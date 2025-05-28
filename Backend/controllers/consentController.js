const ConsentLog = require('../models/Consentlog');

// Log or update a new consent
// controllers/consentController.js



exports.logConsent = async (req, res) => {
  try {
    const { service, dataShared, consentGiven } = req.body;

    if (!Array.isArray(dataShared)) {
      return res.status(400).json({ error: 'dataShared must be an array' });
    }

    const isValid = dataShared.every(
      (item) =>
        item &&
        typeof item.permission === 'string' &&
        typeof item.granted === 'boolean'
    );

    if (!isValid) {
      return res.status(400).json({
        error:
          'Each item in dataShared must have permission(string) and granted(boolean)',
      });
    }

    const existingConsent = await ConsentLog.findOne({
      userId: req.user.id,
      service,
    });

    let mergedDataShared = dataShared;

    if (existingConsent) {
      // Merge permissions
      const mergedMap = new Map();

      for (const entry of existingConsent.dataShared) {
        mergedMap.set(entry.permission, entry.granted);
      }

      for (const incoming of dataShared) {
        mergedMap.set(incoming.permission, incoming.granted);
      }

      mergedDataShared = Array.from(mergedMap.entries()).map(
        ([permission, granted]) => ({ permission, granted })
      );
    }

    const updatedConsent = await ConsentLog.findOneAndUpdate(
      { userId: req.user.id, service },
      {
        $set: {
          dataShared: mergedDataShared,
          consentGiven,
        },
      },
      { upsert: true, new: true }
    );

    return res.status(existingConsent ? 200 : 201).json({
      message: existingConsent ? 'Consent updated' : 'Consent created',
      consent: updatedConsent,
    });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error (shouldn’t happen with proper upsert)
      console.error('Duplicate consent entry detected:', err);
      return res.status(409).json({ error: 'Duplicate consent entry' });
    }

    console.error('[ERROR] logConsent failed:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Get all consents for the authenticated user
exports.getUserConsents = async (req, res) => {
  try {
    // Log the incoming request user ID
    const userId =  req.user?.id
  
    
  

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized or missing user ID' });
    }

    // Populate if needed: .populate('userId', 'email name') — optional
    const consents = await ConsentLog.find({ userId: userId });
    console.log(consents);
    

    console.log(`Found ${consents.length} consents for user ${userId}`);

    res.status(200).json(consents);
  } catch (err) {
    console.error('Fetch consent error:', err);
    res.status(500).json({ error: 'Server error while fetching consents' });
  }
};


// Update a specific permission's granted state
// controllers/consentController.js

exports.updateConsent = async (req, res) => {
  try {
    const { id } = req.params;
    const { dataShared } = req.body;

    if (!Array.isArray(dataShared)) {
      return res.status(400).json({ error: 'dataShared must be an array' });
    }

    // Validate each entry in dataShared
    for (const item of dataShared) {
      if (
        !item ||
        typeof item.permission !== 'string' ||
        item.permission.trim() === '' ||
        typeof item.granted === 'undefined'
      ) {
        return res.status(400).json({
          error: 'Each dataShared item must have a valid permission (non-empty string) and granted (boolean).',
          invalidItem: item
        });
      }
    }

    const consent = await ConsentLog.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!consent) {
      return res.status(404).json({ error: 'Consent not found' });
    }

    // Merge or add permissions
    dataShared.forEach(({ permission, granted }) => {
      const entry = consent.dataShared.find(e => e.permission === permission);
      if (entry) {
        entry.granted = Boolean(granted);
      } else {
        consent.dataShared.push({ permission, granted: Boolean(granted) });
      }
    });

    consent.consentGiven = consent.dataShared.every(e => e.granted);

    await consent.save();

    return res.status(200).json({
      message: 'Consent updated',
      consent
    });
  } catch (err) {
    console.error('[ERROR] updateConsent failed:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};


// Check if a service has been logged
exports.checkOrigin = async (req, res) => {
  const userId = req.user._id;
  const { origin } = req.body;

  try {
    const existing = await ConsentLog.findOne({ userId, service: origin });
    res.json({ exists: !!existing });
  } catch (err) {
    console.error('checkOrigin error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
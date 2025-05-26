// controllers/consentController.js
const Consent = require('../models/Consentlog'); // Assuming you have a Consent model

// Log a new consent
exports.logConsent = async (req, res) => {
  try {
    const { service, dataShared, consentGiven } = req.body;
    const newConsent = new Consent({
      userId: req.user.id,
      service,
      dataShared,
      consentGiven,
      timestamp: new Date(),
    });

    await newConsent.save();
    res.status(201).json({ message: 'Consent logged successfully' });
  } catch (err) {
    console.error('Log consent error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all consents for the authenticated user
exports.getUserConsents = async (req, res) => {
  try {
    const consents = await Consent.find({ userId: req.user.id });
    res.status(200).json(consents);
  } catch (err) {
    console.error('Fetch consent error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a consent
exports.updateConsent = async (req, res) => {
  try {
    const { id } = req.params;
    const { consentGiven } = req.body;

    const updated = await Consent.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { consentGiven },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Consent not found' });
    }

    res.status(200).json({ message: 'Consent updated', updated });
  } catch (err) {
    console.error('Update consent error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

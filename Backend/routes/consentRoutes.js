const express = require('express');
const { logConsent, getUserConsents, updateConsent } = require('../controllers/consentController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// @route   POST /api/consent/log
// @desc    Log a new consent decision
// @access  Private
router.post('/log', authMiddleware, logConsent);

// @route   GET /api/consent/my-consents
// @desc    Get all consents for the authenticated user
// @access  Private
router.get('/my-consents', authMiddleware, getUserConsents);

// @route   PUT /api/consent/update/:id
// @desc    Update (revoke/edit) a consent entry
// @access  Private
router.put('/update/:id', authMiddleware, updateConsent);

module.exports = router;

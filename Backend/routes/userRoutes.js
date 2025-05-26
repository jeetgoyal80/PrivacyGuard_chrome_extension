const express = require('express');
const { getProfile, updateProfile, deleteAccount } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authMiddleware, getProfile);

// @route   PUT /api/user/profile
// @desc    Update current user profile (username, email)
// @access  Private
router.put('/profile', authMiddleware, updateProfile);

// @route   DELETE /api/user/delete
// @desc    Delete current user account
// @access  Private
router.delete('/delete', authMiddleware, deleteAccount);

module.exports = router;

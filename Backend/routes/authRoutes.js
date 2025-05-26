const express = require('express');
const router = express.Router();

// Import controller functions
const { registerUser, loginUser } = require('../controllers/authController');

// Define routes
router.post('/register', registerUser); // Must be a function
router.post('/login', loginUser);       // Must be a function

module.exports = router;

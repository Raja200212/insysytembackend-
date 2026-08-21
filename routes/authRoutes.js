const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyToken, getProfile);
router.get('/me', verifyToken, getProfile);
router.post('/logout', (req, res) => res.json({ success: true, message: 'Logged out successfully' }));

module.exports = router;

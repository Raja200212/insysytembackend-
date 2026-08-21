const express = require('express');
const router = express.Router();
const { getServices, createService, updateServiceStatus } = require('../controllers/serviceController');
const { verifyAdmin } = require('../middleware/auth');

router.get('/', getServices);
router.post('/', createService);
router.put('/:id/status', verifyAdmin, updateServiceStatus);

module.exports = router;

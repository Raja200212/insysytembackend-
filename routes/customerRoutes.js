const express = require('express');
const router = express.Router();
const { getCustomers, createCustomer } = require('../controllers/customerController');
const { verifyAdmin } = require('../middleware/auth');

router.get('/', verifyAdmin, getCustomers);
router.post('/', createCustomer);

module.exports = router;

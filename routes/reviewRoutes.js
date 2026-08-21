const express = require('express');
const router = express.Router();
const { addReview, getReviewsByProduct } = require('../controllers/reviewController');

router.post('/', addReview);
router.get('/product/:productId', getReviewsByProduct);

module.exports = router;

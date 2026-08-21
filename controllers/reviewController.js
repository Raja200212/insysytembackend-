const { pool } = require('../config/db');

const addReview = async (req, res) => {
  try {
    const { product_id, user_name, rating, comment } = req.body;
    if (!product_id || !user_name || !rating) {
      return res.status(400).json({ success: false, message: 'Product ID, user name, and rating are required.' });
    }

    const [result] = await pool.query(
      'INSERT INTO reviews (product_id, user_name, rating, comment) VALUES (?, ?, ?, ?)',
      [product_id, user_name, rating, comment || null]
    );

    res.status(201).json({ success: true, id: result.insertId, message: 'Review added successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const [reviews] = await pool.query('SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC', [productId]);
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addReview,
  getReviewsByProduct
};

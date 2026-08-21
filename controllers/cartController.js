const { pool } = require('../config/db');

// Get User Cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const [items] = await pool.query(
      `SELECT c.id as cart_item_id, c.quantity, p.* 
       FROM cart_items c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = ?`,
      [userId]
    );

    res.json({ success: true, cart: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add Item to Cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    if (!product_id) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    const qty = parseInt(quantity) || 1;

    // Check if item already in cart
    const [existing] = await pool.query('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?', [userId, product_id]);

    if (existing.length > 0) {
      await pool.query('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?', [qty, existing[0].id]);
    } else {
      await pool.query('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)', [userId, product_id, qty]);
    }

    res.json({ success: true, message: 'Item added to cart!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Cart Item Quantity
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      await pool.query('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [id, userId]);
    } else {
      await pool.query('UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, id, userId]);
    }

    res.json({ success: true, message: 'Cart updated successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove Cart Item
const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await pool.query('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [id, userId]);
    res.json({ success: true, message: 'Item removed from cart!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Clear Cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await pool.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
    res.json({ success: true, message: 'Cart cleared successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};

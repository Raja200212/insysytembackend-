const { pool } = require('../config/db');

// Get All Products (With Filters: category_id, subcategory_id, search, is_featured, is_deal)
const getProducts = async (req, res) => {
  try {
    const { category_id, subcategory_id, search, is_featured, is_deal, limit } = req.query;

    let query = 'SELECT p.*, c.name as category_name, s.name as subcategory_name FROM products p LEFT JOIN categories c ON p.category_id = c.id LEFT JOIN subcategories s ON p.subcategory_id = s.id WHERE p.status = "active"';
    const params = [];

    if (category_id) {
      query += ' AND p.category_id = ?';
      params.push(category_id);
    }

    if (subcategory_id) {
      query += ' AND p.subcategory_id = ?';
      params.push(subcategory_id);
    }

    if (is_featured !== undefined) {
      query += ' AND p.is_featured = ?';
      params.push(is_featured === 'true' || is_featured === '1' ? 1 : 0);
    }

    if (is_deal !== undefined) {
      query += ' AND p.is_deal = ?';
      params.push(is_deal === 'true' || is_deal === '1' ? 1 : 0);
    }

    if (search) {
      query += ' AND (p.name LIKE ? OR p.brand LIKE ? OR p.description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY p.id DESC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    const [products] = await pool.query(query, params);
    res.json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Product by ID or Slug
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [products] = await pool.query(
      'SELECT p.*, c.name as category_name, s.name as subcategory_name FROM products p LEFT JOIN categories c ON p.category_id = c.id LEFT JOIN subcategories s ON p.subcategory_id = s.id WHERE p.id = ? OR p.slug = ?',
      [id, id]
    );

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const product = products[0];

    // Fetch specifications
    const [specifications] = await pool.query('SELECT spec_key, spec_value FROM product_specifications WHERE product_id = ?', [product.id]);
    product.specifications = specifications;

    // Fetch variants
    const [variants] = await pool.query('SELECT * FROM product_variants WHERE product_id = ?', [product.id]);
    product.variants = variants;

    // Fetch reviews
    const [reviews] = await pool.query('SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC', [product.id]);
    product.reviews = reviews;

    res.json(product);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create Product (Admin)
const createProduct = async (req, res) => {
  try {
    const { category_id, subcategory_id, name, slug, brand, description, price, sale_price, stock, image, is_featured, is_deal } = req.body;

    if (!category_id || !name || !price) {
      return res.status(400).json({ success: false, message: 'Category, name, and price are required.' });
    }

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const [result] = await pool.query(
      'INSERT INTO products (category_id, subcategory_id, name, slug, brand, description, price, sale_price, stock, image, is_featured, is_deal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        category_id,
        subcategory_id || null,
        name,
        generatedSlug,
        brand || null,
        description || null,
        price,
        sale_price || null,
        stock || 0,
        image || null,
        is_featured ? 1 : 0,
        is_deal ? 1 : 0
      ]
    );

    const [newProducts] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
    res.status(201).json(newProducts[0]);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Product (Admin)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, brand, description, price, sale_price, stock, image, is_featured, is_deal, status } = req.body;

    const [result] = await pool.query(
      'UPDATE products SET name = COALESCE(?, name), brand = COALESCE(?, brand), description = COALESCE(?, description), price = COALESCE(?, price), sale_price = COALESCE(?, sale_price), stock = COALESCE(?, stock), image = COALESCE(?, image), is_featured = COALESCE(?, is_featured), is_deal = COALESCE(?, is_deal), status = COALESCE(?, status) WHERE id = ?',
      [name || null, brand || null, description || null, price || null, sale_price || null, stock || null, image || null, is_featured !== undefined ? (is_featured ? 1 : 0) : null, is_deal !== undefined ? (is_deal ? 1 : 0) : null, status || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const [updated] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Product (Admin)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.json({ success: true, message: 'Product deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};

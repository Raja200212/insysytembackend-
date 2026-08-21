const { pool } = require('../config/db');

// Get All Categories with Subcategories
const getCategories = async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT * FROM categories WHERE status = "active" ORDER BY id ASC');
    const [subcategories] = await pool.query('SELECT * FROM subcategories WHERE status = "active" ORDER BY id ASC');

    const result = categories.map(cat => ({
      ...cat,
      subcategories: subcategories.filter(sub => sub.category_id === cat.id)
    }));

    // If query string format=array is passed or default return format, support both array & object
    if (req.query.raw === 'true' || req.query.format === 'array') {
      return res.json(result);
    }

    // Attach array directly or as property
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Category by ID or Slug
const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const [categories] = await pool.query('SELECT * FROM categories WHERE slug = ? OR id = ?', [slug, slug]);

    if (categories.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    const category = categories[0];
    const [subcategories] = await pool.query('SELECT * FROM subcategories WHERE category_id = ? AND status = "active"', [category.id]);
    category.subcategories = subcategories;

    res.json(category);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create Category (Admin)
const createCategory = async (req, res) => {
  try {
    const { name, slug, description, image } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required.' });
    }

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const [result] = await pool.query(
      'INSERT INTO categories (name, slug, description, image) VALUES (?, ?, ?, ?)',
      [name, generatedSlug, description || null, image || null]
    );

    const newCategory = {
      id: result.insertId,
      name,
      slug: generatedSlug,
      description: description || null,
      image: image || null,
      status: 'active'
    };

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Category (Admin)
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, image, status } = req.body;

    const [result] = await pool.query(
      'UPDATE categories SET name = COALESCE(?, name), slug = COALESCE(?, slug), description = COALESCE(?, description), image = COALESCE(?, image), status = COALESCE(?, status) WHERE id = ?',
      [name || null, slug || null, description || null, image || null, status || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    const [updated] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Category (Admin)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    res.json({ success: true, message: 'Category deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
};

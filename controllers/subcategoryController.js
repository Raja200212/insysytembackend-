const { pool } = require('../config/db');

// Get All Subcategories (Optional filter by category_id)
const getSubcategories = async (req, res) => {
  try {
    const { category_id } = req.query;
    let query = 'SELECT s.*, c.name as category_name FROM subcategories s LEFT JOIN categories c ON s.category_id = c.id WHERE s.status = "active"';
    const params = [];

    if (category_id) {
      query += ' AND s.category_id = ?';
      params.push(category_id);
    }

    query += ' ORDER BY s.id ASC';

    const [subcategories] = await pool.query(query, params);
    
    // Return array directly so frontend expects standard JSON array or object
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Subcategory by ID or Slug
const getSubcategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const [subcategories] = await pool.query(
      'SELECT s.*, c.name as category_name FROM subcategories s LEFT JOIN categories c ON s.category_id = c.id WHERE s.id = ? OR s.slug = ?',
      [id, id]
    );

    if (subcategories.length === 0) {
      return res.status(404).json({ success: false, message: 'Subcategory not found.' });
    }

    res.json(subcategories[0]);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create Subcategory (Admin)
const createSubcategory = async (req, res) => {
  try {
    const { category_id, name, slug, description, image, status } = req.body;
    if (!category_id || !name) {
      return res.status(400).json({ success: false, message: 'Category ID and name are required.' });
    }

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const statusVal = status === false || status === 'inactive' ? 'inactive' : 'active';

    const [result] = await pool.query(
      'INSERT INTO subcategories (category_id, name, slug, description, image, status) VALUES (?, ?, ?, ?, ?, ?)',
      [category_id, name, generatedSlug, description || null, image || null, statusVal]
    );

    const newSubcategory = {
      id: result.insertId,
      category_id,
      name,
      slug: generatedSlug,
      description: description || null,
      image: image || null,
      status: statusVal
    };

    res.status(201).json(newSubcategory);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Subcategory (Admin)
const updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, name, slug, description, image, status } = req.body;

    const statusVal = status !== undefined ? (status === false || status === 'inactive' ? 'inactive' : 'active') : null;

    const [result] = await pool.query(
      'UPDATE subcategories SET category_id = COALESCE(?, category_id), name = COALESCE(?, name), slug = COALESCE(?, slug), description = COALESCE(?, description), image = COALESCE(?, image), status = COALESCE(?, status) WHERE id = ?',
      [category_id || null, name || null, slug || null, description || null, image || null, statusVal, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Subcategory not found.' });
    }

    const [updated] = await pool.query('SELECT * FROM subcategories WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Subcategory (Admin)
const deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM subcategories WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Subcategory not found.' });
    }

    res.json({ success: true, message: 'Subcategory deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSubcategories,
  getSubcategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory
};

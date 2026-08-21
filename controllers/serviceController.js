const { pool } = require('../config/db');

const getServices = async (req, res) => {
  try {
    const [services] = await pool.query('SELECT * FROM services ORDER BY id DESC');
    res.json({ success: true, count: services.length, services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createService = async (req, res) => {
  try {
    const { title, customer_name, service_type, notes } = req.body;
    if (!title || !customer_name || !service_type) {
      return res.status(400).json({ success: false, message: 'Title, customer name, and service type are required.' });
    }

    const [result] = await pool.query(
      'INSERT INTO services (title, customer_name, service_type, notes) VALUES (?, ?, ?, ?)',
      [title, customer_name, service_type, notes || null]
    );

    res.status(201).json({ success: true, id: result.insertId, message: 'Service ticket submitted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateServiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const [result] = await pool.query('UPDATE services SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Service ticket not found.' });
    }

    res.json({ success: true, message: 'Service status updated successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getServices,
  createService,
  updateServiceStatus
};

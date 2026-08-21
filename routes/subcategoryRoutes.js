const express = require('express');
const router = express.Router();
const {
  getSubcategories,
  getSubcategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory
} = require('../controllers/subcategoryController');
const { verifyAdmin } = require('../middleware/auth');

router.get('/', getSubcategories);
router.get('/:id', getSubcategoryById);
router.post('/', verifyAdmin, createSubcategory);
router.put('/:id', verifyAdmin, updateSubcategory);
router.delete('/:id', verifyAdmin, deleteSubcategory);

module.exports = router;

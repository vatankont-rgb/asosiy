const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate, authorize } = require('../middleware/auth');
const { categoryRules, validate } = require('../validators/rules');

router.get('/categories', categoryController.getCategories);
router.post('/categories', authenticate, authorize(['Super Admin', 'Admin', 'Editor']), categoryRules, validate, categoryController.createCategory);
router.put('/categories/:id', authenticate, authorize(['Super Admin', 'Admin', 'Editor']), categoryController.updateCategory);
router.delete('/categories/:id', authenticate, authorize(['Super Admin', 'Admin']), categoryController.deleteCategory);

module.exports = router;

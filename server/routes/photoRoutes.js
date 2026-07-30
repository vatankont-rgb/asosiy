const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');
const { authenticate, authorize } = require('../middleware/auth');

// Public route to get all photos
router.get('/photos', photoController.getAll);

// Admin routes
router.post('/admin/photos/:lang', authenticate, authorize(['Super Admin', 'Admin', 'Editor']), photoController.create);
router.put('/admin/photos/:lang/:id', authenticate, authorize(['Super Admin', 'Admin', 'Editor']), photoController.update);
router.delete('/admin/photos/:lang/:id', authenticate, authorize(['Super Admin', 'Admin', 'Editor']), photoController.delete);

module.exports = router;

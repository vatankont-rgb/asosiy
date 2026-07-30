const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/videos', videoController.getAll);
router.post('/admin/videos/:lang', authenticate, authorize(['Super Admin', 'Admin', 'Editor']), videoController.create);
router.put('/admin/videos/:lang/:id', authenticate, authorize(['Super Admin', 'Admin', 'Editor']), videoController.update);
router.delete('/admin/videos/:lang/:id', authenticate, authorize(['Super Admin', 'Admin', 'Editor']), videoController.delete);

module.exports = router;

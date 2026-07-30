const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const { authenticate } = require('../middleware/auth');

router.post('/admin/upload', authenticate, mediaController.uploadMedia);
router.get('/admin/media', authenticate, mediaController.getMedia);
router.delete('/admin/media/:filename', authenticate, mediaController.deleteMedia);

module.exports = router;

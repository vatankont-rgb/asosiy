const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const { authenticate, authorize } = require('../middleware/auth'); // requireAdmin -> authenticate

// Hammaga ochiq (Frontend uchun reklamalarni olish)
router.get('/ads', adController.getAllAds);

// Admin uchun (Reklamalarni boshqarish faqat Super Admin uchun)
router.post('/admin/ads', authenticate, authorize(['Super Admin']), adController.createAd);
router.put('/admin/ads/:id', authenticate, authorize(['Super Admin']), adController.updateAd);
router.delete('/admin/ads/:id', authenticate, authorize(['Super Admin']), adController.deleteAd);

module.exports = router;

const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/settings', authenticate, settingController.getSettings);
router.put('/settings', authenticate, authorize(['Super Admin', 'Admin']), settingController.updateSettings);

// Backup system (Super Admin only)
router.post('/backup/export', authenticate, authorize(['Super Admin']), settingController.exportBackup);
router.post('/backup/import', authenticate, authorize(['Super Admin']), settingController.importBackup);

router.get('/dashboard/stats', authenticate, authorize(['Super Admin', 'Admin']), settingController.getDashboardStats);
router.get('/dashboard/logs', authenticate, authorize(['Super Admin', 'Admin']), settingController.getLogs);

// System Health & Auto-Repair (Super Admin & Admin only)
router.get('/health', authenticate, authorize(['Super Admin', 'Admin']), settingController.getHealth);
router.post('/health/repair', authenticate, authorize(['Super Admin', 'Admin']), settingController.repairDb);

module.exports = router;

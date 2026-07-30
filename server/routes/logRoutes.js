const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize(['Super Admin', 'Admin']), logController.getLogs);

module.exports = router;

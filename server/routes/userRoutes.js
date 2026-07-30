const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize(['Super Admin']), userController.getUsers);
router.post('/', authenticate, authorize(['Super Admin']), userController.createUser);
router.delete('/:id', authenticate, authorize(['Super Admin']), userController.deleteUser);

module.exports = router;

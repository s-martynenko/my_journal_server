const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.get('/user-info', userCtrl.authMiddleware, userCtrl.userInfo);
router.patch('/password', userCtrl.authMiddleware, userCtrl.changePassword);
router.patch('/photo', userCtrl.authMiddleware, userCtrl.changePhoto);

module.exports = router;

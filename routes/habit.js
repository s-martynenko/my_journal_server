const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const habitCtrl = require('../controllers/habit');

router.post('/habit', userCtrl.authMiddleware, habitCtrl.newHabit);

module.exports = router;
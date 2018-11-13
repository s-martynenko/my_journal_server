const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const habitCtrl = require('../controllers/habit');

router.post('/habit', userCtrl.authMiddleware, habitCtrl.newHabit);
router.get('/habit', userCtrl.authMiddleware, habitCtrl.allHabits);
router.get('/habit/:id', habitCtrl.getHabit);
router.delete('/habit/:id', userCtrl.authMiddleware, habitCtrl.deleteHabit);
router.patch('/habit/:id', userCtrl.authMiddleware, habitCtrl.changeHabit);

module.exports = router;
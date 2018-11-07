const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const eventCtrl = require('../controllers/event');

router.post('/event', userCtrl.authMiddleware, eventCtrl.newEvent);

module.exports = router;
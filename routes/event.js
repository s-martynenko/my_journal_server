const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const eventCtrl = require('../controllers/event');

router.post('/event', userCtrl.authMiddleware, eventCtrl.newEvent);
router.get('/event', userCtrl.authMiddleware, eventCtrl.allEvents);
router.get('/event/:id', eventCtrl.getEvent);
router.delete('/event/:id', userCtrl.authMiddleware, eventCtrl.deleteEvent);
router.patch('/event/:id', userCtrl.authMiddleware, eventCtrl.changeEvent);

module.exports = router;
const express = require('express');
const router = express.Router();

router.get('/test-user', function (req, res) {
    return res.json({name:'Vasya'});
});

module.exports = router;

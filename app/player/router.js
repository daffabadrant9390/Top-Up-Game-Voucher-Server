const express = require('express');
const router = express.Router();
const { index, updateStatus } = require('./controller');

router.get('/', index);
router.put('/status/:id', updateStatus);

module.exports = router;

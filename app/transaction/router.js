const express = require('express');
const router = express.Router();
const { index, updateTransactionStatus } = require('./controller');

router.get('/', index);
router.put('/status/:id', updateTransactionStatus);

module.exports = router;

const express = require('express');
const router = express.Router();

const { index, action_sign_in, action_log_out } = require('./controller');

router.get('/', index);
router.post('/', action_sign_in);
router.get('/logout', action_log_out);

module.exports = router;

const express = require('express');
const router = express.Router();
const { signUp, signIn } = require('./controller');

const multer = require('multer');
const os = require('os');

router.post(
  '/sign-up',
  multer({ dest: os.tmpdir() }).single('imgAvatar'),
  signUp
);
router.post('/sign-in', signIn);

module.exports = router;

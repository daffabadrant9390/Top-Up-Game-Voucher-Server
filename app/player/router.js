const express = require('express');
const router = express.Router();
const {
  index,
  updateStatus,
  landingPage,
  detailPage,
  getAllCategory,
  checkout,
  getHistoryTransactionByStatus,
  getDetailHistoryTransactionById,
  getPlayerOverview,
  getPlayerProfile,
  editPlayerProfile,
} = require('./controller');
const { isLoginPlayer, isLogin } = require('../middleware/auth');
const multer = require('multer');
const os = require('os');

// router.use(isLogin);
// router.get('/', index);
// router.put('/status/:id', updateStatus);
router.get('/landing-page', landingPage);
router.get('/:id/detail', detailPage);
router.get('/category', getAllCategory);
router.post('/checkout', isLoginPlayer, checkout);
router.get(
  '/history-transaction',
  isLoginPlayer,
  getHistoryTransactionByStatus
);
router.get(
  '/history-transaction/:id/detail',
  isLoginPlayer,
  getDetailHistoryTransactionById
);
router.get('/overview', isLoginPlayer, getPlayerOverview);
router.get('/profile', isLoginPlayer, getPlayerProfile);
router.put(
  '/profile',
  isLoginPlayer,
  multer({ dest: os.tmpdir() }).single('image'),
  editPlayerProfile
);

module.exports = router;

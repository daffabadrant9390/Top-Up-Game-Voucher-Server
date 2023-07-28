const express = require('express');
const router = express.Router();
const {
  index,
  renderCreatePaymentPage,
  createPayment,
  renderEditPaymentPage,
  editPayment,
  deletePayment,
} = require('./controller');
const { isLogin } = require('../middleware/auth');

router.use(isLogin);
router.get('/', index);
router.get('/create-payment', renderCreatePaymentPage);
router.post('/create-payment', createPayment);
router.get('/edit-payment/:id', renderEditPaymentPage);
router.put('/edit-payment/:id', editPayment);
router.delete('/delete-payment/:id', deletePayment);

module.exports = router;

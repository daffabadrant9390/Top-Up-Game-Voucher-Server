const express = require('express');
const {
  index,
  renderCreateVoucherPage,
  createVoucher,
  renderEditVoucherPage,
  editVoucher,
  deleteVoucher,
} = require('./controller');
const router = express.Router();
const multer = require('multer');
const os = require('os');

router.get('/', index);
router.get('/create-voucher', renderCreateVoucherPage);
router.post(
  '/create-voucher',
  multer({ dest: os.tmpdir() }).single('img_thumbnail'),
  createVoucher
);
router.get('/edit-voucher/:id', renderEditVoucherPage);
router.put(
  '/edit-voucher/:id',
  multer({ dest: os.tmpdir() }).single('img_thumbnail'),
  editVoucher
);
router.delete('/delete-voucher/:id', deleteVoucher);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  index,
  renderCreateBankPage,
  createBank,
  renderEditBankPage,
  editBank,
  deleteBank,
} = require('./controller');
const { isLogin } = require('../middleware/auth');

router.use(isLogin);
router.get('/', index);
router.get('/create-bank', renderCreateBankPage);
router.post('/create-bank', createBank);
router.get('/edit-bank/:id', renderEditBankPage);
router.put('/edit-bank/:id', editBank);
router.delete('/delete-bank/:id', deleteBank);

module.exports = router;

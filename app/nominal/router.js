const express = require('express');
const router = express.Router();
const {
  index,
  renderCreateNominalPage,
  createNominal,
  renderEditNominalPage,
  editNominal,
  deleteNominal,
} = require('./controller');
const { isLogin } = require('../middleware/auth');

router.use(isLogin);
router.get('/', index);
router.get('/create-nominal', renderCreateNominalPage);
router.post('/create-nominal', createNominal);
router.get('/edit-nominal/:id', renderEditNominalPage);
router.put('/edit-nominal/:id', editNominal);
router.delete('/delete-nominal/:id', deleteNominal);

module.exports = router;

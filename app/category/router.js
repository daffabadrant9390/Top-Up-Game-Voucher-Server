const express = require('express');
const router = express.Router();
const {
  index,
  renderCreateCategoryPage,
  createCategory,
  renderEditCategoryPage,
  editCategory,
  deleteCategory,
} = require('./controller');
const { isLogin } = require('../middleware/auth');

router.use(isLogin);
router.get('/', index);
router.get('/create-category', renderCreateCategoryPage);
router.post('/create-category', createCategory);
router.get('/edit-category/:id', renderEditCategoryPage);
router.put('/edit-category/:id', editCategory);
router.delete('/delete-category/:id', deleteCategory);

module.exports = router;

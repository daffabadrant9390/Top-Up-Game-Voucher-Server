const mongoose = require('mongoose');
const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name cant be empty!'],
  },
});

const categoryModel = mongoose.model('Category', categorySchema);

module.exports = categoryModel;

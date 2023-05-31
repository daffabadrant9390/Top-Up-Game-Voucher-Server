const mongoose = require('mongoose');
const bankNameConstant = require('./constant');
const bankSchema = mongoose.Schema({
  cardHolderName: {
    type: String,
    require: [true, 'Card Holder Name cant be empty!'],
  },
  cardNumber: {
    type: String,
    require: [true, 'Card Number cant be empty!'],
  },
  bankName: {
    type: String,
    require: [true, 'Bank Name cant be empty!'],
    enum: bankNameConstant,
  },
});

const bankModel = mongoose.model('Bank', bankSchema);
module.exports = bankModel;

const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
  {
    historyVoucherTopup: {
      gameName: { type: String, require: [true, 'Game name cant be empty!'] },
      category: { type: String, require: [true, 'Category cant be empty!'] },
      imageThumbnail: { type: String },
      coinName: { type: String, require: [true, 'Coin name cant be empty!'] },
      coinQuantity: {
        type: String,
        require: [true, 'Coin quantity cant be empty!'],
      },
      price: { type: Number },
    },
    historyPayment: {
      name: { type: String, require: [true, 'Payment name cant be empty!'] },
      type: { type: String, require: ['Payment type cant be empty!'] },
      bankName: { type: String, require: ['Bank name cant be empty!'] },
      accountNumber: {
        type: String,
        require: ['Account number cant be empty!'],
      },
    },
    buyerName: {
      type: String,
      require: [true, 'Buyer name cant be empty!'],
      minLength: [3, 'Buyer name length must be between 3-225 characters'],
      maxLength: [225, 'Buyer name length must be between 3-225 characters'],
    },
    accountUser: {
      type: String,
      require: [true, 'Account user cant be empty!'],
      minLength: [3, 'Account user length must be between 3-225 characters'],
      maxLength: [225, 'Account user length must be between 3-225 characters'],
    },
    tax: {
      type: Number,
      default: 0,
    },
    // Final Price after substracted with TAX
    finalPrice: {
      type: Number,
      default: 0,
    },
    transactionStatus: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED'],
      default: 'PENDING',
    },
    // Get the data from Player Model
    playerData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
    },
    // Get the data from Category Model
    categoryData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    historyUser: {
      name: { type: String, require: [true, 'User name cant be empty!'] },
      phoneNumber: {
        type: String,
        require: [true, 'User phone number cant be empty!'],
        minLength: [9, 'Phone number length must be between 9 - 13 characters'],
        maxLength: [
          13,
          'Phone number length must be between 9 - 13 characters',
        ],
      },
    },
    // Get the data from User Model
    userData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const transactionModel = mongoose.model('Transaction', transactionSchema);

module.exports = transactionModel;

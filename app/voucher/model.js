const mongoose = require('mongoose');
const voucherSchema = mongoose.Schema(
  {
    gameName: {
      type: String,
      require: [true, 'Game name cant be empty!'],
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'NON-ACTIVE'],
      default: 'ACTIVE',
    },
    imageThumbnail: {
      type: String,
    },
    categoryData: {
      // Use the data from Category collection
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    nominalsData: [
      {
        // Use the data from Nominal collection
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nominal',
      },
    ],
    userData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const voucherModel = mongoose.model('Voucher', voucherSchema);
module.exports = voucherModel;

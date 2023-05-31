const mongoose = require('mongoose');
const voucherSchema = mongoose.Schema({
  gameName: {
    type: String,
    require: [true, 'Game name cant be empty!'],
  },
  voucherStatus: {
    type: String,
    enum: ['ACTIVE', 'NON-ACTIVE'],
    default: 'ACTIVE',
  },
  imageThumbnail: {
    type: String,
  },
  category: {
    // Use the data from Category collection
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  nominals: [
    {
      // Use the data from Nominal collection
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Nominal',
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const voucherModel = mongoose.model('Voucher', voucherSchema);
module.exports = voucherModel;

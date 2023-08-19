const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema(
  {
    paymentType: {
      type: String,
      require: [true, "Payment type can't be empty!"],
    },
    banksData: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bank',
      },
    ],
    status: {
      type: String,
      enum: ['ACTIVE', 'NON-ACTIVE'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

const paymentModel = mongoose.model('Payment', paymentSchema);

module.exports = paymentModel;

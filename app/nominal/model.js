const mongoose = require('mongoose');
const nominalSchema = mongoose.Schema(
  {
    coinQuantity: {
      type: Number,
      default: 0,
    },
    coinType: {
      type: String,
      required: [true, "Coin type can't be empty!"],
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const nominalModel = mongoose.model('Nominal', nominalSchema);

module.exports = nominalModel;

const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: [true, "Email can't be empty!"],
    },
    name: {
      type: String,
      require: [true, "Name can't be empty!"],
    },
    password: {
      type: String,
      require: [true, "Password can't be empty!"],
    },
    phoneNumber: {
      type: String,
      require: [true, "Phone number can't be empty!"],
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'admin',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'NON-ACTIVE'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;

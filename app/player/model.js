const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
  email: {
    type: String,
    require: [true, "Email can't be empty!"],
  },
  name: {
    type: String,
    require: [true, "Name can't be empty!"],
    minLength: [3, 'Buyer name length must be between 3-225 characters'],
    maxLength: [225, 'Buyer name length must be between 3-225 characters'],
  },
  username: {
    type: String,
    require: [true, "Name can't be empty!"],
    minLength: [3, 'Buyer name length must be between 3-225 characters'],
    maxLength: [225, 'Buyer name length must be between 3-225 characters'],
  },
  password: {
    type: String,
    require: [true, "Password can't be empty!"],
    minLength: [8, 'Buyer name length must be between 8-20 characters'],
    maxLength: [20, 'Buyer name length must be between 8-20 characters'],
  },
  phoneNumber: {
    type: String,
    require: [true, "Phone number can't be empty!"],
    minLength: [9, 'Buyer name length must be between 9-12 characters'],
    maxLength: [12, 'Buyer name length must be between 9-12 characters'],
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'NON-ACTIVE'],
    default: 'ACTIVE',
  },
  avatar: {
    type: String,
  },
});

const playerModel = mongoose.model('Player', playerSchema);

module.exports = playerModel;

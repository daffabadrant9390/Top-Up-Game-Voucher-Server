const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const HASH_ROUND = 10;

const playerSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email can't be empty!"],
  },
  name: {
    type: String,
    required: [true, "Name can't be empty!"],
    minLength: [3, 'Player name length must be between 3-225 characters'],
    maxLength: [225, 'Player name length must be between 3-225 characters'],
  },
  username: {
    type: String,
    required: [true, "Username can't be empty!"],
    minLength: [3, 'Player user name length must be between 3-225 characters'],
    maxLength: [
      225,
      'Player user name length must be between 3-225 characters',
    ],
  },
  password: {
    type: String,
    required: [true, "Password can't be empty!"],
    minLength: [3, 'Player password length must be between 3-20 characters'],
    maxLength: [20, 'Player password length must be between 3-20 characters'],
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number can't be empty!"],
    minLength: [
      9,
      'Player phone number length must be between 9-12 characters',
    ],
    maxLength: [
      12,
      'Player phone number length must be between 9-12 characters',
    ],
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

// Make sure before save the new data into Player collection, encrypt the password which already inputted by the user
playerSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync('hello world', HASH_ROUND);
  next();
});

/*
  If the email inputted by the user same with the existing data inside database, prevent the user to add new data
    - value inside parameter is the email value that inputted by the user
    - if is duplicated, return the message to the user with "attr" variable
*/
playerSchema.path('email').validate(
  async function (value) {
    try {
      const countDuplicate = await this.model('Player').countDocuments({
        email: value,
      });

      /*
      return statement :
        - if the countDuplicate is not exist (0), means that the validation is true (success)
        - if the countDuplicate is exist (not 0), means that the validation is false (failed)
    */
      return !countDuplicate;
    } catch (error) {
      throw error;
    }
  },
  (attr) =>
    `${
      attr.value || ''
    } already registered, please try again with different email address.`
);

module.exports = mongoose.model('Player', playerSchema);

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please tell us username'],
  },
  email: {
    type: String,
    required: [true, 'please tell  email'],
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, 'please provide us a valid email address'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'must have password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your  password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'passwords must be matched',
    },
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidateKey,
  userPassword
) {
  return await bcrypt.compare(candidateKey, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

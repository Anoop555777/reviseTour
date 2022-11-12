const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
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
  passwordChangedAt: Date,
  role: {
    type: String,
    enum: ['user', 'admin', 'guide', 'lead-guide'],
    default: 'user',
    select: false,
  },
  passwordResetToken: String,
  passwordExpireToken: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() + 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidateKey,
  userPassword
) {
  return await bcrypt.compare(candidateKey, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = Number.parseInt(
      this.passwordChangedAt.getTime() / 1000
    );
    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordExpireToken = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

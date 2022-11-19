const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a valid name'],
      unique: [true, 'A tour must have a unique name'],
      maxlength: [50, 'A tour name must be sort unique and easy to catch'],
      minlength: [5, 'A tour name must make sense'],
      // validator: [
      //   validator.isAlfha,
      //   'the value must be string and no space in between',
      // ],
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'difficult', 'medium'],
        message: 'Difficulty must be :easy or medium or difficult',
      },
    },

    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'rating must be more than 1'],
      max: [5, 'rating must be less than 5.1'],
    },
    ratingType: { type: Number, default: 0 },
    price: { type: Number, required: [true, 'must give price a number'] },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          //only work when new data is created not for update this keyword allows point to the current document
          return value <= this.price / 2;
        },
        message: 'Discount price must be atmost 50%',
      },
    },
    summary: {
      type: String,
      required: [true, 'Summary must be required for tour'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },

    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    slug: String,
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//document middleware only works for save and create methods
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

//query middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({ path: 'guides', select: '-__v -passwordChangedAt' });
  next();
});

//aggregate middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

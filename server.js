const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log('DataBase in connected successfully');
  });

const tourSchema = new mongoose.Schema({
  name: {
    type: 'String',
    required: [true, 'A tour must have a valid name'],
    unique: true,
  },
  rating: { type: 'Number', default: 4.5 },
  price: { type: 'String', required: [true, 'must give price a number'] },
});

const Tour = mongoose.model('Tour', tourSchema);

const tour = new Tour({
  name: 'Forest Hiker',
  price: 442,
});

tour
  .save()
  .then((doc) => console.log(doc))
  .catch((err) => console.log(err));

const port = process.env.PORT;
//server
app.listen(port, () => {
  console.log('application is running in port 8000');
});

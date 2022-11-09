const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log(err);
  console.log('uncaught Exception shutting down');
  process.exit(1);
});

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

const port = process.env.PORT;
//server
const server = app.listen(port, () => {
  console.log('application is running in port 8000');
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('unhandleError shutting down... 💥');
  server.close(() => {
    process.exit(1);
  });
});

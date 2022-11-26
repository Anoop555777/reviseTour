const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
process.on('uncaughtException', (err) => {
  console.log(err);
  console.log('uncaught Exception shutting down');
  process.exit(1);
});

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
    useUnifiedTopology: true,
  })
  .then((connect) => console.log('DataBase connected successfully'));

const port = process.env.PORT;
//server
const server = app.listen(port, () => {
  console.log('application is running in port 8000');
});

process.on('unhandledRejection', (err) => {
  console.log(err);
  console.log('unhandleError shutting down... 💥');
  server.close(() => {
    process.exit(1);
  });
});

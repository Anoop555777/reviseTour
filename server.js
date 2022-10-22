const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

const port = process.env.PORT;
//server
app.listen(port, () => {
  console.log('application is running in port 8000');
});

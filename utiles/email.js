const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //create transpoter
  const transpoter = nodemailer.createTransport({
    service: 'Gmail',
    host: process.env.EMIAL_HOST,
    port: process.env.EMIAL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //define email options
  const mailOptions = {
    from: `<Anoop Singh> web developer`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //Actually sent the email

  await transpoter.sendMail(mailOptions);
};

module.exports = sendEmail;

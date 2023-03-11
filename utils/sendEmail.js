// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require("nodemailer");

// Nodemailer
const sendEmail = async (options) => {
  // 1) create transporters (Service that will send email like "gmail", "sendGrid", "mailGun")
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  // 2) define email options
  const mailOptions = {
    from: "E-shop app <salahibrahim1818@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // 3) Send Email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

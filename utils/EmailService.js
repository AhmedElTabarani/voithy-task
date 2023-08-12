const nodemailer = require('nodemailer');

module.exports = sendEmailNotificationToPatient = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  await transporter.sendMail({
    from: options.from,
    to: options.to,
    subject: options.subject,
    text: options.message,
    html: `<div>
        <h1>Hi ${options.patient}</h1>
        <p>${options.message}</p>
        <p>From D/ ${options.doctor} - ${options.from}</p>
    </div>`,
  });
};

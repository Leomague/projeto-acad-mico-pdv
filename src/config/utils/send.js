const transport = require('../connection/mail');

const send = (to, subject, body) => {
  transport.sendMail({
    from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html: body
  });
}

module.exports = send;

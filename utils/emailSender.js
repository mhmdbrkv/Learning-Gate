const nodemailer = require("nodemailer");

const emailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        ciphers: "SSLv3",
      },
    });

    let info = await transporter.sendMail({
      from: "Learning Gate by Suez Canal Students",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });
    console.log(info);
    return info;
  } catch (error) {
    console.log(error);

    throw error;
  }
};

module.exports = emailSender;

const nodemailer = require('nodemailer');

const mailTransporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILPASSWORD,
  },
});

const sendVerificationEmail = (user, url) => {
  const data = {
    from: process.env.EMAIL,
    to: user.email,
    subject: 'Blogster Email Verification',
    html: `<h1>URL을 클릭하면 회원가입이 완료됩니다</h1><br/>
               <a href="${url}">이메일 인증 완료</a>`,
  };
  return mailTransporter.sendMail(data);
};

module.exports = {
  sendVerificationEmail,
};

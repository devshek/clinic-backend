const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateTemplate = ({ title, message, details }) => {
  return `
    <div style="font-family: Arial; background:#f4f6f9; padding:30px;">
      <div style="max-width:600px; margin:auto; background:#fff; border-radius:10px; box-shadow:0 4px 15px rgba(0,0,0,0.1); overflow:hidden;">
        <div style="background:#2563EB; color:white; padding:20px; text-align:center;">
          <h2 style="margin:0;">City Clinic</h2>
        </div>
        <div style="padding:25px;">
          <h3 style="color:#2563EB;">${title}</h3>
          <p>${message}</p>
          <ul>${details}</ul>
        </div>
        <div style="background:#f1f5f9; text-align:center; padding:15px; font-size:12px;">
          © 2026 City Clinic
        </div>
      </div>
    </div>
  `;
};

const sendEmail = async ({ to, subject, title, message, details }) => {
  const html = generateTemplate({ title, message, details });

  await transporter.sendMail({
    from: `"City Clinic" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendOTP = async (to, otp) => {
  await transporter.sendMail({
    from: `"OffScroll" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Recuperar password — OffScroll',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
        <h2 style="color:#0f172a;margin-bottom:8px">Recuperar password</h2>
        <p style="color:#64748b;margin-bottom:16px">Usa o código abaixo para redefinir a tua password. Expira em 10 minutos.</p>
        <div style="background:#f8fafc;border:2px solid #e2e8f0;border-radius:12px;padding:24px;text-align:center;margin:24px 0">
          <span style="font-size:36px;font-weight:700;letter-spacing:10px;color:#833AB4">${otp}</span>
        </div>
        <p style="color:#94a3b8;font-size:12px;margin-top:24px">Se não pediste a recuperação de password, ignora este email.</p>
      </div>
    `,
  });
};

module.exports = { sendOTP };

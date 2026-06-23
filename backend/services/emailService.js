const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendPasswordReset = async (to, token) => {
  const link = `http://localhost:5173/reset-password?token=${token}`;
  await transporter.sendMail({
    from: `"OffScroll" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Recuperar password — OffScroll',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
        <h2 style="color:#0f172a;margin-bottom:8px">Recuperar password</h2>
        <p style="color:#64748b;margin-bottom:24px">Clica no botão abaixo para redefinir a tua password. O link expira em 1 hora.</p>
        <a href="${link}" style="display:inline-block;background:linear-gradient(135deg,#833AB4,#C13584,#F77737);color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700">
          Redefinir password
        </a>
        <p style="color:#94a3b8;font-size:12px;margin-top:24px">Se não pediste a recuperação de password, ignora este email.</p>
      </div>
    `,
  });
};

module.exports = { sendPasswordReset };

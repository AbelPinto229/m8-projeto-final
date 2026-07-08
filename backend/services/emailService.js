const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (to, otp) => {
  await transporter.sendMail({
    from: `"OffScroll" <${process.env.EMAIL_USER}>`,
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

const sendContactMessage = async ({ nome, email, servico, mensagem }) => {
  await transporter.sendMail({
    from: `"OffScroll Website" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `Novo contacto de ${nome}${servico ? ` — ${servico}` : ''}`,
    text: `Nome: ${nome}\nEmail: ${email}\nServiço: ${servico || '—'}\n\n${mensagem}`,
    html: `
      <h2>Novo contacto via website</h2>
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Serviço:</strong> ${servico || '—'}</p>
      <hr/>
      <p>${mensagem.replace(/\n/g, '<br/>')}</p>
    `,
  });
};

module.exports = { sendOTP, sendContactMessage };

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const create = async (req, res) => {
  try {
    const { nome, email, servico, mensagem } = req.body;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || '').trim());
    if (!nome || !email || !mensagem || !emailOk) {
      return res.status(400).json({ error: 'Nome, email válido e mensagem são obrigatórios.' });
    }

    await resend.emails.send({
      from: 'OffScroll Website <onboarding@resend.dev>',
      to: [process.env.EMAIL_TO || 'offscrollteste@gmail.com'],
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

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Erro ao enviar email:', err);
    res.status(500).json({ error: 'Erro ao enviar a mensagem.' });
  }
};

module.exports = { create };

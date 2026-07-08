const emailService = require('../services/emailService');

const create = async (req, res) => {
  try {
    const { nome, email, servico, mensagem } = req.body;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || '').trim());
    if (!nome || !email || !mensagem || !emailOk) {
      return res.status(400).json({ error: 'Nome, email válido e mensagem são obrigatórios.' });
    }

    await emailService.sendContactMessage({ nome, email, servico, mensagem });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Erro ao enviar email:', err);
    res.status(500).json({ error: 'Erro ao enviar a mensagem.' });
  }
};

module.exports = { create };

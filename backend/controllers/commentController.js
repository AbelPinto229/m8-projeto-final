// backend/controllers/commentController.js
const commentService = require('../services/commentService');
const cardService = require('../services/cardService');
const notificationService = require('../services/notificationService');

// GET /api/comments?card_id=:id — comentários de um card
const getByCard = async (req, res) => {
  try {
    const { card_id } = req.query;

    if (!card_id || !Number.isInteger(Number(card_id)) || Number(card_id) <= 0) {
      return res.status(400).json({ error: 'Dados em falta ou inválidos' });
    }

    const comments = await commentService.getByCard(card_id);
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};

// POST /api/comments — criar comentário
// contact_email é opcional — quando vem preenchido é um comentário da agência
const create = async (req, res) => {
  try {
    const { card_id, client_id, message, contact_email } = req.body;

    if (!card_id || !client_id || !message) {
      return res.status(400).json({ error: 'Dados em falta ou inválidos' });
    }

    const id = await commentService.create({
      card_id, client_id, message, type: 'comment', contact_email,
    });

    const now = new Date().toISOString();

    res.status(201).json({
      id,
      card_id, client_id, message,
      type: 'comment',
      contact_email: contact_email || null,
      created_at: now,
    });

    // notificação após resposta — falha silenciosa para não bloquear o comentário
    try {
      const card = await cardService.getById(card_id);
      if (card) {
        const isAgency = contact_email === 'Agência';
        await notificationService.create({
          client_id: card.client_id,
          for_agency: !isAgency,
          card_id: card.id,
          message: isAgency
            ? `A agência comentou em "${card.title}".`
            : `Novo comentário do cliente em "${card.title}".`,
        });
      }
    } catch (notifErr) {
      console.error('Erro ao criar notificação de comentário:', notifErr);
    }
  } catch (err) {
    console.error(err);
    if (!res.headersSent) res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};

// DELETE /api/comments/:id — apagar comentário
const remove = async (req, res) => {
  try {
    const ok = await commentService.remove(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Comentário não encontrado' });
    res.json({ message: 'Comentário eliminado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};

module.exports = { getByCard, create, remove };

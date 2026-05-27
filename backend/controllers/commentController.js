// backend/controllers/commentController.js

const db = require('../db/connection');

// GET /api/comments?card_id=:id — comentários de um card
const getByCard = async (req, res) => {
  try {
    const { card_id } = req.query;

    if (!card_id || !Number.isInteger(Number(card_id)) || Number(card_id) <= 0) {
      return res.status(400).json({ error: 'Dados em falta ou inválidos' });
    }

    const [rows] = await db.query(
      'SELECT * FROM comments WHERE card_id = ? ORDER BY created_at ASC',
      [card_id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};

// POST /api/comments — criar comentário
const create = async (req, res) => {
  try {
    const { card_id, client_id, message, type } = req.body;

    if (!card_id || !client_id || !message) {
      return res.status(400).json({ error: 'Dados em falta ou inválidos' });
    }

    const validTypes = ['comment', 'suggestion'];
    const commentType = validTypes.includes(type) ? type : 'comment';

    const [result] = await db.query(
      'INSERT INTO comments (card_id, client_id, message, type) VALUES (?, ?, ?, ?)',
      [card_id, client_id, message, commentType]
    );

    res.status(201).json({
      id: result.insertId,
      card_id, client_id, message,
      type: commentType
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};


module.exports = { getByCard, create };
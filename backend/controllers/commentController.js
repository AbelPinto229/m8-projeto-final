// backend/controllers/commentController.js

const db = require('../db/connection');

// GET /api/comments?card_id=:id — comentários de um card
const getByCard = async (req, res) => {
  try {
    const { card_id } = req.query;

    if (!card_id || !Number.isInteger(Number(card_id)) || Number(card_id) <= 0) {
      return res.status(400).json({ error: 'Dados em falta ou inválidos' });
    }
    
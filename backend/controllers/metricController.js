// backend/controllers/metricController.js

const db = require('../db/connection');

// GET /api/metrics?card_id=:id — métricas de um card
const getByCard = async (req, res) => {
  try {
    const { card_id } = req.query;

    if (!card_id || !Number.isInteger(Number(card_id)) || Number(card_id) <= 0) {
      return res.status(400).json({ error: 'Dados em falta ou inválidos' });
    }

    const [rows] = await db.query(
      'SELECT * FROM metrics WHERE card_id = ?',
      [card_id]
    );
    res.json(rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};


// POST /api/metrics — inserir métricas manualmente
const create = async (req, res) => {
  try {
    const { card_id, reach, likes, comments_count, shares, published_at } = req.body;

    if (!card_id || !published_at) {
      return res.status(400).json({ error: 'Dados em falta ou inválidos' });
    }

    const [result] = await db.query(
      'INSERT INTO metrics (card_id, reach, likes, comments_count, shares, published_at) VALUES (?, ?, ?, ?, ?, ?)',
      [card_id, reach || 0, likes || 0, comments_count || 0, shares || 0, published_at]
    );

    res.status(201).json({
      id: result.insertId,
      card_id, reach, likes, comments_count, shares, published_at
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};

module.exports = { getByCard, create };

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

module.exports = { getByCard };

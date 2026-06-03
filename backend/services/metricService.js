// backend/services/metricService.js
const db = require('../db/connection');

// GET /api/metrics?card_id=:id
const getByCard = async (cardId) => {
  const [rows] = await db.query(
    'SELECT * FROM metrics WHERE card_id = ?',
    [cardId]
  );
  return rows[0] || null;
};

// POST /api/metrics
const create = async ({ card_id, reach, likes, comments_count, shares, published_at }) => {
  const [result] = await db.query(
    'INSERT INTO metrics (card_id, reach, likes, comments_count, shares, published_at) VALUES (?, ?, ?, ?, ?, ?)',
    [
      card_id,
      reach || 0,
      likes || 0,
      comments_count || 0,
      shares || 0,
      published_at,
    ]
  );
  return result.insertId;
};

// PUT /api/metrics/:id
const update = async (id, { reach, likes, comments_count, shares, published_at }) => {
  const [result] = await db.query(
    'UPDATE metrics SET reach = ?, likes = ?, comments_count = ?, shares = ?, published_at = ? WHERE id = ?',
    [
      reach || 0,
      likes || 0,
      comments_count || 0,
      shares || 0,
      published_at,
      id,
    ]
  );
  return result.affectedRows > 0;
};

module.exports = { getByCard, create, update };

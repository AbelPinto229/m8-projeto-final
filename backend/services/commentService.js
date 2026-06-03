// backend/services/commentService.js
// Camada de acesso a dados dos comments — só fala com a BD.

const db = require('../db/connection');

// GET /api/comments?card_id=:id
const getByCard = async (cardId) => {
  const [rows] = await db.query(
    'SELECT * FROM comments WHERE card_id = ? ORDER BY created_at ASC',
    [cardId]
  );
  return rows;
};

// POST /api/comments
const create = async ({ card_id, client_id, message, type }) => {
  const [result] = await db.query(
    'INSERT INTO comments (card_id, client_id, message, type) VALUES (?, ?, ?, ?)',
    [card_id, client_id, message, type]
  );
  return result.insertId;
};

// DELETE /api/comments/:id
const remove = async (id) => {
  const [result] = await db.query(
    'DELETE FROM comments WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

module.exports = { getByCard, create, remove };

// backend/services/commentService.js
const db = require('../db/connection');

// GET /api/comments?card_id=:id
// usa contact_email da coluna do comentário se existir (comentários da agência),
// caso contrário usa o email do cliente via JOIN
const getByCard = async (cardId) => {
  const [rows] = await db.query(
    `SELECT co.*,
            COALESCE(co.contact_email, cl.contact_email) AS contact_email
       FROM comments co
       JOIN clients cl ON co.client_id = cl.id
      WHERE co.card_id = ?
      ORDER BY co.created_at ASC`,
    [cardId]
  );
  return rows;
};

// POST /api/comments
// contact_email é opcional — só usado quando a agência envia feedback
const create = async ({ card_id, client_id, message, type, contact_email }) => {
  const [result] = await db.query(
    'INSERT INTO comments (card_id, client_id, message, type, contact_email) VALUES (?, ?, ?, ?, ?)',
    [card_id, client_id, message, type, contact_email || null]
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

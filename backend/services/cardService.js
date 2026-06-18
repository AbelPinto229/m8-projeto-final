// backend/services/cardService.js
const db = require('../db/connection');

// GET /api/cards?client_id=:id — inclui contagem e data do último comentário
const getByClient = async (clientId) => {
  const [rows] = await db.query(
    `SELECT c.*,
            (SELECT COUNT(*) FROM comments WHERE card_id = c.id) AS comment_count,
            (SELECT MAX(created_at) FROM comments WHERE card_id = c.id) AS last_comment_at
       FROM content_cards c
      WHERE c.client_id = ?
      ORDER BY c.created_at DESC`,
    [clientId]
  );
  return rows;
};

// GET /api/cards/:id
const getById = async (id) => {
  const [rows] = await db.query(
    'SELECT * FROM content_cards WHERE id = ?',
    [id]
  );
  return rows[0] || null;
};

// POST /api/cards
const create = async ({
  client_id,
  title,
  body,
  image_url,
  social_network,
  scheduled_date,
  review_deadline,
  ai_suggestion,
}) => {
  const [result] = await db.query(
    `INSERT INTO content_cards
       (client_id, title, body, image_url, social_network, status, scheduled_date, review_deadline, ai_suggestion)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      client_id,
      title,
      body,
      image_url || null,
      social_network,
      'in_review',
      scheduled_date || null,
      review_deadline || null,
      JSON.stringify(ai_suggestion),
    ]
  );
  return result.insertId;
};

// PUT /api/cards/:id
const update = async (id, { title, body, image_url, social_network, scheduled_date, review_deadline, ai_suggestion }) => {
  const existing = await getById(id);
  if (!existing) return false;

  const [result] = await db.query(
    `UPDATE content_cards
        SET title = ?, body = ?, image_url = ?, social_network = ?, scheduled_date = ?, review_deadline = ?, ai_suggestion = ?
      WHERE id = ?`,
    [
      title || existing.title,
      body || existing.body,
      image_url || existing.image_url,
      social_network || existing.social_network,
      scheduled_date || existing.scheduled_date,
      review_deadline !== undefined ? review_deadline : existing.review_deadline,
      ai_suggestion
        ? ai_suggestion
        : (typeof existing.ai_suggestion === 'string'
            ? existing.ai_suggestion
            : JSON.stringify(existing.ai_suggestion)),
      id,
    ]
  );
  return result.affectedRows > 0;
};

// PATCH /api/cards/:id/status  APPROVED — guarda timestamp de aprovação
const updateStatus = async (id, status) => {
  const [result] = await db.query(
    'UPDATE content_cards SET status = ?, approved_at = NOW() WHERE id = ?',
    [status, id]
  );
  return result.affectedRows > 0;
};

// PATCH /api/cards/:id/status PUBLISHED — guarda timestamp de publicação e métricas da ia
const updateStatusWithMetrics = async (id, status, ai_metrics_prediction) => {
  const [result] = await db.query(
    'UPDATE content_cards SET status = ?, published_at = NOW(), ai_metrics_prediction = ? WHERE id = ?',
    [status, JSON.stringify(ai_metrics_prediction), id]
  );
  return result.affectedRows > 0;
};

// DELETE /api/cards/:id
const remove = async (id) => {
  const [result] = await db.query(
    'DELETE FROM content_cards WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

module.exports = { getByClient, getById, create, update, updateStatus, updateStatusWithMetrics, remove };

// backend/services/cardService.js
const db = require('../db/connection');

// GET /api/cards
const getAll = async () => {
  const [rows] = await db.query(
    `SELECT cc.*, c.company_name
       FROM content_cards cc
       JOIN clients c ON cc.client_id = c.id
       ORDER BY cc.created_at DESC`
  );
  return rows;
};

// GET /api/cards?client_id=:id
const getByClient = async (clientId) => {
  const [rows] = await db.query(
    'SELECT * FROM content_cards WHERE client_id = ? ORDER BY created_at DESC',
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
  ai_suggestion,
}) => {
  const [result] = await db.query(
    `INSERT INTO content_cards
       (client_id, title, body, image_url, social_network, status, scheduled_date, ai_suggestion)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      client_id,
      title,
      body,
      image_url || null,
      social_network,
      'in_review',
      scheduled_date || null,
      JSON.stringify(ai_suggestion),
    ]
  );
  return result.insertId;
};

// PUT /api/cards/:id
const update = async (id, { title, body, image_url, social_network, scheduled_date, ai_suggestion }) => {
  const existing = await getById(id);
  if (!existing) return false;

  const [result] = await db.query(
    `UPDATE content_cards
        SET title = ?, body = ?, image_url = ?, social_network = ?, scheduled_date = ?, ai_suggestion = ?
      WHERE id = ?`,
    [
      title || existing.title,
      body || existing.body,
      image_url || existing.image_url,
      social_network || existing.social_network,
      scheduled_date || existing.scheduled_date,
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

// PATCH /api/cards/:id/status  APPROVED
const updateStatus = async (id, status) => {
  const [result] = await db.query(
    'UPDATE content_cards SET status = ? WHERE id = ?',
    [status, id]
  );
  return result.affectedRows > 0;
};

// PATCH /api/cards/:id/status PUBLISHED
const updateStatusWithMetrics = async (id, status, ai_metrics_prediction) => {
  const [result] = await db.query(
    'UPDATE content_cards SET status = ?, ai_metrics_prediction = ? WHERE id = ?',
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

module.exports = { getAll, getByClient, getById, create, update, updateStatus, updateStatusWithMetrics, remove };
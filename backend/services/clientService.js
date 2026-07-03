// backend/services/clientService.js
const db = require('../db/connection');

// GET /api/clients
const getAll = async () => {
  const [rows] = await db.query(
    `SELECT cl.*, COUNT(cc.id) AS card_count
       FROM clients cl
       LEFT JOIN content_cards cc ON cc.client_id = cl.id
      GROUP BY cl.id
      ORDER BY cl.created_at DESC`
  );
  return rows;
};

// GET /api/clients/:id
const getById = async (id) => {
  const [rows] = await db.query(
    'SELECT * FROM clients WHERE id = ?',
    [id]
  );
  return rows[0] || null;
};

// verifica se já existe um projeto com esse nome
const nameExists = async (company_name) => {
  const [rows] = await db.query(
    'SELECT id FROM clients WHERE company_name = ?',
    [company_name]
  );
  return rows.length > 0;
};

// POST /api/clients
const create = async ({ company_name, contact_email, logo_url, social_networks, color }) => {
  const [result] = await db.query(
    'INSERT INTO clients (company_name, contact_email, logo_url, social_networks, color, status) VALUES (?, ?, ?, ?, ?, ?)',
    [
      company_name,
      contact_email || null,
      logo_url || null,
      social_networks || null,
      color || null,
      'ativo',
    ]
  );
  return result.insertId;
};

// PUT /api/clients/:id
const update = async (id, { company_name, contact_email, logo_url, social_networks, status, color }) => {
  const existing = await getById(id);
  if (!existing) return false;

  const [result] = await db.query(
    'UPDATE clients SET company_name = ?, contact_email = ?, logo_url = ?, social_networks = ?, status = ?, color = ? WHERE id = ?',
    [
      company_name || existing.company_name,
      contact_email || existing.contact_email,
      logo_url || existing.logo_url,
      social_networks || existing.social_networks,
      status || existing.status,
      color !== undefined ? color : existing.color,
      id,
    ]
  );
  return result.affectedRows > 0;
};

// DELETE /api/clients/:id
const remove = async (id) => {
  const [result] = await db.query(
    'DELETE FROM clients WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

const getMine = async (email) => {
  const [rows] = await db.query(
    `SELECT cl.*, COUNT(cc.id) AS card_count
       FROM clients cl
       LEFT JOIN content_cards cc ON cc.client_id = cl.id
      WHERE cl.contact_email = ?
      GROUP BY cl.id
      ORDER BY cl.created_at DESC`,
    [email]
  );
  return rows;
};

module.exports = { getAll, getById, create, update, remove, nameExists, getMine };

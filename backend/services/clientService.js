// backend/services/clientService.js
const db = require('../db/connection');

// GET /api/clients
const getAll = async () => {
  const [rows] = await db.query(
    'SELECT * FROM clients ORDER BY created_at DESC'
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

// POST /api/clients
const create = async ({ company_name, contact_email, logo_url, social_networks }) => {
  const [result] = await db.query(
    'INSERT INTO clients (company_name, contact_email, logo_url, social_networks) VALUES (?, ?, ?, ?)',
    [
      company_name,
      contact_email || null,
      logo_url || null,
      social_networks || null,
    ]
  );
  return result.insertId;
};

// PUT /api/clients/:id
const update = async (id, { company_name, contact_email, logo_url, social_networks }) => {
  const existing = await getById(id);
  if (!existing) return false;

  const [result] = await db.query(
    'UPDATE clients SET company_name = ?, contact_email = ?, logo_url = ?, social_networks = ? WHERE id = ?',
    [
      company_name || existing.company_name,
      contact_email || existing.contact_email,
      logo_url || existing.logo_url,
      social_networks || existing.social_networks,
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

module.exports = { getAll, getById, create, update, remove };

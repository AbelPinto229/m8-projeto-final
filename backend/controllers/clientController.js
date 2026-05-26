const db = require('../db/connection');

// GET /api/clients
const getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM clients ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/clients/:id
const getById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM clients WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /api/clients
const create = async (req, res) => {
  try {
    const { company_name, contact_email, logo_url, social_networks } = req.body;
    if (!company_name) return res.status(400).json({ error: 'Nome da empresa é obrigatório' });

    const [result] = await db.query(
      'INSERT INTO clients (company_name, contact_email, logo_url, social_networks) VALUES (?, ?, ?, ?)',
      [company_name, contact_email || null, logo_url || null, social_networks || null]
    );
    res.status(201).json({ id: result.insertId, company_name, contact_email, logo_url, social_networks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// PUT /api/clients/:id
const update = async (req, res) => {
  try { 
    const { company_name, contact_email, logo_url, social_networks } = req.body;
    const [result] = await db.query(
      'UPDATE clients SET company_name = ?, contact_email = ?, logo_url = ?, social_networks = ? WHERE id = ?',
      [company_name, contact_email, logo_url, social_networks, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json({ message: 'Cliente actualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DELETE /api/clients/:id
const remove = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM clients WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json({ message: 'Cliente eliminado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getAll, getById, create, update, remove };
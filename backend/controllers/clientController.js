const db = require('../db/connection');

// GET /api/clients
const getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM clients ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
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
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};

// POST /api/clients
const create = async (req, res) => {
  try {
    const { company_name, contact_email, logo_url, social_networks } = req.body;
    if (!company_name || !contact_email || !social_networks) return res.status(400).json({ error: 'Dados em falta ou inválidos' });

    const [result] = await db.query(
      'INSERT INTO clients (company_name, contact_email, logo_url, social_networks) VALUES (?, ?, ?, ?)',
      [company_name, contact_email || null, logo_url || null, social_networks || null]
    );
    res.status(201).json({ id: result.insertId, company_name, contact_email, logo_url, social_networks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};


// PUT /api/clients/:id
const update = async (req, res) => {
  try {
    const { company_name, contact_email, logo_url, social_networks } = req.body;

    if (!company_name || !contact_email || !social_networks) {
      return res.status(400).json({ error: 'Dados em falta ou inválidos' });
    }
    
    const [existing] = await db.query('SELECT * FROM clients WHERE id = ?', [req.params.id]);
    const client = existing[0];
    if (!client) return res.status(404).json({ error: 'Cliente não encontrado' });

    const [result] = await db.query(
      'UPDATE clients SET company_name = ?, contact_email = ?, logo_url = ?, social_networks = ? WHERE id = ?',
      [company_name || client.company_name, contact_email || client.contact_email, logo_url || client.logo_url, social_networks || client.social_networks, req.params.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json({ message: 'Cliente actualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
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
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};

module.exports = { getAll, getById, create, update, remove };
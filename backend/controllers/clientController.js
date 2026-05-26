const db = require('../db/connection');

// GET /api/clients
const getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM clients ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/clients/:id
const getById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM clients WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
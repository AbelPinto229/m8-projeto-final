// backend/controllers/cardController.js

const db = require('../db/connection');

// GET /api/cards — todos os cards (agência)
const getAll = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT cc.*, c.company_name FROM content_cards cc JOIN clients c ON cc.client_id = c.id ORDER BY cc.created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};

// GET /api/cards?client_id=:id — cards de um cliente específico
const getByClient = async (req, res) => {
  try {
    const { client_id } = req.query;
    if (!client_id) return res.status(400).json({ error: 'Dados em falta ou inválidos' });

    const [rows] = await db.query(
      'SELECT * FROM content_cards WHERE client_id = ? ORDER BY created_at DESC',
      [client_id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};

// GET /api/cards/:id — um card específico
const getById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM content_cards WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Card não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};
module.exports = { getAll, getByClient, getById };

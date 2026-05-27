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
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/cards?client_id=:id — cards de um cliente específico
const getByClient = async (req, res) => {
  try {
    const { client_id } = req.query;
    if (!client_id) return res.status(400).json({ error: 'client_id é obrigatório' });

    const [rows] = await db.query(
      'SELECT * FROM content_cards WHERE client_id = ? ORDER BY created_at DESC',
      [client_id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getAll, getByClient };

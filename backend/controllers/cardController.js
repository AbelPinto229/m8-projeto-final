// backend/controllers/cardController.js

const db = require('../db/connection');
const aiService = require('../services/aiService');

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

// POST /api/cards — criar card
const create = async (req, res) => {
  try {
    const { client_id, title, body, image_url, social_network, scheduled_date } = req.body;

    if (!client_id || !title || !body || !social_network) {
      return res.status(400).json({ error: 'Dados em falta ou inválidos' });
    }

    // Chama a IA para analisar o conteúdo
    const ai_suggestion = await aiService.analyseContent(title, body, social_network, scheduled_date);

    const [result] = await db.query(
      'INSERT INTO content_cards (client_id, title, body, image_url, social_network, status, scheduled_date, ai_suggestion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [client_id, title, body, image_url || null, social_network, 'in_review', scheduled_date || null, JSON.stringify(ai_suggestion)]
    );

    res.status(201).json({
      id: result.insertId,
      client_id, title, body, social_network,
      status: 'in_review',
      ai_suggestion,
      link: `/cliente/${client_id}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};

// PUT /api/cards/:id — editar card
const update = async (req, res) => {
  try {
    const { title, body, image_url, social_network, scheduled_date } = req.body;
    const [result] = await db.query(
      'UPDATE content_cards SET title = ?, body = ?, image_url = ?, social_network = ?, scheduled_date = ? WHERE id = ?',
      [title, body, image_url || null, social_network, scheduled_date || null, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Card não encontrado' });
    res.json({ message: 'Card actualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};

// PATCH /api/cards/:id/status
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatus = ['approved', 'published'];

    if (!validStatus.includes(status)) {
      return res.status(400).json({ error: 'Dados em falta ou inválidos' });
    }

    // Se for publicado chama a IA para prever métricas
    if (status === 'published') {
      // Vai buscar o card para passar à IA
      const [rows] = await db.query(
        'SELECT * FROM content_cards WHERE id = ?',
        [req.params.id]
      );

      if (rows.length === 0) return res.status(404).json({ error: 'Conteúdo não encontrado' });

      const card = rows[0];

      // Chama a IA para prever métricas
      const ai_metrics_prediction = await aiService.predictMetrics(card.title, card.body, card.social_network);

      // Actualiza o status para publicado e guarda a previsão
      await db.query(
        'UPDATE content_cards SET status = ?, ai_metrics_prediction = ? WHERE id = ?',
        [status, JSON.stringify(ai_metrics_prediction), req.params.id]
      );

    } else {
      // Só actualiza o status para aprovado
      const [result] = await db.query(
        'UPDATE content_cards SET status = ? WHERE id = ?',
        [status, req.params.id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Conteúdo não encontrado' });
    }

    res.json({ message: `Estado actualizado para ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};

// DELETE /api/cards/:id
const remove = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM content_cards WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Card não encontrado' });
    res.json({ message: 'Card eliminado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};

module.exports = { getAll, getByClient, getById, create, update, updateStatus, remove };

// backend/controllers/metricController.js
const metricService = require('../services/metricService');

// GET /api/metrics?card_id=:id — métricas de um card
const getByCard = async (req, res) => {
  try {
    const { card_id } = req.query;

    if (!card_id || !Number.isInteger(Number(card_id)) || Number(card_id) <= 0) {
      return res.status(400).json({ error: 'Dados em falta ou inválidos' });
    }

    const metric = await metricService.getByCard(card_id);
    res.json(metric);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};

// POST /api/metrics — inserir métricas manualmente
const create = async (req, res) => {
  try {
    const { card_id, reach, likes, comments_count, shares, published_at } = req.body;

    if (!card_id || !published_at) {
      return res.status(400).json({ error: 'Dados em falta ou inválidos' });
    }

    const id = await metricService.create({
      card_id, reach, likes, comments_count, shares, published_at,
    });

    res.status(201).json({
      id,
      card_id, reach, likes, comments_count, shares, published_at,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};

// PUT /api/metrics/:id — actualizar métricas
const update = async (req, res) => {
  try {
    const { reach, likes, comments_count, shares, published_at } = req.body;

    if (!published_at) {
      return res.status(400).json({ error: 'Dados em falta ou inválidos' });
    }

    const ok = await metricService.update(req.params.id, {
      reach, likes, comments_count, shares, published_at,
    });
    if (!ok) return res.status(404).json({ error: 'Métricas não encontradas' });

    res.json({ message: 'Métricas actualizadas com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};

module.exports = { getByCard, create, update };

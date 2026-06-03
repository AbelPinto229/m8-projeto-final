// backend/controllers/cardController.js
const cardService = require('../services/cardService');
const aiService = require('../services/aiService');

// GET /api/cards — todos os cards (agência)
const getAll = async (req, res) => {
  try {
    const cards = await cardService.getAll();
    res.json(cards);
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

    const cards = await cardService.getByClient(client_id);
    res.json(cards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};

// GET /api/cards/:id — um card específico
const getById = async (req, res) => {
  try {
    const card = await cardService.getById(req.params.id);
    if (!card) return res.status(404).json({ error: 'Card não encontrado' });
    res.json(card);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};

// POST /api/cards — criar card
const create = async (req, res) => {
  try {
    const { client_id, title, body, image_url, social_network, scheduled_date } = req.body;

    if (!client_id || !title || !body || !social_network || !scheduled_date) {
      return res.status(400).json({ error: 'Dados em falta ou inválidos' });
    }

    // Chama a IA para analisar o conteúdo
    const ai_suggestion = await aiService.analyseContent(title, body, social_network, scheduled_date);

    const id = await cardService.create({
      client_id, title, body, image_url, social_network, scheduled_date, ai_suggestion,
    });

    res.status(201).json({
      id,
      client_id, title, body, social_network,
      status: 'in_review',
      ai_suggestion,
      link: `/cliente/${client_id}`,
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

    if (!title || !body || !social_network || !scheduled_date) {
      return res.status(400).json({ error: 'Dados em falta ou inválidos' });
    }

    const ok = await cardService.update(req.params.id, {
      title, body, image_url, social_network, scheduled_date,
    });
    if (!ok) return res.status(404).json({ error: 'Card não encontrado' });

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
      const card = await cardService.getById(req.params.id);
      if (!card) return res.status(404).json({ error: 'Conteúdo não encontrado' });

      const ai_metrics_prediction = await aiService.predictMetrics(
        card.title, card.body, card.social_network
      );

      await cardService.updateStatusWithMetrics(req.params.id, status, ai_metrics_prediction);
    } else {
      // Só actualiza o status para aprovado
      const ok = await cardService.updateStatus(req.params.id, status);
      if (!ok) return res.status(404).json({ error: 'Conteúdo não encontrado' });
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
    const ok = await cardService.remove(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Card não encontrado' });
    res.json({ message: 'Card eliminado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};

module.exports = { getAll, getByClient, getById, create, update, updateStatus, remove };

// backend/controllers/cardController.js
const cardService = require('../services/cardService');
const aiService = require('../services/aiService');
const notificationService = require('../services/notificationService');

// GET /api/cards?client_id=:id — cards de um cliente específico
const getByClient = async (req, res) => {
  try {
    const { client_id } = req.query;
    if (!client_id) return res.status(400).json({ error: 'Dados em falta ou inválidos' });

    // clientes só podem ver os cards dos seus próprios projetos
    if (req.user.role === 'client') {
      const client = await require('../services/clientService').getById(client_id);
      if (!client || client.contact_email !== req.user.email) {
        return res.status(403).json({ error: 'Acesso negado.' });
      }
    }

    const cards = await cardService.getByClient(client_id);
    res.json(cards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};

// POST /api/cards — criar card e notificar cliente
const create = async (req, res) => {
  try {
    const { client_id, title, body, image_url, social_network, scheduled_date, review_deadline } = req.body;

    if (!client_id || !title || !body || !social_network || !scheduled_date) {
      return res.status(400).json({ error: 'Dados em falta ou inválidos' });
    }

    const ai_suggestion = await aiService.analyseContent(title, body, social_network, scheduled_date);

    const id = await cardService.create({
      client_id, title, body, image_url, social_network, scheduled_date, review_deadline, ai_suggestion,
    });

    // notifica o cliente que há um novo conteúdo para rever
    await notificationService.create({
      client_id,
      for_agency: false,
      card_id: id,
      message: `Novo conteúdo "${title}" está disponível para revisão.`,
    });

    res.status(201).json({
      id,
      client_id, title, body, social_network,
      status: 'in_review',
      review_deadline: review_deadline || null,
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
    const { title, body, image_url, social_network, scheduled_date, review_deadline } = req.body;

    if (!title || !body || !social_network || !scheduled_date) {
      return res.status(400).json({ error: 'Dados em falta ou inválidos' });
    }

    const ok = await cardService.update(req.params.id, {
      title, body, image_url, social_network, scheduled_date, review_deadline,
    });
    if (!ok) return res.status(404).json({ error: 'Card não encontrado' });

    res.json({ message: 'Card actualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};

// PATCH /api/cards/:id/status — muda estado e dispara notificação
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatus = ['approved', 'published'];

    if (!validStatus.includes(status)) {
      return res.status(400).json({ error: 'Dados em falta ou inválidos' });
    }

    const card = await cardService.getById(req.params.id);
    if (!card) return res.status(404).json({ error: 'Conteúdo não encontrado' });

    if (status === 'published') {
      const ai_metrics_prediction = await aiService.predictMetrics(
        card.title, card.body, card.social_network
      );
      await cardService.updateStatusWithMetrics(req.params.id, status, ai_metrics_prediction);

      // notifica o cliente que o conteúdo foi publicado
      await notificationService.create({
        client_id: card.client_id,
        for_agency: false,
        card_id: card.id,
        message: `"${card.title}" foi publicado.`,
      });
    } else {
      // approved — vem do lado do cliente, notifica a agência
      await cardService.updateStatus(req.params.id, status);

      await notificationService.create({
        client_id: card.client_id,
        for_agency: true,
        card_id: card.id,
        message: `O cliente aprovou "${card.title}".`,
      });
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

module.exports = { getByClient, create, update, updateStatus, remove };

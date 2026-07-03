const notificationService = require('../services/notificationService');

const getForAgency = async (req, res) => {
  try {
    const { client_id } = req.query;
    if (!client_id) return res.status(400).json({ error: 'client_id em falta' });
    const notifications = await notificationService.getForAgency(client_id);
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao obter notificações' });
  }
};

const getForClient = async (req, res) => {
  try {
    const { client_id } = req.query;
    if (!client_id) return res.status(400).json({ error: 'client_id em falta' });
    const notifications = await notificationService.getForClient(client_id);
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao obter notificações' });
  }
};

const markOneRead = async (req, res) => {
  try {
    const { id } = req.params;
    await notificationService.markOneRead(id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao marcar notificação' });
  }
};

module.exports = { getForAgency, getForClient, markOneRead };

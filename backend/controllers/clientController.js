// backend/controllers/clientController.js
const clientService = require('../services/clientService');

// GET /api/clients
const getAll = async (req, res) => {
  try {
    const clients = await clientService.getAll();
    res.json(clients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};

// GET /api/clients/:id
const getById = async (req, res) => {
  try {
    const client = await clientService.getById(req.params.id);
    if (!client) return res.status(404).json({ error: 'Cliente não encontrado' });

    // clientes só podem aceder aos seus próprios projetos
    if (req.user.role === 'client' && client.contact_email !== req.user.email) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    res.json(client);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};

// POST /api/clients
const create = async (req, res) => {
  try {
    const { company_name, contact_email, logo_url, social_networks, color } = req.body;

    if (!company_name || !contact_email || !social_networks) {
      return res.status(400).json({ error: 'Dados em falta ou inválidos' });
    }

    const exists = await clientService.nameExists(company_name);
    if (exists) {
      return res.status(409).json({ error: 'Já existe um projeto com esse nome.' });
    }

    const id = await clientService.create({
      company_name, contact_email, logo_url, social_networks, color,
    });

    res.status(201).json({
      id,
      company_name, contact_email, logo_url, social_networks, color,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};

// PUT /api/clients/:id
const update = async (req, res) => {
  try {
    const { company_name, contact_email, logo_url, social_networks, status, color } = req.body;

    if (!company_name) {
      return res.status(400).json({ error: 'Dados em falta ou inválidos' });
    }

    const ok = await clientService.update(req.params.id, {
      company_name, contact_email, logo_url, social_networks, status, color,
    });
    if (!ok) return res.status(404).json({ error: 'Cliente não encontrado' });

    res.json({ message: 'Cliente actualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};

// DELETE /api/clients/:id
const remove = async (req, res) => {
  try {
    const ok = await clientService.remove(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json({ message: 'Cliente eliminado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};

// GET /api/clients/mine — projetos do cliente autenticado (por email)
const getMine = async (req, res) => {
  try {
    const db = require('../db/connection');
    const [rows] = await db.query(
      `SELECT cl.*, COUNT(cc.id) AS card_count
         FROM clients cl
         LEFT JOIN content_cards cc ON cc.client_id = cl.id
        WHERE cl.contact_email = ?
        GROUP BY cl.id
        ORDER BY cl.created_at DESC`,
      [req.user.email]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' });
  }
};

module.exports = { getAll, getById, create, update, remove, getMine };

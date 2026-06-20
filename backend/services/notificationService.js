const db = require('../db/connection');

const create = async ({ client_id, for_agency, card_id, message }) => {
  const [result] = await db.query(
    'INSERT INTO notifications (client_id, for_agency, card_id, message) VALUES (?, ?, ?, ?)',
    [client_id, for_agency ? 1 : 0, card_id || null, message]
  );
  return result.insertId;
};

const getForAgency = async (client_id) => {
  const [rows] = await db.query(
    'SELECT * FROM notifications WHERE client_id = ? AND for_agency = 1 ORDER BY created_at DESC LIMIT 50',
    [client_id]
  );
  return rows;
};

const getForClient = async (client_id) => {
  const [rows] = await db.query(
    'SELECT * FROM notifications WHERE client_id = ? AND for_agency = 0 ORDER BY created_at DESC LIMIT 50',
    [client_id]
  );
  return rows;
};

const markAllRead = async (client_id, for_agency) => {
  await db.query(
    'UPDATE notifications SET is_read = 1 WHERE client_id = ? AND for_agency = ?',
    [client_id, for_agency ? 1 : 0]
  );
};

const markOneRead = async (id) => {
  await db.query('UPDATE notifications SET is_read = 1 WHERE id = ?', [id]);
};

module.exports = { create, getForAgency, getForClient, markAllRead, markOneRead };

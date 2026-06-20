const db     = require('../db/connection');
const bcrypt = require('bcryptjs');

// vai à BD buscar o utilizador pelo email
const findUserByEmail = async (email) => {
  const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return results[0] || null;
};

// compara a password que o utilizador escreveu com o hash guardado na BD
const validatePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// cria um novo utilizador na BD com a password já encriptada
const createUser = async (email, hashedPassword, role = 'client', client_id = null, name = null) => {
  const [result] = await db.query(
    'INSERT INTO users (email, password, role, client_id, name) VALUES (?, ?, ?, ?, ?)',
    [email, hashedPassword, role, client_id, name]
  );
  return result.insertId;
};

// verifica se já existe um utilizador com esse email na BD
const emailExists = async (email) => {
  const [results] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
  return results.length > 0;
};

module.exports = { findUserByEmail, validatePassword, createUser, emailExists };

const jwt          = require('jsonwebtoken');
const bcrypt       = require('bcryptjs');
const crypto       = require('crypto');
const authService  = require('../services/authService');
const emailService = require('../services/emailService');

const login = async (req, res) => {
  try {
    // lê o email e password que vieram no body do pedido POST do frontend 
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e password são obrigatórios.' });
    }

    // chama o service para ir à BD buscar o utilizador pelo emailrd
    const user = await authService.findUserByEmail(email);

    // se não encontrou nenhum utilizador com esse email, recusa o login
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // chama o service para comparar a password escrita com o hash que veio da BD
    const validPassword = await authService.validatePassword(password, user.password);

    // se a password não corresponder ao hash, recusa o login
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // email e password corretos — cria o token JWT com os dados do utilizador
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // responde ao frontend com o token e os dados do utilizador
    res.json({
      token,
      message: 'Login efetuado com sucesso!',
      user: {
        id:        user.id,
        name:      user.name || null,
        email:     user.email,
        role:      user.role,
        client_id: user.client_id || null,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

//registo
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e password são obrigatórios.' });
    }

    const exists = await authService.emailExists(email);
    if (exists) {
      return res.status(409).json({ error: 'Este email já está registado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await authService.createUser(email, hashedPassword, 'client', null, name || null);

    res.status(201).json({ message: 'Conta criada com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// cria o utilizador de acesso para um cliente — chamado pela agência ao criar projeto
const createClientUser = async (req, res) => {
  try {
    const { email, password, client_id, name } = req.body;

    if (!email || !password || !client_id) {
      return res.status(400).json({ error: 'Email, password e client_id são obrigatórios.' });
    }

    const exists = await authService.emailExists(email);
    if (exists) {
      return res.status(409).json({ error: 'Este email já está registado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await authService.createUser(email, hashedPassword, 'client', client_id, name || null);

    res.status(201).json({ message: 'Acesso do cliente criado com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const checkEmail = async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email é obrigatório.' });
  const exists = await authService.emailExists(email);
  res.json({ exists });
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email é obrigatório.' });

    const user = await authService.findUserByEmail(email);
    if (!user) return res.json({ message: 'Se o email existir, receberás um código em breve.' });

    const otp    = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 1000 * 60 * 10); // 10 minutos

    await authService.saveOTP(email, otp, expiry);
    await emailService.sendOTP(email, otp);
    res.json({ message: 'Se o email existir, receberás um código em breve.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { otp, password } = req.body;
    if (!otp || !password) return res.status(400).json({ error: 'Código e password são obrigatórios.' });

    const user = await authService.findUserByOTP(otp);
    if (!user) return res.status(400).json({ error: 'Código inválido ou expirado.' });

    const hashed = await bcrypt.hash(password, 10);
    await authService.updatePasswordAndClearOTP(otp, hashed);

    res.json({ message: 'Password atualizada com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

module.exports = { login, register, createClientUser, checkEmail, forgotPassword, resetPassword };

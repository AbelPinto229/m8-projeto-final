const express        = require('express');
const router         = express.Router();
const auth           = require('../middleware/auth');
const authController = require('../controllers/authController');

// rota pública — recebe email e password no body, devolve token JWT
router.post('/login',    authController.login);

// rota pública — cliente cria a sua própria conta
router.post('/register', authController.register);

// rota protegida — agência cria o acesso (login+password) para um cliente ao criar projeto
router.post('/create-client-user', auth, authController.createClientUser);

// rota protegida — verifica se um email já tem conta criada
router.get('/check-email', auth, authController.checkEmail);

// rotas públicas — recuperação de password via código OTP
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password',  authController.resetPassword);

// rota protegida — verifica se o token é válido
router.get('/dashboard', auth, (req, res) => {
  res.json({ message: 'Área protegida', user: req.user });
});

module.exports = router;

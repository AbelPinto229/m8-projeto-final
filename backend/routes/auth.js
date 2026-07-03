const express        = require('express');
const router         = express.Router();
const auth           = require('../middleware/auth');
const authController = require('../controllers/authController');

// rota pública — recebe email e password no body, devolve token JWT
router.post('/login',    authController.login);

// rota pública — cliente cria a sua própria conta
router.post('/register', authController.register);

// rotas públicas — recuperação de password via código OTP
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password',  authController.resetPassword);

module.exports = router;

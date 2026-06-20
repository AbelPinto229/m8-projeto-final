const express        = require('express');
const router         = express.Router();
const auth           = require('../middleware/auth');
const authController = require('../controllers/authController');

// rota pública — recebe email e password no body, devolve token JWT
// chamada pelo Login.jsx quando o utilizador carrega em "Entrar"
router.post('/login', authController.login);

// rota protegida — agência cria o acesso (login+password) para um cliente ao criar projeto
router.post('/create-client-user', auth, authController.createClientUser);

// rota protegida — verifica se um email já tem conta criada (usado no drawer para esconder campos de password)
router.get('/check-email', auth, authController.checkEmail);

// rota protegida — verifica se o token é válido
// o middleware auth corre antes do handler e bloqueia se o token for inválido
// usada pelas dashboards ao abrir para confirmar que o utilizador está autenticado
// se o token for válido responde com os dados do utilizador (req.user)
router.get(
  "/dashboard",
  auth,
  (req, res) => {
    res.json({
      message: "Área protegida",
      user: req.user  // dados descodificados do token: { id, email, role }
    });
  }
);

module.exports = router;

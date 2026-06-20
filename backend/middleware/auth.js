const jwt = require("jsonwebtoken");

// middleware que verifica se o token JWT é válido antes de deixar passar para a rota
function auth(req, res, next) {
  // lê o header Authorization que o frontend envia em cada pedido
  const authHeader = req.headers.authorization;

  // se não vier nenhum header, o utilizador não está autenticado
  if (!authHeader) {
    return res.sendStatus(401); // 401 = não autorizado
  }

  // fica só com o token que está na posição 1 do header
  const token = authHeader.split(" ")[1];

  try {
    // verifica se o token é válido usando a chave secreta do .env
    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    // guarda os dados do utilizador no req para estarem disponíveis na rota seguinte
    req.user = decoded;

    // token válido — deixa o pedido continuar para a rota
    next();
  } catch {
    // token inválido ou expirado
    return res.sendStatus(403); 
  }
}

module.exports = auth;

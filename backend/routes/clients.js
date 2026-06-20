// backend/routes/clients.js

const express = require('express');
const router  = express.Router();
const clientController = require('../controllers/clientController');

router.get('/',       clientController.getAll);
// devolve todos os projetos cujo contact_email corresponde ao utilizador autenticado
router.get('/mine',   clientController.getMine);
router.get('/:id',    clientController.getById);
router.post('/',      clientController.create);
router.put('/:id',    clientController.update);
router.delete ('/:id',  clientController.remove);

module.exports = router;
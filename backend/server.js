require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const auth    = require('./middleware/auth');

const app = express();

app.use(cors());
app.use(express.json());

// rotas públicas 
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));

// rotas protegidas 
app.use('/api/clients',       auth, require('./routes/clients'));
app.use('/api/cards',         auth, require('./routes/cards'));
app.use('/api/comments',      auth, require('./routes/comments'));
app.use('/api/metrics',       auth, require('./routes/metrics'));
app.use('/api/notifications', auth, require('./routes/notifications'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server a correr em http://localhost:${PORT}`));

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/clients', require('./routes/clients'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server a correr em http://localhost:${PORT}`));

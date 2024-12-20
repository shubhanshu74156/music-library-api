// server.js
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser'); 
const cors = require('cors'); 
const routeIndex = require('./routes/index');

const app = express();
app.use(cors()); 
app.use(bodyParser.json()); 

app.use('/api/v1', routeIndex); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

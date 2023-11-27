const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./userRoutes');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Добро пожаловать на Node.js сервер!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

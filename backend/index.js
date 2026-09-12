// Importa o framework Express, que cuida de rotas, requisições e respostas HTTP
const express = require('express');

// Importa as rotas de música que criamos em outro arquivo (routes/musica.routes.js)
const musicaRoutes = require('./routes/musica.routes'); 

const PORT = 3000;
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ status: 'Música API' }); 
});

// Registra todas as rotas de música sob o prefixo "/musicas".
app.use('/musicas', musicaRoutes); 

// 404 primeiro
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// erro por último // 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erro interno no servidor' });
});

app.listen(PORT, () => {
    console.log(`Música API - porta ${PORT}`);
});
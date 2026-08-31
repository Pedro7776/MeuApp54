// Importa o framework Express, que cuida de rotas, requisições e respostas HTTP
const express = require('express');

// Importa as rotas de tarefas que criamos em outro arquivo (routes/tasks.routes.js)
// Separar as rotas em arquivos próprios evita que o index.js fique gigante
// conforme a API cresce 
const tasksRoutes = require('./routes/tasks.routes');

const PORT = 3000;
const app = express();

// Middleware que ensina o Express a entender JSON no body das requisições.
// Sem isso, quando o app Expo/React Native mandar um POST com { "title": "..." },
// o req.body chegaria "undefined" no servidor.
app.use(express.json());

// Rota simples só para confirmar que a API está no ar (útil para testar no navegador
// ou dar um "ping" a partir do app Expo antes de chamar as rotas de verdade)
app.get('/', (req, res) => {
    res.json({ status: 'Ntask API' });
});

// Registra todas as rotas de tarefas sob o prefixo "/tasks".
// Ou seja, o que estiver definido como router.get('/') dentro de tasks.routes.js
// na prática vira GET /tasks, router.post('/') vira POST /tasks, etc.
app.use('/tasks', tasksRoutes);

// Middleware de tratamento de erro "genérico". Se qualquer rota chamar next(erro),
// a requisição cai aqui em vez de derrubar o servidor. Sempre deve ser o ÚLTIMO
// app.use() do arquivo, depois de todas as rotas.
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erro interno no servidor' });
});

// Middleware para rota não encontrada (404). Só é executado se nenhuma rota acima bateu.
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`Ntask API - porta ${PORT}`);
});
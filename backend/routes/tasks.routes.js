// O Router do Express permite criar um "mini app" de rotas separado,
// que depois é "encaixado" no app principal (veja app.use('/tasks', ...) no index.js)
const express = require('express');
const router = express.Router();

// Banco de dados" em memória
// Isso é só para testar a API sem precisar configurar um banco de verdade ainda.
// Assim que quiser persistência real, essa lista vira uma tabela (ex: SQLite, Postgres, MongoDB)
// e as funções abaixo passam a fazer queries em vez de mexer em array.
let tasks = [
    { id: 1, title: 'Estudar Express', done: false },
    { id: 2, title: 'Configurar app Expo', done: false },
];

// Contador simples para gerar ids novos. Em produção o banco costuma fazer isso sozinho.
let nextId = 3;

// GET /tasks
// Lista todas as tarefas. É a rota que a tela inicial do app Expo provavelmente vai chamar.
router.get('/', (req, res) => {
    res.json(tasks);
});

// GET /tasks/:id
// Busca UMA tarefa pelo id (ex: GET /tasks/2).
// ":id" é um parâmetro de rota; o valor digitado na URL fica disponível em req.params.id
router.get('/:id', (req, res) => {
    // req.params.id sempre chega como string, por isso o Number(...)
    const id = Number(req.params.id);
    const task = tasks.find((t) => t.id === id);

    if (!task) {
        // 404 = "não encontrado". Importante retornar isso em vez de um objeto vazio,
        // para o app conseguir tratar o erro (ex: mostrar "tarefa não existe")
        return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    res.json(task);
});

// POST /tasks
// Cria uma nova tarefa. O app Expo manda algo como { "title": "Comprar leite" } no body.
router.post('/', (req, res) => {
    const { title } = req.body;

    // Validação básica: sem título não cria a tarefa.
    // 400 = "bad request", erro de quem fez a requisição, não do servidor.
    if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: 'O campo "title" é obrigatório' });
    }

    const newTask = {
        id: nextId++,
        title,
        done: false,
    };

    tasks.push(newTask);

    // 201 = "created". Devolvemos a tarefa criada para o app já saber o id gerado.
    res.status(201).json(newTask);
});

// PUT /tasks/:id
// Atualiza uma tarefa existente (ex: marcar como concluída, mudar o título).
// O app manda o id na URL e os campos que quer mudar no body.
router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find((t) => t.id === id);

    if (!task) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    const { title, done } = req.body;

    // Só atualiza os campos que vieram no body, mantendo os outros como estavam.
    if (title !== undefined) task.title = title;
    if (done !== undefined) task.done = done;

    res.json(task);
});

// DELETE /tasks/:id
// Remove uma tarefa pelo id.
router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = tasks.findIndex((t) => t.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    tasks.splice(index, 1);

    // 204 = "no content". Deu certo, mas não há nada para devolver no corpo da resposta.
    res.status(204).send();
});

// Exporta o router para ser usado no index.js
module.exports = router;
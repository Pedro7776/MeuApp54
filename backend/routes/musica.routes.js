// O Router do Express permite criar um "mini app" de rotas separado,
// que depois é "encaixado" no app principal (veja app.use('/tasks', ...) no index.js)
const express = require('express');
const router = express.Router();

// "Banco de dados" em memória
let musicas = [
    { id: 1, titulo: 'If I Fell', artista: 'The Beatles' },
    { id: 2, titulo: 'Azul', artista: 'Gal Costa' },
    { id: 3, titulo: 'I Put A Spell On You', artista: 'Nina Simone' },
];

let nextId = 4;

// GET /musicas
router.get('/', (req, res) => {
    res.json(musicas);
});

// GET /musicas/aleatoria
router.get('/aleatoria', (req, res) => {
    if (musicas.length === 0) {
        return res.status(404).json({ error: 'Nenhuma música cadastrada' });
    }

    const index = Math.floor(Math.random() * musicas.length);
    res.json(musicas[index]);
});

// GET /musicas/:id
router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    const musica = musicas.find((m) => m.id === id);

    if (!musica) {
        return res.status(404).json({ error: 'Música não encontrada' });
    }

    res.json(musica);
});

// POST /musicas
router.post('/', (req, res) => {
    const { titulo, artista } = req.body;

    if (!titulo || typeof titulo !== 'string') {
        return res.status(400).json({ error: 'O campo "titulo" é obrigatório' });
    }

    const novaMusica = {
        id: nextId++,
        titulo,
        artista: artista || 'Desconhecido',
    };

    musicas.push(novaMusica);
    res.status(201).json(novaMusica);
});

// PUT /musicas/:id
router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    const musica = musicas.find((m) => m.id === id);

    if (!musica) {
        return res.status(404).json({ error: 'Música não encontrada' });
    }

    const { titulo, artista } = req.body;

    if (titulo !== undefined) musica.titulo = titulo;
    if (artista !== undefined) musica.artista = artista;

    res.json(musica);
});

// DELETE /musicas/:id
router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = musicas.findIndex((m) => m.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Música não encontrada' });
    }

    musicas.splice(index, 1);
    res.status(204).send();
});

module.exports = router;
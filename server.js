const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos (como index.html, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Caminho do arquivo JSON
const FILE_PATH = path.join(__dirname, 'banco.json');

// Rota para obter os cards
app.get('/cards', (req, res) => {
    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao ler o arquivo' });
        }
        const cards = JSON.parse(data || '[]');
        res.json(cards);
    });
});

// Rota para salvar os cards
app.post('/cards', (req, res) => {
    const cards = req.body;
    fs.writeFile(FILE_PATH, JSON.stringify(cards, null, 2), 'utf8', (err) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao salvar o arquivo' });
        }
        res.status(200).json({ message: 'Cards salvos com sucesso!' });
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
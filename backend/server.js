// Importa o framework Express para criar o servidor
const express = require('express');
// Importa o módulo fs para manipulação de arquivos
const fs = require('fs');
// Importa o módulo cors para permitir requisições de origens diferentes
const cors = require('cors');
// Importa o módulo path para manipulação de caminhos de arquivos
const path = require('path');
// Cria uma instância do servidor Express
const app = express();
// Define a porta onde o servidor será executado
const PORT = 3000;

// Middleware para habilitar CORS e permitir requisições JSON
app.use(cors());
app.use(express.json({ limit: '100mb' })); // Limita o tamanho do corpo da requisição a 100MB

// Define o caminho para servir os arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Caminho do arquivo JSON que armazena os dados dos cards
const FILE_PATH = path.join(__dirname, 'banco.json');

// Rota GET para obter os cards armazenados no arquivo JSON
app.get('/cards', (req, res) => {
    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            // Retorna um erro 500 caso ocorra um problema ao ler o arquivo
            return res.status(500).json({ error: 'Erro ao ler o arquivo' });
        }
        // Converte o conteúdo do arquivo JSON em um array de objetos
        const cards = JSON.parse(data || '[]');
        // Retorna os cards como resposta
        res.json(cards);
    });
});

// Rota POST para salvar os cards no arquivo JSON
app.post('/cards', (req, res) => {
    const cards = req.body; // Obtém os dados enviados no corpo da requisição
    fs.writeFile(FILE_PATH, JSON.stringify(cards, null, 2), 'utf8', (err) => {
        if (err) {
            // Retorna um erro 500 caso ocorra um problema ao salvar o arquivo
            return res.status(500).json({ error: 'Erro ao salvar o arquivo' });
        }
        // Retorna uma mensagem de sucesso
        res.status(200).json({ message: 'Cards salvos com sucesso!' });
    });
});

// Inicia o servidor na porta definida
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
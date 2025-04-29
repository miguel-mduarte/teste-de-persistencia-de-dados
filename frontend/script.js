// Seleciona o formulário e o contêiner de cards no DOM
const form = document.getElementById('cardForm');
const cardContainer = document.getElementById('cardContainer');
// Define a URL da API para comunicação com o backend
const API_URL = 'http://localhost:3000/cards';

// Função para carregar os cards do backend e exibi-los no DOM
async function carregarCards() {
    const response = await fetch(API_URL); // Faz uma requisição GET para a API
    const cards = await response.json(); // Converte a resposta em JSON
    cards.forEach((card, index) => criarCard(card.titulo, card.descricao, card.imagemBase64, index)); // Cria os cards no DOM
}

// Função para salvar os cards no backend
async function salvarCards(cards) {
    await fetch(API_URL, {
        method: 'POST', // Define o método HTTP como POST
        headers: { 'Content-Type': 'application/json' }, // Define o tipo de conteúdo como JSON
        body: JSON.stringify(cards), // Envia os dados dos cards no corpo da requisição
    });
}

// Função para criar um card no DOM
function criarCard(titulo, descricao, imagemBase64, index) {
    const card = document.createElement('div'); // Cria um elemento div para o card
    card.className = 'card p-3'; // Adiciona classes CSS ao card

    // Define o conteúdo HTML do card
    const cardBody = `
        <img src="${imagemBase64}" class="card-img-top mb-3" alt="Imagem do Card">
        <h5 class="card-title">${titulo}</h5>
        <p class="card-text">${descricao}</p>
        <button class="btn btn-danger w-100" onclick="excluirCard(${index})">Excluir</button>
    `;
    card.innerHTML = cardBody; // Insere o conteúdo no card

    cardContainer.appendChild(card); // Adiciona o card ao contêiner de cards
}

// Função para excluir um card
async function excluirCard(index) {
    const response = await fetch(API_URL); // Faz uma requisição GET para obter os cards
    const cards = await response.json(); // Converte a resposta em JSON
    cards.splice(index, 1); // Remove o card do array
    await salvarCards(cards); // Salva o array atualizado no backend
    atualizarCards(); // Atualiza os cards no DOM
}

// Função para atualizar os cards no DOM
async function atualizarCards() {
    cardContainer.innerHTML = ''; // Limpa o contêiner de cards
    await carregarCards(); // Recarrega os cards do backend
}

// Função para converter uma imagem em Base64
function converterImagemParaBase64(imagemArquivo) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader(); // Cria um leitor de arquivos
        reader.onload = () => resolve(reader.result); // Retorna o resultado em Base64
        reader.onerror = error => reject(error); // Retorna um erro caso ocorra
        reader.readAsDataURL(imagemArquivo); // Lê o arquivo como uma URL de dados
    });
}

// Carrega os cards ao carregar a página
carregarCards();

// Adiciona um evento de envio ao formulário
form.addEventListener('submit', async function (event) {
    event.preventDefault(); // Impede o comportamento padrão do formulário

    // Obtém os valores dos campos do formulário
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const imagemInput = document.getElementById('imagem');
    const imagemArquivo = imagemInput.files[0];

    if (!imagemArquivo) {
        alert('Por favor, selecione uma imagem.'); // Exibe um alerta caso nenhuma imagem seja selecionada
        return;
    }

    const imagemBase64 = await converterImagemParaBase64(imagemArquivo); // Converte a imagem para Base64

    const response = await fetch(API_URL); // Faz uma requisição GET para obter os cards
    const cards = await response.json(); // Converte a resposta em JSON
    cards.push({ titulo, descricao, imagemBase64 }); // Adiciona o novo card ao array
    await salvarCards(cards); // Salva o array atualizado no backend

    atualizarCards(); // Atualiza os cards no DOM
    form.reset(); // Reseta o formulário
});
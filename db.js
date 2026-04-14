// Banco de dados em memória para simulação
const { v4: uuidv4 } = require("uuid");

let usuarios = [
  { id: "1", nome: "Alice Silva", email: "alice@email.com", idade: 28 },
  { id: "2", nome: "Bruno Costa", email: "bruno@email.com", idade: 34 },
  { id: "3", nome: "Carla Souza", email: "carla@email.com", idade: 22 },
];

let produtos = [
  { id: "1", nome: "Notebook", preco: 3500.0, estoque: 10 },
  { id: "2", nome: "Mouse", preco: 89.9, estoque: 50 },
  { id: "3", nome: "Teclado", preco: 149.9, estoque: 30 },
];

module.exports = { usuarios, produtos, uuidv4 };

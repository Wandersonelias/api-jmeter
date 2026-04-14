const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /produtos - Lista todos os produtos
router.get("/", (req, res) => {
  // Simula delay ocasional para testes de performance
  const { delay } = req.query;
  const espera = delay ? parseInt(delay) : 0;

  setTimeout(() => {
    res.json({ sucesso: true, total: db.produtos.length, dados: db.produtos });
  }, espera);
});

// GET /produtos/:id - Busca produto por ID
router.get("/:id", (req, res) => {
  const produto = db.produtos.find((p) => p.id === req.params.id);
  if (!produto) {
    return res.status(404).json({ sucesso: false, mensagem: "Produto não encontrado" });
  }
  res.json({ sucesso: true, dados: produto });
});

// POST /produtos - Cria novo produto
router.post("/", (req, res) => {
  const { nome, preco, estoque } = req.body;

  if (!nome || preco === undefined) {
    return res.status(400).json({ sucesso: false, mensagem: "Nome e preço são obrigatórios" });
  }

  if (preco < 0) {
    return res.status(400).json({ sucesso: false, mensagem: "Preço não pode ser negativo" });
  }

  const novoProduto = { id: db.uuidv4(), nome, preco, estoque: estoque || 0 };
  db.produtos.push(novoProduto);

  res.status(201).json({ sucesso: true, mensagem: "Produto criado com sucesso", dados: novoProduto });
});

// PUT /produtos/:id - Atualiza produto
router.put("/:id", (req, res) => {
  const index = db.produtos.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ sucesso: false, mensagem: "Produto não encontrado" });
  }

  const { nome, preco, estoque } = req.body;
  db.produtos[index] = { ...db.produtos[index], nome, preco, estoque };

  res.json({ sucesso: true, mensagem: "Produto atualizado", dados: db.produtos[index] });
});

// DELETE /produtos/:id - Remove produto
router.delete("/:id", (req, res) => {
  const index = db.produtos.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ sucesso: false, mensagem: "Produto não encontrado" });
  }

  db.produtos.splice(index, 1);
  res.json({ sucesso: true, mensagem: "Produto removido com sucesso" });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /usuarios - Lista todos os usuários
router.get("/", (req, res) => {
  res.json({ sucesso: true, total: db.usuarios.length, dados: db.usuarios });
});

// GET /usuarios/:id - Busca usuário por ID
router.get("/:id", (req, res) => {
  const usuario = db.usuarios.find((u) => u.id === req.params.id);
  if (!usuario) {
    return res.status(404).json({ sucesso: false, mensagem: "Usuário não encontrado" });
  }
  res.json({ sucesso: true, dados: usuario });
});

// POST /usuarios - Cria novo usuário
router.post("/", (req, res) => {
  const { nome, email, idade } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ sucesso: false, mensagem: "Nome e email são obrigatórios" });
  }

  const emailExiste = db.usuarios.find((u) => u.email === email);
  if (emailExiste) {
    return res.status(409).json({ sucesso: false, mensagem: "Email já cadastrado" });
  }

  const novoUsuario = { id: db.uuidv4(), nome, email, idade: idade || null };
  db.usuarios.push(novoUsuario);

  res.status(201).json({ sucesso: true, mensagem: "Usuário criado com sucesso", dados: novoUsuario });
});

// PUT /usuarios/:id - Atualiza usuário
router.put("/:id", (req, res) => {
  const index = db.usuarios.findIndex((u) => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ sucesso: false, mensagem: "Usuário não encontrado" });
  }

  const { nome, email, idade } = req.body;
  db.usuarios[index] = { ...db.usuarios[index], nome, email, idade };

  res.json({ sucesso: true, mensagem: "Usuário atualizado", dados: db.usuarios[index] });
});

// DELETE /usuarios/:id - Remove usuário
router.delete("/:id", (req, res) => {
  const index = db.usuarios.findIndex((u) => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ sucesso: false, mensagem: "Usuário não encontrado" });
  }

  db.usuarios.splice(index, 1);
  res.json({ sucesso: true, mensagem: "Usuário removido com sucesso" });
});

module.exports = router;

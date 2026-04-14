const express = require("express");
const router = express.Router();

// Usuários fixos para login (simulação)
const credenciais = [
  { usuario: "admin", senha: "admin123", perfil: "administrador" },
  { usuario: "qa_tester", senha: "teste123", perfil: "testador" },
  { usuario: "user01", senha: "senha01", perfil: "usuario" },
];

// POST /auth/login
router.post("/login", (req, res) => {
  const { usuario, senha } = req.body;

  if (!usuario || !senha) {
    return res.status(400).json({ sucesso: false, mensagem: "Usuário e senha são obrigatórios" });
  }

  const conta = credenciais.find((c) => c.usuario === usuario && c.senha === senha);

  if (!conta) {
    return res.status(401).json({ sucesso: false, mensagem: "Credenciais inválidas" });
  }

  // Token fake para simulação
  const token = Buffer.from(`${usuario}:${Date.now()}`).toString("base64");

  res.json({
    sucesso: true,
    mensagem: "Login realizado com sucesso",
    token,
    perfil: conta.perfil,
  });
});

// POST /auth/logout
router.post("/logout", (req, res) => {
  res.json({ sucesso: true, mensagem: "Logout realizado com sucesso" });
});

module.exports = router;

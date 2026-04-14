const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Log de requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ===== BANCO DE DADOS EM MEMÓRIA =====
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

const credenciais = [
  { usuario: "admin", senha: "admin123", perfil: "administrador" },
  { usuario: "qa_tester", senha: "teste123", perfil: "testador" },
  { usuario: "user01", senha: "senha01", perfil: "usuario" },
];

let proximoId = 100;
const novoId = () => String(proximoId++);

// ===== ROTAS: AUTH =====
app.post("/auth/login", (req, res) => {
  const { usuario, senha } = req.body;
  if (!usuario || !senha)
    return res.status(400).json({ sucesso: false, mensagem: "Usuário e senha são obrigatórios" });

  const conta = credenciais.find((c) => c.usuario === usuario && c.senha === senha);
  if (!conta)
    return res.status(401).json({ sucesso: false, mensagem: "Credenciais inválidas" });

  const token = Buffer.from(`${usuario}:${Date.now()}`).toString("base64");
  res.json({ sucesso: true, mensagem: "Login realizado com sucesso", token, perfil: conta.perfil });
});

app.post("/auth/logout", (req, res) => {
  res.json({ sucesso: true, mensagem: "Logout realizado com sucesso" });
});

// ===== ROTAS: USUÁRIOS =====
app.get("/usuarios", (req, res) => {
  res.json({ sucesso: true, total: usuarios.length, dados: usuarios });
});

app.get("/usuarios/:id", (req, res) => {
  const usuario = usuarios.find((u) => u.id === req.params.id);
  if (!usuario)
    return res.status(404).json({ sucesso: false, mensagem: "Usuário não encontrado" });
  res.json({ sucesso: true, dados: usuario });
});

app.post("/usuarios", (req, res) => {
  const { nome, email, idade } = req.body;
  if (!nome || !email)
    return res.status(400).json({ sucesso: false, mensagem: "Nome e email são obrigatórios" });

  if (usuarios.find((u) => u.email === email))
    return res.status(409).json({ sucesso: false, mensagem: "Email já cadastrado" });

  const novo = { id: novoId(), nome, email, idade: idade || null };
  usuarios.push(novo);
  res.status(201).json({ sucesso: true, mensagem: "Usuário criado com sucesso", dados: novo });
});

app.put("/usuarios/:id", (req, res) => {
  const index = usuarios.findIndex((u) => u.id === req.params.id);
  if (index === -1)
    return res.status(404).json({ sucesso: false, mensagem: "Usuário não encontrado" });

  const { nome, email, idade } = req.body;
  usuarios[index] = { ...usuarios[index], nome, email, idade };
  res.json({ sucesso: true, mensagem: "Usuário atualizado", dados: usuarios[index] });
});

app.delete("/usuarios/:id", (req, res) => {
  const index = usuarios.findIndex((u) => u.id === req.params.id);
  if (index === -1)
    return res.status(404).json({ sucesso: false, mensagem: "Usuário não encontrado" });

  usuarios.splice(index, 1);
  res.json({ sucesso: true, mensagem: "Usuário removido com sucesso" });
});

// ===== ROTAS: PRODUTOS =====
app.get("/produtos", (req, res) => {
  const delay = parseInt(req.query.delay) || 0;
  setTimeout(() => {
    res.json({ sucesso: true, total: produtos.length, dados: produtos });
  }, delay);
});

app.get("/produtos/:id", (req, res) => {
  const produto = produtos.find((p) => p.id === req.params.id);
  if (!produto)
    return res.status(404).json({ sucesso: false, mensagem: "Produto não encontrado" });
  res.json({ sucesso: true, dados: produto });
});

app.post("/produtos", (req, res) => {
  const { nome, preco, estoque } = req.body;
  if (!nome || preco === undefined)
    return res.status(400).json({ sucesso: false, mensagem: "Nome e preço são obrigatórios" });
  if (preco < 0)
    return res.status(400).json({ sucesso: false, mensagem: "Preço não pode ser negativo" });

  const novo = { id: novoId(), nome, preco, estoque: estoque || 0 };
  produtos.push(novo);
  res.status(201).json({ sucesso: true, mensagem: "Produto criado com sucesso", dados: novo });
});

app.put("/produtos/:id", (req, res) => {
  const index = produtos.findIndex((p) => p.id === req.params.id);
  if (index === -1)
    return res.status(404).json({ sucesso: false, mensagem: "Produto não encontrado" });

  const { nome, preco, estoque } = req.body;
  produtos[index] = { ...produtos[index], nome, preco, estoque };
  res.json({ sucesso: true, mensagem: "Produto atualizado", dados: produtos[index] });
});

app.delete("/produtos/:id", (req, res) => {
  const index = produtos.findIndex((p) => p.id === req.params.id);
  if (index === -1)
    return res.status(404).json({ sucesso: false, mensagem: "Produto não encontrado" });

  produtos.splice(index, 1);
  res.json({ sucesso: true, mensagem: "Produto removido com sucesso" });
});

// ===== HEALTH CHECK =====
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    memoria: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
  });
});

app.get("/", (req, res) => {
  res.json({
    status: "online",
    mensagem: "API de Simulação para Testes JMeter",
    endpoints: {
      auth: ["POST /auth/login", "POST /auth/logout"],
      usuarios: ["GET /usuarios", "GET /usuarios/:id", "POST /usuarios", "PUT /usuarios/:id", "DELETE /usuarios/:id"],
      produtos: ["GET /produtos", "GET /produtos?delay=500", "GET /produtos/:id", "POST /produtos", "PUT /produtos/:id", "DELETE /produtos/:id"],
      health: ["GET /health"],
    },
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ sucesso: false, mensagem: `Rota ${req.method} ${req.url} não encontrada` });
});

app.listen(PORT, () => {
  console.log(`\n🚀 API rodando em http://localhost:${PORT}`);
  console.log(`📋 Endpoints: http://localhost:${PORT}/`);
  console.log(`❤️  Health:    http://localhost:${PORT}/health\n`);
});
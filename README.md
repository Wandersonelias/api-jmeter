# API de Simulação para Testes com JMeter 🧪

API REST simples em Node.js criada para aulas de QA com Apache JMeter.

---

## ▶️ Como rodar

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o servidor
npm start

# A API estará disponível em: http://localhost:3000
```

---

## 📋 Endpoints disponíveis

### 🔐 Autenticação
| Método | Rota          | Descrição     |
|--------|---------------|---------------|
| POST   | /auth/login   | Fazer login   |
| POST   | /auth/logout  | Fazer logout  |

**Credenciais de teste:**
- `admin` / `admin123`
- `qa_tester` / `teste123`
- `user01` / `senha01`

**Exemplo de body para login:**
```json
{ "usuario": "admin", "senha": "admin123" }
```

---

### 👤 Usuários
| Método | Rota            | Descrição             |
|--------|-----------------|-----------------------|
| GET    | /usuarios       | Listar todos          |
| GET    | /usuarios/:id   | Buscar por ID         |
| POST   | /usuarios       | Criar novo            |
| PUT    | /usuarios/:id   | Atualizar             |
| DELETE | /usuarios/:id   | Remover               |

**Exemplo de body para criar usuário:**
```json
{ "nome": "João", "email": "joao@email.com", "idade": 25 }
```

---

### 📦 Produtos
| Método | Rota                        | Descrição                        |
|--------|-----------------------------|----------------------------------|
| GET    | /produtos                   | Listar todos                     |
| GET    | /produtos?delay=500         | Listar com delay (ms) para teste |
| GET    | /produtos/:id               | Buscar por ID                    |
| POST   | /produtos                   | Criar novo                       |
| PUT    | /produtos/:id               | Atualizar                        |
| DELETE | /produtos/:id               | Remover                          |

**Exemplo de body para criar produto:**
```json
{ "nome": "Monitor", "preco": 1200.00, "estoque": 5 }
```

---

### ❤️ Health Check
| Método | Rota     | Descrição                  |
|--------|----------|----------------------------|
| GET    | /        | Informações da API         |
| GET    | /health  | Status e métricas          |

---

## 🔧 Configuração no JMeter

### Configuração básica do Test Plan:

1. **Thread Group** (Grupo de Usuários)
   - Number of Threads: 10 (usuários simultâneos)
   - Ramp-Up Period: 5 segundos
   - Loop Count: 3

2. **HTTP Request Defaults** (Config Element)
   - Server Name: `localhost`
   - Port: `3000`
   - Protocol: `http`

3. **HTTP Header Manager** (Config Element)
   - `Content-Type`: `application/json`

### Exemplos de requisições para adicionar:

#### Teste 1 - GET simples (listar usuários)
- Method: GET
- Path: `/usuarios`

#### Teste 2 - POST com body (criar usuário)
- Method: POST
- Path: `/usuarios`
- Body: `{"nome": "Teste JMeter", "email": "jmeter${__threadNum}@test.com", "idade": 20}`

#### Teste 3 - Login
- Method: POST
- Path: `/auth/login`
- Body: `{"usuario": "admin", "senha": "admin123"}`

#### Teste 4 - Teste de latência com delay
- Method: GET
- Path: `/produtos?delay=1000`

### Listeners recomendados para análise:
- **View Results Tree** — ver cada requisição
- **Summary Report** — resumo com throughput e erros
- **Response Time Graph** — gráfico de tempo de resposta
- **Aggregate Report** — médias, percentis (90th, 95th, 99th)

---

## 📊 Códigos de status retornados

| Código | Situação                      |
|--------|-------------------------------|
| 200    | Sucesso                       |
| 201    | Criado com sucesso            |
| 400    | Dados inválidos               |
| 401    | Credenciais inválidas         |
| 404    | Recurso não encontrado        |
| 409    | Conflito (ex: email duplicado)|
| 500    | Erro interno                  |

---

## 💡 Dicas para a aula

- Use `?delay=1000` nos produtos para simular lentidão e ver o impacto no JMeter
- Use `${__threadNum}` nos bodies do JMeter para gerar dados únicos por thread
- Observe a diferença entre 10, 50 e 100 threads simultâneas
- Compare os resultados com e sem o parâmetro `delay`

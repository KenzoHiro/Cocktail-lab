const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const USERS_FILE = path.join(__dirname, "users.json");

// middleware para receber JSON
app.use(express.json());

// rotas de usuario

// POST /user cadastra usuário
app.post("/user", (req, res) => {
  const user = req.body;

  // le usuarios já salvos
  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  }

  // adiciona novo
  users.push(user);

  // salva no arquivo
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.status(201).json({ message: "Usuário salvo!", user });
});

// GET /user  lista todos usuários
app.get("/user", (req, res) => {
  if (!fs.existsSync(USERS_FILE)) {
    return res.json([]);
  }
  const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  res.json(users);
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});

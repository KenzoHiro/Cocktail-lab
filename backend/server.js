const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Importa o módulo de rotas
const userRoutes = require("./routes/user");

// middleware para receber JSON
app.use(express.json());

// conecta o arquivo user.js ao caminho /user
app.use("/user", userRoutes);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});

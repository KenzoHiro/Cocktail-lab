const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios"); 
const cors = require("cors"); 

const app = express();
const PORT = process.env.PORT || 3000;
const USERS_FILE = path.join(__dirname, "users.json");
const DRINK_API_URL = "https://www.thecocktaildb.com/api/json/v1/1";

// middleware para receber JSON
app.use(express.json());
app.use(cors()); 

// --- ENDPOINT DE BUSCA DE BEBIDAS ---
app.get("/drinks/search", async (req, res) => {
  const drinkName = req.query.name;

  if (!drinkName) {
    return res.status(400).json({ error: "O parâmetro 'name' é obrigatório para a busca." });
  }

  try {
    const searchUrl = `${DRINK_API_URL}/search.php?s=${drinkName}`;
    
    // <<< AXIOS FAZ A REQUISIÇÃO >>>
    const response = await axios.get(searchUrl); 
    
    // Axios já retorna o JSON em .data
    const data = response.data;

    // Retorna a resposta (o array de drinks)
    res.json(data.drinks || []); 
    
  } catch (error) {
    console.error("Erro ao buscar dados na API externa:", error);
    res.status(500).json({ error: "Falha ao se comunicar com o serviço externo." });
  }
});

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

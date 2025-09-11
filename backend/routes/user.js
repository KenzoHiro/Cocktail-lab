const express = require("express");
const fs = require("fs");
const router = express.Router();

const USERS_FILE = "users.json";

// POST user  cadastra usuario
router.post("/", (req, res) => {
  const user = req.body;

  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE));
  }

  users.push(user);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.status(201).json({ message: "Usuário salvo!", user });
});

// GET user  lista usuarios
router.get("/", (req, res) => {
  if (!fs.existsSync(USERS_FILE)) return res.json([]);
  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  res.json(users);
});

module.exports = router;

// src/components/Favoritos.js
import React, { useState, useEffect } from "react";
import { auth, salvarFavorito, observarFavoritos, removerFavorito } from "../Services/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
// npm install react-firebase-hooks

export default function Favoritos() {
  const [user] = useAuthState(auth);
  const [drink, setDrink] = useState("");
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    if (user) {
      const unsubscribe = observarFavoritos(user.uid, setFavoritos);
      return () => unsubscribe();
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) {
      alert("Você precisa estar logado!");
      return;
    }
    if (!drink) return;

    await salvarFavorito(user.uid, drink);
    setDrink("");
  };

  const handleRemove = async (d) => {
    if (!user) return;
    await removerFavorito(user.uid, d);
  };

  return (
    <div>
      <h2>Adicionar Drink Favorito</h2>
      <input
        type="text"
        placeholder="Nome do drink"
        value={drink}
        onChange={(e) => setDrink(e.target.value)}
      />
      <button onClick={handleSave}>Salvar</button>

      <h3>Meus Favoritos 🍸</h3>
      {favoritos.length > 0 ? (
        <ul>
          {favoritos.map((d, i) => (
            <li key={i}>
              {d}{" "}
              <button onClick={() => handleRemove(d)}>❌</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum favorito ainda.</p>
      )}
    </div>
  );
}

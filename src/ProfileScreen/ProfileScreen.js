import React, { useState } from "react";
import "./Profile.css";

function Profile() {
  // Estado fictício para permitir mudanças futuras
  const [username] = useState("João Ângelo");
  const [description] = useState(
    "Apaixonado por drinks artesanais e mixologia. Adora explorar novos sabores e combinações únicas."
  );
  const [preferences] = useState(["🍷 Vinhos", "🍹 Coquetéis", "🍺 Cervejas artesanais"]);

  return (
    <div className="profile-container">
      {/* Botão de voltar (apenas visual) */}
      <button className="back-button">←</button>

      {/* Foto de perfil */}
      <div className="profile-pic"></div>

      {/* Nome do usuário */}
      <h1 className="username">{username}</h1>

      {/* Descrição */}
      <p className="description">{description}</p>

      {/* Preferências */}
      <div className="preferences">
        {preferences.map((pref, index) => (
          <span key={index} className="preference">
            {pref}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Profile;

import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // ícone do Material UI
import "./ProfileScreen.css";

const ProfileScreen = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (!user) {
    return (
      <div className="profile-container">
        <p>Você precisa estar logado para ver o perfil.</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Botão circular de voltar */}
      <button className="back-circle" onClick={() => navigate("/")}>
        <ArrowBackIcon style={{ color: "#fff" }} />
      </button>

      <div className="profile-header">
        <img src={user.photoURL} alt="User" className="profile-image" />
        <h2 className="profile-name">{user.name}</h2>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="favorites-section">
        <h3>My Favorite Drinks</h3>
      </div>
    </div>
  );
};

export default ProfileScreen;

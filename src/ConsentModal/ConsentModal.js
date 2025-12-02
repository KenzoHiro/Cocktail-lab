import React, { useEffect } from "react";
import { auth, provider } from "../Services/Firebase";
import { signInWithPopup } from "firebase/auth";
import GoogleIcon from "@mui/icons-material/Google";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { useTranslation } from 'react-i18next'; // <-- 1. Importação para tradução

const Header = ({ user, setUser }) => {
  const { t, i18n } = useTranslation(); // <-- 2. Uso do hook de tradução
  const navigate = useNavigate();

  // Função para trocar o idioma
  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
    // Salva a escolha do usuário no localStorage para persistir
    localStorage.setItem('i18nextLng', lng);
  };

  // 🔹 Recupera o usuário salvo ao carregar o site
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const loggedUser = {
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
      };

      setUser(loggedUser);
      localStorage.setItem("user", JSON.stringify(loggedUser));

      // 🔹 Redireciona direto para o perfil após login
      navigate("/profile");
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };

  const goToProfile = () => navigate("/profile");

  return (
    <header className="header">
      <div className="logo-area" onClick={() => navigate("/")}>
        <img src={logo} alt="Logo do site" />
      </div>
      
      {/* SELETOR DE IDIOMA */}
      <div className="language-selector">
        <button 
          onClick={() => handleLanguageChange('en')}
          style={{ fontWeight: i18n.language === 'en' ? 'bold' : 'normal' }}
        >
          EN
        </button>
        {' | '}
        <button 
          onClick={() => handleLanguageChange('pt-BR')}
          style={{ fontWeight: i18n.language === 'pt-BR' ? 'bold' : 'normal' }}
        >
          PT-BR
        </button>
      </div>
      {/* FIM: SELETOR DE IDIOMA */}

      <div className="login">
        {user ? (
          <button className="profile-btn" onClick={goToProfile}>
            <img src={user.photoURL} alt="User" className="profile-pic" />
            {/* TRADUÇÃO: View Profile */}
            <span>{t('view_profile')}</span> 
          </button>
        ) : (
          <button className="login-btn" onClick={handleLogin}>
            <GoogleIcon style={{ marginRight: "6px" }} />
            {/* TRADUÇÃO: Sign in with Google */}
            {t('sign_in_google')}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;

import React, { useEffect } from "react";
import { auth, provider } from "../Services/Firebase";
import { signInWithPopup } from "firebase/auth";
import GoogleIcon from "@mui/icons-material/Google";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from "../Components/LanguageSwitcher"; 

const Header = ({ user, setUser }) => {
  const { t } = useTranslation(); 
  const navigate = useNavigate();


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
      
      <div className="language-selector">
        <LanguageSwitcher />
      </div>

      <div className="login">
        {user ? (
          <button className="profile-btn" onClick={goToProfile}>
            <img src={user.photoURL} alt="User" className="profile-pic" />
            <span>{t('view_profile')}</span> 
          </button>
        ) : (
          <button className="login-btn" onClick={handleLogin}>
            <GoogleIcon style={{ marginRight: "6px" }} />
            {t('sign_in_google')}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { db } from "../Services/Firebase.js"; 
import { doc, getDoc } from "firebase/firestore";
import { auth, salvarFavorito, removerFavorito } from "../Services/Firebase.js";
import "./ProfileScreen.css";
import { FaStar, FaRegStar } from "react-icons/fa";
import YoutubeAPI from "../Services/YoutubeAPI.js";
import { useTranslation } from 'react-i18next';

const ProfileScreen = ({ userUI }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [favoriteDrinks, setFavoriteDrinks] = useState([]);
  const [modalDrink, setModalDrink] = useState(null);
  const [loading, setLoading] = useState(true);  
  const [videoUrl, setVideoUrl] = useState(null);

  const closeModal = () => setModalDrink(null);
  const user = auth.currentUser;

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;

      try {
        // Busca os drinks favoritados no Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          const favoritos = data.favoritos || [];

          // Caso já tenhamos o objeto completo do drink salvo
          setFavoriteDrinks(favoritos);
        } else {
          setFavoriteDrinks([]);
        }
      } catch (error) {
        console.error("Erro ao carregar drinks favoritos:", error);
        setFavoriteDrinks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  // Favoritos
  const toggleFavorite = async (drink) => {
    if (!user) {
      alert(t('favorite_alert_login'));
      return;
    }

    const isFavorite = favoriteDrinks.some((d) => d.idDrink === drink.idDrink);

    if (isFavorite) {
      // Remove do estado e do Firestore
      setFavoriteDrinks(favoriteDrinks.filter((d) => d.idDrink !== drink.idDrink));
      await removerFavorito(user.uid, drink);
    } else {
      // Adiciona no estado e no Firestore
      setFavoriteDrinks([...favoriteDrinks, drink]);
      await salvarFavorito(user.uid, drink);
    }
  };


  const isFavorite = (drink) => {
    return favoriteDrinks.some((d) => d.idDrink === drink.idDrink);
  };

  const openModal = async (drink) => {
    setModalDrink(drink);
    setVideoUrl(null);   // 🔥 Limpa vídeo ANTES de buscar

    const yt = new YoutubeAPI();
    const video = await yt.searchVideoByDrinkName(drink.strDrink);

    setVideoUrl(video); // agora só seta quando estiver pronto
  };

  if (!userUI) {
    return (
      <div className="profile-container">
        {/* TRADUÇÃO: Você precisa estar logado para ver o perfil. */}
        <p>{t('profile_login_required')}</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Botão circular de voltar */}
      <button className="back-circle" onClick={() => navigate("/")}>
        <ArrowBackIcon style={{ color: "#fff" }} />
      </button>

      {/* Cabeçalho do perfil */}
      <div className="profile-header">
        <img src={userUI.photoURL} alt="User" className="profile-image" />
        <h2 className="profile-name">{userUI.displayName}</h2>
        <button onClick={handleLogout} className="logout-button">
          {/* TRADUÇÃO: Logout */}
          {t('logout')}
        </button>
      </div>

      {/* Seção de favoritos */}
      <div className="favorites-section">
        {/* TRADUÇÃO: My Favorite Drinks */}
        <h3>{t('my_favorite_drinks')}</h3>

        {loading ? (
          // TRADUÇÃO: Loading your drinks...
          <p>{t('loading_drinks')}</p>
        ) : favoriteDrinks.length === 0 ? (
          // TRADUÇÃO: You have no favorite drinks yet.
          <p className="drinks-empty">{t('no_favorites_yet')}</p>
        ) : (
          <div className="drinks-grid">
            {favoriteDrinks.map((drink) => (
              <div
                key={drink.idDrink}
                className="drink-card"
                onClick={() => openModal(drink)}
              >
                <img
                  src={drink.strDrinkThumb}
                  alt={drink.strDrink}
                  className="drink-img"
                />
                <h4>{drink.strDrink}</h4>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalDrink && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ✖
            </button>

            <h2>{modalDrink.strDrink}</h2>

            <button
              onClick={() => toggleFavorite(modalDrink)}
              className="favorite-btn"
              aria-label={isFavorite(modalDrink) ? t('desfavoritar') : t('favoritar')}
            >
              {isFavorite(modalDrink) ? <FaStar /> : <FaRegStar />}
            </button>

            <img
              src={modalDrink.strDrinkThumb}
              alt={modalDrink.strDrink}
              className="modal-img"
            />
            <p>
              {/* RÓTULO traduzido, VALOR traduzido */}
              <strong>{t('category')}</strong> {t(modalDrink.strCategory)}
            </p>
            <p>
              {/* RÓTULO traduzido, VALOR traduzido */}
              <strong>{t('alcoholic')}</strong> {t(modalDrink.strAlcoholic)}
            </p>
            <p>
              {/* RÓTULO traduzido, VALOR traduzido */}
              <strong>{t('glass')}</strong> {t(modalDrink.strGlass)}
            </p>
            <p>
              {/* TRADUÇÃO: Instructions: */}
              <strong>{t('instructions')}</strong> {modalDrink.strInstructions}
            </p>

            {/* TRADUÇÃO: Ingredients */}
            <h3>{t('ingredients')}</h3>
            <ul>
              {Array.from({ length: 15 }, (_, i) => i + 1)
                .map((n) => ({
                  ingredient: modalDrink[`strIngredient${n}`],
                  measure: modalDrink[`strMeasure${n}`],
                }))
                .filter((item) => item.ingredient)
                .map((item, i) => (
                  <li key={i}>
                    {/* TRADUZ O NOME DO INGREDIENTE */}
                    {t(item.ingredient)} — {item.measure || t('as_you_like')}
                  </li>
                ))}
            </ul>
            {videoUrl ? (
              <div className="youtube-wrapper">
                <div className="youtube-container">
                  <iframe
                    src={videoUrl}
                    title="YouTube drink tutorial"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* 🔹 Aviso abaixo do vídeo */}
                <p className="youtube-warning">
                  {t('youtube_warning')}
                </p>
              </div>
            ) : (
              <div className="youtube-wrapper">
                <div style={{ textAlign: "center" }}>
                  {/* TRADUÇÃO: No tutorial video found for this drink. */}
                  <p style={{ opacity: 0.6 }}>{t('no_video_found')}</p>

                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                      modalDrink.strDrink + " drink recipe"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="youtube-fallback-btn"
                  >
                    {/* TRADUÇÃO: Search on YouTube */}
                    {t('search_on_youtube')}
                  </a>
                </div>

                {/* 🔹 Aviso também na fallback */}
                <p className="youtube-warning">
                  {t('youtube_warning_profile')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;

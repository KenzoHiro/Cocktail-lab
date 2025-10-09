import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { db } from "../Services/Firebase.js"; 
import { doc, getDoc } from "firebase/firestore";
import { auth, salvarFavorito, removerFavorito } from "../Services/Firebase.js";
import "./ProfileScreen.css";
import { FaStar, FaRegStar } from "react-icons/fa";

const ProfileScreen = ({ userUI }) => {
  const navigate = useNavigate();
  const [favoriteDrinks, setFavoriteDrinks] = useState([]);
  const [modalDrink, setModalDrink] = useState(null);
  const [loading, setLoading] = useState(true);  

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
      alert("Você precisa estar logado para favoritar um drink!");
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



  if (!userUI) {
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

      {/* Cabeçalho do perfil */}
      <div className="profile-header">
        <img src={userUI.photoURL} alt="User" className="profile-image" />
        <h2 className="profile-name">{userUI.displayName}</h2>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      {/* Seção de favoritos */}
      <div className="favorites-section">
        <h3>My Favorite Drinks</h3>

        {loading ? (
          <p>Loading your drinks...</p>
        ) : favoriteDrinks.length === 0 ? (
          <p className="drinks-empty">You have no favorite drinks yet.</p>
        ) : (
          <div className="drinks-grid">
            {favoriteDrinks.map((drink) => (
              <div
                key={drink.idDrink}
                className="drink-card"
                onClick={() => setModalDrink(drink)}
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
              aria-label={isFavorite(modalDrink) ? "Desfavoritar" : "Favoritar"}
            >
              {isFavorite(modalDrink) ? <FaStar /> : <FaRegStar />}
            </button>

            <img
              src={modalDrink.strDrinkThumb}
              alt={modalDrink.strDrink}
              className="modal-img"
            />
            <p>
              <strong>Category:</strong> {modalDrink.strCategory}
            </p>
            <p>
              <strong>Alcoholic:</strong> {modalDrink.strAlcoholic}
            </p>
            <p>
              <strong>Glass:</strong> {modalDrink.strGlass}
            </p>
            <p>
              <strong>Instructions:</strong> {modalDrink.strInstructions}
            </p>

            <h3>Ingredients</h3>
            <ul>
              {Array.from({ length: 15 }, (_, i) => i + 1)
                .map((n) => ({
                  ingredient: modalDrink[`strIngredient${n}`],
                  measure: modalDrink[`strMeasure${n}`],
                }))
                .filter((item) => item.ingredient)
                .map((item, i) => (
                  <li key={i}>
                    {item.ingredient} — {item.measure || "as you like"}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;

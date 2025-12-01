import React, { useState, useEffect } from "react";
import DrinkService from "./DrinkService";
import { ingredientCategories } from "./IngredientCategories";
import "./TestDrinkService.css";
import { salvarFavorito, removerFavorito } from "./Firebase.js";
import { auth } from "./Firebase.js";
import { observarFavoritos } from "./Firebase.js";
import { FaStar, FaRegStar } from "react-icons/fa";
import YoutubeAPI from "./YoutubeAPI.js";

export default function TestDrinkService() {
  const [selected, setSelected] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [modalDrink, setModalDrink] = useState(null);
  const [drinkDetails, setDrinkDetails] = useState(null);
  const [drinkSearch, setDrinkSearch] = useState(""); // barra de pesquisa de drinks
  const [favorites, setFavorites] = useState([]); // lista de drinks favoritados
  const [videoUrl, setVideoUrl] = useState(null);

  // Novo estado
  const [visibleCount, setVisibleCount] = useState(12); // mostra 12 drinks inicialmente

  // Novo: estado para armazenar drinks filtrados
  const [filteredDrinks, setFilteredDrinks] = useState([]);

  const allIngredients = Object.values(ingredientCategories).flat();

  // Sincroniza favoritos com Firestore (se o usuário logado)
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsubscribe = observarFavoritos(user.uid, (favoritos) => {
      setFavorites(favoritos || []);
    });

    return () => unsubscribe();
  }, []);

  // Quando 'drinks' muda, atualizamos filteredDrinks (é aqui a sua sugestão)
  useEffect(() => {
    setFilteredDrinks(drinks);
  }, [drinks]);

  // Quando a pesquisa de drinks muda, filtramos
  useEffect(() => {
    if (!drinkSearch || !drinkSearch.trim()) {
      setFilteredDrinks(drinks);
    } else {
      const term = drinkSearch.toLowerCase();
      setFilteredDrinks(
        drinks.filter((d) => d.strDrink && d.strDrink.toLowerCase().includes(term))
      );
    }
  }, [drinkSearch, drinks]);

  // Handle random drinks (botão). Busca/embaralha e seta em 'drinks'
  const handleRandomDrinks = async () => {
    
    // Se há ingredientes selecionados, apenas reembaralha os drinks filtrados
    // Se o usuário selecionou ingredientes, ele espera ver os drinks da seleção.
    if (selected.length > 0) {
      const shuffled = [...drinks].sort(() => Math.random() - 0.5);
      setDrinks(shuffled);
      setVisibleCount(12); // reseta a paginação
      return;
    }
    
    // CASO CONTRÁRIO (selected.length === 0), BUSCA NOVOS DRINKS ALEATÓRIOS.

    // Tenta buscar drinks aleatórios da API (até 12 únicos)
    try {
      if (typeof DrinkService.getRandomDrink === "function") {
        const set = new Map();
        const arr = [];
        
        // Tenta obter até 12 drinks únicos
        for (let i = 0; i < 15 && arr.length < 12; i++) {
          const d = await DrinkService.getRandomDrink();
          if (d && d.idDrink && !set.has(d.idDrink)) {
            set.set(d.idDrink, true);
            arr.push(d);
          }
        }

        if (arr.length) {
          setDrinks(arr);
          setVisibleCount(12); // reseta a paginação
          return;
        }
      }
    } catch (e) {
      // console.warn(e);
    }

    // Fallback: buscar por um ingrediente comum (Vodka)
    try {
      const fallback = await DrinkService.getDrinksByIngredient?.("Vodka");
      if (Array.isArray(fallback) && fallback.length) {
        // Embaralha o fallback para que não seja sempre a mesma ordem
        const shuffledFallback = fallback.sort(() => Math.random() - 0.5).slice(0, 12);
        setDrinks(shuffledFallback);
        setVisibleCount(12); // reseta a paginação
      }
    } catch (e) {
      // console.warn(e);
    }
  };

  // Função para carregar mais
  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  // Seleção de ingredientes
  const handleSelect = async (ingredient) => {
    let updated;
    if (selected.includes(ingredient)) {
      updated = selected.filter((i) => i !== ingredient);
    } else {
      updated = [...selected, ingredient];
    }
    setSelected(updated);

    if (updated.length > 0) {
      let allDrinks = {};

      for (let ing of updated) {
        const drinksFound = await DrinkService.getDrinksByIngredient(ing);
        if (Array.isArray(drinksFound)) {
          drinksFound.forEach((drink) => {
            if (!allDrinks[drink.idDrink]) {
              allDrinks[drink.idDrink] = { ...drink, matchCount: 0 };
            }
            allDrinks[drink.idDrink].matchCount += 1;
          });
        }
      }

      const sortedDrinks = Object.values(allDrinks).sort(
        (a, b) => b.matchCount - a.matchCount
      );

      setDrinks(sortedDrinks);
    } else {
      // se desmarcou tudo, limpa lista (ou mantém os aleatórios; aqui definimos para limpar)
      setDrinks([]);
    }
  };

  // Pesquisa de ingredientes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      setSearchResults([]);
    } else {
      const results = allIngredients.filter(
        (ing) =>
          ing.toLowerCase().includes(value.toLowerCase()) &&
          !selected.includes(ing)
      );
      setSearchResults(results.slice(0, 5));
    }
  };

  const handleResultClick = (ingredient) => {
    handleSelect(ingredient);
    setSearch("");
    setSearchResults([]);
  };

  // Reset
  const resetSelection = () => {
    setSelected([]);
    setDrinks([]);
    setSearch("");
    setSearchResults([]);
    setDrinkSearch("");
  };

  // Modal de detalhes
  const openModal = async (drink) => {
    setModalDrink(drink);
    setDrinkDetails(null);
    setVideoUrl(null); // limpa antes

    const details = await DrinkService.getDrinkById(drink.idDrink);
    setDrinkDetails(details);

    const yt = new YoutubeAPI();
    const video = await yt.searchVideoByDrinkName(drink.strDrink);
    setVideoUrl(video);
  };

  const closeModal = () => {
    setModalDrink(null);
    setDrinkDetails(null);
  };

  // Favoritos
  const toggleFavorite = async (drink) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Você precisa estar logado para favoritar um drink!");
      return;
    }

    const isFavorite = favorites.some((d) => d.idDrink === drink.idDrink);

    if (isFavorite) {
      setFavorites(favorites.filter((d) => d.idDrink !== drink.idDrink));
      await removerFavorito(user.uid, drink);
    } else {
      setFavorites([...favorites, drink]);
      await salvarFavorito(user.uid, drink);
    }
  };

  const isFavorite = (drink) => {
    return favorites.some((d) => d.idDrink === drink.idDrink);
  };

  // Drinks visíveis na tela (aplica paginação)
  const visibleDrinks = filteredDrinks.slice(0, visibleCount);

  return (
    <div className="container">
      {/* Coluna esquerda - Ingredientes */}
      <div className="ingredients">
        <h2>Choose your ingredients</h2>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search for your ingredients..."
            value={search}
            onChange={handleSearchChange}
            className="search-input"
          />
          {searchResults.length > 0 && (
            <ul className="search-results">
              {searchResults.map((result) => (
                <li
                  key={result}
                  onClick={() => handleResultClick(result)}
                  className={`search-item ${
                    selected.includes(result) ? "already-selected" : ""
                  }`}
                >
                  {result}
                </li>
              ))}
            </ul>
          )}
        </div>

        {selected.length > 0 && (
          <button className="reset-btn" onClick={resetSelection}>
            Reset selection
          </button>
        )}

        {/* Scroll independente */}
        <div className="ingredients-scroll">
          {Object.entries(ingredientCategories).map(([category, ingredients]) => (
            <div key={category} className="ingredient-category">
              <h3 className="ingredient-category-text">{category}</h3>
              <div className="ingredient-list">
                {ingredients.map((ing) => (
                  <button
                    key={ing}
                    onClick={() => handleSelect(ing)}
                    className={`ingredient-btn ${
                      selected.includes(ing) ? "selected" : ""
                    }`}
                  >
                    {ing}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coluna direita - Drinks */}
      <div className="drinks">
        <h2>Drinks found</h2>

        {/* ❌ ESTAVA CONDICIONADO: {drinks.length > 0 && (...)} */}
        {/* ✅ AGORA SÓ A BARRA DE PESQUISA ESTÁ CONDICIONADA */}
        {/* ✅ BARRA DE PESQUISA AGORA É SEMPRE VISÍVEL */}
        <input
          type="text"
          placeholder="Search drinks..."
          value={drinkSearch}
          onChange={(e) => setDrinkSearch(e.target.value)}
          className="drink-search-input"
        />

        {/* ✅ BOTÃO RANDOM AGORA É SEMPRE VISÍVEL */}
        <button className="random-drinks-btn" onClick={handleRandomDrinks}>
          Random drinks
        </button>

        {/* Texto mostrado quando não há nenhum drink filtrado */}
        {!filteredDrinks.length && (
          <p className="drinks-empty">No drinks found yet.</p>
        )}

        {/* Scroll independente + Mostrar mais */}
        <div className="drinks-scroll">
          <div className="drinks-grid">
            {visibleDrinks.map((drink) => (
              <div
                key={drink.idDrink}
                className="drink-card"
                onClick={() => openModal(drink)}
              >
                <div className="match-badge">
                  {drink.matchCount} {drink.matchCount > 1 ? "matches" : "match"}
                </div>

                <button
                  className="card-fav"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(drink);
                  }}
                  aria-label={isFavorite(drink) ? "Unfavorite" : "Favorite"}
                  title={isFavorite(drink) ? "Favorited" : "Favorite"}
                >
                  {isFavorite(drink) ? <FaStar /> : <FaRegStar />}
                </button>

                <img
                  src={drink.strDrinkThumb}
                  alt={drink.strDrink}
                  className="drink-img"
                />
                <h4>{drink.strDrink}</h4>
                <p>
                  {drink.matchCount} ingredient
                  {drink.matchCount > 1 ? "s" : ""} in common
                </p>

                <div className="match-progress" aria-hidden="true">
                  <i
                    style={{
                      width: `${Math.min(
                        100,
                        (drink.matchCount / Math.max(1, selected.length)) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {visibleCount < filteredDrinks.length && (
            <button className="show-more-btn" onClick={handleShowMore}>
              Show more
            </button>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalDrink && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ✖
            </button>

            {drinkDetails ? (
              <>
                <h2>{drinkDetails.strDrink}</h2>

                <button
                  onClick={() => toggleFavorite(drinkDetails)}
                  className="favorite-btn"
                  aria-label={isFavorite(drinkDetails) ? "Desfavoritar" : "Favoritar"}
                >
                  {isFavorite(drinkDetails) ? <FaStar /> : <FaRegStar />}
                </button>

                <img
                  src={drinkDetails.strDrinkThumb}
                  alt={drinkDetails.strDrink}
                  className="modal-img"
                />
                <p>
                  <strong>Category:</strong> {drinkDetails.strCategory}
                </p>
                <p>
                  <strong>Alcoholic:</strong> {drinkDetails.strAlcoholic}
                </p>
                <p>
                  <strong>Glass:</strong> {drinkDetails.strGlass}
                </p>
                <p>
                  <strong>Instructions:</strong> {drinkDetails.strInstructions}
                </p>

                <h3>Ingredients</h3>
                <ul>
                  {Array.from({ length: 15 }, (_, i) => i + 1)
                    .map((n) => ({
                      ingredient: drinkDetails[`strIngredient${n}`],
                      measure: drinkDetails[`strMeasure${n}`],
                    }))
                    .filter((item) => item.ingredient)
                    .map((item, i) => (
                      <li key={i}>
                        {item.ingredient} — {item.measure || "as you like"}
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
                      />
                    </div>

                    <p className="youtube-warning">
                      The video shown may not be 100% identical to the recipe listed here.
                    </p>
                  </div>
                ) : (
                  <div className="youtube-wrapper">
                    <div style={{ textAlign: "center" }}>
                      <p style={{ opacity: 0.6 }}>No tutorial video found for this drink.</p>

                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                          drinkDetails.strDrink + " drink recipe"
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="youtube-fallback-btn"
                      >
                        🔍 Search on YouTube
                      </a>
                    </div>

                    <p className="youtube-warning">
                      The videos found on YouTube may not perfectly match our recipe.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p>Loading drink details...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

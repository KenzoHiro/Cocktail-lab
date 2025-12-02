import React, { useState, useEffect } from "react";
import DrinkService from "./DrinkService";
import { ingredientCategories } from "./IngredientCategories";
import "./TestDrinkService.css";
import { salvarFavorito, removerFavorito } from "./Firebase.js";
import { auth } from "./Firebase.js";
import { observarFavoritos } from "./Firebase.js";
import { FaStar, FaRegStar } from "react-icons/fa";
import YoutubeAPI from "./YoutubeAPI.js";
import { useTranslation } from 'react-i18next';

export default function TestDrinkService() {
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [modalDrink, setModalDrink] = useState(null);
  const [drinkDetails, setDrinkDetails] = useState(null);
  const [drinkSearch, setDrinkSearch] = useState(""); 
  const [favorites, setFavorites] = useState([]); 
  const [videoUrl, setVideoUrl] = useState(null);

  const [visibleCount, setVisibleCount] = useState(12); 
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

  // Quando 'drinks' muda, atualizamos filteredDrinks
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
    if (selected.length > 0) {
      const shuffled = [...drinks].sort(() => Math.random() - 0.5);
      setDrinks(shuffled);
      setVisibleCount(12); // reseta a paginação
      return;
    }
    
    // CASO CONTRÁRIO (selected.length === 0), BUSCA NOVOS DRINKS ALEATÓRIOS.
    try {
      if (typeof DrinkService.getRandomDrink === "function") {
        const set = new Map();
        const arr = [];
        
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
      // se desmarcou tudo, limpa lista
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
      // Filtra usando a chave (inglês), mas a busca na tela será traduzida.
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
      alert(t('favorite_alert_login')); // Traduzido
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
        {/* TRADUÇÃO: Choose your ingredients */}
        <h2>{t('choose_ingredients')}</h2>

        <div className="search-box">
          <input
            type="text"
            // TRADUÇÃO: Search for your ingredients...
            placeholder={t('search_ingredients_placeholder')}
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
                  {t(result)} {/* <--- TRADUZ O NOME DO INGREDIENTE NA BUSCA */}
                </li>
              ))}
            </ul>
          )}
        </div>

        {selected.length > 0 && (
          <button className="reset-btn" onClick={resetSelection}>
            {/* TRADUÇÃO: Reset selection */}
            {t('reset_selection')}
          </button>
        )}

        {/* Scroll independente */}
        <div className="ingredients-scroll">
          {Object.entries(ingredientCategories).map(([categoryKey, ingredients]) => (
            <div key={categoryKey} className="ingredient-category">
              {/* Traduz a chave da categoria usando t() */}
              <h3 className="ingredient-category-text">{t(categoryKey)}</h3> 
              <div className="ingredient-list">
                {ingredients.map((ing) => (
                  <button
                    key={ing}
                    onClick={() => handleSelect(ing)}
                    className={`ingredient-btn ${
                      selected.includes(ing) ? "selected" : ""
                    }`}
                  >
                    {t(ing)} {/* <--- TRADUZ O NOME DO INGREDIENTE */}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coluna direita - Drinks */}
      <div className="drinks">
        {/* TRADUÇÃO: Drinks found */}
        <h2>{t('drinks_found')}</h2>

        {/* BARRA DE PESQUISA AGORA É SEMPRE VISÍVEL */}
        <input
          type="text"
          // TRADUÇÃO: Search drinks...
          placeholder={t('search_drinks_placeholder')}
          value={drinkSearch}
          onChange={(e) => setDrinkSearch(e.target.value)}
          className="drink-search-input"
        />

        <button className="random-drinks-btn" onClick={handleRandomDrinks}>
          {/* TRADUÇÃO: Random drinks */}
          {t('random_drinks')}
        </button>

        {/* Texto mostrado quando não há nenhum drink filtrado */}
        {!filteredDrinks.length && (
          <p className="drinks-empty">{t('no_drinks_found')}</p>
        )}

        {/* Scroll independente + Mostrar mais */}
        <div className="drinks-scroll">
          <div className="drinks-grid">
            {visibleDrinks.map((drink) => {
              // Lógica de singular/plural para 'match' e 'ingredient'
              const matchKey = drink.matchCount > 1 ? 'match_plural' : 'match_single';
              const ingredientKey = drink.matchCount > 1 ? 'ingredient_in_common_plural' : 'ingredient_in_common_single';
              
              return (
                <div
                  key={drink.idDrink}
                  className="drink-card"
                  onClick={() => openModal(drink)}
                >
                  <div className="match-badge">
                    {drink.matchCount} {t(matchKey)}
                  </div>

                  <button
                    className="card-fav"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(drink);
                    }}
                    // Usa as chaves de tradução para aria-label e title
                    aria-label={isFavorite(drink) ? t('desfavoritar') : t('favoritar')}
                    title={isFavorite(drink) ? t('desfavoritar') : t('favoritar')}
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
                    {drink.matchCount} {t(ingredientKey)}
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
              );
            })}
          </div>

          {visibleCount < filteredDrinks.length && (
            <button className="show-more-btn" onClick={handleShowMore}>
              {/* TRADUÇÃO: Show more */}
              {t('show_more')}
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
                  aria-label={isFavorite(drinkDetails) ? t('desfavoritar') : t('favoritar')}
                >
                  {isFavorite(drinkDetails) ? <FaStar /> : <FaRegStar />}
                </button>

                <img
                  src={drinkDetails.strDrinkThumb}
                  alt={drinkDetails.strDrink}
                  className="modal-img"
                />
                <p>
                  {/* RÓTULO traduzido, VALOR dinâmico traduzido */}
                  <strong>{t('category')}</strong> {t(drinkDetails.strCategory)}
                </p>
                <p>
                  {/* RÓTULO traduzido, VALOR dinâmico traduzido */}
                  <strong>{t('alcoholic')}</strong> {t(drinkDetails.strAlcoholic)}
                </p>
                <p>
                  {/* RÓTULO traduzido, VALOR dinâmico traduzido */}
                  <strong>{t('glass')}</strong> {t(drinkDetails.strGlass)}
                </p>
                <p>
                  {/* TRADUÇÃO: Instructions: (USA APENAS O CAMPO INGLÊS/PADRÃO) */}
                  <strong>{t('instructions')}</strong> {drinkDetails.strInstructions}
                </p>

                {/* TRADUÇÃO: Ingredients */}
                <h3>{t('ingredients')}</h3>
                <ul>
                  {Array.from({ length: 15 }, (_, i) => i + 1)
                    .map((n) => ({
                      ingredient: drinkDetails[`strIngredient${n}`],
                      measure: drinkDetails[`strMeasure${n}`],
                    }))
                    .filter((item) => item.ingredient)
                    .map((item, i) => (
                      <li key={i}>
                        {/* 🛑 AQUI ESTÁ A MUDANÇA: Exibe a medida original da API (ex: '1 1/2 oz') 
                             e usa a tradução apenas para o fallback (se a medida estiver vazia).
                        */}
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
                      />
                    </div>

                    <p className="youtube-warning">
                      {/* TRADUÇÃO: The video shown may not be 100% identical... */}
                      {t('youtube_warning')}
                    </p>
                  </div>
                ) : (
                  <div className="youtube-wrapper">
                    <div style={{ textAlign: "center" }}>
                      <p style={{ opacity: 0.6 }}>
                        {/* TRADUÇÃO: No tutorial video found... */}
                        {t('no_video_found')}
                      </p>

                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                          drinkDetails.strDrink + " drink recipe"
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="youtube-fallback-btn"
                      >
                        {/* TRADUÇÃO: Search on YouTube */}
                        {t('search_on_youtube')}
                      </a>
                    </div>

                    <p className="youtube-warning">
                      {t('youtube_warning')}
                    </p>
                  </div>
                )}
              </>
            ) : (
              // TRADUÇÃO: Loading drink details...
              <p>{t('loading_details')}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

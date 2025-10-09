import React, { useState } from "react";
import DrinkService from "./DrinkService";
import { ingredientCategories } from "./IngredientCategories";
import "./TestDrinkService.css";

export default function TestDrinkService() {
  const [selected, setSelected] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [modalDrink, setModalDrink] = useState(null);
  const [drinkDetails, setDrinkDetails] = useState(null);
  const [drinkSearch, setDrinkSearch] = useState(""); // barra de pesquisa de drinks
  const [favorites, setFavorites] = useState([]); // lista de drinks favoritados

  const allIngredients = Object.values(ingredientCategories).flat();

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
    const details = await DrinkService.getDrinkById(drink.idDrink);
    setDrinkDetails(details);
  };

  const closeModal = () => {
    setModalDrink(null);
    setDrinkDetails(null);
  };

  // Favoritos
  const toggleFavorite = (drink) => {
    if (favorites.some((d) => d.idDrink === drink.idDrink)) {
      setFavorites(favorites.filter((d) => d.idDrink !== drink.idDrink));
    } else {
      setFavorites([...favorites, drink]);
    }
  };

  const isFavorite = (drink) => {
    return favorites.some((d) => d.idDrink === drink.idDrink);
  };

  // Drinks filtrados pela barra de pesquisa
  const filteredDrinks = drinks.filter((drink) =>
    drink.strDrink.toLowerCase().includes(drinkSearch.toLowerCase())
  );

  return (
    <div className="container">
      {/* Coluna esquerda - Ingredientes */}
      <div className="ingredients">
        <h2>Choose your ingredients 🍹</h2>

        {/* Barra de pesquisa de ingredientes */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search for your ingredients..."
            value={search}
            onChange={handleSearchChange}
            className="search-input"
          />
          <span className="search-icon">🔍</span>

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

        {/* Botão Reset */}
        {selected.length > 0 && (
          <button className="reset-btn" onClick={resetSelection}>
            Reset selection ✖
          </button>
        )}

        {/* Ingredientes por categoria */}
        <div className="ingredients-grid">
          {Object.entries(ingredientCategories).map(
            ([category, ingredients]) => (
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
            )
          )}
        </div>
      </div>

      {/* Coluna direita - Drinks */}
      <div className="drinks">
        <h2>Drinks found</h2>

        {/* Barra de pesquisa de drinks */}
        {drinks.length > 0 && (
          <input
            type="text"
            placeholder="Search drinks..."
            value={drinkSearch}
            onChange={(e) => setDrinkSearch(e.target.value)}
            className="drink-search-input"
          />
        )}

        {!filteredDrinks.length && <p className="drinks-empty">No drinks found yet.</p>}

        <div className="drinks-grid">
          {filteredDrinks.map((drink) => (
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
              <p>
                {drink.matchCount} ingredient
                {drink.matchCount > 1 ? "s" : ""} in common
              </p>
            </div>
          ))}
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
                  style={{
                    backgroundColor: isFavorite(drinkDetails)
                      ? "#ff6961"
                      : "#4caf50",
                    color: "#fff",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginBottom: "10px",
                  }}
                >
                  {isFavorite(drinkDetails) ? "Desfavoritar" : "Favoritar"}
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
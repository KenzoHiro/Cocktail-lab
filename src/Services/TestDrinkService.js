import React, { useState } from "react";
import DrinkService from "./DrinkService";
import { ingredientCategories } from "./IngredientCategories";
import "./TestDrinkService.css";

export default function TestDrinkService() {
  const [selected, setSelected] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Lista com todos os ingredientes disponíveis (vindo das categorias)
  const allIngredients = Object.values(ingredientCategories).flat();

  // Alterna a seleção de um ingrediente (se já está marcado, remove; se não está, adiciona)
  const handleSelect = async (ingredient) => {
    let updated;
    if (selected.includes(ingredient)) {
      updated = selected.filter((i) => i !== ingredient);
    } else {
      updated = [...selected, ingredient];
    }
    setSelected(updated);

    // Quando há ingredientes selecionados, buscamos os drinks relacionados
    if (updated.length > 0) {
      let allDrinks = {};

      // Para cada ingrediente selecionado, busca drinks correspondentes
      for (let ing of updated) {
        const drinksFound = await DrinkService.getDrinksByIngredient(ing);

        if (Array.isArray(drinksFound)) {
          drinksFound.forEach((drink) => {
            // Se o drink ainda não está listado, cria uma entrada
            if (!allDrinks[drink.idDrink]) {
              allDrinks[drink.idDrink] = { ...drink, matchCount: 0 };
            }
            // Incrementa o contador de quantos ingredientes do usuario batem com esse drink
            allDrinks[drink.idDrink].matchCount += 1;
          });
        }
      }

      // Ordena os drinks pelo maior número de ingredientes em comum com os selecionados
      const sortedDrinks = Object.values(allDrinks).sort(
        (a, b) => b.matchCount - a.matchCount
      );

      setDrinks(sortedDrinks);
    } else {
      // Se não tem ingredientes selecionados, limpa os drinks
      setDrinks([]);
    }
  };

  // Atualiza a barra de pesquisa e gera sugestões de ingredientes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      setSearchResults([]);
    } else {
      // Filtra os ingredientes que contêm o termo digitado e que ainda não foram selecionados
      const results = allIngredients.filter(
        (ing) =>
          ing.toLowerCase().includes(value.toLowerCase()) &&
          !selected.includes(ing)
      );
      setSearchResults(results.slice(0, 5)); // limita a 5 resultados
    }
  };

  // Ao clicar em um ingrediente do resultado da pesquisa, adiciona ele à seleção
  const handleResultClick = (ingredient) => {
    handleSelect(ingredient);
    setSearch(""); // limpa a barra de pesquisa
    setSearchResults([]); // limpa os resultados
  };

  // Reseta toda a seleção (ingredientes + drinks + pesquisa)
  const resetSelection = () => {
    setSelected([]);
    setDrinks([]);
    setSearch("");
    setSearchResults([]);
  };

  return (
    <div className="container">
      {/* Coluna esquerda - Ingredientes */}
      <div className="ingredients">
        <h2>Choose your ingredients 🍹</h2>

        {/* Barra de pesquisa */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search for your ingredients..."
            value={search}
            onChange={handleSearchChange}
            className="search-input"
          />
          <span className="search-icon">🔍</span>

          {/* Resultados da pesquisa */}
          {searchResults.length > 0 && (
            <ul className="search-results">
              {searchResults.map((result) => (
                <li
                  key={result}
                  onClick={() => handleResultClick(result)}
                  className={`search-item ${selected.includes(result) ? "already-selected" : ""}`}
                >
                  {result}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Botão Reset*/}
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
                <h3>{category}</h3>
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

        {/* Caso ainda não tenha nenhum drink */}
        {(!Array.isArray(drinks) || drinks.length === 0) && (
          <p>No drinks found yet.</p>
        )}

        {/* Grid de drinks encontrados */}
        <div className="drinks-grid">
          {Array.isArray(drinks) &&
            drinks.map((drink) => (
              <div key={drink.idDrink} className="drink-card">
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
    </div>
  );
}

import React, { useEffect, useState } from "react";
import DrinkService from "./DrinkService";
import { ingredientCategories } from "./IngredientCategories";

export default function IngredientSelector() {
  const [selected, setSelected] = useState([]);
  const [drinks, setDrinks] = useState([]);

  // Alterna seleção de um ingrediente
  const handleSelect = async (ingredient) => {
    let updated;
    if (selected.includes(ingredient)) {
      updated = selected.filter((i) => i !== ingredient);
    } else {
      updated = [...selected, ingredient];
    }
    setSelected(updated);

    if (updated.length > 0) {
      // Busca drinks pelo último ingrediente marcado
      // (se quiser filtrar por TODOS depois, fazemos interseção dos resultados)
      const drinksFound = await DrinkService.getDrinksByIngredient(
        updated[updated.length - 1]
      );
      setDrinks(drinksFound || []);
    } else {
      setDrinks([]);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Escolha os ingredientes que você tem em casa 🍹</h2>

      {/* Categorias */}
      {Object.entries(ingredientCategories).map(([category, ingredients]) => (
        <div key={category} style={{ marginBottom: "20px" }}>
          <h3>{category}</h3>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {ingredients.map((ing) => (
              <label key={ing} style={{ margin: "5px" }}>
                <input
                  type="checkbox"
                  checked={selected.includes(ing)}
                  onChange={() => handleSelect(ing)}
                />
                {ing}
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Drinks */}
      <h3>Drinks encontrados:</h3>
      {drinks.length === 0 && <p>Nenhum drink encontrado ainda.</p>}
      <ul>
        {drinks.map((drink) => (
          <li key={drink.idDrink}>
            {drink.strDrink}{" "}
            {drink.strDrinkThumb && (
              <img
                src={drink.strDrinkThumb}
                alt={drink.strDrink}
                width="50"
                style={{ borderRadius: "5px", marginLeft: "10px" }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
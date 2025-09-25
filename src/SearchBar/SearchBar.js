import React, { useState } from "react";
import "./SearchBar.css";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null); 

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = async () => {
    if (query.trim() !== "") {
      console.log("Buscando por:", query);
      
      try {
        // CHAMA BACKEND
        // Passa o termo de busca como parâmetro na URL: ?name=...
        const response = await fetch(`http://localhost:3000/drinks/search?name=${query}`);
        
        if (!response.ok) {
            throw new Error('Erro do servidor ao buscar bebidas.');
        }

        const drinks = await response.json(); // Já é o array de drinks
        
        // ARMAZENA O RESULTADO
        setSearchResults(drinks);

        if (drinks && drinks.length > 0) {
          console.log("Resultado da Busca:", drinks);
          alert(`Encontradas ${drinks.length} bebidas para "${query}"! (Veja o console)`);
        } else {
          console.log("Nenhuma bebida encontrada.");
          alert(`Nenhuma bebida encontrada com o nome "${query}".`);
        }
      } catch (error) {
        console.error("Erro ao buscar as bebidas:", error);
        alert(`Ocorreu um erro: ${error.message}`);
      }
    }
  };

  const handleClear = () => {
    setQuery("");
    setSearchResults(null);
  };

  return (
    <div>
      <div className="search-container">
        {/* Input de pesquisa */}
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Digite o nome da bebida..."
          className="search-input"
        />

        {/* Botões */}
        <button onClick={handleSearch} className="search-button">
          🔍
        </button>
        {query && (
          <button onClick={handleClear} className="clear-button">
            ✕
          </button>
        )}
      </div>

      {/* Exibição simples dos resultados */}
      {searchResults && searchResults.length > 0 && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Resultados ({searchResults.length}):</h3>
          <ul>
            {searchResults.slice(0, 5).map(drink => ( // Limita a 5 para simplificar
              <li key={drink.idDrink}>
                <strong>{drink.strDrink}</strong>
              </li>
            ))}
            {searchResults.length > 5 && <li>...e mais {searchResults.length - 5} resultados.</li>}
          </ul>
        </div>
      )}
      {searchResults === null && <p>Digite um termo e clique em buscar.</p>}
      {searchResults && searchResults.length === 0 && <p>Nenhuma bebida encontrada com esse nome.</p>}
    </div>
  );
}

export default SearchBar;

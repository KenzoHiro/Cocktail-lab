import React, { useState } from "react";
import "./SearchBar.css";

function SearchBar() {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (query.trim() !== "") {
      console.log("Buscando por:", query);
      // aqui você pode colocar lógica de busca real
    }
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className="search-container">
      {/* Input de pesquisa */}
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Digite sua pesquisa..."
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
  );
}

export default SearchBar;

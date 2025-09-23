

import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import SearchBar from './SearchBar/SearchBar.js';
import DrinkDetails from './Services/TestDrinkService.js';

function App() {

  return (
    <div className="App">
      <SearchBar/>
      {/* <DrinkDetails/> */}
    </div>
  );
}

export default App;


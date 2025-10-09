

import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import SearchBar from './SearchBar/SearchBar.js';
import DrinkDetails from './Services/TestDrinkService.js';
import TestDrinkService from './Services/TestDrinkService.js';

function App() {

  return (
    <div className="App">
      <TestDrinkService/>
      {/* <DrinkDetails/> */}
    </div>
  );
}

export default App;


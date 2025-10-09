

import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import SearchBar from './SearchBar/SearchBar.js';
import DrinkDetails from './Services/TestDrinkService.js';
import Login from "./LoginScreen/Login.js";
import Favoritos from "./LoginScreen/FavoritesTest.js";
import Header from "./Header/Header.js";
import Profile from "./ProfileScreen/ProfileScreen.js"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestDrinkService from './Services/TestDrinkService.js';

function App() {
    const [user, setUser] = useState(null);

  return (
    <Router>
      <Header user={user} setUser={setUser} />
      <main>
        <Routes>
          <Route path="/" element={<TestDrinkService/>} />
          <Route path="/profile" element={<Profile userUI={user} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;


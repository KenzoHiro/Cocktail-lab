import React, { useState } from 'react';
import './App.css';

import SearchBar from './SearchBar/SearchBar.js';
import DrinkDetails from './Services/TestDrinkService.js';
import Login from "./LoginScreen/Login.js";
import Favoritos from "./LoginScreen/FavoritesTest.js";
import Header from "./Header/Header.js";
import Profile from "./ProfileScreen/ProfileScreen.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestDrinkService from './Services/TestDrinkService.js';

// Import correto do seu modal
import ConsentModal from "./ConsentModal/ConsentModal";

function App() {
  const [user, setUser] = useState(null);

  // Modal só aparece quando não há usuário logado
  const [showConsent, setShowConsent] = useState(true);

  const handleAccept = () => {
    setShowConsent(false);
  };

  return (
    <Router>

      {/* mostro o modal somente se o usuário não estiver logado */}
      {user === null && showConsent && (
        <ConsentModal onAccept={handleAccept} />
      )}

      <Header user={user} setUser={setUser} />
      <main>
        <Routes>
          <Route path="/" element={<TestDrinkService />} />
          <Route path="/profile" element={<Profile userUI={user} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;

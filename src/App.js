
import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import ConsentModal from './components/ConsentModal/ConsentModal.js';

function App() {
  const [hasConsented, setHasConsented] = useState(false);

  const handleAcceptConsent = () => {
    console.log("Consentimento aceito pelo usuário.");
    setHasConsented(true);
  };

  return (
    <div className="App">

      {!hasConsented && <ConsentModal onAccept={handleAcceptConsent} />}

      {hasConsented && (
        <header className="App-header">
          <h1>Cocktail Lab</h1>
          <p>
            Bem-vindo à plataforma!
          </p>
        </header>
      )}

    </div>
  );
}

export default App;

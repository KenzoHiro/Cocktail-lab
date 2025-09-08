
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
      
      {/* O modal só aparece se o usuário AINDA NÃO consentiu */}
      {!hasConsented && <ConsentModal onAccept={handleAcceptConsent} />}

      {/* O conteúdo principal do seu site só aparece DEPOIS que o usuário consentir */}
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

import React, { useState } from 'react';
import './ConsentModal.css';

const ConsentModal = ({ onAccept }) => {
  const [hasAgreed, setHasAgreed] = useState(false);

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 className="modal-title">Bem-vindo ao Cocktail Lab!</h2>
        <p className="modal-text">
          Para continuar, você precisa confirmar que tem <strong>18 anos ou mais</strong> e que concorda com nossos Termos de Uso e Política de Privacidade. Beba com responsabilidade.
        </p>
        
        <div className="modal-agree-section">
          <input 
            type="checkbox" 
            id="agree-checkbox" 
            checked={hasAgreed}
            onChange={() => setHasAgreed(!hasAgreed)} 
          />
          <label htmlFor="agree-checkbox">
            Eu confirmo que tenho 18 anos ou mais e aceito os termos.
          </label>
        </div>

        <button 
          onClick={onAccept} 
          disabled={!hasAgreed}
          className="modal-button"
        >
          Aceitar e Entrar
        </button>
      </div>
    </div>
  );
};

export default ConsentModal;

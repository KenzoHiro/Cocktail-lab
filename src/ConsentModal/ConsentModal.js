import React, { useState } from 'react';
import './ConsentModal.css';
import { useTranslation } from 'react-i18next'; // <-- Adicionado para tradução

const ConsentModal = ({ onAccept }) => {
  const { t } = useTranslation(); // <-- Uso do hook
  const [hasAgreed, setHasAgreed] = useState(false);

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        {/* TRADUÇÃO: ⚠ Atenção */}
        <h2 className="modal-title">{t('attention_title')}</h2>

        <p className="modal-text">
          {/* TRADUÇÃO: Antes de continuar, confirme... */}
          <strong>{t('modal_age_warning_1')}</strong> 
          {/* TRADUÇÃO: Este aplicativo pode conter conteúdo... */}
          {t('modal_age_warning_2')}
        </p>

        <p className="modal-text">
          {/* TRADUÇÃO: Para continuar, você precisa confirmar... */}
          {t('modal_age_confirmation')}
        </p>

        <div className="modal-agree-section">
          <input 
            type="checkbox" 
            id="agree-checkbox" 
            checked={hasAgreed}
            onChange={() => setHasAgreed(!hasAgreed)} 
          />
          <label htmlFor="agree-checkbox">
            {/* TRADUÇÃO: Eu confirmo que tenho 18 anos ou mais... */}
            {t('modal_checkbox_label')}
          </label>
        </div>

        <button 
          onClick={onAccept} 
          disabled={!hasAgreed}
          className="modal-button"
        >
          {/* TRADUÇÃO: Aceitar e Entrar */}
          {t('modal_accept_button')}
        </button>
      </div>
    </div>
  );
};

export default ConsentModal;

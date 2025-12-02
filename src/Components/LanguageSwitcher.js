import React from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as UsaFlag } from '../assets/USA.svg';
import { ReactComponent as BraFlag } from '../assets/BRA.svg';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const buttonStyle = {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ccc",
    borderRadius: "6px",
    padding: "4px 8px",
    cursor: "pointer",
    background: "#fff",
    fontSize: "14px"
  };

  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
      
      <button 
        onClick={() => i18n.changeLanguage("en")}
        style={{
          ...buttonStyle,
          fontWeight: i18n.language === 'en' ? 'bold' : 'normal',
          borderColor: i18n.language === 'en' ? '#000' : '#ccc'
        }}
      >
        <UsaFlag style={{ width: '20px', height: 'auto', marginRight: '5px' }} />
        EN
      </button>

      <button 
        onClick={() => i18n.changeLanguage("pt-BR")}
        style={{
          ...buttonStyle,
          fontWeight: i18n.language === 'pt-BR' ? 'bold' : 'normal',
          borderColor: i18n.language === 'pt-BR' ? '#000' : '#ccc'
        }}
      >
        <BraFlag style={{ width: '20px', height: 'auto', marginRight: '5px' }} />
        PT-BR
      </button>

    </div>
  );
}
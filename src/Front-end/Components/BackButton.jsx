import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.css'; 

export default function BackButton({ className = '', text = 'Back', theme = 'primary' }) {
  const navigate = useNavigate();
  
  function handleBack() {
    navigate(-1);
  }
  
  return (
    <button 
      onClick={handleBack} 
      className={`back-button ${theme} ${className}`}
    >
      <span className="back-icon">&#8592;</span>
      <span className="back-text">{text}</span>
    </button>
  );
}
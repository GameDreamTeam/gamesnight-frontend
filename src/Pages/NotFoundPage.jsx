// NotFoundPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <h1>🚫 404 - Not Found</h1>
      <p>🔍 The page you are looking for does not exist.</p>
      <button onClick={() => navigate('/home')}>🏠 Go Home</button>
    </div>
  );
};

export default NotFoundPage;

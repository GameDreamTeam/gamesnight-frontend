import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HostGame.css'; // Import the CSS file

const HostGame = () => {
  const [gameCode, setGameCode] = useState('');

  useEffect(() => {
    axios.post('http://localhost:8080/host')
      .then(response => {
        setGameCode(response.data.code);
      })
      .catch(error => {
        console.error('Error creating game:', error);
      });
  }, []);

  return (
    <div className="host-game-container">
      <h1>Your Host Code</h1>
      <div className="code-display">
        {gameCode ? gameCode : "Generating..."}
      </div>
    </div>
  );
};

export default HostGame;

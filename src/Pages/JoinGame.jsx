import React, { useState } from 'react';
import axios from 'axios';
import './JoinGame.css'; // Import the CSS file

const JoinGame = () => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const joinGame = () => {
    axios.post('http://localhost:8080/join', { code })
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        setMessage('Failed to join game. ' + (error.response?.data.error || error.message));
      });
  };

  return (
    <div className="join-game-container">
      <h1>Join Game</h1>
      <div className="input-group">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter 4-digit code"
        />
        <button onClick={joinGame}>Join</button>
      </div>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default JoinGame;

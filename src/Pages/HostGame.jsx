import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './HostGame.css'; // Ensure this CSS file is properly set up

const HostGame = () => {
  const [gameId, setGameId] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/v0/create-game', { withCredentials: true })
      .then(response => {
        setGameId(response.data.data.gameId);
      })
      .catch(error => {
        console.error('Error creating game:', error);
        setMessage('Error creating game. Please try again.');
        setIsError(true);
      });
  }, []);

  const handleUsernameSubmit = () => {
    axios.post(`http://localhost:8080/v0/${gameId}/join`, { username }, { withCredentials: true })
      .then(response => {
        navigate(`/v0/game/${gameId}/submit`, { state: { gameId, username } });
      })
      .catch(error => {
        setMessage('Error joining game. Please try again.');
        setIsError(true);
      });
  };

  return (
    <div className="host-game-container">
      <div className="top-right-corner">
        <p>Username: {username}</p>
        <p>Game ID: {gameId}</p>
      </div>

      {message && (
        <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`}>
          {message}
        </div>
      )}

      <div>
        <h2>Enter Your Username</h2>
        <div className="input-group">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Username"
          />
          <button onClick={handleUsernameSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default HostGame;

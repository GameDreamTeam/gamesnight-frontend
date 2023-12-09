import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

const HomePage = () => {
  const [gameId, setGameId] = useState('');
  const [playerGameId, setPlayerGameId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/v0/game/create', { withCredentials: true })
      .then(response => setGameId(response.data.data.gameId))
      .catch(error => console.error('Error fetching game ID:', error));
  }, []);

  const handleJoinAsHost = () => navigate(`/game/${gameId}/join`);

  const handleJoinAsPlayer = (e) => {
    e.preventDefault();
    if (playerGameId.length === 4) {
      axios.get(`http://localhost:8080/v0/gamemeta/${playerGameId}`, { withCredentials: true })
        .then(response => {
          response.data.status === 'success'
            ? navigate(`/game/${playerGameId}/join`)
            : setError('Invalid Game ID. Please try again.');
        })
        .catch(error => setError('Game not Found'));
    } else {
      setError('Invalid Game ID. Please enter a 4-digit ID.');
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to the Fishbowl Game!</h1>
      </header>
      <section className="join-section">
        <p>Choose to join as a host or a player.</p>
        <div className="buttons-container">
          <button onClick={handleJoinAsHost} className="button host-button">Join as Host</button>
          <form onSubmit={handleJoinAsPlayer} className="player-join-form">
            <input
              type="text"
              placeholder="Enter Game ID"
              value={playerGameId}
              onChange={(e) => setPlayerGameId(e.target.value)}
              className="game-id-input"
            />
            <button type="submit" className="button player-button">Join as Player</button>
          </form>
        </div>
        {error && <p className="error-message">{error}</p>}
      </section>
    </div>
  );
};

export default HomePage;

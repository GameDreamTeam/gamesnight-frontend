import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

const HomePage = () => {
  const [playerGameId, setPlayerGameId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoinAsHost = async () => {
    try {
      const response = await axios.post('http://localhost:8080/v0/games/', null, {
        withCredentials: true,
        maxRedirects: 0,
      });
      console.log(response.data)
  
      const gameIdFromResponse = response.data?.data?.gameId;
  
      if (gameIdFromResponse) {
        navigate(`/game/${gameIdFromResponse}/join`);
      } else {
        console.error('Invalid game data received. No gameId found in the response:', response);
      }
    } catch (error) {
      console.error('Error creating a new game:', error);
  
      if (error.response) {
        console.error('Server responded with:', error.response.data);
      }
  
      setError('Error creating a new game. Please try again.');
    }
  };
  

  const handleJoinAsPlayer = async (e) => {
    e.preventDefault();
    
    if (playerGameId.length === 4) {
      try {
        const response = await axios.get(`http://localhost:8080/v0/games/${playerGameId}/meta`, { withCredentials: true });
        response.data.status === 'success'
          ? navigate(`/game/${playerGameId}/join`)
          : setError('Invalid Game ID. Please try again.');
      } catch (error) {
        setError('Game not Found');
        console.error('Error fetching game meta:', error);
      }
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
          <button onClick={handleJoinAsHost} className="button host-button">
            Join as Host
          </button>
          <form onSubmit={handleJoinAsPlayer} className="player-join-form">
            <input
              type="text"
              placeholder="Enter Game ID"
              value={playerGameId}
              onChange={(e) => setPlayerGameId(e.target.value)}
              className="game-id-input"
            />
            <button type="submit" className="button player-button">
              Join as Player
            </button>
          </form>
        </div>
        {error && <p className="error-message">{error}</p>}
      </section>
    </div>
  );
};

export default HomePage;

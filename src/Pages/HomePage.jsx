import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

const HomePage = () => {
  const [playerGameId, setPlayerGameId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handler for joining as a host
  const handleJoinAsHost = async () => {
    try {
      // Create a new game on the server
      const response = await axios.post('http://localhost:8080/v0/games/', null, {
        withCredentials: true
      });

      // Extract the gameId from the response
      const gameIdFromResponse = response.data?.data?.gameId;

      if (gameIdFromResponse) {
        // Navigate to the join page with the generated gameId
        navigate(`/games/${gameIdFromResponse}`);
      }
      else {
        console.error('Invalid game data received. No gameId found in the response:', response);
      }
    } 
    catch (error) {
      console.error('Error creating a new game:', error);

      setError('Error creating a new game. Please try again.');
    }
  };

  // Handler for joining as a player
  const handleJoinAsPlayer = async (e) => {
    e.preventDefault();

    if (playerGameId.length === 4) {
      try {
        // Check if the game with the provided ID exists
        const response = await axios.get(`http://localhost:8080/v0/games/${playerGameId}/meta`, { withCredentials: true });
        response.data.status === 'success'
          ? navigate(`/game/${playerGameId}/join`)
          : setError('Invalid Game ID. Please try again.');
      } catch (error) {
        setError('Game not Found');
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
          {/* Join as Host button */}
          <button onClick={handleJoinAsHost} className="button host-button">
            Join as Host
          </button>
          {/* Join as Player form */}
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

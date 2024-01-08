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
      });

      const gameIdFromResponse = response.data?.data?.gameId;

      if (gameIdFromResponse) {
        navigate(`/games/${gameIdFromResponse}`);
      } else {
        setError('Response does not contain gameId');
        clearErrorAfterDelay();
      }
    } catch (error) {
      setError('Error creating a new game. Please try again.');
      clearErrorAfterDelay();
    }
  };

  const handleJoinAsPlayer = async (e) => {
    e.preventDefault();
    if (playerGameId.length === 4) {
      try {
        const response = await axios.get(`http://localhost:8080/v0/games/${playerGameId}/meta`, { withCredentials: true });
        if (response.data.status === 'success') {
          navigate(`/games/${playerGameId}`);
        } else {
          setError(`Game: ${playerGameId} does not exist. Please try again.`);
          clearErrorAfterDelay();
        }
      } catch (error) {
        setError('Unable to find game');
        clearErrorAfterDelay();
      }
    } else {
      setError('Invalid Game ID. Please enter a 4-digit ID.');
      clearErrorAfterDelay();
    }
  };

  const clearErrorAfterDelay = () => {
    setTimeout(() => {
      setError('');
    }, 2000);
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

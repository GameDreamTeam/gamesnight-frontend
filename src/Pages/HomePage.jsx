import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';
import people1 from '../assets/people-1.png';
import people2 from '../assets/people-2.png';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const HomePage = () => {
  const [playerGameId, setPlayerGameId] = useState('');
  const [showPlayerOptions, setShowPlayerOptions] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const createGame = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/v0/games/`, null, {withCredentials: true})
      return response.data?.data?.gameId;
    } catch (error) {
      throw new Error('Error creating a new game. Please try again.');
    }
  }

  const checkGameExists = async (gameId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/v0/games/${gameId}/meta`, {withCredentials: true,});
      return response.data.status === 'success'
    } catch (error) {
      throw new Error('Unable to find game');
    }
  };

  const handleJoinAsHost = async () => {
    try {
      const gameId = await createGame();
      if (gameId) {
        navigate(`/games/${gameId}`);
      } else {
        setError('Response does not contain gameId');
      }
    } catch (error) {
      setError(error.message);
    }
    clearErrorAfterDelay();
  };

  const handleJoinAsPlayer = async (e) => {
    e.preventDefault();
    if (playerGameId.length === 4) {
      try {
        const gameExists = await checkGameExists(playerGameId);
        if (gameExists) {
          navigate(`/games/${playerGameId}`);
        } else {
          setError(`Game: ${playerGameId} does not exist. Please try again.`);
        }
      } catch (error) {
        setError(error.message);
      }
    } else {
      setError('Invalid Game ID. Please enter a 4-letter ID.');
    }
    clearErrorAfterDelay();
  };

  const clearErrorAfterDelay = () => {
    setTimeout(() => {
      setError('');
    }, 2000);
  };

  const handlePlayerOptionToggle = () => {
    setShowPlayerOptions(!showPlayerOptions);
  };



  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to the Charades Game!</h1>
      </header>

      <section className="join-section">
        {showPlayerOptions && (
          <div>
            <form onSubmit={handleJoinAsPlayer} className="player-join-form">
              <input
                type="text"
                placeholder="Enter Game ID"
                value={playerGameId}
                onChange={(e) => setPlayerGameId(e.target.value.toUpperCase())}
                maxLength="4"
                className="game-id-input"
              />
              <div className="form-buttons">
                <button type="button" onClick={handlePlayerOptionToggle} className="button back-button">
                  Back
                </button>
                <button type="submit" className="button join-button">
                  Join Game
                </button>
              </div>
            </form>
          </div>

        )}

        {!showPlayerOptions && (
          <div className="buttons-container">
            <p>Choose to join as a host or a player</p>
            <button onClick={handleJoinAsHost} className="button host-button">
              Host Game
            </button>
            <button onClick={() => setShowPlayerOptions(true)} className="button player-button">
              Join Game
            </button>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}

        <div className="image-container">
          <img src={people1} alt="People Playing" className="responsive-image" />
          <img src={people2} alt="People Playing" className="responsive-image" />
        </div>

      </section>
    </div>
  );
};

export default HomePage;

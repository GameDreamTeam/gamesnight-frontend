import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

  const handleJoinAsHost = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/v0/games/`, null,
        { withCredentials: true }
      )
      const gameId = response.data?.data?.gameId
      if (gameId) {
        console.log("Game:" + gameId + "created and navigating to JoinState")
        navigate(`/games/${gameId}`);
      }
      else {
        setError("Response does not contain gameId")
      }
    }
    catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        console.error("Backend throwed error:", error.response.data)
        setError(error.response.data.error)

      } else if (error.request) {
        //Backend Server is down
        console.error("No response from the server:", error.request);
        setError('Server is down or not reachable');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error:", error.message);
        setError('Error in making the request');
      }
    }
    clearErrorAfterDelay()
  }

  const handleJoinAsPlayer = async (e) => {
    e.preventDefault();
    try {
      await axios.get(
        `${API_BASE_URL}/v0/games/${playerGameId}/meta`,
        { withCredentials: true }
      )
      console.log("Game found and navigating to JoinState")
      navigate(`/games/${playerGameId}`);
    }
    catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        console.error("Backend throwed error:", error.response.data)
        setError("game not found")

      } else if (error.request) {
        //Backend Server is down
        console.error("No response from the server:", error.request);
        setError('Server is down or not reachable');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error:", error.message);
        setError('Error in making the request');
      }

    }
    clearErrorAfterDelay();
  }

  const clearErrorAfterDelay = () => {
    setTimeout(() => {
      setError('');
    }, 3000);
  }

  const handlePlayerOptionToggle = () => {
    setShowPlayerOptions(!showPlayerOptions);
  }

  return (
    <>
      <header className="home-header">
        <h1>🎭 Welcome to the Charades Game! 🎉</h1>
      </header>

      <p className="option">Choose to join as a host or a player</p>

      {!showPlayerOptions && (
        <div className="buttons-container">
          <button onClick={handleJoinAsHost} className="button host-button">
            🎲 Host Game
          </button>
          <button onClick={() => setShowPlayerOptions(true)} className="button player-button">
            👥 Join Game
          </button>
        </div>
      )}

      {showPlayerOptions && (
        <div>
          <form onSubmit={handleJoinAsPlayer} className="player-join-form">
            <input
              type="text"
              placeholder="🔑 Enter Game ID"
              value={playerGameId}
              onChange={(e) => setPlayerGameId(e.target.value.toUpperCase())}
              maxLength="4"
              className="game-id-input"
            />

            <div className="buttons-containers">
              <button type="button" onClick={handlePlayerOptionToggle} className="button back-button">
                🔙 Back
              </button>
              <button type="submit" className="button join-button">
                🚪 Join Game
              </button>
            </div>
          </form>
        </div>
      )}

      {error && <p className="error-message">⚠️ {error}</p>}

      <div className="image-container">
        <img src={people1} alt="House-Party-1" className="responsive-image" />
        <img src={people2} alt="House-Party-2" className="responsive-image" />
      </div>


    </>
  )
}

export default HomePage;

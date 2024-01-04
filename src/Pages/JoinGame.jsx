import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './JoinGame.css'; // Importing CSS file

const JoinGame = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [name, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [players, setPlayers] = useState([]);
  const gameLink = `http://localhost:3000/game/${gameId}/join`;

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/v0/games/${gameId}/meta`, { withCredentials: true });
        if (response.data.status === 'success') {
          setPlayers(response.data.data.players);
        }
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    fetchPlayers();
    const intervalId = setInterval(fetchPlayers, 1000);
  
    return () => clearInterval(intervalId);
  }, [gameId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/v0/games/${gameId}/join`, { name }, { withCredentials: true });
      setMessage("Game Joined Successfully");
      setError('');
      setUsername('');
    } catch (error) {
      setMessage('');
      setError("You have already joined the game");
    }
  };

  const handleSubmitWords = () => {
    navigate(`/game/${gameId}/submit`);
  };

  return (
    <div className="game-container">
      <header className="game-header">
        <h1>Welcome to Game: {gameId}</h1>
        {name && <p>Logged in as: {name}</p>}
      </header>
      <section className="share-link">
        <p>Share this link for others to join:</p>
        <div className="link-container">
          <input type="text" value={gameLink} readOnly />
          <button onClick={() => navigator.clipboard.writeText(gameLink)}>
            Copy Link
          </button>
        </div>
      </section>

      <section className="join-game">
        <form onSubmit={handleSubmit} className="join-form">
          <input
            type="text"
            value={name}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
          <button type="submit">Join Game</button>
        </form>
        <div className={error ? "message error" : "message success"}>
          {message || error}
        </div>
      </section>

      <section className="lobby">
        <h2>Lobby</h2>
        <div className="player-list">
          {players.map(player => (
            <div className="player-card" key={player.id}>
              {player.name}
            </div>
          ))}
        </div>
      </section>

      <section className="submit-words">
        <button onClick={handleSubmitWords}>Submit Words</button>
      </section>
    </div>
  );
};

export default JoinGame;

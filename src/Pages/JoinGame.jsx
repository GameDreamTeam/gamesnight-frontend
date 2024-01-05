import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JoinGame.css';

const JoinGame = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [name, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [players, setPlayers] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [showError, setShowError] = useState(false);
  const [adminId, setAdminId] = useState(null); 
  const [currentPlayerId, setCurrentPlayerId] = useState(null);

  const gameLink = `http://localhost:3000/games/${gameId}`;

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/v0/games/${gameId}/meta`, { withCredentials: true });
        if (response.data.status === 'success') {
          setPlayers(response.data.data.players);
          setAdminId(response.data.data.adminId);
        }
      } catch (error) {
        console.error('Error Getting Game Data', error);
        navigate("/home");
      }
    };

    fetchPlayers();
    const intervalId = setInterval(fetchPlayers, 1000);

    return () => clearInterval(intervalId);
  }, [gameId, navigate]);

  useEffect(() => {
    const checkGameState = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/v0/games/${gameId}/details`, { withCredentials: true });
        console.log(response)
        if (response.data.status === 'success' && response.data.data.state === 1) {
          navigate(`/games/${gameId}/submit`);
        }
      } catch (error) {
        console.error('Error checking game state', error);
      }
    };

    checkGameState();
    const intervalId = setInterval(checkGameState, 1000);

    return () => clearInterval(intervalId);
  }, [gameId, navigate]);

  const fetchPlayerData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/v0/players/`, { withCredentials: true });
      if (response.data.status === 'success') {
        setCurrentPlayerId(response.data.data.id);
      }
    } catch (error) {
      console.error('Error Getting Player Data', error);
    }
  };
  fetchPlayerData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/v0/games/${gameId}/join`, { name }, { withCredentials: true });
      setMessage("Game Joined Successfully");
      setShowMessage(true);

      setTimeout(() => {
        setShowMessage(false);
        setMessage('')
      }, 1500);
    } 
    catch (error) {
      setError("You have already joined the game");
      setShowError(true);

      setTimeout(() => {
        setShowError(false);
        setError('');
      }, 1500);
    }
  };

  const handleSubmitWords = () => {
    axios.post(`http://localhost:8080/v0/games/${gameId}/changeState`, null, { withCredentials: true })
    navigate(`/games/${gameId}/submit`);
  };

  return (
    <div className="game-container">
      <header className="game-header">
        <h1>Welcome to Game: {gameId}</h1>
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

        <div className={showMessage ? "message success" : "hidden"}>
          {message}
        </div>
        <div className={showError ? "message error" : "hidden"}>
          {error}
        </div>
      </section>

      <section className="lobby">
        <h2>Lobby</h2>
        <div className="player-list">
          {players.map((player) => (
            <div className="player-card" key={player.id}>
              {player.name}
            </div>
          ))}
        </div>
      </section>

      <section className="submit-words">
      {currentPlayerId === adminId && (
          <button onClick={handleSubmitWords}>Submit Words</button>
        )}
      </section>
    </div>
  );
};

export default JoinGame;

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './JoinGame.css';
import ShareLink from './ShareLink';
import SubmitWords from './SubmitWords';
import Lobby from './Lobby';
import { GameProvider } from './GameContext';

const JoinGame = () => {
  const { gameId } = useParams();
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  return (
    <GameProvider gameId={gameId}>
      <div>
        <header className="game-header">
          <h1>🎲 Welcome to the Game: {gameId} 🎮</h1>
        </header>
      </div>

      <ShareLink gameId={gameId} />

      <Lobby setError={setError} setShowError={setShowError} />

      <SubmitWords setError={setError} setShowError={setShowError} />

      {showError && <div className="message-error">⚠️ {error}</div>}
    </GameProvider>
  );
};

export default JoinGame;

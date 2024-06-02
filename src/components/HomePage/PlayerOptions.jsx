import React, { useState } from 'react';
import {useJoinAsPlayer} from '../../hooks';

const PlayerOptions = ({ setError, navigate, setShowPlayerOptions }) => {
  const [playerGameId, setPlayerGameId] = useState('');
  const handleJoinAsPlayer = useJoinAsPlayer(playerGameId, setError, navigate);

  return (
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
          <button type="button" onClick={() => setShowPlayerOptions(false)} className="button back-button">
            🔙 Back
          </button>
          <button type="submit" className="button join-button">
            🚪 Join Game
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlayerOptions;

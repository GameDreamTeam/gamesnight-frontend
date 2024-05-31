import React from 'react';
import useJoinAsHost from '../../hooks/useJoinAsHost';

const HostOptions = ({ setError, navigate, setShowPlayerOptions }) => {
  const handleJoinAsHost = useJoinAsHost(setError, navigate);

  return (
    <div className="buttons-container">
      <button onClick={handleJoinAsHost} className="button host-button">
        🎲 Host Game
      </button>
      <button onClick={() => setShowPlayerOptions(true)} className="button player-button">
        👥 Join Game
      </button>
    </div>
  );
};

export default HostOptions;

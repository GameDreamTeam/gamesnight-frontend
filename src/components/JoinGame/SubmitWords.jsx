import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../constants/api';
import { useGameContext } from './GameContext';

const SubmitWords = ({ setError, setShowError }) => {
  const { gameId, currentPlayerId, adminId } = useGameContext();
  const [loading, setLoading] = useState(false);
  const isAdmin = currentPlayerId === adminId;

  const handleGoToAddPhrases = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading screen
    try {
      await axios.patch(`${API_BASE_URL}/v0/games/${gameId}/update-state`, null, { withCredentials: true });
    } catch (e) {
      setError('Not enough players to start the game');
      setShowError(true);

      setTimeout(() => {
        setShowError(false);
        setError(''); 
      }, 1500);
    } finally {
      setTimeout(() => {
        setLoading(false); // Hide loading screen after 2 seconds
      }, 2000);
    }
  };

  return (
    <>
      {loading && (
        <div className="loading-screen">
          <div className="spinner"></div>
        </div>
      )}
      {isAdmin && !loading && (
        <div className="submit-word">
          <section className="submit-words">
            <button onClick={handleGoToAddPhrases} className="next-button">
              🚀 Everyone's Here
            </button>
          </section>
        </div>
      )}
    </>
  );
};

export default SubmitWords;

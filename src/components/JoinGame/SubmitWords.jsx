import React from 'react';
import { API_BASE_URL } from '../../constants/api';
import axios from 'axios'

const SubmitWords = ({ isAdmin, gameId, setError, setShowError}) => {
    const handleGoToAddPhrases = async (e) => {
        e.preventDefault()
        try {
          await axios.patch(
            `${API_BASE_URL}/v0/games/${gameId}/update-state`,
            null,
            { withCredentials: true }
          )
        }
        catch (e) {
          setError("Not enough players to start the game")
          setShowError(true)
    
          setTimeout(() => {
            setShowError(false)
            setError('')
          }, 1500)
        }
      }

    return (
        isAdmin && (
        <div className="submit-word">
            <section className="submit-words">
            <button onClick={handleGoToAddPhrases} className="next-button">
                🚀 Everyone's Here
            </button>
            </section>
        </div>
        )
    );
};

export default SubmitWords;

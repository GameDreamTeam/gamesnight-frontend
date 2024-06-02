import { useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants/api';
import { useNavigate } from 'react-router-dom';

const useCheckGameState = (gameId) => {
  const navigate = useNavigate();

  useEffect(() => {
    let isCancelled = false;

    const checkGameState = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/v0/games/${gameId}/details`,
          { withCredentials: true }
        );
        if (!isCancelled && response.data.data.state === 1) {
          navigate(`/games/${gameId}/submit`);
        }
      } catch (error) {
        if (error.response) {
          console.error("Backend threw error:", error.response.data);
          navigate("/game-not-found");
          window.location.reload();
        } else if (error.request) {
          console.error("No response from the server:", error.request);
        } else {
          console.error("Error:", error.message);
        }
      }
      setTimeout(checkGameState, 4000);
    };

    checkGameState();
    const intervalId = setInterval(checkGameState, 4000);
    return () => {
      isCancelled = true;
      clearInterval(intervalId);
    };
  }, [gameId, navigate]);
};

export default useCheckGameState;

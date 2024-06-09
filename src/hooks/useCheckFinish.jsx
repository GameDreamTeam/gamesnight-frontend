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
        const response = await axios.get(`${API_BASE_URL}/v0/games/${gameId}/details`, { withCredentials: true });
        if (response.data.data.state === 4 && !isCancelled) {
          setTimeout(() => {
            navigate(`/games/${gameId}/finish`);
            window.location.reload();
          }, 3000);
        }
      } catch (error) {
        console.error('Error checking game state', error);
      }
    };

    checkGameState();

    const intervalId = setInterval(checkGameState, 2000);
    return () => {
      isCancelled = true;
      clearInterval(intervalId);
    };
  }, [gameId, navigate]);
};

export default useCheckGameState;

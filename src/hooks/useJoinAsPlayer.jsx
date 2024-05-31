import { useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

const useJoinAsPlayer = (playerGameId, setError, navigate) => {
  const handleJoinAsPlayer = useCallback(async (e) => {
    e.preventDefault();
    try {
      await axios.get(
        `${API_BASE_URL}/v0/games/${playerGameId}/meta`,
        { withCredentials: true }
      );
      console.log("Game found and navigating to JoinState");
      navigate(`/games/${playerGameId}`);
    } catch (error) {
      if (error.response) {
        console.error("Backend threw error:", error.response.data);
        setError("Game not found");
      } else if (error.request) {
        console.error("No response from the server:", error.request);
        setError('Server is down or not reachable');
      } else {
        console.error("Error:", error.message);
        setError('Error in making the request');
      }
    }
    setTimeout(() => {
      setError('');
    }, 3000);
  }, [navigate, playerGameId, setError]);

  return handleJoinAsPlayer;
};

export default useJoinAsPlayer;

import { useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

const useJoinAsHost = (setError, navigate) => {
  const handleJoinAsHost = useCallback(async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/v0/games/`,
        null,
        { withCredentials: true }
      );
      const gameId = response.data?.data?.gameId;
      if (gameId) {
        console.log("Game:" + gameId + " created and navigating to JoinState");
        navigate(`/games/${gameId}`);
      } else {
        setError("Response does not contain gameId");
      }
    } catch (error) {
      if (error.response) {
        console.error("Backend threw error:", error.response.data);
        setError(error.response.data.error);
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
  }, [navigate, setError]);

  return handleJoinAsHost;
};

export default useJoinAsHost;

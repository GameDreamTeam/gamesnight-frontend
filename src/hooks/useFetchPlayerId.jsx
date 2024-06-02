import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

const useFetchPlayerId = () => {
  const [currentPlayerId, setCurrentPlayerId] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchPlayerId = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/v0/players/`,
          { withCredentials: true }
        );
        if (!isCancelled) {
          setCurrentPlayerId(response.data.data.id);
        }
      } catch (error) {
        if (error.response) {
          console.error("Backend threw error:", error.response.data);
        } else if (error.request) {
          console.error("No response from the server:", error.request);
        } else {
          console.error("Error:", error.message);
        }
      }
    };

    fetchPlayerId();
    return () => {
      isCancelled = true;
    };
  }, []);

  return {currentPlayerId};
};

export default useFetchPlayerId;

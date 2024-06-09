import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

const useFetchPlayers = (gameId) => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/v0/games/${gameId}/meta`, { withCredentials: true });
        if (response.data.status === 'success') {
          const allPlayers = response.data.data.players;
          const playersWithWords = allPlayers.filter((player) => player.wordsSubmitted === false);
          setPlayers(playersWithWords);
        }
      } catch (error) {
        console.error('Error Getting Teams and Players Data', error);
      }
    };

    fetchPlayers();
    const intervalId = setInterval(fetchPlayers, 3000);
    return () => clearInterval(intervalId);
  }, [gameId]);

  return players;
};

export default useFetchPlayers;

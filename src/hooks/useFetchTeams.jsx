import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

const useFetchTeams = (gameId) => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/v0/games/${gameId}/details`, { withCredentials: true });
        if (response.data.status === 'success') {
          setTeams(response.data.data.teams);
        }
      } catch (error) {
        console.error('Error Getting Teams and Players Data', error);
      }
    };

    fetchTeams();
    const intervalId = setInterval(fetchTeams, 3000);
    return () => clearInterval(intervalId);
  }, [gameId]);

  return teams;
};

export default useFetchTeams;

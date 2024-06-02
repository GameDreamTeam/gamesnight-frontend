import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants/api';
import { useNavigate } from 'react-router-dom';

const useFetchLobbyPlayers = (gameId) => {
  const [players, setPlayers] = useState([]);
  const [adminId, setAdminId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isCancelled = false;

    const fetchLobbyPlayers = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/v0/games/${gameId}/meta`,
          { withCredentials: true }
        );

        if (!isCancelled) {
          setPlayers(response.data.data.players);
          setAdminId(response.data.data.adminId);
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
    };

    fetchLobbyPlayers();
    const intervalId = setInterval(fetchLobbyPlayers, 4000);

    return () => {
      isCancelled = true;
      clearInterval(intervalId);
    };
  }, [gameId, navigate]);

  return { players, adminId };
};

export default useFetchLobbyPlayers;

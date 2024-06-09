import { useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

const useFetchPlayerResponse = (gameId, navigate, setMessage) => {
  useEffect(() => { 
    let isCancelled = false;
    const fetchPlayerResponse = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/v0/players/`,
          { withCredentials: true }
        )
        if (!isCancelled && response.data.data.wordsSubmitted === true) {
          navigate(`/games/${gameId}/divide-teams`)
        }
      } catch (error) {
        if (error.response) {
          console.error("Backend throwed error:", error.response.data)
          setMessage(error.response.data.error)
        }
        else if (error.request) {
          console.error("No response from the server:", error.request)
          setMessage('Server is down or not reachable')
        }
        else {
          console.error("Error:", error.message)
          setMessage('Error in making the request')
        }
      }
    }
    fetchPlayerResponse()
    return () => {
      isCancelled = true;
    };
  }, [gameId, navigate, setMessage]);
};

export default useFetchPlayerResponse;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './DivideTeams.css';

const DivideTeams = () => {
  const [teams, setTeams] = useState([]);
  const { gameId } = useParams();
  const [currentPlayerId, setCurrentPlayerId] = useState(null);
  const [adminId, setAdminId] = useState(null);
  const [players, setPlayers] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayerId = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/v0/players/`, { withCredentials: true });
        if (response.data.status === 'success') {
          setCurrentPlayerId(response.data.data.id);
        }
      } catch (error) {
        console.error('Error Getting Player Data', error);
      }
    };
    fetchPlayerId();
  }, []);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/v0/games/${gameId}/meta`, { withCredentials: true });
        if (response.data.status === 'success') {
          setAdminId(response.data.data.adminId);
        }
      } catch (error) {
        console.error('Error Getting Admin Data', error);
      }
    };
    fetchAdmin();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchPlayers = async () => {
      if (!isMounted) return;
      try {
        const response = await axios.get(`http://localhost:8080/v0/games/${gameId}/meta`, { withCredentials: true });
        if (response.data.status === 'success') {
          const allPlayers = response.data.data.players;
          const playersWithWords = allPlayers.filter((player) => player.wordsSubmitted === false);
          setPlayers(playersWithWords);
        }
      } catch (error) {
        console.error('Error Getting Teams and Players Data', error);
      }
      setTimeout(fetchPlayers, 3000);
    };

    fetchPlayers();
    return () => { isMounted = false };
  }, [gameId]);

  useEffect(() => {
    let isMounted = true;

    const fetchTeams = async () => {
      if (!isMounted) return;
      try {
        const response = await axios.get(`http://localhost:8080/v0/games/${gameId}/details`, { withCredentials: true });
        if (response.data.status === 'success') {
          setTeams(response.data.data.teams);
        }
      } catch (error) {
        console.error('Error Getting Teams and Players Data', error);
      }
      setTimeout(fetchTeams, 3000);
    };

    fetchTeams();
    return () => { isMounted = false };
  }, [gameId]);

  const handleCreateTeams = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/v0/games/${gameId}/teams`, null, { withCredentials: true });
      if (response.data && response.data.status === 'success') {
        setTeams(response.data.data.teams)
        setSuccessMessage('Teams created successfully');
        setTimeout(() => setSuccessMessage(null), 2000);
      }
    } catch (error) {
      setErrorMessage('Error creating teams. Please try again.');
      setTimeout(() => setErrorMessage(null), 2000);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const checkGameState = async () => {
      if (!isMounted) return;
      try {
        const response = await axios.get(`http://localhost:8080/v0/games/${gameId}/details`, { withCredentials: true });
        if (response.data.status === 'success' && response.data.data.state === 3) {
          navigate(`/games/${gameId}/playing`);
        }
      } catch (error) {
        console.error('Error checking game state', error);
      }
      setTimeout(checkGameState, 4000);
    };

    checkGameState();
    return () => { isMounted = false };
  }, [gameId, navigate]);

  const handleStartGame = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/v0/games/${gameId}/start`, null, { withCredentials: true });
      if (response.data && response.data.status === 'success') {
        setSuccessMessage('Game started successfully');
        setTimeout(() => setSuccessMessage(null), 2000);
      }
    } catch (error) {
      console.error('Error starting the game:', error);
      setErrorMessage('Error starting the game. Please try again.');
      setTimeout(() => setErrorMessage(null), 2000);
    }
  };

  return (
    <div>
      <section className="not-submitted">
        <h2>Players Not Submitted Phrases</h2>
        {players.length > 0 ? (
          <ul>
            {players.map((player) => (
              <li key={player.id}>{player.name}</li>
            ))}
          </ul>
        ) : (
          <p>All players have submitted phrases.</p>
        )}
      </section>

      <h1>Teams Division</h1>
      {teams && teams.length > 0 ? (
        teams.map((team, index) => (
          <div key={index}>
            <h2>Team {team.name}</h2>
            <p>Score: {team.score}</p>

            <h3>Players:</h3>
            <ul>
              {team.players.map((player) => (
                <li key={player.id}>
                  {player.name}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>Teams yet to be made. </p>
      )}

      <section className="error-message">
        {errorMessage && <p className="error">{errorMessage}</p>}
      </section>

      <section className="success-message">
        {successMessage && <p className="success">{successMessage}</p>}
      </section>

      <section className="submit-words">
        {currentPlayerId === adminId && (
          <button onClick={handleCreateTeams}>Create Teams</button>
        )}
      </section>

      <section className="start-game">
        {currentPlayerId === adminId && (
          <button onClick={handleStartGame}>Start Game</button>
        )}
      </section>
    </div>
  );
};

export default DivideTeams;

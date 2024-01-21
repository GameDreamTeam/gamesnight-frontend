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
        const response = await axios.get(`http://localhost:8080/v0/players/`, { withCredentials: true })
        if (response.data.status === 'success') {
          setCurrentPlayerId(response.data.data.id)
        }
      } catch (error) {
        console.error('Error Getting Player Data', error)
      }
    }
    fetchPlayerId()
  }, [])

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/v0/games/${gameId}/meta`, { withCredentials: true })
        if (response.data.status === 'success') {
          setAdminId(response.data.data.adminId)
        }
      } catch (error) {
        console.error('Error Getting Admin Data', error)
      }
    }
    fetchAdmin()
  }, [gameId])

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/v0/games/${gameId}/meta`, { withCredentials: true });
        if (response.data.status === 'success') {
          const allPlayers = response.data.data.players
          const playersWithWords = allPlayers.filter((player) => player.wordsSubmitted === false)
          setPlayers(playersWithWords);
        }
      } catch (error) {
        console.error('Error Getting Teams and Players Data', error);
      }
      setTimeout(fetchPlayers, 3000)
    }

    fetchPlayers()
  }, [gameId])

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/v0/games/${gameId}/details`, { withCredentials: true });
        if (response.data.status === 'success') {
          setTeams(response.data.data.teams)
        }
      } catch (error) {
        console.error('Error Getting Teams and Players Data', error);
      }
      setTimeout(fetchTeams, 3000);
    }
    fetchTeams()
  }, [gameId])

  useEffect(() => {
    const checkGameState = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/v0/games/${gameId}/details`, { withCredentials: true });
        if (response.data.status === 'success' && response.data.data.state === 3) {
          navigate(`/games/${gameId}/playing`);
        }
      } catch (error) {
        console.error('Error checking game state', error);
      }
      setTimeout(checkGameState, 4000);
    }

    checkGameState()
  }, [gameId, navigate])

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
  }

  const handleStartGame = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/v0/games/${gameId}/start`, null, { withCredentials: true });
      if (response.data && response.data.status === 'success') {
        setSuccessMessage('Get Ready For The Game');
        setTimeout(() => setSuccessMessage(null), 2000);
      }
    } catch (error) {
      setErrorMessage('Error starting the game. Please try again.');
      setTimeout(() => setErrorMessage(null), 2000);
    }
  };

  return (
    <>
      <div className="showPlayers">
        <section className="not-submitted">
          {players.length > 0 ? (
            <div>
              <h2>Players yet to submit phrases 😔</h2>
              <ul>
                {players.map((player) => (
                  <li key={player.id}>👤 {player.name}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p>🎉 Waiting for Admin to start the game 🎮</p>
          )}
        </section>
      </div>

      {errorMessage && <p className="message-error">⚠️ {errorMessage}</p>}
      {successMessage && <p className="message-success">✅ {successMessage}</p>}

      <div className="showTeams">
        {teams && teams.length > 0 ? (
          teams.map((team, index) => (
            <div key={index} className="team-container">
              <h2>🏆 Team {team.name}</h2>
              <h3>👥 Players:</h3>
              <ul>
                {team.players.map((player) => (
                  <li key={player.id}>👤 {player.name}</li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>🔍 Teams are being formed...</p>
        )}
      </div>

      <div className="button-container">
        <div className="createTeams">
          <section className="submit-words">
            {currentPlayerId === adminId && (
              <button onClick={handleCreateTeams}>🛠️ Create Teams</button>
            )}
          </section>
        </div>

        <div className="startGame">
          <section className="start-game">
            {currentPlayerId === adminId && (
              <button onClick={handleStartGame}>🚀 Start Game</button>
            )}
          </section>
        </div>
      </div>

    </>

  )
}

export default DivideTeams;

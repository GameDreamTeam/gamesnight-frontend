import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './DivideTeams.css';

const DivideTeams = () => {
  const [teams, setTeams] = useState([]);
  const { gameId } = useParams();
  const [currentPlayerId, setCurrentPlayerId] = useState(null);
  const [adminId, setAdminId] = useState(null);
  const [players, setPlayers] = useState([]);

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
  },[]); 

  useEffect(() => {
    const fetchPlayers = async () => {
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
    }

    fetchPlayers();
  },[]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/v0/games/${gameId}/details`, { withCredentials: true });
        if (response.data.status === 'success') {
          setTeams(response.data.data.teams);
        }
      } catch (error) {
        console.error('Error Getting Teams and Players Data', error);
      }
      setTimeout(fetchTeams, 3000);
    }

    fetchTeams();
  },[]);

  const handleCreateTeams = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/v0/games/${gameId}/teams`, null, { withCredentials: true });
      if (response.data && response.data.status === 'success') {
        setTeams(response.data.data.teams)
      }
    } catch (error) {
      console.error('Error creating teams:', error);
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

      <section className="submit-words">
      {currentPlayerId === adminId && (
          <button onClick={handleCreateTeams}>Create Teams</button>
        )}
      </section>
    </div>
  );
};

export default DivideTeams;

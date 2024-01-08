import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './DivideTeams.css'; 

const DivideTeams = () => {
  const [teams, setTeams] = useState(null);
  const { gameId } = useParams();
  const [currentPlayerId, setCurrentPlayerId] = useState(null);
  const [adminId, setAdminId] = useState(null); 

  const fetchPlayerData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/v0/players/`, { withCredentials: true });
      if (response.data.status === 'success') {
        setCurrentPlayerId(response.data.data.id);
      }
    } catch (error) {
      console.error('Error Getting Player Data', error);
    }
  };
  fetchPlayerData();

  const fetchAdmin = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/v0/games/${gameId}/meta`, { withCredentials: true });
      if (response.data.status === 'success') {
        setAdminId(response.data.data.adminId);
      }
    } catch (error) {
      console.error('Error Getting Game Data', error);
    }
  };
  fetchAdmin();

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/v0/games/${gameId}/details`, { withCredentials: true });
      if (response.data.status === 'success') {
        setTeams(response.data.data.teams);
      }
    } catch (error) {
      console.error('Error fetching game details:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 10000); 

    return () => clearInterval(intervalId);
  });

  const handleCreateTeams = () => {
    axios.post(`http://localhost:8080/v0/games/${gameId}/teams`, null, { withCredentials: true })
  };

  return (
    <div>
      <h1>Teams Division</h1>

      {teams !== null ? (
        teams.map((team, index) => (
          <div key={index}>
            <h2>Team {team.name}</h2>
            <p>Score: {team.score}</p>

            <h3>Players:</h3>
            <ul>
              {team.players.map(player => (
                <li key={player.id}>
                  {player.name} - Words Submitted: {player.wordsSubmitted.toString()}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>Waiting for admin to divide teams</p>
      )}

      <section className="submit-words">
      {currentPlayerId === adminId && (
          <button onClick={handleCreateTeams}>Randomize Teams</button>
        )}
      </section> 
    </div>
  );
};

export default DivideTeams;

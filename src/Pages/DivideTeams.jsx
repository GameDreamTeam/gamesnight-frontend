import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './DivideTeams.css'; // Ensure this CSS file is correctly linked

const DivideTeams = () => {
  const [teams, setTeams] = useState(null);
  const { gameId } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:8080/v0/games/${gameId}`, { withCredentials: true })
      .then(response => {
        setTeams(response.data.data.teams);
      })
      .catch(error => {
        console.error('Error creating teams:', error);
      });
  }, [gameId]);

  return (
    <div className="divide-teams-wrapper">
      <h2 className="title">Teams</h2>
      <div className="teams-container">
        {teams ? teams.map((team, index) => (
          <div key={index} className="team">
            <h3 className="team-name">{`${team.name} Team`}</h3>
            <ul className="player-list">
              {team.players.map(player => (
                <li key={player.id} className="player">{player.name}</li>
              ))}
            </ul>
          </div>
        )) : <p>Loading teams...</p>}
      </div>
    </div>
  );
};

export default DivideTeams;

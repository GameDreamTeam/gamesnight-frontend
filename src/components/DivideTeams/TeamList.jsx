import React from 'react';

const TeamList = ({ teams }) => (
  <div className="showTeams">
    {teams && teams.length > 0 ? (
      teams.map((team, index) => (
        <div
          key={index}
          className="team-container"
          style={{
            backgroundColor: team.name.toLowerCase() === 'red' ? 'red' : team.name.toLowerCase() === 'blue' ? 'blue' : 'white',
            color: 'white'
          }}
        >
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
);

export default TeamList;

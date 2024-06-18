import React from 'react';

const PlayerList = ({ players }) => (
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
        <p>👨‍🍳Let the admin cook</p>
      )}
    </section>
  </div>
);

export default PlayerList;

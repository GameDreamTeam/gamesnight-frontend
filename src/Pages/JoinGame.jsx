import React, { useState } from 'react';
import axios from 'axios';
import './JoinGame.css'; // Import the updated CSS file

const JoinGame = () => {
  const [gameId, setGameId] = useState('');
  const [username, setUsername] = useState('');
  const [phrases, setPhrases] = useState(['', '', '', '']);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [stage, setStage] = useState(0);

  const joinGame = () => {
    if (stage === 0) {
      axios.post(`http://localhost:8080/v0/${gameId}/join`, { username }, { withCredentials: true })
        .then(response => {
          console.log(response);
          setStage(1);
          setMessage('Joined game successfully.');
          setIsError(false);
        })
        .catch(error => {
          setMessage('Failed to join game. ' + (error.response?.data.error || error.message));
          setIsError(true);
        });
    } else {
      if (phrases.some(phrase => !phrase.trim())) {
        setMessage('Please enter all four phrases.');
        setIsError(true);
        return;
      }

      axios.post(`http://localhost:8080/v0/game/${gameId}/submit`, { phraseList: phrases }, { withCredentials: true })
        .then(response => {
          setMessage('Phrases submitted successfully.');
          setIsError(false);
        })
        .catch(error => {
          setMessage('Failed to submit phrases. ' + (error.response?.data.error || error.message));
          setIsError(true);
        });
    }
  };

  return (
    <div className="join-game-container">
      <h1>Join Game</h1>

      {gameId && (
        <div className="game-id-display">
          <p>Game ID: {gameId}</p>
        </div>
      )}

      <div className="input-group">
        {stage === 0 && (
          <>
            <input type="text" value={gameId} onChange={(e) => setGameId(e.target.value)} placeholder="Enter Game ID" />
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter Username" />
          </>
        )}

        {stage === 1 && phrases.map((phrase, index) => (
          <input key={index} type="text" value={phrase} onChange={(e) => {
            const newPhrases = [...phrases];
            newPhrases[index] = e.target.value;
            setPhrases(newPhrases);
          }} placeholder={`Phrase ${index + 1}`} />
        ))}

        <button onClick={joinGame}>{stage === 0 ? 'Join' : 'Submit Phrases'}</button>
      </div>

      {message && <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`}>{message}</div>}
    </div>
  );
};

export default JoinGame;
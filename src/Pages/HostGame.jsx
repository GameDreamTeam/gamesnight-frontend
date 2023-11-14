import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HostGame.css'; // Import the updated CSS file

const HostGame = () => {
  const [gameId, setGameId] = useState('');
  const [username, setUsername] = useState('');
  const [phrases, setPhrases] = useState(['', '', '', '']);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [teams, setTeams] = useState(null);
  const [stage, setStage] = useState(0);
  const [wordsSubmitted, setWordsSubmitted] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8080/v0/create-game', { withCredentials: true })
      .then(response => {
        setGameId(response.data.data.gameId);
        console.log(response);
      })
      .catch(error => {
        console.error('Error creating game:', error);
        setMessage('Error creating game. Please try again.');
        setIsError(true);
      });
  }, []);

  const handleUsernameSubmit = () => {
    axios.post(`http://localhost:8080/v0/${gameId}/join`, { username }, { withCredentials: true })
      .then(response => {
        console.log(response);
        setStage(1);
        setMessage('Username submitted successfully.');
        setIsError(false);
      })
      .catch(error => {
        console.error('Error joining game:', error);
        setMessage('Error joining game. Please try again.');
        setIsError(true);
      });
  };

  const handlePhraseChange = (index, value) => {
    const newPhrases = [...phrases];
    newPhrases[index] = value;
    setPhrases(newPhrases);
  };

  const submitPhrases = () => {
    if (phrases.some(phrase => !phrase.trim())) {
      setMessage('Please enter all four phrases.');
      setIsError(true);
      return;
    }

    const phrasesToSubmit = {
      phraseList: phrases.map(input => ({ input })),
    };

    axios.post(`http://localhost:8080/v0/game/${gameId}/submit`, phrasesToSubmit, { withCredentials: true })
      .then(response => {
        setMessage('Phrases submitted successfully.');
        setIsError(false);
        setWordsSubmitted(true);
      })
      .catch(error => {
        setMessage('Failed to submit phrases. ' + (error.response?.data.error || error.message));
        setIsError(true);
      });
  };

  const nextStage = () => {
    setMessage('');
    setIsError(false);
    setStage(2);
  };

  const createTeams = () => {
    axios.get(`http://localhost:8080/v0/game/${gameId}/divide-teams`, { withCredentials: true })
      .then(response => {
        setTeams(response.data.data.teams);
        console.log(response.data);
        setStage(3); // Move to the next stage after dividing teams
      })
      .catch(error => {
        console.error('Error creating teams:', error);
        setMessage('Error creating teams. Please try again.');
        setIsError(true);
      });
  };

  return (
    <div className="host-game-container">
      <div className="top-right-corner">
        <p>Username: {username}</p>
        <p>Game ID: {gameId}</p>
      </div>

      {message && (
        <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`}>
          {message}
        </div>
      )}

      {stage === 0 && (
        <div>
          <h2>Enter Your Username</h2>
          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Username"
            />
            <button onClick={handleUsernameSubmit}>Submit</button>
          </div>
        </div>
      )}

      {stage === 1 && (
        <div>
          <h2>Submit 4 Phrases</h2>
          <div className="phrase-inputs">
            {phrases.map((phrase, index) => (
              <input
                key={index}
                type="text"
                value={phrase}
                onChange={(e) => handlePhraseChange(index, e.target.value)}
                placeholder={`Phrase ${index + 1}`}
              />
            ))}
          </div>
          <button onClick={submitPhrases}>Submit</button>
          {wordsSubmitted && <button onClick={nextStage}>Next</button>}
        </div>
      )}

      {stage === 2 && (
        <div>
          <h2>Teams</h2>
          <button onClick={createTeams}>Divide Teams</button>
        </div>
      )}

      {stage === 3 && teams && (
        <div>
          <h2>Teams</h2>
          <div className="teams-container">
            {teams.map((team, index) => (
              <div key={index} className={`team ${team.name.toLowerCase()}-team`}>
                <p>{`${team.name} Team`}</p>
                {team.players.map(player => (
                  <p key={player.id}>{player.name}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HostGame;

import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PlayerList from './PlayerList';
import TeamList from './TeamList';
import './DivideTeams.css';
import { useFetchPlayerId, useFetchAdminId, useCheckGamePlaying, useFetchPlayers, useFetchTeams} from '../../hooks';
import { API_BASE_URL } from '../../constants/api';

const DivideTeams = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { gameId } = useParams();
  const currentPlayerId = useFetchPlayerId();
  const adminId = useFetchAdminId(gameId);
  const players = useFetchPlayers(gameId);
  var [teams,setTeams]=useState(null); 
  teams=useFetchTeams(gameId)
  useCheckGamePlaying(gameId);

  const handleCreateTeams = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/v0/games/${gameId}/teams`, null, { withCredentials: true });
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
      const response = await axios.post(`${API_BASE_URL}/v0/games/${gameId}/start`, null, { withCredentials: true });
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
      <PlayerList players={players} />

      {errorMessage && <p className="message-error">⚠️ {errorMessage}</p>}
      {successMessage && <p className="message-success">✅ {successMessage}</p>}

      <TeamList teams={teams}/>
      {adminId.adminId==currentPlayerId.currentPlayerId && <div className="button-container">
        { (
          <>
            <div className="createTeams">
              <button onClick={handleCreateTeams}>🛠️ Create Teams</button>
            </div>
            <div className="startGame">
              <button onClick={handleStartGame}>🚀 Start Game</button>
            </div>
          </>
        )}
      </div>}
    </>

  )
}

export default DivideTeams;

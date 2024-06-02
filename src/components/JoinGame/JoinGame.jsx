import { useParams} from 'react-router-dom'
import React, { useState} from 'react'
import './JoinGame.css'
import ShareLink from './ShareLink';
import SubmitWords from './SubmitWords';
import { useCheckGameState, useFetchLobbyPlayers, useFetchPlayerId } from '../../hooks';
import Lobby from './Lobby';

const JoinGame = () => {
  const {gameId} = useParams()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [showError, setShowError] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  
  const {currentPlayerId} = useFetchPlayerId();
  const { players, adminId } = useFetchLobbyPlayers(gameId);
  useCheckGameState(gameId);

  return (
    <>
      <div>
        <header className="game-header">
          <h1>🎲 Welcome to the Game: {gameId} 🎮</h1>
        </header>
      </div>

      <ShareLink gameId={gameId}/>

      {showMessage && <div className="message-success">✨ {message}</div>}
      {showError && <div className="message-error">⚠️ {error}</div>}

      <Lobby currentPlayerId={currentPlayerId} adminId={adminId} gameId={gameId} players={players} setError={setError} setShowError={setShowError} setMessage={setMessage} setShowMessage={setShowMessage}/>

      <SubmitWords isAdmin={currentPlayerId===adminId} gameId={gameId} setError={setError} setShowError={setShowError}/>

    </>
  )
}

export default JoinGame

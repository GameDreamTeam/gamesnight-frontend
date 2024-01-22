import { useParams, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './JoinGame.css'
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const JoinGame = () => {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const [name, setUsername] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [players, setPlayers] = useState([])
  const [showMessage, setShowMessage] = useState(false)
  const [showError, setShowError] = useState(false)
  const [adminId, setAdminId] = useState(null)
  const [currentPlayerId, setCurrentPlayerId] = useState(null)
  const [copied, setCopied] = useState(false);
  const gameLink = `http://localhost:3000/games/${gameId}`

  useEffect(() => {
    let isCancelled = false;
    const fetchPlayerId = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/v0/players/`,
          { withCredentials: true }
        )
        if (!isCancelled) {
          setCurrentPlayerId(response.data.data.id)
        }
      }
      catch (error) {
        if (error.response) {
          console.error("Backend throwed error:", error.response.data)
          setError(error.response.data.error)
        }
        else if (error.request) {
          console.error("No response from the server:", error.request)
          setError('Server is down or not reachable')
        }
        else {
          console.error("Error:", error.message)
          setError('Error in making the request')
        }
      }
    }

    fetchPlayerId()
    return () => {
      isCancelled = true;
    };
  }, [])

  useEffect(() => {
    let isCancelled = false
    const fetchLobbyPlayers = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/v0/games/${gameId}/meta`,
          { withCredentials: true }
        )

        if (!isCancelled) {
          setPlayers(response.data.data.players)
          setAdminId(response.data.data.adminId)
        }
      }
      catch (error) {
        if (error.response) {
          console.error("Backend throwed error:", error.response.data)
          setError(error.response.data.error)
          navigate("/game-not-found")
          window.location.reload()
        }
        else if (error.request) {
          console.error("No response from the server:", error.request)
          setError('Server is down or not reachable')
        }
        else {
          console.error("Error:", error.message)
          setError('Error in making the request')
        }
      }
      setTimeout(fetchLobbyPlayers, 4000);
    }

    fetchLobbyPlayers()
    const intervalId = setInterval(fetchLobbyPlayers, 4000);
    return () => {
      isCancelled = true;
      clearInterval(intervalId);
    };
  }, [gameId, navigate])

  useEffect(() => {
    let isCancelled = false
    const checkGameState = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/v0/games/${gameId}/details`,
          { withCredentials: true }
        )
        if (!isCancelled && response.data.data.state === 1) {
          navigate(`/games/${gameId}/submit`)
        }
      }
      catch (error) {
        if (error.response) {
          console.error("Backend throwed error:", error.response.data)
          setError(error.response.data.error)
          navigate("/game-not-found")
          window.location.reload()
        }
        else if (error.request) {
          console.error("No response from the server:", error.request)
          setError('Server is down or not reachable')
        }
        else {
          console.error("Error:", error.message)
          setError('Error in making the request')
        }
      }
      setTimeout(checkGameState, 4000)
    }

    checkGameState()
    const intervalId = setInterval(checkGameState, 4000);
    return () => {
      isCancelled = true;
      clearInterval(intervalId);
    };
  }, [gameId, navigate])

  const handleJoinGame = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        `${API_BASE_URL}/v0/games/${gameId}/join`,
        { name },
        { withCredentials: true }
      )
      setMessage("Game Joined Successfully")
      setPlayers(response.data.data.players)
      setShowMessage(true)
      
      setTimeout(() => {
        window.location.reload()
        setShowMessage(false)
        setMessage('')
      }, 2000)
    }
    catch (error) {
      setError(error.response?.data?.error)
      setShowError(true)

      setTimeout(() => {
        setShowError(false)
        setError('')
      }, 2000)
    }
  }

  const handleDeletePlayer = (playerId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this player?")
    if (isConfirmed) {
      deletePlayer(playerId)
    }
  }

  const deletePlayer = async (playerId) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/v0/games/${gameId}/players/${playerId}`,
        { withCredentials: true }
      )
      setMessage("Player removed Successfully")
      setShowMessage(true)

      setTimeout(() => {
        setShowMessage(false)
        setMessage('')
      }, 1500)

    } catch (error) {
      setError(error.response?.data?.error)
      setShowError(true)

      setTimeout(() => {
        setShowError(false)
        setError('')
      }, 1500)
    }
  }

  const handleGoToAddPhrases = async (e) => {
    e.preventDefault()
    try {
      await axios.patch(
        `${API_BASE_URL}/v0/games/${gameId}/update-state`,
        null,
        { withCredentials: true }
      )
      navigate(`/games/${gameId}/submit`)
    }
    catch (e) {
      setError("Not enough players to start the game")
      setShowError(true)

      setTimeout(() => {
        setShowError(false)
        setError('')
      }, 1500)
    }
  }

  return (
    <>
      <div>
        <header className="game-header">
          <h1>🎲 Welcome to the Game: {gameId} 🎮</h1>
        </header>
      </div>

      <div>
        <section className="share-link">
          <p>🔗 Share this link for others to join:</p>

          <div className="link-container">
            <input type="text" value={gameLink} readOnly />
            <button onClick={() => {
              navigator.clipboard.writeText(gameLink)
              setCopied(true)
              setTimeout(() => setCopied(false), 3000)
            }}>
              {copied ? '✅ Copied!' : '📋 Copy Link'}
            </button>
          </div>

          <p>Or the Code: {gameId}</p>

        </section>
      </div>

      {showMessage && <div className="message-success">✨ {message}</div>}
      {showError && <div className="message-error">⚠️ {error}</div>}

      <div className="join-game">
        <h2>👥 Lobby</h2>
        <form onSubmit={handleJoinGame} className="join-form">
          <input
            type="text"
            value={name}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="📛 Enter your username"
            required
          />
          <button type="submit" className="join-game-button">➡️ Join Game</button>
        </form>
        <div className="player-list">
          {players.map((player) => (
            <div className="player-card" key={player.id}>
              <span>{player.name}</span>
              {currentPlayerId === adminId && (
                <button
                  className="delete-button"
                  onClick={() => handleDeletePlayer(player.id)}
                >
                  ❌
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="submit-word">
        {currentPlayerId === adminId && (
          <section className="submit-words">
            <button onClick={handleGoToAddPhrases} className="next-button">🚀 Everyone's Here</button>
          </section>
        )}
      </div>


    </>
  )
}

export default JoinGame

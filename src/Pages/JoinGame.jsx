import { useParams, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './JoinGame.css'

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
    const fetchPlayerId = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/v0/players/`, { withCredentials: true })
        if (response.data.status === 'success') {
          setCurrentPlayerId(response.data.data.id)
        }
      } 
      catch (error) {
        setError("Middleware issue in generating new player cookie")
      }
    }

    fetchPlayerId()
  }, [currentPlayerId])

  useEffect(() => {
    const fetchLobbyPlayers = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/v0/games/${gameId}/meta`, { withCredentials: true })
        if (response.data.status === 'success') {
          setPlayers(response.data.data.players)
          setAdminId(response.data.data.adminId)
        }
      } catch (error) {
        navigate("/home")
      }

      setTimeout(fetchLobbyPlayers, 4000);

    }

    fetchLobbyPlayers()
  }, [])


  const handleJoinGame = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`http://localhost:8080/v0/games/${gameId}/join`, { name }, { withCredentials: true })
      setMessage("Game Joined Successfully")
      setPlayers(response.data.data.players)
      setShowMessage(true)

      setTimeout(() => {
        setShowMessage(false)
        setMessage('')
      }, 1500)
    }
    catch (error) {
      setError("You have already joined the game")
      setShowError(true)

      setTimeout(() => {
        setShowError(false)
        setError('')
      }, 1500)
    }
  }

  const handleDeletePlayer = async (playerId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this player?")
    if (isConfirmed) {
      deletePlayer(playerId)
    }
  }

  const deletePlayer = async (playerId) => {
    try {
      await axios.delete(`http://localhost:8080/v0/games/${gameId}/players/${playerId}`, { withCredentials: true })
      setMessage("Player removed Successfully")
      setShowMessage(true)

      setTimeout(() => {
        setShowMessage(false)
        setMessage('')
      }, 1500)

    } catch (error) {
      setError("Host cannot be removed")
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
      const response = await axios.patch(`http://localhost:8080/v0/games/${gameId}/update-state`, null, { withCredentials: true })
      if (response.data.status === 'success') {
        navigate(`/games/${gameId}/submit`)
      }
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

  useEffect(() => {
    const checkGameState = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/v0/games/${gameId}/details`, { withCredentials: true })

        if (response.data.status === 'success' && response.data.data.state === 1) {
          navigate(`/games/${gameId}/submit`)
        }
      } catch (error) {
        console.error('Error checking game state', error)
      }
      setTimeout(checkGameState, 4000)
    }

    checkGameState()
  })

  return (
    <>
      <div>
        <header className="game-header">
          <h1>Welcome to the Game: {gameId}</h1>
        </header>
      </div>

      <div>
        <section className="share-link">
          <p>Share this link for others to join:</p>

          <div className="link-container">
            <input type="text" value={gameLink} readOnly />
            <button onClick={() => {
              navigator.clipboard.writeText(gameLink)
              setCopied(true)
              setTimeout(() => setCopied(false), 3000)
            }}>
              {copied ? 'Copied' : 'Copy Link'}
            </button>
          </div>

        </section>
      </div>


      <div>
        <section className="join-game">

          <form onSubmit={handleJoinGame} className="join-form">
            <input
              type="text"
              value={name}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
            <button type="submit" class="join-game-button">Join Game</button>
          </form>

          {showMessage && <div className="message success">{message}</div>}
          {showError && <div className="message error">{error}</div>}
        </section>
      </div>

      <div>
        <section className="lobby">
          <h2>Lobby</h2>

          <div className="player-list">
            {players.map((player) => (
              <div className="player-card" key={player.id}>
                <span>{player.name}</span>
                {currentPlayerId === adminId && (
                  <button
                    className="delete-button"
                    onClick={() => handleDeletePlayer(player.id)}
                  >
                    &#x2715;
                  </button>
                )}
              </div>
            ))}
          </div>

        </section>
      </div>

      <div class="submit-word">
        {currentPlayerId === adminId && (
          <section className="submit-words">
            <button onClick={handleGoToAddPhrases} class="next-button">Everyone's Here</button>
          </section>
        )}
      </div>

    </>
  )
}

export default JoinGame

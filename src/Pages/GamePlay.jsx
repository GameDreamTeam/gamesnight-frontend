import { useParams, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './GamePlay.css'
import people from '../assets/people-action.png';

const GamePlay = () => {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const [gameDetails, setGameDetails] = useState({})
  const [currentPlayerId, setCurrentPlayerId] = useState(null)
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [showGameOverMessage, setShowGameOverMessage] = useState(false);
  const [isTurnStarted, setIsTurnStarted] = useState(false);

  useEffect(() => {
    const fetchPlayerId = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/v0/players/`, { withCredentials: true })
        if (response.data.status === 'success') {
          setCurrentPlayerId(response.data.data.id)
        }
      } catch (error) {
        console.error('Error Getting Player Data', error)
      }
    }

    fetchPlayerId()
  }, [])

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/v0/games/${gameId}/details`, { withCredentials: true })
        if (response.data.status === 'success') {
          setGameDetails(response.data.data)
        }
      } catch (error) {
        console.error('Error fetching game details', error)
      }

      setTimeout(() => {
        fetchGameDetails()
      }, 2000)
    }

    fetchGameDetails()
  }, [gameId])

  useEffect(() => {
    const checkGameState = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/v0/games/${gameId}/details`, { withCredentials: true })

        if (response.data.data.state === 4) {
          setShowGameOverMessage(true);
          setTimeout(() => {
            navigate(`/games/${gameId}/finish`)
            window.location.reload()
          }, 3000);
        }
      } catch (error) {
        console.error('Error checking game state', error)
      }
      setTimeout(checkGameState, 4000)
    }

    checkGameState()
  }, [gameId, navigate])

  const handleStartTurn = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/v0/games/${gameId}/turns/start`, {}, { withCredentials: true });
      if (response.data.status === 'success') {
        setCurrentPhrase(response.data.data);
        setIsTurnStarted(true);
      }
    } catch (error) {
      console.error('Error starting turn', error);
    }
  };

  const handlePlayerChoice = async (choice) => {
    try {
      const response = await axios.post(`http://localhost:8080/v0/games/${gameId}/choices`, { playerChoice: choice }, { withCredentials: true });
      if (response.data.status === 'success') {
        if (response.data.data === "the game has ended") {
          setShowGameOverMessage(true);
          setTimeout(() => {
            navigate(`/games/${gameId}/finish`)
            window.location.reload()
          }, 3000);
        } else {
          setCurrentPhrase(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error submitting choice', error);
    }
  };


  const handleEndTurn = async () => {
    try {
      await axios.post(`http://localhost:8080/v0/games/${gameId}/turns/end`, {}, { withCredentials: true });
      setCurrentPhrase("")
    } catch (error) {
      console.error('Error ending choice', error);
    }
  }

  return (
    <div className="game-container">
      <h1 className="home-header">🎮 Start your turn when you see the button 🎮</h1>

      <div className="team-scores">
        {gameDetails.teams?.map((team, index) => (
          <p className="team-score" key={index}>👥 {team.name} Team Score: {team.score} 🌟</p>
        ))}
      </div>

      {showGameOverMessage && (
        <div className="game-over-message">
          <h2>🎉 The game is over, all phrases have been guessed! 🎉</h2>
        </div>
      )}

      <div className="gameplay-container">
        <div className="image-container">
          <img src={people} alt="House-Party-3" className="responsive-image" />
        </div>

        <div className="player-info-container">
          <div className="player-info">
            <h2 className="current-player">👤 Current Player: {gameDetails.currentPlayer?.name}</h2>
            <h2 className="next-player">⏭ Next Player: {gameDetails.nextPlayer?.name}</h2>
          </div>

          {gameDetails.currentPlayer?.id === currentPlayerId && !isTurnStarted && (
            <button className="start-turn-btn" onClick={handleStartTurn}>▶️ Start Turn</button>
          )}

          {currentPhrase && gameDetails.currentPlayer?.id === currentPlayerId && (
            <div className="phrase-section">
              <h3 className="current-phrase">🗨️ Current Phrase: {currentPhrase}</h3>
              <button className="guessed-btn" onClick={() => handlePlayerChoice('guessed')}>✅ Guessed</button>
              <button className="not-guessed-btn" onClick={() => handlePlayerChoice('notGuessed')}>➡️ Next Phrase</button>
              <button className="end-turn-btn" onClick={handleEndTurn}>⏹ End Turn</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GamePlay

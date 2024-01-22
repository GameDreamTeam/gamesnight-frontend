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
    <div class="game-container">
      <h1 class="home-header">Start your turn when you see the button</h1>

      <div class="team-scores">
        {gameDetails.teams?.map((team, index) => (
          <p class="team-score" key={index}>{team.name} Team Score: {team.score}</p>
        ))}
      </div>

      <div className="gameplay-container">
        <div className="image-container">
          <img src={people} alt="House-Party-3" className="responsive-image" />
        </div>

        {showGameOverMessage && (
          <div className="game-over-message">
            <h2>The game is over, all phrases have been guessed!</h2>
          </div>
        )}

        <div class="player-info-container">
          <div class="player-info">
            <h2 class="current-player">Current Player: {gameDetails.currentPlayer?.name}</h2>
            <h2 class="next-player">Next Player: {gameDetails.nextPlayer?.name}</h2>
          </div>

          {gameDetails.currentPlayer?.id === currentPlayerId && (
            <button class="start-turn-btn" onClick={handleStartTurn}>Start Turn</button>
          )}

          {currentPhrase && gameDetails.currentPlayer?.id === currentPlayerId && (
            <div class="phrase-section">
              <h3 class="current-phrase">Current Phrase: {currentPhrase}</h3>
              <button class="guessed-btn" onClick={() => handlePlayerChoice('guessed')}>Guessed</button>
              <button class="not-guessed-btn" onClick={() => handlePlayerChoice('notGuessed')}>Next Phrase</button>
              <button class="end-turn-btn" onClick={handleEndTurn}>End Turn</button>
            </div>
          )}
        </div>
      </div>
    </div>

  )
}

export default GamePlay

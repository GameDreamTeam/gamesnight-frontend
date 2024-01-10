import { useParams, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './GamePlay.css'

const GamePlay = () => {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const [gameDetails, setGameDetails] = useState({});
//   const [message, setMessage] = useState('')
//   const [error, setError] = useState('')
//   const [showMessage, setShowMessage] = useState(false)
//   const [showError, setShowError] = useState(false)
//   const [adminId, setAdminId] = useState(null) 
  const [currentPlayerId, setCurrentPlayerId] = useState(null)

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
    };

    fetchPlayerId()
  },[]) 

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/v0/games/${gameId}/details`);
        if (response.data.status === 'success') {
          setGameDetails(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching game details', error);
      }
    };

    fetchGameDetails();
  },[]);


  useEffect(() => {
    const checkGameState = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/v0/games/${gameId}/details`, { withCredentials: true })
        
        if (response.data.status === 'success' && response.data.data.state === 4) {
          navigate(`/games/${gameId}/finish`)
        }
      } catch (error) {
        console.error('Error checking game state', error)
      }
      setTimeout(checkGameState,4000)
    }

    checkGameState()
  },[])

  const handleStartTurn = () => {
    // Your logic for starting the turn
    console.log('Turn started!');
  };


  return (
    <div>
      <h1>Game Playing</h1>

      <div>
        <h2>Current Player: {gameDetails.currentPlayer?.name}</h2>
        <h2>Next Player: {gameDetails.nextPlayer?.name}</h2>
      </div>

      {gameDetails.currentPlayer?.id === currentPlayerId && (
        <button onClick={handleStartTurn}>Start Turn</button>
      )}

    </div>
  )
}

export default GamePlay

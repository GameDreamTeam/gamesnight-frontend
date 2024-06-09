import { useParams, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './GamePlay.css'
import PhraseSection from './PhraseSection';
import people from '../../assets/images/people-action.png';
import { API_BASE_URL } from '../../constants/api';
import { useFetchPlayerId, useFetchLobbyPlayers, useFetchAdminId, useCheckGameState } from '../../hooks';


const GamePlay = () => {
  const getInitialTimerValue = () => {
    const storedTimer = localStorage.getItem('timer');
    return storedTimer ? parseInt(storedTimer, 10) : 30;
  };
  const { gameId } = useParams()
  const { currentPlayerId } = useFetchPlayerId();
  const navigate = useNavigate()
  const [gameDetails, setGameDetails] = useState({})
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [showGameOverMessage, setShowGameOverMessage] = useState(false);
  const [showPhraseOverMessage, setShowPhraseOverMessage] = useState(false);
  const [isTurnStarted, setIsTurnStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(getInitialTimerValue);
  const [showTimerText, setShowTimerText] = useState(false);
  const [phraseLength, setPhraseLength] = useState(0);
  

  useEffect(() => {
    localStorage.setItem('timer', timer.toString());
  }, [timer]);

  useEffect(() => {
    let isCancelled = false;
    const fetchGameDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/v0/games/${gameId}/details`, { withCredentials: true })
        if (!isCancelled) {
          setGameDetails(response.data.data)
        }
      } catch (error) {
        console.error('Error fetching game details', error)
      }
    }

    fetchGameDetails()

    const intervalId = setInterval(fetchGameDetails, 2000)
    return () => {
      isCancelled = true;
      clearInterval(intervalId);
    };
  }, [gameId])

  useEffect(() => {
    let isCancelled = false;
    const checkGameState = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/v0/games/${gameId}/details`, { withCredentials: true })
        if (response.data.data.state === 4 && !isCancelled) {
          setShowGameOverMessage(true);
          setTimeout(() => {
            navigate(`/games/${gameId}/finish`)
            window.location.reload()
          }, 3000);
        }
      } catch (error) {
        console.error('Error checking game state', error)
      }
    }

    checkGameState()

    const intervalId = setInterval(checkGameState, 2000)
    return () => {
      isCancelled = true;
      clearInterval(intervalId);
    };
  }, [gameId, navigate])

  useEffect(() => {
    let isCancelled = false;
    const checkPhraseExists = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/v0/games/${gameId}/current-phrases`, { withCredentials: true })
        if (!isCancelled) {
          setPhraseLength(response.data.data.phraseList.length)
        }
      } catch (error) {
        setShowGameOverMessage(true);
        setTimeout(() => {
          navigate(`/games/${gameId}/finish`)
          window.location.reload()
        }, 3000);
      }
    }

    checkPhraseExists()

    const intervalId = setInterval(checkPhraseExists, 2000)
    return () => {
      isCancelled = true;
      clearInterval(intervalId);
    };
  }, [gameId, navigate])

  const handleStartTurn = async () => {
    try {
      if (!localStorage.getItem('timer')) {
        setTimer(30); 
      }
      const response = await axios.post(`${API_BASE_URL}/v0/games/${gameId}/turns/start`, {}, { withCredentials: true });
      setCurrentPhrase(response.data.data);
      setIsTurnStarted(true);
      setShowTimerText(true)
    } catch (error) {
      console.error('Error starting turn', error);
    }
  };

  const handlePlayerChoice = async (choice) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await axios.post(`${API_BASE_URL}/v0/games/${gameId}/choices`, { playerChoice: choice }, { withCredentials: true });
      setIsLoading(false);
      setCurrentPhrase(response.data.data);
    } catch (error) {
      console.log(error.response)
      if (error.response && error.response.data && error.response.data.error === 'all phrases were shown') {
        setShowPhraseOverMessage(true);
        await new Promise(resolve => setTimeout(resolve, 3000));
        setShowPhraseOverMessage(false);
      }
      handleEndTurn();
      setIsLoading(false);
    }
  };

  const handleEndTurn = async () => {
    setShowTimerText(false);
    setTimer(30)
    setIsTurnStarted(false)
    setCurrentPhrase("")

    try {
      await axios.post(`${API_BASE_URL}/v0/games/${gameId}/turns/end`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Error ending turn', error);
    }
  }

  const countdown = () => {
    setTimer((prevTime) => prevTime > 0 ? prevTime - 1 : 0);
  };

  useEffect(() => {
    let intervalId;

    if (gameDetails.currentPlayer?.id === currentPlayerId && isTurnStarted) {
      intervalId = setInterval(countdown, 800);
    }
    return () => clearInterval(intervalId);
  }, [gameDetails.currentPlayer, isTurnStarted]);

  useEffect(() => {
    if (timer === 0) {
      handleEndTurn();
    }
  }, [timer]);


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

      {showPhraseOverMessage && (
        <div className="game-over-message">
          <h2>All Phrases were Shown, ending your turn !!</h2>
        </div>
      )}

      <div className="phrase left">
        Phrases left to be guessed {phraseLength}
      </div>

      {gameDetails.currentPlayer?.id === currentPlayerId && showTimerText && (
        <div className="timer">
          Time left: {timer}
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
            <PhraseSection
              currentPhrase={currentPhrase}
              isLoading={isLoading}
              handlePlayerChoice={handlePlayerChoice}
              handleEndTurn={handleEndTurn}
            />
          )}

        </div>
      </div>
    </div>
  )
}

export default GamePlay

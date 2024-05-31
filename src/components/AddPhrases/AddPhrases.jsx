import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AddPhrases.css';
import { useParams, useNavigate } from 'react-router-dom';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const AddPhrases = () => {
  const [phrases, setPhrases] = useState(Array.from({ length: 4 }, () => ''))
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const navigate = useNavigate()
  const { gameId } = useParams()

  useEffect(() => {
    let isCancelled = false;
    const fetchPlayer = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/v0/players/`,
          { withCredentials: true }
        )
        if (!isCancelled && response.data.data.wordsSubmitted === true) {
          navigate(`/games/${gameId}/divide-teams`)
        }
      } catch (error) {
        if (error.response) {
          console.error("Backend throwed error:", error.response.data)
          setMessage(error.response.data.error)
        }
        else if (error.request) {
          console.error("No response from the server:", error.request)
          setMessage('Server is down or not reachable')
        }
        else {
          console.error("Error:", error.message)
          setMessage('Error in making the request')
        }
      }
    }
    fetchPlayer()
    return () => {
      isCancelled = true;
    };
  }, [gameId, navigate])

  const handlePhraseChange = (index, value) => {
    const updatedPhrases = phrases.map((phrase, i) => (i === index ? value : phrase))
    setPhrases(updatedPhrases)
  }

  const submitPhrases = async (event) => {
    event.preventDefault();
    try {
      const formattedPhrases = phrases.map((phrase) => ({ input: phrase }))
      axios.post(
        `${API_BASE_URL}/v0/games/${gameId}/phrases`,
        { phraseList: formattedPhrases },
        { withCredentials: true }
      )
      setMessage('Phrases submitted successfully.');
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }
    catch (error) {
      setMessage(error.response?.data.error || 'An error occurred');
      setIsError(true)
    }
  }

  return (
    <>
      <div className="add-phrases-wrapper">
        <div className="container">
          <h2 className="title">📝 Submit Your Phrases</h2>
          <form className="phrases-form" onSubmit={submitPhrases}>
            {phrases.map((phrase, index) => (
              <div key={index} className="phrase-input-group">
                <label htmlFor={`phrase-${index}`} className="input-label">
                  Phrase {index + 1} 🗨️
                </label>
                <input
                  id={`phrase-${index}`}
                  type="text"
                  className="input-field"
                  value={phrase}
                  onChange={(e) => handlePhraseChange(index, e.target.value)}
                  placeholder="Enter phrase here"
                  required
                />
              </div>
            ))}
            <button type="submit" className="submit-button">✏️ Submit Phrases</button>
          </form>
        </div>
      </div>

      <div>
        {message && (
          <div className={`submit-message ${isError ? 'error' : 'success'}`}>
            {isError ? '⚠️' : '✅'} {message}
          </div>
        )}
      </div>

    </>
  )
}

export default AddPhrases;

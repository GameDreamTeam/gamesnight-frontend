import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './AddPhrases.css';
import { API_BASE_URL } from '../../constants/api';
import PhraseInputGroup from './PhraseInputGroup';
import Message from './Message';
import { useFetchPlayerResponse } from '../../hooks';


const AddPhrases = () => {
  const [phrases, setPhrases] = useState(Array.from({ length: 4 }, () => ''))
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const navigate = useNavigate()
  const { gameId } = useParams()

  useFetchPlayerResponse(gameId, navigate, setMessage);

  const handlePhraseChange = (index, value) => {
    const updatedPhrases = phrases.map((phrase, i) => (i === index ? value : phrase))
    setPhrases(updatedPhrases)
  }

  const submitPhrases = async (event) => {
    event.preventDefault();
    try {
      const formattedPhrases = phrases.map((phrase) => ({ input: phrase }))
      await axios.post(
        `${API_BASE_URL}/v0/games/${gameId}/phrases`,
        { phraseList: formattedPhrases },
        { withCredentials: true }
      )
      setMessage('Phrases submitted successfully.');
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
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
              <PhraseInputGroup
                key={index}
                index={index}
                phrase={phrase}
                handlePhraseChange={handlePhraseChange}
              />
            ))}
            <button type="submit" className="submit-button">✏️ Submit Phrases</button>
          </form>
        </div>
      </div>

      <Message isError={isError} message={message} />
    </>
  )
}

export default AddPhrases;

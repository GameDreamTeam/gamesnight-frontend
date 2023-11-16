import React, { useState } from 'react';
import axios from 'axios';
import './AddPhrases.css';
import { useNavigate, useLocation } from 'react-router-dom';

const AddPhrases = () => {
  const [phrases, setPhrases] = useState(new Array(4).fill(''));
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { gameId } = location.state || {};

  const handlePhraseChange = (index, value) => {
    const updatedPhrases = phrases.map((phrase, i) => 
      i === index ? value : phrase
    );
    setPhrases(updatedPhrases);
  };

  const submitPhrases = async (event) => {
    event.preventDefault();

    if (phrases.some(phrase => !phrase.trim())) {
      setMessage('Please fill in all phrases.');
      setIsError(true);
      return;
    }

    try {
      const formattedPhrases = phrases.map(phrase => ({ input: phrase }));
      await axios.post(`http://localhost:8080/v0/game/${gameId}/submit`, 
                       { phraseList: formattedPhrases }, 
                       { withCredentials: true });

      setMessage('Phrases submitted successfully.');
      setIsError(false);
      navigate(`/v0/game/${gameId}/divide-teams`, { state: { gameId } });
    } catch (error) {
      console.error('Error submitting phrases:', error);
      setMessage('Error submitting phrases. Please try again.');
      setIsError(true);
    }
  };

  return (
    <div className="add-phrases-wrapper">
      <div className="container">
        <h2 className="title">Submit Your Phrases</h2>
        <form className="phrases-form" onSubmit={submitPhrases}>
          {phrases.map((phrase, index) => (
            <div key={index} className="input-wrapper">
              <label htmlFor={`phrase-${index}`} className="input-label">
                Phrase {index + 1}
              </label>
              <input
                id={`phrase-${index}`}
                type="text"
                className="input-field"
                value={phrase}
                onChange={(e) => handlePhraseChange(index, e.target.value)}
                placeholder=""
                required
              />
            </div>
          ))}
          <button type="submit" className="submit-button">Submit Phrases</button>
        </form>
        {message && (
          <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPhrases;

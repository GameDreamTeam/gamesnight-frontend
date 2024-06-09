import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FinishGame.css';
import { API_BASE_URL } from '../../constants/api';

const FinishGame = () => {
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/v1/feedback`, { text: feedback });
      alert('Feedback submitted successfully!');
      setFeedback('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoHome = () => {
    navigate('/home'); // Navigate to the home page
  };

  return (
    <div className="game-container">
      <h1 className="finish-header">🎉 Thank you for playing! 🎉</h1>
      <form onSubmit={handleSubmit} className="feedback-form">
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Please leave your feedback 😊"
          rows={4}
          className="feedback-textarea"
          required
        />
        <button type="submit" className="feedback-button" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Feedback 🚀'}
        </button>
        <button type="button" onClick={handleGoHome} className="home-button">Go Home 🏠</button>
      </form>
      {isLoading && (
        <div className="loading-screen">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}

export default FinishGame;

import React, { useState } from 'react';
import axios from 'axios';
import './FinishGame.css';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const FinishGame = () => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/v0/feedback`, { text: feedback });
      alert('Feedback submitted successfully!');
      setFeedback('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback.');
    }
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
        <button type="submit" className="feedback-button">Submit Feedback 🚀</button>
      </form>
    </div>
  );
}

export default FinishGame;

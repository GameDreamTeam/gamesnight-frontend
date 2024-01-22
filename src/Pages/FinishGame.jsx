import React, { useState } from 'react';
import axios from 'axios';
import './FinishGame.css'
const FinishGame = () => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:8080/v0/feedback', {
        text: feedback
      });
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
      <form onSubmit={handleSubmit}>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Please leave your feedback 😊"
          rows={4}
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <button type="submit" className="feedback-button">Submit Feedback 🚀</button>
      </form>
    </div>

  );
}

export default FinishGame;

import React from 'react';

const PhraseSection = ({ currentPhrase, isLoading, handlePlayerChoice, handleEndTurn }) => {
  return (
    <div className="phrase-section">
      {isLoading ? (
        <h3>Loading next phrase...</h3>
      ) : (
        <>
          <h3 className="current-phrase">🗨️ Current Phrase: {currentPhrase}</h3>
          <button className="guessed-btn" onClick={() => handlePlayerChoice('guessed')}>✅ Guessed</button>
          <button className="not-guessed-btn" onClick={() => handlePlayerChoice('notGuessed')}>➡️ Next Phrase</button>
          <button className="end-turn-btn" onClick={handleEndTurn}>⏹ End Turn</button>
        </>
      )}
    </div>
  );
};

export default PhraseSection;

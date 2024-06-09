import React from 'react';

const PhraseInputGroup = ({ index, phrase, handlePhraseChange }) => (
  <div className="phrase-input-group">
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
);

export default PhraseInputGroup;

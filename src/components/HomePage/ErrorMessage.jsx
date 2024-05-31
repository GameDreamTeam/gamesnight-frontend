import React from 'react';

const ErrorMessage = ({ error }) => {
  return <p className="error-message">⚠️ {error}</p>;
};

export default ErrorMessage;

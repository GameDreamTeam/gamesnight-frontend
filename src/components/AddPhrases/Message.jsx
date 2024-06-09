import React from 'react';

const Message = ({ message, isError }) => {
  return (
    message && (
      <div className={`submit-message ${isError ? 'error' : 'success'}`}>
        {isError ? '⚠️' : '✅'} {message}
      </div>
    )
  );
};

export default Message;

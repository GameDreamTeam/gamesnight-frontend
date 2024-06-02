import React, { useState } from 'react';

const ShareLink = ({gameId }) => {
  const [copied, setCopied] = useState(false);
  const gameLink = window.location.href

  const handleCopyLink = () => {
    navigator.clipboard.writeText(gameLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section className="share-link">
      <p>🔗 Share this link for others to join:</p>
      <div className="link-container">
        <input type="text" value={gameLink} readOnly />
        <button onClick={handleCopyLink}>
          {copied ? '✅ Copied!' : '📋 Copy Link'}
        </button>
      </div>
      <p>Or the Code: {gameId}</p>
    </section>
  );
};

export default ShareLink;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import HostOptions from './HostOptions';
import PlayerOptions from './PlayerOptions';
import ErrorMessage from './ErrorMessage';
import ImageContainer from './ImageContainer';

const HomePage = () => {
  const [showPlayerOptions, setShowPlayerOptions] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  return (
    <>
      <header className="home-header">
        <h1>🎭 Welcome to the Charades Game! 🎉</h1>
      </header>
      <p className="option">Choose to join as a host or a player</p>
      {!showPlayerOptions ? (
        <HostOptions
          setError={setError}
          navigate={navigate}
          setShowPlayerOptions={setShowPlayerOptions}
        />
      ) : (
        <PlayerOptions setError={setError} navigate={navigate} setShowPlayerOptions={setShowPlayerOptions} />
      )}
      {error && <ErrorMessage error={error} />}
      <ImageContainer />
    </>
  );
};

export default HomePage;

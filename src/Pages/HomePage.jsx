import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const Button = ({ path, label, className }) => (
  <Link to={path} className={`button ${className}`} aria-label={label}>
    {label}
  </Link>
);

const HomePage = () => (
  <div className="home-container">
    <header>
      <h1>Welcome to the Fishbowl Game!</h1>
    </header>
    <p>Choose to join as a host or a player.</p>
    <nav className="buttons-container">
      <Button path="/v0/create-game" label="Join as Host" className="host-button" />
      <Button path="/v0/:gameId/join" label="Join as Player" className="player-button" />
    </nav>
  </div>
);

export default HomePage;

import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Import the CSS file

const HomePage = () => (
  <div className="home-container">
    <h1>Welcome to the Fishbowl Game!</h1>
    <p>Choose to join as a host or a player.</p>
    <div className="buttons-container">
      <Link to="/host" className="button host-button">Join as Host</Link>
      <Link to="/join" className="button player-button">Join as Player</Link>
    </div>
  </div>
);

export default HomePage;

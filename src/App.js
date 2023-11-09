import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import HostGame from './Pages/HostGame';
import JoinGame from './Pages/JoinGame';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/host" element={<HostGame />} />
      <Route path="/join" element={<JoinGame />} />
    </Routes>
  </Router>
);

export default App;

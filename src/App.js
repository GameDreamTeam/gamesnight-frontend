import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import JoinGame from './Pages/JoinGame';
import AddPhrases from './Pages/AddPhrases';
import DivideTeams from './Pages/DivideTeams';
const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/game/:gameId/join" element={<JoinGame />} />
      <Route path="/game/:gameId/submit" element={<AddPhrases/>} />
      <Route path="/game/:gameId/divide-teams" element={<DivideTeams/>} /> 
    </Routes>
  </Router>
);

export default App;

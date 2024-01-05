import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import JoinGame from './Pages/JoinGame';
import AddPhrases from './Pages/AddPhrases';
import DivideTeams from './Pages/DivideTeams';
const App = () => (
  <Router>
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/games/:gameId" element={<JoinGame />} />
      <Route path="/games/:gameId/submit" element={<AddPhrases/>} />
      <Route path="/games/:gameId/divide-teams" element={<DivideTeams/>} /> 
    </Routes>
  </Router>
);

export default App;

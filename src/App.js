import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import JoinGame from './Pages/JoinGame';
import AddPhrases from './Pages/AddPhrases';
import DivideTeams from './Pages/DivideTeams';
import GamePlay from './Pages/GamePlay';
const App = () => (
  <Router>
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/games/:gameId" element={<JoinGame />} />
      <Route path="/games/:gameId/submit" element={<AddPhrases/>} />
      <Route path="/games/:gameId/divide-teams" element={<DivideTeams/>} /> 
      <Route path="/games/:gameId/playing" element={<GamePlay/>} /> 
      
    </Routes>
  </Router>
);

export default App;

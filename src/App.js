import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import HostGame from './Pages/HostGame';
import JoinGame from './Pages/JoinGame';
import AddPhrases from './Pages/AddPhrases';
import DivideTeams from './Pages/DivideTeams';
const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/v0/create-game" element={<HostGame />} />
      <Route path="/v0/:gameId/join" element={<JoinGame />} />
      <Route path="/v0/game/:gameId/submit" element={<AddPhrases/>} />
      <Route path="/v0/game/:gameId/divide-teams" element={<DivideTeams/>} />
    </Routes>
  </Router>
);

export default App;

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const HomePage = lazy(() => import('./components/HomePage/HomePage'));
const JoinGame = lazy(() => import('./components/JoinGame/JoinGame'));
const AddPhrases = lazy(() => import('./components/AddPhrases/AddPhrases'));
const DivideTeams = lazy(() => import('./components/DivideTeams/DivideTeams'));
const GamePlay = lazy(() => import('./components/GamePlay/GamePlay'));
const FinishGame = lazy(() => import('./components/FinishGame/FinishGame'));
const NotFoundPage = lazy(()=> import('./components/NotFound/NotFoundPage'))

const Loading = () => <div>Loading...</div>;

const App = () => (
  <Router>
    <Suspense fallback={<Loading/>}>
      <Routes>
        <Route path="/home" element={<HomePage/>} />
        <Route path="/games/:gameId" element={<JoinGame/>} />
        <Route path="/games/:gameId/submit" element={<AddPhrases/>} />
        <Route path="/games/:gameId/divide-teams" element={<DivideTeams/>} />
        <Route path="/games/:gameId/playing" element={<GamePlay/>} />
        <Route path="/games/:gameId/finish" element={<FinishGame/>} />
        <Route path="*" element={<NotFoundPage/>} />
      </Routes>
    </Suspense>
  </Router>
);

export default App;

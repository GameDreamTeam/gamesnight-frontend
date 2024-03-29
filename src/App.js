import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import NotFoundPage from './Pages/NotFoundPage'

const HomePage = lazy(() => import('./Pages/HomePage'))
const JoinGame = lazy(() => import('./Pages/JoinGame'))
const AddPhrases = lazy(() => import('./Pages/AddPhrases'))
const DivideTeams = lazy(() => import('./Pages/DivideTeams'))
const GamePlay = lazy(() => import('./Pages/GamePlay'))
const FinishGame = lazy(() => import('./Pages/FinishGame'))

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/games/:gameId" element={<JoinGame />} />
        <Route path="/games/:gameId/submit" element={<AddPhrases/>} />
        <Route path="/games/:gameId/divide-teams" element={<DivideTeams/>} />
        <Route path="/games/:gameId/playing" element={<GamePlay/>} />
        <Route path="/games/:gameId/finish" element={<FinishGame/>} />
        <Route path="*" element={<NotFoundPage />} /> 
      </Routes>
    </Suspense>
  </Router>
)

export default App

import React, { createContext, useContext } from 'react';
import { useFetchPlayerId, useFetchLobbyPlayers, useFetchAdminId, useCheckGameState } from '../../hooks';

const GameContext = createContext();

export const GameProvider = ({ gameId, children }) => {
  const { currentPlayerId } = useFetchPlayerId();
  const { players } = useFetchLobbyPlayers(gameId);
  const { adminId } = useFetchAdminId(gameId);
  useCheckGameState(gameId);

  const value = {
    gameId,
    currentPlayerId,
    players,
    adminId,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGameContext = () => useContext(GameContext);

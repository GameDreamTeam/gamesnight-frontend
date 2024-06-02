import {useState,React} from "react";
import axios from "axios";
import { API_BASE_URL } from "../../constants/api";

const Lobby = ({currentPlayerId, adminId, gameId, players, setError, setShowError, setMessage, setShowMessage}) => {
  const [name, setUsername] = useState("");

  const handleJoinGame = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_BASE_URL}/v0/games/${gameId}/join`,
        { name },
        { withCredentials: true }
      );
      setMessage("Game Joined Successfully");
      setShowMessage(true);

      setTimeout(() => {
        window.location.reload();
        setShowMessage(false);
        setMessage("");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error);
      setShowError(true);

      setTimeout(() => {
        setShowError(false);
        setError("");
      }, 2000);
    }
  };

  const handleDeletePlayer = (playerId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this player?"
    );
    if (isConfirmed) {
      deletePlayer(playerId);
    }
  };

  const deletePlayer = async (playerId) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/v0/games/${gameId}/players/${playerId}`,
        { withCredentials: true }
      );
      setMessage("Player removed Successfully");
      setShowMessage(true);

      setTimeout(() => {
        setShowMessage(false);
        setMessage("");
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.error);
      setShowError(true);

      setTimeout(() => {
        setShowError(false);
        setError("");
      }, 1500);
    }
  };

  return (
    <div className="join-game">
      <h2>👥 Lobby</h2>
      <form onSubmit={handleJoinGame} className="join-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="📛 Enter your username"
          required
        />
        <button type="submit" className="join-game-button">
          ➡️ Join Game
        </button>
      </form>
      <div className="player-list">
        {players.map((player) => (
          <div className="player-card" key={player.id}>
            <span>{player.name}</span>
            {currentPlayerId === adminId && (
              <button
                className="delete-button"
                onClick={() => handleDeletePlayer(player.id)}
              >
                x
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lobby;

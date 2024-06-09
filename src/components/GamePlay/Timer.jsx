import React, { useEffect } from 'react';

const Timer = ({ timer, setTimer, handleEndTurn }) => {
  useEffect(() => {
    if (timer === 0) {
      handleEndTurn();
    }
  }, [timer, handleEndTurn]);

  useEffect(() => {
    const countdown = () => {
      setTimer((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    };

    const intervalId = setInterval(countdown, 1000);

    return () => clearInterval(intervalId);
  }, [setTimer]);

  return <div className="timer">Time left: {timer}</div>;
};

export default Timer;

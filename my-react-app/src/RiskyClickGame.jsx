import React, { useEffect, useState } from "react";
import "./RiskyClickGame.css";

const GRID_SIZE = 36;
const SAFE_CLICKS_REQUIRED = 5;
const BASE_TIME = 18;
const MIN_TIME = 6;

function RiskyClickGame() {
  const [bombs, setBombs] = useState([]);
  const [clickedTiles, setClickedTiles] = useState([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(BASE_TIME);

  // 💣 Bombs increase every round (max 24)
  const getBombCount = (currentRound) => {
    const bombs = 5 + (currentRound - 1);
    return bombs >= 24 ? 24 : bombs;
  };

  // ⏱ Timer decreases every round (min 6 sec)
  const getRoundTime = (currentRound) => {
    const time = BASE_TIME - (currentRound - 1);
    return time <= MIN_TIME ? MIN_TIME : time;
  };

  const generateBombs = (currentRound) => {
    let bombPositions = [];
    const bombCount = getBombCount(currentRound);

    while (bombPositions.length < bombCount) {
      const random = Math.floor(Math.random() * GRID_SIZE);
      if (!bombPositions.includes(random)) {
        bombPositions.push(random);
      }
    }

    setBombs(bombPositions);
    setClickedTiles([]);
    setTimeLeft(getRoundTime(currentRound));
  };

  // First load
  useEffect(() => {
    generateBombs(1);
  }, []);

  // Timer logic
  useEffect(() => {
    if (gameOver) return;

    if (timeLeft === 0) {
      setGameOver(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameOver]);

  const handleClick = (index) => {
    if (gameOver) return;
    if (clickedTiles.includes(index)) return;

    if (bombs.includes(index)) {
      setGameOver(true);
      return;
    }

    const newClicked = [...clickedTiles, index];
    setClickedTiles(newClicked);
    setScore((prev) => prev + 10);

    if (newClicked.length === SAFE_CLICKS_REQUIRED) {
      setScore((prev) => prev + 50);
      const nextRound = round + 1;
      setRound(nextRound);
      generateBombs(nextRound);
    }
  };

  const restartGame = () => {
    setScore(0);
    setRound(1);
    setGameOver(false);
    generateBombs(1);
  };

  const getDifficulty = () => {
    const bombs = getBombCount(round);
    if (bombs <= 8) return "Easy";
    if (bombs <= 14) return "Medium";
    if (bombs <= 21) return "Insane";
    return "Impossible";
  };

  return (
    <div className="container">
      <h1>💣 Risky Click Survival</h1>
      <h2>Score: {score}</h2>
      <h3>Round: {round}</h3>
      <h3>Bombs: {getBombCount(round)}</h3>
      <h3>Time Left: {timeLeft}s</h3>
      <h3>Difficulty: {getDifficulty()}</h3>
      <h4>Safe Clicks: {clickedTiles.length}/5</h4>

      {gameOver && <h2 className="game-over">💥 GAME OVER</h2>}

      <div className="grid">
        {[...Array(GRID_SIZE)].map((_, index) => (
          <div
            key={index}
            className={`cell 
              ${clickedTiles.includes(index) ? "safe" : ""}
              ${gameOver && bombs.includes(index) ? "bomb" : ""}
            `}
            onClick={() => handleClick(index)}
          >
            {clickedTiles.includes(index)
              ? "✅"
              : gameOver && bombs.includes(index)
              ? "💣"
              : ""}
          </div>
        ))}
      </div>

      <button onClick={restartGame}>Restart</button>
    </div>
  );
}

export default RiskyClickGame;

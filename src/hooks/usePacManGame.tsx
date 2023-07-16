import { useState, useEffect } from "react";
import useGhost from "./useGhost";
import usePacMan from "./usePacman";
import { Cell, GameBoard, GameStatus } from "../components/Game/Game";
import {
  shadowBlinkyAI,
  speedyPinkyAI,
  bashfulInkyAI,
  pokeyClydeAI,
} from "../services/ghostLogics";

const usePacManGame = (
  initialPos: { y: number; x: number },
  initialRedGhostPos: { y: number; x: number },
  initialPinkGhostPos: { y: number; x: number },
  initialBlueGhostPos: { y: number; x: number },
  initialOrangeGhostPos: { y: number; x: number },
  gameBoard: GameBoard
) => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(
    GameStatus.ReadyToStart
  );

  const startGame = (warmUpTime: number = 5000) => {
    setGameStatus(GameStatus.Ready);
    setTimeout(() => {
      setGameStatus(GameStatus.InProgress);
    }, warmUpTime);
  };

  const { pacManPos, pacManDirection } = usePacMan(
    initialPos,
    gameBoard,
    gameStatus
  );

  const { ghostPos: redGhostPos } = useGhost(
    Cell.RedGhost,
    initialRedGhostPos,
    gameBoard,
    pacManPos,
    pacManDirection,
    shadowBlinkyAI,
    gameStatus
  );

  const { ghostPos: pinkGhostPos } = useGhost(
    Cell.PinkGhost,
    initialPinkGhostPos,
    gameBoard,
    pacManPos,
    pacManDirection,
    speedyPinkyAI,
    gameStatus
  );

  const { ghostPos: blueGhostPos } = useGhost(
    Cell.BlueGhost,
    initialBlueGhostPos,
    gameBoard,
    pacManPos,
    pacManDirection,
    bashfulInkyAI,
    gameStatus
  );

  const { ghostPos: orangeGhostPos } = useGhost(
    Cell.OrangeGhost,
    initialOrangeGhostPos,
    gameBoard,
    pacManPos,
    pacManDirection,
    pokeyClydeAI,
    gameStatus
  );

  const ghostPositions = [
    redGhostPos,
    pinkGhostPos,
    blueGhostPos,
    orangeGhostPos,
  ];

  useEffect(() => {
    if (gameStatus !== GameStatus.InProgress) {
      return;
    }

    if (
      ghostPositions.some(
        (ghostPos) => pacManPos.x === ghostPos.x && pacManPos.y === ghostPos.y
      )
    ) {
      setGameStatus(GameStatus.GameOver);
    } else if (!gameBoard.some((row) => row.includes(Cell.Dot))) {
      setGameStatus(GameStatus.GameClear);
    }
  }, [pacManPos, ghostPositions, gameBoard, gameStatus]);

  return { gameBoard, pacManDirection, gameStatus, startGame };
};

export default usePacManGame;

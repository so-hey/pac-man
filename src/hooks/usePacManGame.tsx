import { useState, useEffect } from "react";
import useGhost from "./useGhost";
import usePacMan from "./usePacman";
import { Cell, GameBoard, GameStatus } from "../components/Game/Game";
import {
  // shadowBlinkyAI,
  speedyPinkyAI,
  // bashfulInkyAI,
  pokeyClydeAI,
} from "../services/ghostLogics";

const usePacManGame = (
  initialGameBoard: GameBoard,
  prediction: number | null
) => {
  const originalGameBoard = initialGameBoard.map((row) => [...row]);
  const [gameBoard, setGameBoard] = useState<GameBoard>(
    originalGameBoard.map((row) => [...row])
  );

  let initialPacManPos = { x: -1, y: -1 };
  let initialRedGhostPos = { x: -1, y: -1 };
  let initialPinkGhostPos = { x: -1, y: -1 };
  let initialBlueGhostPos = { x: -1, y: -1 };
  let initialOrangeGhostPos = { x: -1, y: -1 };

  for (let y = 0; y < initialGameBoard.length; y++) {
    for (let x = 0; x < initialGameBoard[y].length; x++) {
      switch (initialGameBoard[y][x]) {
        case Cell.RedGhost:
          initialRedGhostPos = { x, y };
          break;
        case Cell.PinkGhost:
          initialPinkGhostPos = { x, y };
          break;
        case Cell.BlueGhost:
          initialBlueGhostPos = { x, y };
          break;
        case Cell.OrangeGhost:
          initialOrangeGhostPos = { x, y };
          break;
        case Cell.PacMan:
          initialPacManPos = { x, y };
          break;
      }
    }
  }

  const [gameStatus, setGameStatus] = useState<GameStatus>(
    GameStatus.ReadyToStart
  );

  const readyGame = () => {
    setGameStatus(GameStatus.ReadyToStart);
    console.log(gameStatus);
  };

  const startGame = (warmUpTime: number = 5000) => {
    setGameStatus(GameStatus.Ready);
    setGameBoard(originalGameBoard.map((row) => [...row]));
    // setRedGhostPos(initialRedGhostPos);
    setPinkGhostPos(initialPinkGhostPos);
    // setBlueGhostPos(initialBlueGhostPos);
    setOrangeGhostPos(initialOrangeGhostPos);
    setPacManPos(initialPacManPos);
    setTimeout(() => {
      setGameStatus(GameStatus.InProgress);
    }, warmUpTime);
  };

  const {
    pacManPos,
    setPacManPos,
    pacManDirection,
    handleDirectionChangeWithPrediction,
  } = usePacMan(initialPacManPos, gameBoard, gameStatus, prediction);

  // const { ghostPos: redGhostPos, setGhostPos: setRedGhostPos } = useGhost(
  //   Cell.RedGhost,
  //   initialRedGhostPos,
  //   gameBoard,
  //   pacManPos,
  //   pacManDirection,
  //   shadowBlinkyAI,
  //   gameStatus
  // );

  const { ghostPos: pinkGhostPos, setGhostPos: setPinkGhostPos } = useGhost(
    Cell.PinkGhost,
    initialPinkGhostPos,
    gameBoard,
    pacManPos,
    pacManDirection,
    speedyPinkyAI,
    gameStatus
  );

  // const { ghostPos: blueGhostPos, setGhostPos: setBlueGhostPos } = useGhost(
  //   Cell.BlueGhost,
  //   initialBlueGhostPos,
  //   gameBoard,
  //   pacManPos,
  //   pacManDirection,
  //   bashfulInkyAI,
  //   gameStatus
  // );

  const { ghostPos: orangeGhostPos, setGhostPos: setOrangeGhostPos } = useGhost(
    Cell.OrangeGhost,
    initialOrangeGhostPos,
    gameBoard,
    pacManPos,
    pacManDirection,
    pokeyClydeAI,
    gameStatus
  );

  const ghostPositions = [
    // redGhostPos,
    pinkGhostPos,
    // blueGhostPos,
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

  return {
    gameBoard,
    pacManDirection,
    handleDirectionChangeWithPrediction,
    gameStatus,
    readyGame,
    startGame,
  };
};

export default usePacManGame;

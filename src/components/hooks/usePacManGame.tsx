import { useState, useEffect, useRef } from "react";
import { Cell, GameBoard, Direction } from "../Game/Game";

const usePacManGame = (
  initialPos: { x: number; y: number },
  initialGhostPos: { x: number; y: number },
  initialGhostPos2: { x: number; y: number },
  gameBoard: GameBoard
) => {
  const [gameOver, setGameOver] = useState(false);
  const [gameClear, setGameClear] = useState(false);

  const [pacManPos, setPacManPos] = useState(initialPos);
  const [pacManDirection, setPacManDirection] = useState<Direction>(
    Direction.Right
  );
  const [ghostPos, setGhostPos] = useState(initialGhostPos);
  const [ghostPos2, setGhostPos2] = useState(initialGhostPos2);
  const [ghostDirection, setGhostDirection] = useState<Direction>(
    Direction.Right
  );

  const movingInterval = useRef<NodeJS.Timeout | null>(null);

  const handleDirectionChange = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowUp":
        setPacManDirection(Direction.Up);
        break;
      case "ArrowDown":
        setPacManDirection(Direction.Down);
        break;
      case "ArrowLeft":
        setPacManDirection(Direction.Left);
        break;
      case "ArrowRight":
        setPacManDirection(Direction.Right);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleDirectionChange);
    return () => {
      window.removeEventListener("keydown", handleDirectionChange);
    };
  }, []);

  useEffect(() => {
    if (movingInterval.current) {
      clearInterval(movingInterval.current);
    }

    movingInterval.current = setInterval(() => {
      let newPos = { ...pacManPos };

      switch (pacManDirection) {
        case Direction.Up:
          newPos.y = Math.max(newPos.y - 1, 0);
          break;
        case Direction.Down:
          newPos.y = Math.min(newPos.y + 1, gameBoard.length - 1);
          break;
        case Direction.Left:
          newPos.x = Math.max(newPos.x - 1, 0);
          break;
        case Direction.Right:
          newPos.x = Math.min(newPos.x + 1, gameBoard[0].length - 1);
          break;
      }

      if (gameBoard[newPos.y][newPos.x] !== Cell.Wall) {
        gameBoard[pacManPos.y][pacManPos.x] = Cell.Empty;
        gameBoard[newPos.y][newPos.x] = Cell.PacMan;
        setPacManPos(newPos);
      }
    }, 200);

    return () => {
      if (movingInterval.current) {
        clearInterval(movingInterval.current);
      }
    };
  }, [pacManPos, pacManDirection]);

  useEffect(() => {
    const movingGhostInterval = setInterval(() => {
      let newGhostPos = { ...ghostPos };

      const diffX = ghostPos.x - pacManPos.x;
      const diffY = ghostPos.y - pacManPos.y;
      if (Math.abs(diffX) > Math.abs(diffY)) {
        newGhostPos.x += diffX > 0 ? -1 : 1;
      } else {
        newGhostPos.y += diffY > 0 ? -1 : 1;
      }

      if (gameBoard[newGhostPos.y][newGhostPos.x] !== Cell.Wall) {
        gameBoard[ghostPos.y][ghostPos.x] = Cell.Empty;
        gameBoard[newGhostPos.y][newGhostPos.x] = Cell.Ghost;
        setGhostPos(newGhostPos);
      }
    }, 200);

    return () => {
      clearInterval(movingGhostInterval);
    };
  }, [ghostPos, pacManPos]);

  useEffect(() => {
    const movingGhostInterval = setInterval(() => {
      let newGhostPos2 = { ...ghostPos2 };

      const diffX = ghostPos2.x - pacManPos.x;
      const diffY = ghostPos2.y - pacManPos.y;
      if (Math.abs(diffX) > Math.abs(diffY)) {
        newGhostPos2.x += diffX > 0 ? -1 : 1;
      } else {
        newGhostPos2.y += diffY > 0 ? -1 : 1;
      }

      if (gameBoard[newGhostPos2.y][newGhostPos2.x] !== Cell.Wall) {
        gameBoard[ghostPos2.y][ghostPos2.x] = Cell.Empty;
        gameBoard[newGhostPos2.y][newGhostPos2.x] = Cell.Ghost;
        setGhostPos2(newGhostPos2);
      }
    }, 200);

    return () => {
      clearInterval(movingGhostInterval);
    };
  }, [ghostPos2, pacManPos]);

  useEffect(() => {
    if (pacManPos.x === ghostPos.x && pacManPos.y === ghostPos.y) {
      setGameOver(true);
      if (movingInterval.current) {
        clearInterval(movingInterval.current);
      }
    }

    if (!gameBoard.some((row) => row.includes(Cell.Dot))) {
      setGameClear(true);
      if (movingInterval.current) {
        clearInterval(movingInterval.current);
      }
    }
  }, [pacManPos, ghostPos, gameBoard]);

  useEffect(() => {
    if (gameOver || gameClear) {
      if (movingInterval.current) {
        clearInterval(movingInterval.current);
      }
    }
  }, [gameOver, gameClear]);

  return { gameBoard, pacManPos, pacManDirection, gameOver, gameClear };
};

export default usePacManGame;

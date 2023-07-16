import { useEffect, useState } from "react";
import {
  Cell,
  Direction,
  GameBoard,
  GameStatus,
} from "../components/Game/Game";

const useGhost = (
  self: Cell,
  initialPos: { y: number; x: number },
  gameBoard: GameBoard,
  pacManPos: { y: number; x: number },
  pacManDirection: Direction,
  ghostAI: (
    ghostPos: { y: number; x: number },
    gameBoard: GameBoard,
    pacManPos: { y: number; x: number },
    pacManDirection: Direction
  ) => { y: number; x: number },
  gameStatus: GameStatus
) => {
  const [ghostPos, setGhostPos] = useState(initialPos);

  // Temporarily save the state of the cell underfoot to avoid overriding Dot
  const [foot, setFoot] = useState(Cell.Empty);

  useEffect(() => {
    let movingGhostInterval: NodeJS.Timeout;

    if (gameStatus !== GameStatus.InProgress) {
      return;
    }

    movingGhostInterval = setInterval(() => {
      let newGhostPos = ghostAI(
        ghostPos,
        gameBoard,
        pacManPos,
        pacManDirection
      );
      if (
        0 <= newGhostPos.y &&
        newGhostPos.y < gameBoard.length &&
        0 <= newGhostPos.x &&
        newGhostPos.x < gameBoard[0].length &&
        gameBoard[newGhostPos.y][newGhostPos.x] !== Cell.Wall
      ) {
        setGhostPos(newGhostPos);
        gameBoard[ghostPos.y][ghostPos.x] = foot;

        // If the cell underfoot is Dot, restore it
        if (
          gameBoard[newGhostPos.y][newGhostPos.x] === Cell.Dot ||
          gameBoard[newGhostPos.y][newGhostPos.x] === Cell.Empty
        ) {
          setFoot(gameBoard[newGhostPos.y][newGhostPos.x]);
        }

        gameBoard[newGhostPos.y][newGhostPos.x] = self;
      }
    }, 200);

    return () => {
      clearInterval(movingGhostInterval);
    };

    // ghostAI dose not need to be in the dependency array, it includes to resolve eslint errors
  }, [ghostPos, pacManPos, gameBoard, ghostAI, foot, gameStatus]);

  return { ghostPos };
};

export default useGhost;

import { useEffect, useState } from "react";
import { Cell, GameBoard } from "../components/Game/Game";

const useGhost = (
  initialPos: { y: number; x: number },
  gameBoard: GameBoard,
  pacManPos: { y: number; x: number },
  ghostAI: (
    ghostPos: { y: number; x: number },
    gameBoard: GameBoard,
    pacManPos: { y: number; x: number }
  ) => { y: number; x: number },
  isReady: boolean
) => {
  const [ghostPos, setGhostPos] = useState(initialPos);
  const [isWarming, setIsWarming] = useState(false);

  useEffect(() => {
    if (!isReady) return;

    const delayTimeout = setTimeout(() => {
      setIsWarming(true);
    }, 5000);
    return () => {
      clearTimeout(delayTimeout);
    };
  }, [isReady]);

  useEffect(() => {
    let movingGhostInterval: NodeJS.Timeout;

    if (!isReady || !isWarming) return;

    movingGhostInterval = setInterval(() => {
      let newGhostPos = ghostAI(ghostPos, gameBoard, pacManPos);
      if (
        0 <= newGhostPos.y &&
        newGhostPos.y < gameBoard.length &&
        0 <= newGhostPos.x &&
        newGhostPos.x < gameBoard[0].length &&
        gameBoard[newGhostPos.y][newGhostPos.x] !== Cell.Wall
      ) {
        gameBoard[ghostPos.y][ghostPos.x] = Cell.Empty;
        gameBoard[newGhostPos.y][newGhostPos.x] = Cell.Ghost;
        setGhostPos(newGhostPos);
      }
    }, 200);

    return () => {
      clearInterval(movingGhostInterval);
    };

    // ghostAI dose not need to be in the dependency array, it includes to resolve eslint errors
  }, [ghostPos, pacManPos, gameBoard, ghostAI, isReady, isWarming]);

  return { ghostPos, setGhostPos };
};

export default useGhost;

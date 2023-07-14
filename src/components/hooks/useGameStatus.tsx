import { useEffect, useState } from "react";
import { Cell, GameBoard, Direction } from "../Game/Game";

const useGameStatus = (
  gameBoard: GameBoard,
  pacManPos: { y: number; x: number },
  ghostPositions: { y: number; x: number }[]
) => {
  const [gameOver, setGameOver] = useState(false);
  const [gameClear, setGameClear] = useState(false);

  useEffect(() => {
    if (
      ghostPositions.some(
        (ghostPos) => pacManPos.x === ghostPos.x && pacManPos.y === ghostPos.y
      )
    ) {
      setGameOver(true);
    } else if (!gameBoard.some((row) => row.includes(Cell.Dot))) {
      setGameClear(true);
    }
  }, [pacManPos, ...ghostPositions, gameBoard]);

  return { gameOver, gameClear };
};

export default useGameStatus;

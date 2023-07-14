import usePacManGame from "../hooks/usePacManGame";
import Board from "../Board/Board";
import { initialGameBoard } from "./initialBoard";
import styles from "./Game.module.css";

enum Cell {
  Empty,
  Wall,
  Dot,
  PacMan,
  Ghost,
}

enum Direction {
  Up,
  Down,
  Left,
  Right,
}

type GameBoard = Cell[][];

export default function Game() {
  const initialPacManPos = { x: 17, y: 5 };
  const initialGhostPos = { x: 8, y: 3 };
  const initialGhostPos2 = { x: 3, y: 4 };

  const { gameBoard, pacManPos, pacManDirection, gameOver, gameClear } =
    usePacManGame(
      initialPacManPos,
      initialGhostPos,
      initialGhostPos2,
      initialGameBoard
    );
  return (
    <>
      <div className={styles.container}>
        <Board board={gameBoard} direction={pacManDirection}></Board>
      </div>
      {gameOver && <div className={styles.gameOver}>Game Over</div>}
      {gameClear && <div className={styles.gameClear}>Game Clear</div>}
    </>
  );
}

export type { GameBoard };
export { Cell, Direction };

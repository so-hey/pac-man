import usePacManGame from "../../hooks/usePacManGame";
import Board from "../Board/Board";
import { initialGameBoard } from "./initialBoard";
import * as styles from "./Game.css";

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
  let initialPacManPos = { x: -1, y: -1 };
  const initialGhostPositions: { x: number; y: number }[] = [];

  for (let y = 0; y < initialGameBoard.length; y++) {
    for (let x = 0; x < initialGameBoard[y].length; x++) {
      if (initialGameBoard[y][x] === Cell.PacMan) {
        initialPacManPos = { x, y };
      } else if (initialGameBoard[y][x] === Cell.Ghost) {
        initialGhostPositions.push({ x, y });
      }
    }
  }

  const initialGhostPos = initialGhostPositions[0];
  const initialGhostPos2 = initialGhostPositions[1];

  const { gameBoard, pacManDirection, gameOver, gameClear } = usePacManGame(
    initialPacManPos,
    initialGhostPos,
    initialGhostPos2,
    initialGameBoard
  );
  return (
    <>
      <div className={styles.container}>
        <Board board={gameBoard} direction={pacManDirection}></Board>
        <div>
          <button>START</button>
        </div>
      </div>
      {gameOver && <div className={styles.gameOver}>Game Over</div>}
      {gameClear && <div className={styles.gameClear}>Game Clear</div>}
    </>
  );
}

export type { GameBoard };
export { Cell, Direction };

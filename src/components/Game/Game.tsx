import { useState } from "react";
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
  const [isReady, setIsReady] = useState(false);

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
    initialGameBoard,
    isReady
  );
  return (
    <>
      <div className={styles.container}>
        {isReady && (
          <>
            <Board board={gameBoard} direction={pacManDirection}></Board>
            <div className={styles.message}>
              {gameOver && <div className={styles.gameOver}>Game Over</div>}
              {gameClear && <div className={styles.gameClear}>Game Clear</div>}
            </div>
          </>
        )}
        <div>
          {!isReady && (
            <>
              <button
                onClick={() => {
                  const audio = new Audio("/pacman_introduction.mp3");
                  audio.play();
                  setTimeout(() => {
                    setIsReady(true);
                  }, 5000);
                }}
                className={styles.startButton}
              ></button>
              <div>START</div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export type { GameBoard };
export { Cell, Direction };

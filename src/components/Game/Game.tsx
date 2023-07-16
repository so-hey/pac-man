import usePacManGame from "../../hooks/usePacManGame";
import Board from "../Board/Board";
import { initialGameBoard } from "./initialBoard";
import * as styles from "./Game.css";

enum Cell {
  Empty,
  Wall,
  Dot,
  PacMan,
  RedGhost,
  PinkGhost,
  BlueGhost,
  OrangeGhost,
}

enum Direction {
  Up,
  Down,
  Left,
  Right,
}

enum GameStatus {
  ReadyToStart,
  Ready,
  InProgress,
  GameOver,
  GameClear,
}

type GameBoard = Cell[][];

export default function Game() {
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

  const { gameBoard, pacManDirection, gameStatus, startGame } = usePacManGame(
    initialPacManPos,
    initialRedGhostPos,
    initialPinkGhostPos,
    initialBlueGhostPos,
    initialOrangeGhostPos,
    initialGameBoard
  );

  return (
    <>
      <div className={styles.container}>
        {gameStatus !== GameStatus.ReadyToStart && (
          <>
            <Board board={gameBoard} direction={pacManDirection}></Board>
            <div className={styles.message}>
              {gameStatus === GameStatus.Ready && (
                <div className={styles.ready}>Ready!</div>
              )}
              {gameStatus === GameStatus.GameOver && (
                <div className={styles.gameOver}>Game Over</div>
              )}
              {gameStatus === GameStatus.GameClear && (
                <div className={styles.gameClear}>Game Clear</div>
              )}
            </div>
          </>
        )}
        <div>
          {gameStatus === GameStatus.ReadyToStart && (
            <>
              <button
                onClick={() => {
                  const audio = new Audio("/pacman_introduction.mp3");
                  audio.play();
                  startGame();
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
export { Cell, Direction, GameStatus };

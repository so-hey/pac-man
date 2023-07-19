import { useState, useEffect, useRef } from "react";
import usePacManGame from "../../hooks/usePacManGame";
import Board from "../Board/Board";

import {
  controllerDataset,
  train,
  predict,
  getImage,
  init,
} from "../../services/model";
import { initialGameBoard as _initialGameBoard } from "./initialBoard";
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
  const [initialGameBoard] = useState<GameBoard>(
    _initialGameBoard.map((row) => [...row])
  );
  const [isTraining, setIsTraining] = useState(false);

  const [prediction, setPrediction] = useState<number | null>(null);
  const { pacManDirection, gameStatus, startGame } = usePacManGame(
    initialGameBoard,
    prediction
  );

  //
  const [sampleCountUp, setSampleCountUp] = useState(
    controllerDataset.exampleCount[0]
  );
  const [sampleCountDown, setSampleCountDown] = useState(
    controllerDataset.exampleCount[1]
  );
  const [sampleCountLeft, setSampleCountLeft] = useState(
    controllerDataset.exampleCount[2]
  );
  const [sampleCountRight, setSampleCountRight] = useState(
    controllerDataset.exampleCount[3]
  );
  const [isTrained, setIsTrained] = useState(false);
  const [loss, setLoss] = useState<number | null>(null);
  const webcamRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    (async () => {
      await init();
    })();
  }, [isTraining]);

  useEffect(() => {
    if (!isTrained) return;
    const interval = setInterval(async () => {
      const prediction = await predict();
      setPrediction(prediction as number);
    }, 50);
    return () => clearInterval(interval);
  }, [isTrained]);

  return (
    <>
      <video
        ref={webcamRef}
        id="webcam"
        muted
        height={224}
        width={224}
        style={{
          display: "none",
        }}
      />
      <div className={styles.container}>
        {gameStatus !== GameStatus.ReadyToStart && (
          <>
            <Board board={initialGameBoard} direction={pacManDirection}></Board>
            <div className={styles.message}>
              {gameStatus === GameStatus.Ready && (
                <div className={styles.ready}>READY!</div>
              )}
              {gameStatus === GameStatus.GameOver && (
                <div className={styles.gameOver}>GAME OVER</div>
              )}
              {gameStatus === GameStatus.GameClear && (
                <div className={styles.gameClear}>GAME CLEAR</div>
              )}
            </div>
            {/* <div
              onClick={() => {
                setInitialGameBoard(originalBoard.map((row) => [...row]));
                startGame();
                const audio = new Audio("/pacman_intro.mp3");
                audio.play();
              }}
            >
              RESTART
            </div> */}
          </>
        )}
        {!isTraining && (
          <>
            {gameStatus === GameStatus.ReadyToStart && (
              <div className={styles.buttonsContainer}>
                <div className={styles.buttonContainer}>
                  <button
                    onClick={() => {
                      const audio = new Audio("/pacman_intro.mp3");
                      audio.play();
                      startGame();
                    }}
                    className={styles.Button}
                  ></button>
                  <div>START</div>
                </div>
                <div className={styles.buttonContainer}>
                  <button
                    onClick={() => {
                      setIsTraining(true);
                    }}
                    className={styles.Button}
                  ></button>
                  <div>TRAIN</div>
                </div>
              </div>
            )}
          </>
        )}
        {isTraining && (
          <div>
            <div
              onClick={() => {
                setIsTraining(false);
              }}
              className={styles.back}
            >
              <p className={styles.backText}>Back</p>
            </div>

            <div className={styles.field}>
              <div></div>
              <div
                className={styles.box}
                onClick={async () => {
                  const img = await getImage();
                  controllerDataset.addExample(img, 0);
                  setSampleCountUp(controllerDataset.exampleCount[0]);
                }}
                style={{
                  border:
                    prediction === 0 ? "1px solid green" : "1px solid white",
                }}
              >
                UP
                <p>{sampleCountUp}</p>
              </div>
              <div></div>
              <div
                className={styles.box}
                onClick={async () => {
                  const img = await getImage();
                  controllerDataset.addExample(img, 2);
                  setSampleCountLeft(controllerDataset.exampleCount[2]);
                }}
                style={{
                  border:
                    prediction === 2 ? "1px solid green" : "1px solid white",
                }}
              >
                LEFT
                <p>{sampleCountLeft}</p>
              </div>

              <video
                id="webcamDummy"
                autoPlay
                playsInline
                muted
                height={224}
                width={224}
                style={{
                  width: "112px",
                  height: "112px",
                  WebkitTransform: "scaleX(-1)",
                }}
              />
              <div
                className={styles.box}
                onClick={async () => {
                  const img = await getImage();
                  controllerDataset.addExample(img, 3);
                  setSampleCountRight(controllerDataset.exampleCount[3]);
                }}
                style={{
                  border:
                    prediction === 3 ? "1px solid green" : "1px solid white",
                }}
              >
                RIGHT
                <p>{sampleCountRight}</p>
              </div>
              <div className={styles.box}>OPTION</div>
              <div
                className={styles.box}
                onClick={async () => {
                  const img = await getImage();
                  controllerDataset.addExample(img, 1);
                  setSampleCountDown(controllerDataset.exampleCount[1]);
                }}
                style={{
                  border:
                    prediction === 1 ? "1px solid green" : "1px solid white",
                }}
              >
                DOWN <p>{sampleCountDown}</p>
              </div>
              <div
                className={styles.box}
                onClick={() => {
                  train(setLoss);
                  setIsTrained(true);
                }}
                style={{ border: "1px solid red" }}
              >
                TRAIN
                {loss && (
                  <>
                    <p style={{ fontSize: "13px" }}>loss:</p>
                    <span style={{ fontSize: "12px" }}>{loss?.toFixed(5)}</span>
                  </>
                )}
              </div>
            </div>
            <div></div>
          </div>
        )}
      </div>
    </>
  );
}

export type { GameBoard };
export { Cell, Direction, GameStatus };

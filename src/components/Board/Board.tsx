import { GameBoard, Cell, Direction } from "../Game/Game";
import Ghost from "./Ghost/Ghost";
import PacMan from "./PacMan/PacMan";
import Dot from "./Dot/Dot";
import Wall from "./Wall/Wall";
import * as styles from "./Board.css";

interface BoardProps {
  board: GameBoard;
  direction: Direction;
}

export default function Board({ board, direction }: BoardProps) {
  return (
    <div className={styles.board}>
      {board.map((row, i) => (
        <>
          {row.map((cell, j) => {
            const idx = i * row.length + j;
            switch (cell) {
              case Cell.Wall:
                return <Wall key={idx} />;
              case Cell.Dot:
                return <Dot key={idx} />;
              case Cell.PacMan:
                return <PacMan key={idx} direction={direction} />;
              case Cell.RedGhost:
                return <Ghost key={idx} color="red" />;
              case Cell.PinkGhost:
                return <Ghost key={idx} color="pink" />;
              case Cell.BlueGhost:
                return <Ghost key={idx} color="blue" />;
              case Cell.OrangeGhost:
                return <Ghost key={idx} color="orange" />;
              default:
                return <div key={idx} className={styles.cell}></div>;
            }
          })}
        </>
      ))}
    </div>
  );
}

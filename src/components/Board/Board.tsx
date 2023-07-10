import { GameBoard, Cell } from "../Game/Game";
import Ghost from "../Ghost/Ghost";
import PacMan from "../PacMan/PacMan";
import Dot from "../Dot/Dot";
import Wall from "../Wall/Wall";
import styles from "./Board.module.css";

interface BoardProps {
  board: GameBoard;
}

export default function Board({ board }: BoardProps) {
  return (
    <div className={styles.board}>
      {board.map((row, i) => (
        <>
          {row.map((cell, j) => {
            switch (cell) {
              case Cell.Wall:
                return <Wall />;
              case Cell.Dot:
                return <Dot key={j} />;
              case Cell.PacMan:
                return <PacMan key={j} />;
              case Cell.Ghost:
                return <Ghost key={j} />;
              default:
                return <div key={j} className={styles.cell}></div>;
            }
          })}
        </>
      ))}
    </div>
  );
}

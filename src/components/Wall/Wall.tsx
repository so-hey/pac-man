import * as styles from "./Wall.css";

export default function Wall() {
  return (
    <div className={styles.wall}>
      <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="blue" />
      </svg>
    </div>
  );
}

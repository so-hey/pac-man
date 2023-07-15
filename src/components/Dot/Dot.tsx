import * as styles from "./Dot.css";

export default function Dot() {
  return (
    <div className={styles.dot}>
      <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
        <circle cx="7.5" cy="7.5" r="2" fill="white" />
      </svg>
    </div>
  );
}

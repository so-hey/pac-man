import { style } from "@vanilla-extract/css";

export const back = style({
  marginBottom: "2rem",
  cursor: "pointer",
});

export const backText = style({
  textDecoration: "underline",
});

export const box = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid white",
  cursor: "pointer",
  userSelect: "none",
});

export const predicted = style({
  border: "1px solid green",
});

export const field = style({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gridTemplateRows: "repeat(3, 1fr)",
  gap: "10px",
});

export const container = style({});

export const ready = style({});
export const gameOver = style({});
export const gameClear = style({});

export const message = style({
  height: "10px",
  textAlign: "center",
  fontFamily: "'Press Start 2P', cursive",
});

export const Button = style({
  ":hover": {
    backgroundColor: "rgb(126, 0, 0)",
  },
  height: "50px",
  width: "50px",
  backgroundColor: "red",
  borderRadius: "50px",
  border: "none",
  transition: "0.3s ease-in-out",
  marginBottom: "10px",
});

export const buttonsContainer = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const buttonContainer = style({
  textAlign: "center",
  margin: "0 10px",
});

import { style } from "@vanilla-extract/css";

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

import { style } from "@vanilla-extract/css";

export const container = style({});

export const gameOver = style({});
export const gameClear = style({});

export const message = style({
  height: "10px",
  textAlign: "center",
});

export const startButton = style({
  ":hover": {
    backgroundColor: "rgb(126, 0, 0)",
  },
  height: "50px",
  width: "50px",
  backgroundColor: "red",
  borderRadius: "50px",
  border: "none",
  transition: "0.3s ease-in-out",
});

import { style } from "@vanilla-extract/css";

export const board = style({
  display: "grid",
  backgroundColor: "black",
  gap: "1px",
  gridTemplateRows: "repeat(11, 1fr)",
  gridTemplateColumns: "repeat(20, 1fr)",
});

export const cell = style({
  border: "1px solid black",
  padding: "10px",
  textAlign: "center",
});

import { style } from "@vanilla-extract/css";

export const boardStyle = style({
  display: "flex",
  backgroundColor: "black",
  gap: "1px",
  gridTemplateRows: "repeat(8, 1fr)",
  gridTemplateColumns: "repeat(20, 1fr)",
});

export const cellStyle = style({
  border: "1px solid black",
  padding: "10px",
  textAlign: "center",
});

import { Cell, GameBoard, Direction } from "../components/Game/Game";

const INF = 10_000;
const dy = [-1, 1, 0, 0];
const dx = [0, 0, -1, 1];

// Sticky type. Follow closely behind Pac-Man.
const shadowBlinkyAI = (
  ghostPos: { y: number; x: number },
  gameBoard: GameBoard,
  pacManPos: { y: number; x: number }
) => {
  const newGhostPos = { ...ghostPos };

  const INF = 10_000;

  const from: Array<Array<-1 | Number[]>> = gameBoard.map((row) =>
    row.map((_) => -1)
  );
  const distances = gameBoard.map((row) => row.map((_) => INF));
  distances[ghostPos.y][ghostPos.x] = 0;

  // TODO: change to use FIFO queue
  const que = [[ghostPos.y, ghostPos.x]];

  while (que.length > 0) {
    const [y, x] = que.shift() as number[];
    for (let i = 0; i < 4; i++) {
      const ny = y + dy[i];
      const nx = x + dx[i];
      if (gameBoard[ny][nx] !== Cell.Wall && distances[ny][nx] === INF) {
        distances[ny][nx] = distances[y][x] + 1;
        from[ny][nx] = [y, x];
        que.push([ny, nx]);
      }
    }
  }

  let ty = pacManPos.y;
  let tx = pacManPos.x;

  while (from[ty][tx] !== -1 && distances[ty][tx] > 1) {
    const [y, x] = from[ty][tx] as number[];
    ty = y;
    tx = x;
  }

  newGhostPos.y = ty;
  newGhostPos.x = tx;

  return newGhostPos;
};

// Brain type. Aims slightly ahead of the point where Pac-Man is and moves ahead of him.
const speedyPinkyAI = (
  ghostPos: { y: number; x: number },
  gameBoard: GameBoard,
  pacManPos: { y: number; x: number },
  pacManDirection: Direction
) => {
  const newGhostPos = { ...ghostPos };

  const INF = 10_000;

  const from: Array<Array<-1 | Number[]>> = gameBoard.map((row) =>
    row.map((_) => -1)
  );
  const distances = gameBoard.map((row) => row.map((_) => INF));
  distances[ghostPos.y][ghostPos.x] = 0;

  // TODO: change to use FIFO queue
  const que = [[ghostPos.y, ghostPos.x]];

  while (que.length > 0) {
    const [y, x] = que.shift() as number[];
    for (let i = 0; i < 4; i++) {
      const ny = y + dy[i];
      const nx = x + dx[i];
      if (gameBoard[ny][nx] !== Cell.Wall && distances[ny][nx] === INF) {
        distances[ny][nx] = distances[y][x] + 1;
        from[ny][nx] = [y, x];
        que.push([ny, nx]);
      }
    }
  }

  let ty = pacManPos.y;
  let tx = pacManPos.x;

  for (let d = 4; d > 0; d--) {
    const _ty = ty + dy[pacManDirection] * d;
    const _tx = tx + dx[pacManDirection] * d;
    if (
      0 <= _ty &&
      _ty < gameBoard.length &&
      0 <= _tx &&
      _tx < gameBoard[0].length &&
      gameBoard[_ty][_tx] !== Cell.Wall
    ) {
      ty = _ty;
      tx = _tx;
      break;
    }
  }

  while (from[ty][tx] !== -1 && distances[ty][tx] > 1) {
    const [y, x] = from[ty][tx] as number[];
    ty = y;
    tx = x;
  }

  newGhostPos.y = ty;
  newGhostPos.x = tx;

  return newGhostPos;
};

// Capricious type. Aims at the point-symmetrical position of Shadow Blinky (red) in the shortest possible distance, with Pac-Man at the centre of the action.
const bashfulInkyAI = (
  ghostPos: { y: number; x: number },
  gameBoard: GameBoard,
  pacManPos: { y: number; x: number }
) => {
  const newGhostPos = { ...ghostPos };

  let blinkyPos = { y: -1, x: -1 };
  for (let y = 0; y < gameBoard.length; y++) {
    for (let x = 0; x < gameBoard[0].length; x++) {
      if (gameBoard[y][x] === Cell.RedGhost) {
        blinkyPos = { y, x };
      }
    }
  }

  const from: Array<Array<-1 | Number[]>> = gameBoard.map((row) =>
    row.map((_) => -1)
  );
  const distances = gameBoard.map((row) => row.map((_) => INF));
  distances[ghostPos.y][ghostPos.x] = 0;

  // TODO: change to use FIFO queue
  const que = [[ghostPos.y, ghostPos.x]];

  while (que.length > 0) {
    const [y, x] = que.shift() as number[];
    for (let i = 0; i < 4; i++) {
      const ny = y + dy[i];
      const nx = x + dx[i];
      if (gameBoard[ny][nx] !== Cell.Wall && distances[ny][nx] === INF) {
        distances[ny][nx] = distances[y][x] + 1;
        from[ny][nx] = [y, x];
        que.push([ny, nx]);
      }
    }
  }

  let ty = 2 * pacManPos.y - blinkyPos.y;
  let tx = 2 * pacManPos.x - blinkyPos.x;

  ty = Math.max(1, Math.min(gameBoard.length - 2, ty));
  tx = Math.max(1, Math.min(gameBoard[0].length - 2, tx));

  if (gameBoard[ty][tx] === Cell.Wall) {
    const movablePos = [];
    for (let i = 0; i < 4; i++) {
      const ny = ty + dy[i];
      const nx = tx + dx[i];
      if (
        0 <= ny &&
        ny < gameBoard.length &&
        0 <= nx &&
        nx < gameBoard[0].length &&
        gameBoard[ny][nx] !== Cell.Wall
      ) {
        movablePos.push([ny, nx]);
      }
    }
    const random = Math.floor(Math.random() * movablePos.length);
    ty = movablePos[random][0];
    tx = movablePos[random][1];
  }

  while (from[ty][tx] !== -1 && distances[ty][tx] > 1) {
    const [y, x] = from[ty][tx] as number[];
    ty = y;
    tx = x;
  }

  newGhostPos.y = ty;
  newGhostPos.x = tx;

  return newGhostPos;
};

// Selfish type. Acts freely without thinking. Chases when further away than Pac-Man and runs away when closer to him.
const pokeyClydeAI = (
  ghostPos: { y: number; x: number },
  gameBoard: GameBoard,
  pacManPos: { y: number; x: number }
) => {
  const newGhostPos = { ...ghostPos };

  const REACT_DISTANCE = 7;

  const from: Array<Array<-1 | Number[]>> = gameBoard.map((row) =>
    row.map((_) => -1)
  );
  const distances = gameBoard.map((row) => row.map((_) => INF));
  distances[ghostPos.y][ghostPos.x] = 0;

  // TODO: change to use FIFO queue
  const que = [[ghostPos.y, ghostPos.x]];

  while (que.length > 0) {
    const [y, x] = que.shift() as number[];
    for (let i = 0; i < 4; i++) {
      const ny = y + dy[i];
      const nx = x + dx[i];
      if (gameBoard[ny][nx] !== Cell.Wall && distances[ny][nx] === INF) {
        distances[ny][nx] = distances[y][x] + 1;
        from[ny][nx] = [y, x];
        que.push([ny, nx]);
      }
    }
  }

  let ty = pacManPos.y;
  let tx = pacManPos.x;

  if (distances[pacManPos.y][pacManPos.x] > REACT_DISTANCE) {
    while (from[ty][tx] !== -1 && distances[ty][tx] > 1) {
      const [y, x] = from[ty][tx] as number[];
      ty = y;
      tx = x;
    }
  } else {
    let max_distance = -1;
    for (let i = 0; i < 4; i++) {
      const ny = ghostPos.y + dy[i];
      const nx = ghostPos.x + dx[i];
      if (
        0 <= ny &&
        ny < gameBoard.length &&
        0 <= nx &&
        nx < gameBoard[0].length &&
        gameBoard[ny][nx] !== Cell.Wall
      ) {
        if (distances[ny][nx] > max_distance) {
          max_distance = distances[ny][nx];
          ty = ny;
          tx = nx;
        }
      }
    }
  }

  newGhostPos.y = ty;
  newGhostPos.x = tx;

  return newGhostPos;
};

export { shadowBlinkyAI, speedyPinkyAI, bashfulInkyAI, pokeyClydeAI };

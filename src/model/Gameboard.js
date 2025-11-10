import Square from "./Square";

class Gameboard {
  #board;
  #missedSqr;
  #ships;
  constructor() {
    this.#board = this.#createBoard();
    this.#missedSqr = [];
    this.#ships = [];
  }
  get board() {
    return this.#board;
  }
  #createBoard() {
    const map = [];
    for (let i = 0; i < 10; i++) {
      const bucket = [];
      for (let j = 0; j < 10; j++) {
        const square = new Square();
        bucket.push(square);
      }
      map.push(bucket);
    }
    return map;
  }
  validateMove(ship, startP, dir) {
    if (dir !== "ver" && dir !== "hor") throw new Error("Invalid direction");

    const [x, y] = startP;
    if (
      (dir === "ver" && x + ship.length > 10) ||
      (dir === "hor" && y + ship.length > 10)
    ) {
      throw new Error("Square out of range");
    }
    for (let i = 0; i < ship.length; i++) {
      let currentSquare;
      if (dir === "ver") {
        currentSquare = this.#board[x + i][y];
      }
      if (dir === "hor") {
        currentSquare = this.#board[x][y + i];
      }
      if (currentSquare.ship !== null) {
        throw new Error("Occupied square");
      }
    }
  }
  placeShip(ship, startP, dir) {
    const [x, y] = startP;
    try {
      this.validateMove(ship, startP, dir);
      for (let i = 0; i < ship.length; i++) {
        let currentSquare;
        if (dir === "ver") {
          currentSquare = this.#board[x + i][y];
        }
        if (dir === "hor") {
          currentSquare = this.#board[x][y + i];
        }
        currentSquare.ship = ship;
      }
      this.#ships.push(ship);
    } catch (e) {
      console.error(e);
    }
  }
  receiveAttack(coord) {
    const [x, y] = coord;
    const square = this.#board[x][y];
    if (square.hit) {
      throw new Error("Can't hit a square twice");
    }
    if (square.ship !== null && !square.ship.sunk) {
      square.ship.hit();
      square.hit(true);
      if (square.ship.isSunk()) {
        this.checkGamestate();
      }
    } else {
      this.#missedSqr.push(coord);
    }
  }
  checkGamestate() {
    const sunkenShips = this.#ships.filter((ship) => ship.isSunk());
    if (sunkenShips.length === this.#ships.length) {
      console.log("All ships have sunk");
    }
  }
}
export default Gameboard;

import Square from "./Square.js";

class Gameboard {
  #board;
  #missedSqr;
  #ships;
  #sunkenShips;
  constructor() {
    this.#board = this.#createBoard();
    this.#missedSqr = [];
    this.#ships = [];
    this.#sunkenShips = [];
  }
  get board() {
    return this.#board;
  }
  get ships() {
    return this.#ships;
  }
  get sunkenShips() {
    return this.#sunkenShips;
  }
  get missedSqr() {
    return this.#missedSqr;
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
      return e.message;
    }
  }
  receiveAttack(coord) {
    const [x, y] = coord;
    const square = this.#board[x][y];
    if (square.isHit) {
      throw new Error("Can't hit a square twice");
    }
    if (square.ship !== null && !square.ship.sunk) {
      square.ship.hit();
      square.hit();
      if (square.ship.isSunk()) {
        const sunkShip = this.#ships.splice(this.#ships.indexOf(square.ship), 1)[0];
        this.#sunkenShips.push(sunkShip);
        return this.isLost();
      }
    } else {
      square.hit();
      this.#missedSqr.push(coord);
    }
  }
  isLost() {
    const sunkenShips = this.#ships.filter((ship) => ship.isSunk());
    if (sunkenShips.length === this.#ships.length) {
      return true;
    }
    return false;
  }
}
export default Gameboard;

import Ship from "../model/Ship.js";
import lib from "./lib.js";
class GamePlay {
  gui;
  constructor() {
    this.gui = lib();
  }
  createBoard() {
    const board = document.createElement("div");
    board.classList.add("board");
    for (let i = 96; i < 107; i++) {
      const row = document.createElement("div");
      row.classList.add("rowContainer");
      let className = "";
      let letter = String.fromCharCode(i);
      for (let j = 0; j < 11; j++) {
        const col = document.createElement("div");
        if (i === 96 && j === 0) {
          className = "notSquare";
        } else if (i === 96 && j > 0) {
          className = "colIndicator";
          col.textContent = j;      // 1–10
        } else if (i > 96 && j === 0) {
          className = "rowIndicator";
          col.textContent = letter; // a–j
        } else {
          className = letter + j;   // a1, b4, j10, etc.
          col.classList.add("boardSquare");
        }
        col.classList.add("boardGridMember", className);
        row.appendChild(col);
      }
      board.appendChild(row);
    }
    return board;
  }
  emptyBoards() {
    const boards = document.querySelectorAll(".board");
    for (const b of boards) {
      b.replaceWith(this.createBoard());
    }
  }
  enablePlaceBtns(players) {
    const [board1, board2] = document.querySelectorAll(".board");
    const [p1, p2] = players;
    if (board1 && board2) {
      this.placeShips(p1, board1);
      this.placeShips(p2, board2);

    }
  }
  placeShips(player, nodeBoard) {
    const startBtn = document.createElement("button");
    startBtn.classList.add("gameBtn", "placeShipsBtn");
    startBtn.textContent = "Place ships";
    nodeBoard.appendChild(startBtn);
    this.gui.multiVeil(nodeBoard, startBtn);
    //INPUT SHIPS HERE!!!!
    startBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const coordinates = this.inputCoordinates();
      const ships = this.createShips();
      for (let i = 0; i < ships.length; i++) {
        player.board.placeShip(ships[i], coordinates[i], "hor");
      }
      this.gui.removeMultiVeil("", startBtn);
      startBtn.remove();
      //ENABLE ATTACKS
      this.enableSquares(nodeBoard);
    })
  }
  inputCoordinates() {
    //MOCK INPUT
    const shipPositions = [[9, 3], [8, 1], [8, 5], [9, 7], [5, 0], [6, 7], [1, 8], [4, 4], [3, 3], [0, 0]];
    return shipPositions;
  }
  createShips() {
    //MOCK INPUT
    const small = [new Ship(1), new Ship(1), new Ship(1), new Ship(1)];
    const mid = [new Ship(2), new Ship(2), new Ship(2)];
    const large = [new Ship(3), new Ship(3)];
    const largest = [new Ship(4)];
    return small.concat(mid, large, largest);
  }
  enableSquares(boardNode) {
    boardNode.addEventListener("click", (e) => {
      if (e.target.classList.contains("boardSquare")) {
        const rawCoord = e.target.classList[2];
        const realCoord = this.translateCoord(rawCoord);
        console.log(rawCoord, realCoord);
      }
    });
  }
  translateCoord(className) {
    const x = className[0];
    const y = className.slice(1); // gets "10", "5", etc.

    const alph = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
    const row = alph.indexOf(x);
    const col = parseInt(y, 10) - 1;

    return [row, col];
  }
  apllyHit(player) {

  }

}
export default GamePlay;

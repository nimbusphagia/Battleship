import Ship from "../model/Ship.js";
import lib from "./lib.js";
class GamePlay {
  gui;
  currentPlayer;
  players;
  phase;
  constructor() {
    this.gui = lib();
    this.phase = 0;
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
          col.classList.add("boardSquare", "unhit");
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
    this.players = players;
    if (board1 && board2) {
      this.placeShips(this.players[0], board1);
      this.placeShips(this.players[1], board2);

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
      //START PLACING PHASE
      if (this.phase === 0) this.phase = 1;
      //Get coordinates
      const coordinates = this.inputCoordinates();
      const ships = this.createShips();
      for (let i = 0; i < ships.length; i++) {
        player.board.placeShip(ships[i], coordinates[i], "hor");
      }
      //STOP PLACING PHASE
      this.gui.removeMultiVeil("", startBtn);
      startBtn.remove();
      //CHECK FOR END OF PHASE - GO ON
      if (this.players[0].board.ships.length === 10 && this.players[1].board.ships.length === 10) {
        this.phase = 2;
        this.playGame();
      }
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
  playGame() {
    this.currentPlayer = this.players[0];
    const game = document.querySelector(".game");
    const board1 = document.querySelector(".player1 > .board");
    const board2 = document.querySelector(".player2 > .board");
    board1.classList.add("playing");
    game.addEventListener("click", (e) => {
      if (this.currentPlayer === this.players[0]) { //PLAYER 1

        if (e.target.closest(".player1")) {
          if (e.target.classList.contains("boardSquare") && !e.target.classList.contains("hit")) {

            this.enableSquares(e.target);
            this.currentPlayer = this.players[1];
            board1.classList.remove("playing");
            board2.classList.add("playing");
          }
        }
      } else if (this.currentPlayer === this.players[1] && this.currentPlayer.type) { //PLAYER 2
        if (e.target.closest(".player2")) {
          if (e.target.classList.contains("boardSquare") && !e.target.classList.contains("hit")) {

            this.enableSquares(e.target);
            this.currentPlayer = this.players[0];
            board2.classList.remove("playing");
            board1.classList.add("playing");
          }
        }
      }
      //COMPUTER
    })
  }
  enableSquares(node) {
    const rawCoord = node.classList[3];
    const realCoord = this.translateCoord(rawCoord);
    this.applyHit(realCoord);
    node.classList.replace("unhit", "hit");
    if (!this.hasCoord(this.currentPlayer.board.missedSqr, realCoord)) {
      node.classList.add("shipHit");
    } else {
      node.classList.add("miss");
    }
  }
  translateCoord(className) {
    const x = className[0];
    const y = className.slice(1); // gets "10", "5", etc.

    const alph = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
    const row = alph.indexOf(x);
    const col = parseInt(y, 10) - 1;

    return [row, col];
  }
  hasCoord(arr, coord) {
    return arr.some(([x, y]) => x === coord[0] && y === coord[1]);
  }
  applyHit(coordinate) {
    this.currentPlayer.board.receiveAttack(coordinate);
  }

}
export default GamePlay;

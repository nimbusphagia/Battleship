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
  }
  inputShips() {
    //MOCK INPUT
    const shipPositions = [[0, 0], [5, 5], [7, 8], [3, 7]];
    return shipPositions;
  }
  apllyHit(player) {

  }

}
export default GamePlay;

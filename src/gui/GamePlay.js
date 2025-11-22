import Ship from "../model/Ship.js";
import lib from "./lib.js";
import shipHelper from "./shipHelper.js";
class GamePlay {
  gui;
  currentPlayer;
  currentOpponent;
  players;
  phase;
  computedCoords;
  constructor() {
    this.gui = lib();
    this.phase = 0;
    this.generateCoords();
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
      this.placeShips(this.players[1], board2);
      this.placeShips(this.players[0], board1);
    }
  }
  placeShips(player, nodeBoard) {
    if (player.type) {
      //CREATE BUTTONS
      const startBtn = document.createElement("button");
      startBtn.classList.add("gameBtn", "placeShipsBtn");
      startBtn.textContent = "Place ships";
      nodeBoard.appendChild(startBtn);
      this.gui.multiVeil(nodeBoard, startBtn);
      startBtn.addEventListener("click", (e) => {
        e.preventDefault();
        //START PLACING PHASE
        if (this.phase === 0) this.phase = 1;
        //Display Placing Ships Module
        const playerNode = nodeBoard.parentElement;
        //P1
        if (playerNode.classList.contains("player1")) {
          const opponentNode = document.querySelector(".player2");
          this.enablePlacing(startBtn, opponentNode, nodeBoard, player);
          //P2
        } else if (playerNode.classList.contains("player2")) {
          const opponentNode = document.querySelector(".player1");
          this.enablePlacing(startBtn, opponentNode, nodeBoard, player);

        }
        //Get coordinates & Place Ships
        /*const coordinates = this.inputCoordinates();
        const ships = this.createShips();

        for (let i = 0; i < ships.length; i++) {
          player.board.placeShip(ships[i], coordinates[i], "hor");
        }        //STOP PLACING PHASE
        if (!this.players[1].type) {
          this.gui.removeMultiVeil("multiVeil");
          document.querySelector(".computingIndicator").remove();
        } else {
          this.gui.removeMultiVeil("", startBtn);
        }
        startBtn.remove();
        //CHECK FOR END OF PHASE - GO ON
        if (this.players[0].board.ships.length === ships.length && this.players[1].board.ships.length === ships.length) {
          this.phase = 2;
          this.playGame();
        } */

      })
    } else {
      const computingSign = document.createElement("div");
      computingSign.classList.add("computingIndicator");
      computingSign.textContent = "Automatically generated";
      nodeBoard.appendChild(computingSign);
      this.gui.multiVeil(nodeBoard, computingSign);
      const coordinates = this.inputCoordinates();
      const ships = this.createShips();
      for (let i = 0; i < ships.length; i++) {
        player.board.placeShip(ships[i], coordinates[i], "hor");
      }

    }
  }

  enablePlacing(startBtn, opponentNode, board, player) {
    const shipModule = shipHelper();
    opponentNode.classList.add("relative");
    opponentNode.appendChild(shipModule);
    this.gui.removeMultiVeil("", startBtn);
    startBtn.style.display = "none";
    board.classList.add("placing");

    const small = [new Ship(1), new Ship(1), new Ship(1), new Ship(1)];
    const mid = [new Ship(2), new Ship(2), new Ship(2)];
    const large = [new Ship(3), new Ship(3)];
    const largest = [new Ship(4)];

    // VARIABLES DE ESTADO MANEJADAS POR LOS LISTENERS
    let selectedShip = null;
    let shipSize = 0;
    let dir = "horizontal";
    let queue = [];

    // --- Listener solo una vez ---
    board.addEventListener("mouseenter", e => {
      if (!selectedShip) return;
      if (!e.target.classList.contains("boardSquare")) return;

      const rootSqr = e.target.classList[3];
      let imgClass = "";

      for (let i = 0; i < shipSize; i++) {
        const className = this.getNextSquare(rootSqr, i, dir);
        const sqr = document.querySelector("." + className);
        let imgClass = "";
        if (shipSize === 1) {
          imgClass = "sp";
        } else if (shipSize === 2) {
          imgClass = "mp";
        } else if (shipSize === 3) {
          imgClass = "lp";
        } else if (shipSize === 4) {
          imgClass = "xlp";
        }
        if (sqr) sqr.classList.add("placingHover", imgClass);
      }
    }, true);

    // --- Listener solo una vez ---
    board.addEventListener("mouseleave", e => {
      if (!selectedShip) return;
      if (!e.target.classList.contains("boardSquare")) return;

      const rootSqr = e.target.classList[3];

      for (let i = 0; i < shipSize; i++) {
        const className = this.getNextSquare(rootSqr, i, dir);
        const sqr = document.querySelector("." + className);
        let imgClass = "";
        if (shipSize === 1) {
          imgClass = "sp";
        } else if (shipSize === 2) {
          imgClass = "mp";
        } else if (shipSize === 3) {
          imgClass = "lp";
        } else if (shipSize === 4) {
          imgClass = "xlp";
        }
        if (sqr) sqr.classList.remove("placingHover", imgClass);
      }
    }, true);

    // --- Listener solo una vez ---
    board.addEventListener("click", e => {
      if (!selectedShip) return;
      if (!e.target.classList.contains("boardSquare")) return;

      const coord = this.translateCoord(e.target.classList[3]);

      player.board.placeShip(selectedShip.pop(), coord, dir);

      // Cuando ya se colocaron todos los barcos de ese tipo
      if (selectedShip.length === 0) {
        selectedShip = null;
        shipSize = 0;
      }
    });

    // --- SELECCIONAR BARCOS  ---
    shipModule.addEventListener("click", e => {
      if (e.target.closest(".dirBtn")) {
        dir = shipModule.querySelector(".shipDisplay").classList[1];
      }
      const item = e.target.closest(".shipImgCont");
      if (!item) return;
      //APPLY SELECTED CLASSNAME
      if (!item.classList.contains("selected")) {
        item.classList.add("selected");
        let selected = document.querySelectorAll(".selected");
        if (selected.length > 1) {
          for (const s of selected) {
            if (s !== item) {
              s.classList.remove("selected");
            }
          }
        }
      } else {
        item.classList.remove("selected");
      }

      if (item.classList.contains("smallShip")) {
        selectedShip = small;
        shipSize = 1;
      } else if (item.classList.contains("mediumShip")) {
        selectedShip = mid;
        shipSize = 2;
      } else if (item.classList.contains("largeShip")) {
        selectedShip = large;
        shipSize = 3;
      } else if (item.classList.contains("largestShip")) {
        selectedShip = largest;
        shipSize = 4;
      }
    });
  }
  inputCoordinates() {
    //MOCK INPUT
    const shipPositions = [[4, 4], [3, 3], [0, 0]]; /*[9, 3], [8, 1], [8, 5], [9, 7], [5, 0], [6, 7], [1, 8],*/
    return shipPositions;
  }
  createShips() {
    //MOCK INPUT
    const small = [new Ship(1), new Ship(1), new Ship(1), new Ship(1)];
    const mid = [new Ship(2), new Ship(2), new Ship(2)];
    const large = [new Ship(3), new Ship(3)];
    const largest = [new Ship(4)];
    //return small.concat(mid, large, largest);
    return large.concat(largest);
  }
  playGame() {
    this.currentPlayer = this.players[0];
    this.currentOpponent = this.players[1];
    const game = document.querySelector(".game");
    const board1 = document.querySelector(".player1 > .board");
    const board2 = document.querySelector(".player2 > .board");
    board2.classList.add("playing");
    //DISPLAY INITIAL SCORE
    const shipIndicator = document.querySelectorAll(".live > :first-child");
    shipIndicator[0].textContent = "Ships: ";
    shipIndicator[1].textContent = "Ships: ";
    const sunkIndicator = document.querySelectorAll(".sunk > :first-child ");
    sunkIndicator[0].textContent = "Sunk: ";
    sunkIndicator[1].textContent = "Sunk: ";
    const shipCounts = document.querySelectorAll(".live .count");
    const sunkCount = document.querySelectorAll(".sunk .count");
    shipCounts[0].textContent = this.players[0].board.ships.length;
    shipCounts[1].textContent = this.players[1].board.ships.length;
    sunkCount[0].textContent = this.players[0].board.sunkenShips.length;
    sunkCount[1].textContent = this.players[1].board.sunkenShips.length;
    game.addEventListener("click", this.enablePlay.bind(this));
  }
  enablePlay(e) {
    const board1 = document.querySelector(".player1 > .board");
    const board2 = document.querySelector(".player2 > .board");

    if (this.currentPlayer === this.players[1] && this.currentPlayer.type) { //HUMAN PLAYER 2
      //ATTACK PLAYER 1
      if (e.target.closest(".player1")) {
        if (e.target.classList.contains("boardSquare") && !e.target.classList.contains("hit")) {
          this.enableSquares(e.target);

          if (this.phase === 2) {
            this.displayScore(board1);
            board1.classList.remove("playing");
            board2.classList.add("playing");
            this.switchTurn();
          }
        }
      }
    } else if (this.currentPlayer === this.players[0]) { //PLAYER 1
      //ATTACK PLAYER 2
      if (e.target.closest(".player2")) {
        if (e.target.classList.contains("boardSquare") && !e.target.classList.contains("hit")) {
          this.enableSquares(e.target);
          if (this.phase === 2) {
            this.displayScore(board2);
            board2.classList.remove("playing");
            this.switchTurn();

            if (this.currentPlayer.type) {
              board1.classList.add("playing");
            } else {
              board1.classList.add("computing");
              //COMPUTER RANDOMLY ATTACK PLAYER 1
              this.computeAttack();
              this.displayScore(board1);
              board1.classList.remove("computing");
              board2.classList.add("playing");
              this.switchTurn();
            }

          }
        }
      }
    }
  }
  displayScore(board) {
    const parent = board.parentElement;
    const ships = parent.querySelector(".live .count");
    const sunk = parent.querySelector(".sunk .count");
    console.log(parent, ships, sunk);
    ships.textContent = this.currentOpponent.board.ships.length;
    sunk.textContent = this.currentOpponent.board.sunkenShips.length;
  }
  enableSquares(node) {
    const rawCoord = node.classList[3];
    const realCoord = this.translateCoord(rawCoord);
    this.applyHit(realCoord);
    node.classList.replace("unhit", "hit");
    if (!this.hasCoord(this.currentOpponent.board.missedSqr, realCoord)) {
      node.classList.add("shipHit");
    } else {
      node.classList.add("miss");
    }
    this.checkGameState();
    if (this.phase === 3) {
      const game = document.querySelector(".game");
      this.displayScore(node.parentElement.parentElement);
      game.removeEventListener("click", this.enablePlay);
    }
  }
  computeAttack() {
    const board1 = document.querySelector(".player1 .board");
    const randomClass = this.getRandomUniqueCoord();
    const randomCoord = this.translateCoord(randomClass);
    this.applyHit(randomCoord);
    const node = board1.querySelector("." + randomClass);
    node.classList.replace("unhit", "hit");
    if (!this.hasCoord(this.currentOpponent.board.missedSqr, randomCoord)) {
      node.classList.add("shipHit");
    } else {
      node.classList.add("miss");
    }
    this.checkGameState();
    if (this.phase === 3) {
      const game = document.querySelector(".game");
      game.removeEventListener("click", this.enablePlay);
    }
  }
  generateCoords() {
    const letters = "abcdefghij";
    const coords = [];

    for (const letter of letters) {
      for (let n = 1; n <= 10; n++) {
        coords.push(letter + n);
      }
    }
    this.computedCoords = coords;
  }
  getRandomUniqueCoord() {
    if (this.computedCoords.length === 0) return null; // no more coords

    const index = Math.floor(Math.random() * this.computedCoords.length);
    const coord = this.computedCoords[index];

    // Remove it so it can’t appear again
    this.computedCoords.splice(index, 1);

    return coord;
  }
  translateCoord(className) {
    const x = className[0];
    const y = className.slice(1); // gets "10", "5", etc.

    const alph = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
    const row = alph.indexOf(x);
    const col = parseInt(y, 10) - 1;

    return [row, col];
  }

  getNextSquare(root, i, dir) {
    const letter = root[0];          // "a"
    const num = parseInt(root.slice(1)); // 1, 2, 10...

    const alphabet = "abcdefghij";
    const letterIndex = alphabet.indexOf(letter);

    if (dir === "horizontal") {
      // MISMA letra, número crece
      return letter + (num + i);
    }

    if (dir === "vertical") {
      // letra cambia, número se mantiene
      return alphabet[letterIndex + i] + num;
    }
  }

  hasCoord(arr, coord) {
    return arr.some(([x, y]) => x === coord[0] && y === coord[1]);
  }
  applyHit(coordinate) {
    this.currentOpponent.board.receiveAttack(coordinate);
  }
  checkGameState() {
    if (this.currentOpponent.board.isLost()) {
      this.phase = 3;
      this.showMessage(`${this.currentPlayer.name} wins!`, "msgWin");
      document.querySelector(".player1 > .board").classList.remove("playing");
      document.querySelector(".player2 > .board").classList.remove("playing");
    }
  }
  showMessage(str, className = "") {
    const msgLbl = document.getElementById("gameMessage");
    msgLbl.textContent = str;
    if (className !== "") {
      msgLbl.classList.add(className);
    }
  }
  switchTurn() {
    if (this.currentPlayer === this.players[0] && this.currentOpponent === this.players[1]) {
      this.currentPlayer = this.players[1];
      this.currentOpponent = this.players[0];
    } else if (this.currentPlayer === this.players[1] && this.currentOpponent === this.players[0]) {
      this.currentPlayer = this.players[0];
      this.currentOpponent = this.players[1];
    }

  }

}
export default GamePlay;

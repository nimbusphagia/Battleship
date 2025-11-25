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
    this.computedCoords = this.generateCoords();
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
      })
    } else {
      //COMPUTER PLAYER
      this.gui.boardStatus(nodeBoard, "Automatically generated", "boardStatus");
      this.computeShipPlacement(player);
      player.status = true;
      console.log(player.board.board, player.board.ships);
    }
  }

  enablePlacing(startBtn, opponentNode, board, player) {
    const shipModule = shipHelper();
    opponentNode.classList.add("relative");
    opponentNode.appendChild(shipModule);
    this.gui.removeMultiVeil("", startBtn);
    //startBtn.style.display = "none";
    startBtn.remove();
    board.classList.add("placing");

    let small = [new Ship(1), new Ship(1), new Ship(1), new Ship(1)];
    let mid = [new Ship(2), new Ship(2), new Ship(2)];
    let large = [new Ship(3), new Ship(3)];
    let largest = [new Ship(4)];

    // STATE VARIABLES
    let selectedShip = null;
    let shipSize = 0;
    let dir = "horizontal";
    let queue = [];

    // MOUSE ENTER
    board.addEventListener("mouseover", e => {
      if (!selectedShip) return;
      if (!e.target.classList.contains("boardSquare")) return;

      const rootSqr = e.target.classList[3];
      this.projectAdjacentShips(board, rootSqr, shipSize, dir, "placingHover", true);

    });

    // MOUSE LEAVE
    board.addEventListener("mouseout", e => {
      if (!selectedShip) return;
      if (!e.target.classList.contains("boardSquare")) return;

      const rootSqr = e.target.classList[3];
      this.projectAdjacentShips(board, rootSqr, shipSize, dir, "placingHover", false);
    });

    // CLICK
    board.addEventListener("click", e => {
      if (!selectedShip) return;
      if (!e.target.classList.contains("boardSquare")) return;
      if (e.target.classList.contains("tempPlaced")) return;
      const sqr = e.target;
      const className = sqr.classList[3];
      if (this.projectAdjacentShips(board, className, shipSize, dir, "tempPlaced", true) !== false) {
        const coord = this.translateCoord(className);
        queue.push([selectedShip.pop(), coord, dir]);
        this.updateShipCounters(small, mid, large, largest);
      }

      // ALL SHIPS USED 
      if (selectedShip.length === 0) {
        selectedShip = null;
        shipSize = 0;
      }
      if (queue.length === 10) {
        document.querySelector(".playBtn").classList.replace("disabled", "enabled");
        //CHECK QUEUE 
        //console.log(queue[0][0]);
      }
    });

    // SELECT SHIPS
    shipModule.addEventListener("click", e => {
      if (e.target.closest(".dirBtn")) {
        dir = shipModule.querySelector(".shipDisplay").classList[1];
      }
      const item = e.target.closest(".shipImgCont");
      if (!item) return;
      const counter = item.parentElement.querySelector(".shipCounter")
      if (!counter) return;
      if (counter.textContent !== "0") {
        // APPLY SELECTED CLASSNAME
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
        } else {
          item.classList.remove("selected");
        }
      }

    });

    const buttonContainer = shipModule.querySelector(".shipModuleBtns");
    if (buttonContainer) buttonContainer.addEventListener("click", (e) => {
      // RESET PLACING PROCESS
      if (e.target.classList.contains("resetPlaceBtn")) {
        const paintedSqrs = board.querySelectorAll(".placingHover");
        paintedSqrs.forEach((s) => {
          s.classList.remove("placingHover", "tempPlaced", "spp", "mpp", "lpp", "xlpp", "spt", "mpt", "lpt", "xlpt")
          small = [new Ship(1), new Ship(1), new Ship(1), new Ship(1)];
          mid = [new Ship(2), new Ship(2), new Ship(2)];
          large = [new Ship(3), new Ship(3)];
          largest = [new Ship(4)];
          selectedShip = null;
          queue = [];
          shipSize = 0;
          const selectedNode = document.querySelector(".selected");
          if (selectedNode) selectedNode.classList.remove("selected");
          this.updateShipCounters(small, mid, large, largest);;
        })
      }
      // FINISH PLACING SHIPS
      if (e.target.classList.contains("playBtn") && e.target.classList.contains("enabled")) {
        const newBoard = this.createBoard();
        board.replaceWith(newBoard);
        this.gui.boardStatus(newBoard, "Player Ready", "boardStatus");
        for (const item of queue) {

          player.board.placeShip(item[0], item[1], item[2]);
        }
        //CHECK PUSHED QUEUE
        //console.log(player.board.ships);
        player.status = true;
        if (this.players[0].status && this.players[1].status) {
          const startGameBtn = document.createElement("button");
          startGameBtn.textContent = "Start";
          startGameBtn.classList.add("startGameBtn");
          const main = document.querySelector("main");
          main.appendChild(startGameBtn);
          this.gui.veil(main, startGameBtn);
          const boardSigns = document.querySelectorAll(".boardStatus");
          boardSigns.forEach((n) => {
            n.style.zIndex = "5";
            n.style.border = "none";
            n.style.color = "black";
          });
          startGameBtn.addEventListener("click", () => {
            this.gui.removeVeil(startGameBtn);
            boardSigns.forEach((b) => b.remove());
            this.gui.removeMultiVeil("boardStatus");
            this.playGame();
            this.phase = 2;
            startGameBtn.remove();
          })
        }
        shipModule.remove();
      }
    })
  }
  projectAdjacentShips(board, sqrClass, shipSize, dir, stateClass, add = true) {
    const queue = [];
    for (let i = 0; i < shipSize; i++) {
      const className = this.getNextSquare(sqrClass, i, dir);

      if (className === false) {
        queue.push(false);
      } else {
        const sqr = board.querySelector("." + className);

        if (!sqr) {
          queue.push(false);             // out of bounds / not found
        } else if (sqr.classList.contains("tempPlaced")) {
          queue.push(false);             // already occupied
        } else {
          queue.push(sqr);               // valid square
        }
      }
    }
    let imgClass = "";
    let id = stateClass[0];
    if (shipSize === 1) {
      imgClass = "sp" + id;
    } else if (shipSize === 2) {
      imgClass = "mp" + id;
    } else if (shipSize === 3) {
      imgClass = "lp" + id;
    } else if (shipSize === 4) {
      imgClass = "xlp" + id;
    }
    if (!queue.includes(false)) {
      for (const sqr of queue) {
        if (add) {
          sqr.classList.add(stateClass, imgClass);
        } else {
          sqr.classList.remove(stateClass, imgClass);
        }
      }
    } else {
      return false;
    }
  }
  updateShipCounters(s, m, l, xl) {
    document.querySelector(".smallShip .shipCounter").textContent = s.length;
    document.querySelector(".mediumShip .shipCounter").textContent = m.length;
    document.querySelector(".largeShip .shipCounter").textContent = l.length;
    document.querySelector(".largestShip .shipCounter").textContent = xl.length;
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
  computeShipPlacement(computer) {
    const qShips = [new Ship(1), new Ship(1), new Ship(1), new Ship(1), new Ship(2), new Ship(2), new Ship(2), new Ship(3), new Ship(3), new Ship(4)];
    for (const ship of qShips) {
      computer.board.placeRandomShip(ship);
    }
    console.log(computer.board.ships);
  }

  generateCoords() {
    const letters = "abcdefghij";
    const coords = [];

    for (const letter of letters) {
      for (let n = 1; n <= 10; n++) {
        coords.push(letter + n);
      }
    }
    return coords;
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
    const letter = root[0];               // "a"
    const num = parseInt(root.slice(1));  // 1, 2, 10...

    const alphabet = "abcdefghij";
    const letterIndex = alphabet.indexOf(letter);

    if (dir === "horizontal") {
      const finalNum = num + i;
      if (finalNum > 10) return false;
      return letter + finalNum;
    }

    if (dir === "vertical") {
      const nextIndex = letterIndex + i;

      // si se pasa de 'j' o queda por debajo de 'a'
      if (nextIndex < 0 || nextIndex >= alphabet.length) {
        return false;
      }

      const finalLetter = alphabet[nextIndex];
      return finalLetter + num;
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
      const restartBtn = document.querySelector(".hiddenBtn");
      restartBtn.style.display = "block";
      this.gui.veil(document.querySelector("main"), restartBtn);
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

import Gameboard from "./Gameboard.js";
class Player {
  #type;
  #name;
  #board;
  constructor(name = "Player", type = true) {
    this.#name = name;
    this.#type = type;
    this.#board = new Gameboard();
  }
}
export default Player;

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
  get name() { return this.#name };
  get type() { return this.#type };
  get board() { return this.#board };
}
export default Player;

import Gameboard from "./Gameboard.js";
class Player {
  #type;
  #name;
  #board;
  #status;
  constructor(name = "Player", type = true, status = false) {
    this.#name = name;
    this.#type = type;
    this.#board = new Gameboard();
    this.#status = status;
  }
  get name() { return this.#name };
  get type() { return this.#type };
  get board() { return this.#board };
  get status() { return this.#status };
  set status(status) {
    this.#status = status;
  }
}
export default Player;

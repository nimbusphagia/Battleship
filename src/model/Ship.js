class Ship {
  #length;
  #hits;
  #sunk;
  constructor(length = 2, hits = 0, sunk = false) {
    this.#length = length;
    this.#hits = hits;
    this.#sunk = sunk;
  }
  get length() {
    return this.#length;
  }
  set length(length) {
    this.#length = length;
  }
  get hits() {
    return this.#hits;
  }
  set hits(hits) {
    this.#hits = hits;
  }
  get sunk() {
    return this.#sunk;
  }
  set sunk(sunk) {
    this.#sunk = sunk;
  }
  //METHODS
  hit() {
    if (!this.isSunk()) this.#hits++;
  }
  isSunk() {
    if (this.#hits === this.#length) {
      this.#sunk = true;
    }
    return this.#sunk;
  }
}
export default Ship;

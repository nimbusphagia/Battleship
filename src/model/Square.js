class square {
  #ship;
  #hit;
  constructor(ship = null, hit = false) {
    this.#ship = ship;
    this.#hit = hit;
  }
  get ship() {
    return this.#ship;
  }
  get isHit() {
    return this.#hit;
  }

  set ship(ship) {
    this.#ship = ship;
  }
  hit() {
    if (this.#hit !== true) {
      this.#hit = true;
    } else {
      throw new Error("Can't hit the same square twice.");
    }
  }
}
export default square;

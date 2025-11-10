class Square {
  #ship;
  #hit;
  constructor(ship = null, hit = false) {
    this.#ship = ship;
    this.#hit = hit;
  }
  get ship() {
    return this.#ship;
  }
  get hit() {
    return this.#hit;
  }
  set hit(hit) {
    if (hit === true || hit === false) {
      this.#hit = hit;
    } else {
      return;
    }
  }
  set ship(ship) {
    this.#ship = ship;
  }
}
export default Square;

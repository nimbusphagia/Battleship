import Ship from "../model/Ship.js";

test("Receive hits", () => {
  const ship = new Ship();
  ship.hit();
  ship.hit();
  expect(ship.hits).toBe(2);
});
test("Check if ship has sunk", () => {
  const ship = new Ship();
  ship.hit();
  expect(ship.isSunk()).toBe(false);
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});

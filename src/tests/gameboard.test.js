import Gameboard from "../model/Gameboard.js";
import Ship from "../model/Ship.js";
const game = new Gameboard();
const ship2 = new Ship(2);
const ship3 = new Ship(3);
const ship4 = new Ship(4);
test("Place ship3 horizontally in coordinates: [3,5],[3,6],[3,7]", () => {
  game.placeShip(ship3, [3, 5], "hor");
  const row = game.board[3];
  expect(row[5].ship).toBe(ship3);
  expect(row[6].ship).toBe(ship3);
  expect(row[7].ship).toBe(ship3);
});
test("Place ship4 vertically in coordinates: [2,9], [3,9], [4,9], [5,9]", () => {
  game.placeShip(ship4, [2, 9], "ver");
  const board = game.board;
  expect(board[2][9].ship).toBe(ship4);
  expect(board[3][9].ship).toBe(ship4);
  expect(board[4][9].ship).toBe(ship4);
  expect(board[5][9].ship).toBe(ship4);
});
test("Place ship2 out of the boards range, thrown error", () => {
  expect(game.placeShip(ship2, [10, 10], "hor")).toBe("Square out of range");
});
test("Place ship2 on occupied squares", () => {
  expect(game.placeShip(ship2, [3, 4], "hor")).toBe("Occupied square");
});
test("Check for placed ships: ship3 and ship4", () => {
  expect(game.ships).toEqual([ship3, ship4]);
});
test("Hit an untouched square", () => {
  game.receiveAttack([0, 0]);
  expect(game.board[0][0].isHit).toBe(true);
});
test("Hit ship3[3,5]", () => {
  game.receiveAttack([3, 5]);
  expect(game.board[3][5].isHit).toBe(true);
  expect(game.board[3][5].ship.hits).toBe(1);
});
test("Hit ship3[3,5] again, throw error", () => {
  expect(() => game.receiveAttack([3, 5])).toThrow();
});
test("Hit and sink ship3", () => {
  expect(ship3.isSunk()).toBe(false);
  game.receiveAttack([3, 6]);
  game.receiveAttack([3, 7]);
  expect(ship3.isSunk()).toBe(true);
});
test("Hit a sunk ship3", () => {
  expect(() => receiveAttack([3, 6]).toThrow());
});
test("Sink all ships", () => {
  game.receiveAttack([2, 9]);
  game.receiveAttack([3, 9]);
  game.receiveAttack([4, 9]);
  const str = game.receiveAttack([5, 9]);
  expect(str).toBe("All ships have sunk");
});
test("Check for missed hits", () => {
  expect(game.missedSqr).toEqual([[0, 0]]);
});

import Square from "../model/Square.js";

test("Hit an empty square.", () => {
  const emptySquare = new Square();
  emptySquare.hit();

  expect(emptySquare.isHit).toBe(true);
});
test("Hit an already hit square.", () => {
  const hitSqr = new Square();
  hitSqr.hit();
  expect(() => hitSqr.hit()).toThrow("Can't hit the same square twice.");
});

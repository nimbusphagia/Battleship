import GameStart from "./GameStart.js";
function renderGame() {
  let p1 = null;
  let p2 = null;
  const start = new GameStart();
  start.newGameButton();
  document.body.addEventListener("click", (e) => {
    if (e.target === document.querySelector(".formBtn")) {
      p1 = start.p1;
      p2 = start.p2;
    }
  })
}
export default renderGame;

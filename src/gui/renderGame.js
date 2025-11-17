import GamePlay from "./GamePlay.js";
import GameStart from "./GameStart.js";
function renderGame() {
  let p1 = null;
  let p2 = null;
  const start = new GameStart();
  const play = new GamePlay();
  //CREATE EMPTY BOARDS
  play.emptyBoards();
  start.newGameButton();
  //CREATE P1 & P2
  document.body.addEventListener("click", (e) => {
    if (e.target === document.querySelector(".formBtn")) {
      p1 = start.p1;
      p2 = start.p2;
      document.querySelector(".player1 .name").textContent = p1.name;
      document.querySelector(".player2 .name").textContent = p2.name;
      document.querySelector(".popup").remove();
      play.enablePlaceBtns([p1, p2]);
    }
  });

  //PLACE SHIPS
}
export default renderGame;

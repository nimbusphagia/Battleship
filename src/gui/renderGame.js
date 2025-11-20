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
      const name1 = document.querySelector(".player1 .name");
      const name2 = document.querySelector(".player2 .name");
      p1 = start.p1;
      p2 = start.p2;
      if (p1 && p2) {
        name1.textContent = p1.name;
        name2.textContent = p2.name;

        play.enablePlaceBtns([p1, p2]);
        document.querySelector(".popup").remove();
      }
    }
  });

  //PLACE SHIPS
}
export default renderGame;

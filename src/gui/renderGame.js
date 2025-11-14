import Components from "./Components.js";
function renderGame() {
  let p1 = null;
  let p2 = null;
  const gameContainer = document.querySelector(".game");
  const gui = new Components();
  const renderStart = () => {
    const newGameBtn = document.createElement("button");
    newGameBtn.textContent = "New Game";
    newGameBtn.classList.add("newGameBtn");
    gameContainer.appendChild(newGameBtn);
    gui.veil(gameContainer, newGameBtn);
    newGameBtn.addEventListener("click", () => {
      gui.removeVeil(newGameBtn);
      const playersForm = gui.promptGameMode();
      gui.popUp(playersForm);
      newGameBtn.remove();
    });
  };
  renderStart();
}
export default renderGame;

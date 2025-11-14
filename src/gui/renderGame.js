import Components from "./Components.js";
async function renderGame() {
  let p1 = null;
  let p2 = null;
  const gui = new Components();
  const renderStart = async () => {
    const ngBtn = document.createElement("button");
    ngBtn.textContent = "New Game";
    ngBtn.classList.add("newGameBtn");
    ngBtn.addEventListener("click", async () => {
      [p1, p2] = await gui.playersPrompt();
      gui.renderGameboards(p1, p2);
    });
  };
  renderStart();
}
export default renderGame;

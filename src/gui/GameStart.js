import pvpIcon from "../assets/icons/pvpSword.png";
import pcIcon from "../assets/icons/computer.png";
import closeIcon from "../assets/icons/closeBtn.png";
import Player from "../model/Player.js";
class GameStart {
  #p1;
  #p2;
  body;
  main;
  footer;
  constructor() {
    this.body = document.body;
    this.main = document.querySelector("main");
    this.footer = document.querySelector("footer");
  }
  get p1() { return this.#p1 };
  get p2() { return this.#p2 };
  popUp(node, windowSize = "medium", gamephase = "start") {
    const popup = document.createElement("div");
    popup.classList.add("popup", windowSize);
    const header = document.createElement("div");
    header.classList.add("popupHeader");
    const closeBtn = document.createElement("img");
    closeBtn.classList.add("closeBtn");
    closeBtn.setAttribute("src", closeIcon);
    header.appendChild(closeBtn);
    popup.appendChild(header);
    popup.appendChild(node);
    this.main.appendChild(popup);
    this.veil(this.main, popup);
    closeBtn.addEventListener("click", () => {
      this.removeVeil(popup);
      popup.remove();
      if (gamephase === "start") this.newGameButton();
    });
    return popup;
  }

  veil(bg, node) {
    if (!document.querySelector(".veil")) {
      const veil = document.createElement("div");
      veil.classList.add("veil");
      bg.classList.add("relative");
      bg.append(veil);

    } else {
      const oldOnTop = document.querySelector(".ontop");
      if (oldOnTop) oldOnTop.classList.remove("ontop")
    }
    node.classList.add("ontop");
  }
  removeVeil(node) {
    const veil = document.querySelector(".veil");
    if (!veil) return;

    veil.parentElement.classList.remove("relative");
    veil.remove();
    node.classList.remove("ontop");
  }
  promptGameMode() {
    const container = document.createElement("div");
    container.classList.add("promptMode");
    const pvp = this.createGameMode("Local PvP", pvpIcon);
    const computer = this.createGameMode("vs Computer", pcIcon);
    container.appendChild(pvp);
    container.appendChild(computer);
    container.addEventListener("click", (e) => {
      if (pvp.contains(e.target)) {
        this.popUp(this.promptPlayers("Player 1", "Player 2"), "small");
        container.parentElement.remove();
      } else if (computer.contains(e.target)) {
        this.popUp(this.promptPlayers("Player1", "Computer"), "small");
        container.parentElement.remove();
      }
    });
    return container;
  }
  createGameMode(name, img) {
    const mode = document.createElement("div");
    mode.classList.add("gamemode");
    const icon = document.createElement("img");
    icon.classList.add("gamemodeIcon");
    icon.setAttribute("src", img);
    const modeName = document.createElement("p");
    modeName.classList.add("gamemodeName");
    modeName.textContent = name;
    mode.appendChild(icon);
    mode.appendChild(modeName);
    return mode;
  }
  promptPlayers(p1, p2) {
    const form = document.createElement("form");
    form.classList.add("formPlayers");
    const player1 = this.createPlayerForm(p1);
    const player2 = this.createPlayerForm(p2);
    const btn = document.createElement("button");
    btn.classList.add("formBtn");
    btn.textContent = "Start";
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const p1Input = document.getElementById("p1Input");
      const p2Input = document.getElementById("p2Input");
      const pcInput = document.getElementById("pcInput");
      this.#p1 = new Player(p1Input.value, true);
      if (pcInput) {
        this.#p2 = new Player(pcInput.value, false);
      } else {
        this.#p2 = new Player(p2Input.value, true);
      }
      const popup = form.parentElement;
      this.removeVeil(popup);
    });

    form.appendChild(player1);
    form.appendChild(player2);
    form.appendChild(btn);
    return form;
  }
  createPlayerForm(playerTitle) {
    let inputId = "";
    let inputValue = "";
    let inputDisable = false;
    if (playerTitle === "Computer") {
      inputId = "pcInput";
      inputValue = "Computer";
      inputDisable = true;
    } else {
      const num = playerTitle.match(/\d+/)[0];
      inputId = `p${num}Input`;
    }
    const inputContainer = document.createElement("div");
    inputContainer.classList.add("playerInput");
    const label = document.createElement("label");
    label.setAttribute("for", inputId);
    label.textContent = playerTitle;
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.id = inputId;
    input.value = inputValue;
    input.disabled = inputDisable;
    input.maxLength = 20;
    inputContainer.appendChild(label);
    inputContainer.appendChild(input);
    return inputContainer;
  }
  newGameButton() {
    const newGameBtn = document.createElement("button");
    newGameBtn.textContent = "New Game";
    newGameBtn.classList.add("newGameBtn");
    this.main.appendChild(newGameBtn);
    this.veil(this.main, newGameBtn);
    newGameBtn.addEventListener("click", () => {
      this.removeVeil(newGameBtn);
      const playersForm = this.promptGameMode();
      this.popUp(playersForm);
      newGameBtn.remove();
    });
  }
}
export default GameStart;

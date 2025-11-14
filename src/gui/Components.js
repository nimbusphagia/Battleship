import pvpIcon from "../assets/icons/pvpSword.png";
import pcIcon from "../assets/icons/computer.png";
import closeIcon from "../assets/icons/closeBtn.png";
class Components {
  body;
  main;
  footer;
  constructor() {
    this.body = document.body;
    this.main = document.querySelector("main");
    this.footer = document.querySelector("footer");
  }
  //incomplete
  popUp(node) {
    const popup = document.createElement("div");
    popup.classList.add("popup");
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
    });
  }

  veil(bg, node) {
    const veil = document.createElement("div");
    veil.classList.add("veil");
    bg.classList.add("relative");
    bg.append(veil);
    node.classList.add("ontop");
  }
  removeVeil(node) {
    const veil = document.querySelector(".veil");
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
        this.popUp(this.promptPlayers("Player 1", "Player 2"));
        container.parentElement.remove();
      } else if (computer.contains(e.target)) {
        this.popUp(this.promptPlayers("Player1", "Computer"));
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
    btn.textContent = "Start";
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
    input.readOnly = inputDisable;
    inputContainer.appendChild(label);
    inputContainer.appendChild(input);
    return inputContainer;
  }
}
export default Components;

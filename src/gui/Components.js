class Components {
  body;
  main;
  footer;
  constructor() {
    this.body = document.body;
    this.main = document.querySelector("main");
    this.footer = document.querySelector("footer");
  }
  async playersPrompt() {}

  showVeil(bg, node) {
    const veil = document.createElement("div");
    veil.classList.add("veil");
    bg.append(veil);
    node.classList.add("ontop");
  }
  removeVeil(node) {
    const veil = document.querySelector("veil");
    veil.remove();
    node.classList.remove("ontop");
  }
  renderGameboards(p1, p2) {}
}
export default Components;

function lib() {
  const veil = (bg, node) => {
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
  const multiVeil = (bg, node) => {
    const veil = document.createElement("div");
    veil.classList.add("multiVeil");
    bg.classList.add("relative");
    bg.append(veil);

    node.classList.add("offsetOntop");
  }
  const removeMultiVeil = (nodeClass, node = null) => {
    if (node) {
      const veil = document.querySelector(".multiVeil");
      veil.parentElement.classList.remove("relative");
      veil.remove();
      node.classList.remove("offsetOntop");
    } else {
      const veils = document.querySelectorAll(".multiVeil");
      if (!veils) return;
      for (const v of veils) {
        const parentElement = v.parentElement;
        parentElement.classList.remove("relative");
        v.remove();
        const node = parentElement.querySelector(nodeClass);
        node.classList.remove("offsetOntop");
      }
    }
  }


  const removeVeil = (node) => {
    const veil = document.querySelector(".veil");
    if (!veil) return;

    veil.parentElement.classList.remove("relative");
    veil.remove();
    node.classList.remove("ontop");
  }
  return { veil, removeVeil, multiVeil, removeMultiVeil }
}
export default lib;

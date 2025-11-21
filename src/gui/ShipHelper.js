import smallShip from "../assets/icons/ship1.png";
import mediumShip from "../assets/icons/ship2.png";
import largeShip from "../assets/icons/ship3.png";
import largestShip from "../assets/icons/ship4.png";
function shipHelper(s = 4, m = 3, l = 2, xl = 1) {
  const small = s;
  const medium = m;
  const large = l;
  const largest = xl;

  function display() {
    const module = document.createElement("div");
    module.classList.add("shipModule");
    //INDICATION
    const indication = document.createElement("div");
    indication.classList.add("placeIndication");
    const text = document.createElement("h3");
    text.textContent = "Place your ships strategically";
    indication.appendChild(text);
    module.appendChild(indication);
    //SHIPS
    const shipDisplay = document.createElement("div");
    shipDisplay.classList.add("shipDisplay");
    shipDisplay.appendChild(renderShip(small, "smallShip"));
    shipDisplay.appendChild(renderShip(medium, "mediumShip"));
    shipDisplay.appendChild(renderShip(large, "largeShip"));
    shipDisplay.appendChild(renderShip(largest, "largestShip"));
    module.appendChild(shipDisplay);
    //BUTTONS
    const btnCont = document.createElement("div");
    btnCont.classList.add("shipModuleBtns");
    const submitBtn = document.createElement("button");
    submitBtn.classList.add("btn", "playBtn");
    submitBtn.textContent = "Ready";
    const resetBtn = document.createElement("button");
    resetBtn.classList.add("btn", "resetPlaceBtn");
    resetBtn.textContent = "Reset";
    btnCont.appendChild(submitBtn);
    btnCont.appendChild(resetBtn);
    module.appendChild(btnCont);
    return module;
  }
  function renderShip(size, className = null) {
    const node = document.createElement("div");
    node.classList.add("shipContainer");
    const shipItem = document.createElement("div");
    if (className) {
      shipItem.classList.add("shipItem", className);
    }
    const shipImgCont = document.createElement("div");
    shipImgCont.classList.add("shipImgCont");
    const shipCounter = document.createElement("p");
    shipCounter.classList.add("shipCounter");
    shipCounter.textContent = size;
    shipItem.appendChild(shipCounter);
    shipItem.appendChild(shipImgCont);
    const dirBtn = document.createElement("button");
    dirBtn.classList.add("dirBtn");
    dirBtn.textContent = "↺";
    node.appendChild(shipItem);
    node.appendChild(dirBtn);
    //PERSONALIZE ACCORDING TO SIZE
    let imgSrc;
    let imgClass;
    let reps;
    switch (size) {
      case small:
        imgSrc = smallShip;
        imgClass = "small";
        reps = 1;
        break;
      case medium:
        imgSrc = mediumShip;
        imgClass = "medium";
        reps = 2;

        break;
      case large:
        imgSrc = largeShip;
        imgClass = "large";
        reps = 3;
        break;
      case largest:
        imgSrc = largestShip;
        imgClass = "largest"
        reps = 4;
        break;
    }
    for (let i = 0; i < reps; i++) {
      const shipImg = document.createElement("img");
      shipImg.classList.add("shipImg", imgClass);
      shipImg.src = imgSrc;
      shipImgCont.appendChild(shipImg);
    }
    return node;
  }
  return display();
}
export default shipHelper;

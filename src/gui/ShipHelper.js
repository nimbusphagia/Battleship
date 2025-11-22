import smallShip from "../assets/icons/ship1.png";
import mediumShip from "../assets/icons/ship2.png";
import largeShip from "../assets/icons/ship3.png";
import largestShip from "../assets/icons/ship4.png";
import horizontal from "../assets/icons/horizontal.png";
import vertical from "../assets/icons/vertical.png";
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
    const dirBtn = document.createElement("div");
    dirBtn.classList.add("dirBtn");
    const dirImg = document.createElement("img");
    dirImg.src = horizontal;
    dirBtn.appendChild(dirImg);

    indication.appendChild(text);
    indication.appendChild(dirBtn);
    module.appendChild(indication);
    //SHIPS
    const shipDisplay = document.createElement("div");
    shipDisplay.classList.add("shipDisplay", "horizontal");
    shipDisplay.appendChild(renderShip(small, "smallShip"));
    shipDisplay.appendChild(renderShip(medium, "mediumShip"));
    shipDisplay.appendChild(renderShip(large, "largeShip"));
    shipDisplay.appendChild(renderShip(largest, "largestShip"));
    module.appendChild(shipDisplay);
    //DIRECTION ICON 
    dirBtn.addEventListener("click", () => {
      if (shipDisplay.classList.contains("horizontal")) {
        dirImg.src = vertical;
        shipDisplay.classList.replace("horizontal", "vertical");
      } else if (shipDisplay.classList.contains("vertical")) {
        dirImg.src = horizontal;
        shipDisplay.classList.replace("vertical", "horizontal");
      }
    });
    //BUTTONS
    const btnCont = document.createElement("div");
    btnCont.classList.add("shipModuleBtns");
    const submitBtn = document.createElement("button");
    submitBtn.classList.add("btn", "playBtn", "disabled");
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

    //PERSONALIZE ACCORDING TO SIZE
    let imgSrc;
    let imgClass;
    let reps;
    switch (size) {
      case small:
        imgSrc = smallShip;
        imgClass = "smallShip";
        reps = 1;
        break;
      case medium:
        imgSrc = mediumShip;
        imgClass = "mediumShip";
        reps = 2;

        break;
      case large:
        imgSrc = largeShip;
        imgClass = "largeShip";
        reps = 3;
        break;
      case largest:
        imgSrc = largestShip;
        imgClass = "largestShip"
        reps = 4;
        break;
    }
    for (let i = 0; i < reps; i++) {
      const shipImg = document.createElement("img");
      shipImg.classList.add("shipImg");
      shipImg.src = imgSrc;
      shipImgCont.appendChild(shipImg);
    }
    //EVENT
    shipImgCont.classList.add(imgClass);
    return shipItem;
  }
  return display();
}
export default shipHelper;

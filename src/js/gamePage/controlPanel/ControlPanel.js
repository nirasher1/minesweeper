import Watch from "./watch.js";

let _movesCount;

const setupElements = controlPanel => {
    const element = controlPanel._element;
    element.classList.add("control-panel");

    controlPanel._watchElement.appendChild(document.createTextNode("time: "));
    controlPanel._watchElement.appendChild(controlPanel.watch.render());

    controlPanel._newGameButton.innerText = "START A NEW GAME";
    controlPanel._newGameButton.addEventListener("click", controlPanel.startANewGame);

    element.appendChild(controlPanel._watchElement);
    element.appendChild(controlPanel._minesCounterElement);
    element.appendChild(controlPanel._newGameButton);
};

export default class ControlPanel {
    constructor(minesToMarkCount, movesCount, startANewGame) {
        this.minesToMarkCount = minesToMarkCount;
        _movesCount = movesCount;
        this.startANewGame = startANewGame;
        this.watch = new Watch();
        this._element = document.createElement("div");
        this._watchElement = document.createElement("span");
        this._minesCounterElement = document.createElement("span");
        this._newGameButton = document.createElement("button");
        setupElements(this);
    }

    decreaseMinesToMarkCount() {
        this.minesToMarkCount--;
        this.render();
    }

    increaseMinesToMarkCount() {
        this.minesToMarkCount++;
        this.render();
    }

    render() {
        this._minesCounterElement.innerText = `mines: ${this.minesToMarkCount}`;

        return this._element;
    }
}
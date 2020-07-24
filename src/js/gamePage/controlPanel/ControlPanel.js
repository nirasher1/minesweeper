import Watch from "./watch.js";


const _setupElements = Symbol("setupElements");
const _element = Symbol("element");
const _watchElement = Symbol("watchElement");
const _minesCounterElement = Symbol("minesCounterElement");
const _newGameButtonElement = Symbol("element");
const _minesToMarkCount = Symbol("minesToMarkCount");
const _startANewGame = Symbol("startANewGame");

export default class ControlPanel {
    constructor(minesToMarkCount, movesCount, startANewGame) {
        this.watch = new Watch();
        this[_minesToMarkCount] = minesToMarkCount;
        this[_startANewGame] = startANewGame;
        this[_element] = document.createElement("div");
        this[_watchElement] = document.createElement("span");
        this[_minesCounterElement] = document.createElement("span");
        this[_newGameButtonElement] = document.createElement("button");
        this[_setupElements]();
    }

    [_setupElements]() {
        const element = this[_element];
        element.classList.add("control-panel");

        this[_watchElement].appendChild(document.createTextNode("time: "));
        this[_watchElement].appendChild(this.watch.render());

        this[_newGameButtonElement].innerText = "START A NEW GAME";
        this[_newGameButtonElement].addEventListener("click", this[_startANewGame]);

        element.appendChild(this[_watchElement]);
        element.appendChild(this[_minesCounterElement]);
        element.appendChild(this[_newGameButtonElement]);
    }

    decreaseMinesToMarkCount() {
        this[_minesToMarkCount]--;
        this.render();
    }

    increaseMinesToMarkCount() {
        this[_minesToMarkCount]++;
        this.render();
    }

    render() {
        this[_minesCounterElement].innerText = `mines: ${this[_minesToMarkCount]}`;

        return this[_element];
    }
}
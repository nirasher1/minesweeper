import Watch from "./watch.js";

export default class ControlPanel {
    constructor(minesToMarkCount, movesCount) {
        this.minesToMarkCount = minesToMarkCount;
        this.movesCount = movesCount;
        this.watch = new Watch();
        this._element = document.createElement("div");
    }

    increaseMinesToMarkCount() {
        this.minesToMarkCount--;
        this.render();
    }

    decreaseMinesToMarkCount() {
        this.minesToMarkCount--;
        this.render();
    }

    increaseMovesCount() {
        this.movesCount++;
        this.render();
    }

    render() {
        const element = this._element;
        element.classList.add("control-panel");

        const watchElement = document.createElement("span");
        watchElement.appendChild(document.createTextNode("time: "));
        watchElement.appendChild(this.watch.render());
        element.appendChild(watchElement);

        const minesCounterElement = document.createElement("span");
        minesCounterElement.innerText = `mines to expose: ${this.minesToMarkCount}`;
        element.appendChild(minesCounterElement);

        const movesCounterElement = document.createElement("span");
        movesCounterElement.innerText = `moves: ${this.movesCount}`;
        element.appendChild(movesCounterElement);

        return element;
    }
}
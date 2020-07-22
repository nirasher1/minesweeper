const parseNumber = number => {
    const stringNumber = number.toString();
    if (stringNumber.length < 2) {
        return "0" + stringNumber;
    }
    return stringNumber;
};

export default class Watch {
    constructor() {
        this.interval = null;
        this.totalSeconds = 0;
        this._element = document.createElement("span");
    }

    start() {
        this.interval = setInterval(this.updateCounter.bind(this), 1000);
    }

    stop() {
        if (this.interval !== null) {
            clearInterval(this.interval);
        }
    }

    updateCounter() {
        this.totalSeconds++;
        this.render();
    }

    render() {
        this._element.classList.add("watch");
        const minutes = parseNumber(Math.round(this.totalSeconds / 60));
        const seconds = parseNumber(Math.round(this.totalSeconds % 60));
        this._element.innerText = `${minutes}:${seconds}`;

        return this._element
    }
}
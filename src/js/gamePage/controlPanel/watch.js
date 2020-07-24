const parseNumber = number => {
    const stringNumber = number.toString();
    if (stringNumber.length < 2) {
        return "0" + stringNumber;
    }
    return stringNumber;
};

const _interval = Symbol("interval");
const _totalSeconds = Symbol("totalSeconds");
const _element = Symbol("element");

export default class Watch {
    constructor() {
        this[_interval] = null;
        this[_totalSeconds] = 0;
        this[_element] = document.createElement("span");
    }

    start() {
        this[_interval] = setInterval(this.updateCounter.bind(this), 1000);
    }

    stop() {
        if (this[_interval] !== null) {
            clearInterval(this[_interval]);
        }
    }

    updateCounter() {
        this[_totalSeconds]++;
        this.render();
    }

    render() {
        this[_element].classList.add("watch");
        const minutes = parseNumber(Math.round(this[_totalSeconds] / 60));
        const seconds = parseNumber(Math.round(this[_totalSeconds] % 60));
        this[_element].innerText = `${minutes}:${seconds}`;

        return this[_element]
    }
}
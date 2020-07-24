const SELECTED_CLASS = "selected";


const _description = Symbol("description");
const _onClick = Symbol("onClick");
const _element = Symbol("element");

export default class GameOption {
    constructor({description, rowsCount, columnsCount, minesCount, classList} = {}, onClick) {
        this.rowsCount = rowsCount;
        this.columnsCount = columnsCount;
        this.minesCount = minesCount;
        this._rowsCountElement = document.createTextNode(this.rowsCount);
        this._columnsCountElement = document.createTextNode(this.columnsCount);
        this._minesCountElement = document.createTextNode(this.minesCount);
        this[_description] = description;
        this[_onClick] = onClick;
        this[_element] = document.createElement("div");

        this[_element].classList.add(classList);
        this[_element].addEventListener("click", (e) => this[_onClick](e, this));
    }

    markAsSelectedOption() {
        this[_element].classList.add(SELECTED_CLASS);
    }

    unmarkAsSelectedOption() {
        this[_element].classList.remove(SELECTED_CLASS);
    }

    render() {
        this[_element].classList.add("game-option");

        this[_element].innerHTML = `
        <h2>${this[_description]}</h2>
        `;

        const fieldsElement = document.createElement("div");

        const rowsAndColumnsCountSpan = document.createElement("span");
        rowsAndColumnsCountSpan.appendChild(this._rowsCountElement);
        rowsAndColumnsCountSpan.appendChild(document.createTextNode(" X "));
        rowsAndColumnsCountSpan.appendChild(this._columnsCountElement);

        const minesCountSPan = document.createElement("span");
        minesCountSPan.appendChild(this._minesCountElement);
        minesCountSPan.appendChild(document.createTextNode(" mines"));

        fieldsElement.appendChild(rowsAndColumnsCountSpan);
        fieldsElement.appendChild(minesCountSPan);
        this[_element].append(fieldsElement);

        return this[_element];
    }
}
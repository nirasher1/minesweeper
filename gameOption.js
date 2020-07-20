const SELECTED_CLASS = "selected";


export default class GameOption {
    constructor({description, rowsCount, columnsCount, minesCount, classList} = {}, onClick) {
        this.description = description;
        this.rowsCount = rowsCount;
        this.columnsCount = columnsCount;
        this.minesCount = minesCount;
        this.onClick = onClick;
        this.isSelected = false;
        this._rowsCountElement = document.createTextNode(this.rowsCount);
        this._columnsCountElement = document.createTextNode(this.columnsCount);
        this._minesCountElement = document.createTextNode(this.minesCount);
        this._element = document.createElement("div");
        this._element.classList.add(classList);
        this._element.addEventListener("click", (e) => this.onClick(e, this));
    }

    markAsSelectedOption() {
        this.isSelected = true;
        this.render();
    }

    unmarkAsSelectedOption() {
        this.isSelected = false;
        this.render();
    }

    render() {
        this._element.classList.add("game-option");

        if (this.isSelected) {
            this._element.classList.add(SELECTED_CLASS)
        } else {
            this._element.classList.remove(SELECTED_CLASS)
        }

        this._element.innerHTML = `
        <h2>${this.description}</h2>
        `
        // <div>
        //     <span>${this.rowsCount} X ${this.columnsCount}</span>
        //     <span>${this.minesCount} mines</span>
        // </div>
        // `
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
        this._element.append(fieldsElement);

        return this._element;
    }
}
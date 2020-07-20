const SELECTED_CLASS = "selected";


export default class GameOption {
    constructor({description, rowsCount, columnsCount, minesCount, classList} = {}, onClick) {
        this.description = description;
        this.rowsCount = rowsCount;
        this.columnsCount = columnsCount;
        this.minesCount = minesCount;
        this.onClick = onClick;
        this.isSelected = false;
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
        <div>
            <span>${this.rowsCount} X ${this.columnsCount}</span>
            <span>${this.minesCount} mines</span>
        </div>
        `

        return this._element;
    }
}
const SELECTED_CLASS = "selected";


const createInput = (customGameOption, min = 0, max = 0, onInputValidUpdate) => {
    let inputElement = document.createElement("input");
    inputElement.setAttribute("type", "number");
    inputElement.min = min.toString();
    inputElement.max = max.toString();
    inputElement.step = "1";

    inputElement.addEventListener("blur", () => {
        console.log("blur")
        let currentValue = parseInt(inputElement.value);
        let newValue = Math.round(currentValue);
        if (currentValue > inputElement.max) {
            newValue = inputElement.max;
        } else if(currentValue < inputElement.min && currentValue !== 0) {
            newValue = inputElement.min;
        } else if (currentValue === 0) {
            newValue = "";
        }

        inputElement.value = newValue.toString();
        onInputValidUpdate(newValue.toString());

        const rowsCountInputValue = customGameOption._rowsCountElement.value;
        const columnsCountInputValue = customGameOption._columnsCountElement.value;
        if (rowsCountInputValue !== "" && columnsCountInputValue !== "") {
            customGameOption._minesCountElement.max =
                ((rowsCountInputValue - 1) * (columnsCountInputValue - 1)).toString();
        }
    });

    return inputElement;
};

export default class CustomGameOption {
    constructor({minCustomRowsCount, maxCustomRowsCount, minCustomColumnsCount, maxCustomColumnsCount, minCustomMinesCount, customOptionClassList} = {}, onClick) {
        this.description = "Custom";
        this.onClick = onClick;
        this.rowsCount = null;
        this.columnsCount = null;
        this.minesCount = null;
        this._rowsCountElement = createInput(this, minCustomRowsCount, maxCustomRowsCount, (value) => this.rowsCount = value);
        this._columnsCountElement = createInput(this, minCustomColumnsCount, maxCustomColumnsCount, (value) => this.columnsCount = value);
        this._minesCountElement = createInput(this, minCustomMinesCount, minCustomRowsCount, (value) => this.minesCount = value);
        this.isSelected = false;
        this._element = document.createElement("div");
        this._element.classList.add(customOptionClassList);
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
        this._element.append(fieldsElement);

        return this._element;
    }
}
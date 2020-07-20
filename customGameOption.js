import GameOption from "./gameOption.js";

const createInput = (customGameOption, min = 0, max = 0, onInputValidUpdate) => {
    let inputElement = document.createElement("input");
    inputElement.setAttribute("type", "number");
    inputElement.min = min.toString();
    inputElement.max = max.toString();
    inputElement.step = "1";

    inputElement.addEventListener("blur", () => {
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

export default class CustomGameOption extends GameOption {
    constructor({minCustomRowsCount,
                    maxCustomRowsCount,
                    minCustomColumnsCount,
                    maxCustomColumnsCount,
                    minCustomMinesCount,
                    customOptionClassList} = {}, onClick) {
        super({
            description: "Custom",
            rowsCount: null,
            columnsCount: null,
            minesCount: null,
            classList: customOptionClassList
        }, onClick);
        this._rowsCountElement = createInput(this,
            minCustomRowsCount,
            maxCustomRowsCount,
            (value) => this.rowsCount = value);
        this._columnsCountElement = createInput(this,
            minCustomColumnsCount,
            maxCustomColumnsCount,
            (value) => this.columnsCount = value);
        this._minesCountElement = createInput(this,
            minCustomMinesCount,
            minCustomRowsCount,
            (value) => this.minesCount = value);
    }
}
import GameOption from "./gameOption.js"
import CustomGameOption from "./customGameOption.js"


const onOptionClick = (configurationPage, e, gameOption) => {
    const currentSelectedOption = configurationPage.selectedOption;

    if (currentSelectedOption === null) {
        configurationPage._startButtonElement.addEventListener("click",
            () => configurationPage.onStartGameClick(configurationPage))
    }
    if (currentSelectedOption !== null && currentSelectedOption !== gameOption) {
        currentSelectedOption.unmarkAsSelectedOption();
    }

    configurationPage.selectedOption = gameOption;
    configurationPage.selectedOption.markAsSelectedOption();
};

export default class ConfigurationPage {
    constructor({
                    builtinOptions,
                    minCustomRowsCount,
                    maxCustomRowsCount,
                    minCustomColumnsCount,
                    maxCustomColumnsCount,
                    minCustomMinesCount,
                    customOptionClassList,
                    onStartGameClick}) {
        this.builtinOptions = builtinOptions;
        this.customOption = {
            minCustomRowsCount,
            maxCustomRowsCount,
            minCustomColumnsCount,
            maxCustomColumnsCount,
            minCustomMinesCount,
            customOptionClassList
        };
        this.onStartGameClick = onStartGameClick;
        this.gameOptions = [];
        this.selectedOption = null;
        this._element = document.createElement("div");
        this._startButtonElement = document.createElement("button");
    }

    render() {
        const element = this._element;
        element.id = "configuration-page";

        const title  = document.createElement("h2");
        title.innerText = "Choose your plan:";

        const gameOptionsDiv = document.createElement("div");
        gameOptionsDiv.id = "game-options";


        this.builtinOptions.forEach(option => {
            const gameOption = new GameOption(option, (e, gameOption) => onOptionClick(this, e, gameOption));
            this.gameOptions.push(gameOption);
            gameOptionsDiv.appendChild(gameOption.render());
        });
        const customGameOption = new CustomGameOption(this.customOption,
            (e, gameOption) => onOptionClick(this, e, gameOption));
        gameOptionsDiv.appendChild(customGameOption.render());

        this._startButtonElement.innerText = "START GAME";

        element.appendChild(title);
        element.appendChild(gameOptionsDiv);
        element.appendChild(this._startButtonElement);

        document.body.appendChild(this._element);
    }
}
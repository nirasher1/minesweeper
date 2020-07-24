import GameOption from "./gameOption.js"
import CustomGameOption from "./customGameOption.js"

const _element = Symbol("element");
const _startButtonElement = Symbol("startButtonElement");
const _onOptionClick = Symbol("onOptionClick");
const _builtinOptionsMetadata = Symbol("builtinOptions");
const _customOptionMetadata = Symbol("customOption");
const _onStartGameClick = Symbol("onStartGameClick");
const _gameOptions = Symbol("gameOptions");

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
        this.selectedGameOption = null;
        this[_builtinOptionsMetadata] = builtinOptions;
        this[_customOptionMetadata] = {
            minCustomRowsCount,
            maxCustomRowsCount,
            minCustomColumnsCount,
            maxCustomColumnsCount,
            minCustomMinesCount,
            customOptionClassList
        };
        this[_onStartGameClick] = onStartGameClick;
        this[_gameOptions] = [];
        this[_element] = document.createElement("div");
        this[_startButtonElement] = document.createElement("button");
    }

    [_onOptionClick] (e, gameOption) {
        const currentSelectedOption = this.selectedGameOption;

        if (currentSelectedOption === null) {
            this[_startButtonElement].addEventListener("click",
                () => this[_onStartGameClick](this))
        }
        if (currentSelectedOption !== null && currentSelectedOption !== gameOption) {
            currentSelectedOption.unmarkAsSelectedOption();
        }

        this.selectedGameOption = gameOption;
        this.selectedGameOption.markAsSelectedOption();
    };

    render() {
        const element = this[_element];
        element.id = "configuration-page";

        const title  = document.createElement("h2");
        title.innerText = "Choose your plan:";

        const gameOptionsDiv = document.createElement("div");
        gameOptionsDiv.id = "game-options";


        this[_builtinOptionsMetadata].forEach(option => {
            const gameOption = new GameOption(option, (e, gameOption) => this[_onOptionClick].call(this, e, gameOption));
            this[_gameOptions].push(gameOption);
            gameOptionsDiv.appendChild(gameOption.render());
        });
        const customGameOption = new CustomGameOption(this[_customOptionMetadata],
            (e, gameOption) => this[_onOptionClick].call(this, e, gameOption));
        gameOptionsDiv.appendChild(customGameOption.render());

        this[_startButtonElement].innerText = "START GAME";

        element.appendChild(title);
        element.appendChild(gameOptionsDiv);
        element.appendChild(this[_startButtonElement]);

        document.body.appendChild(this[_element]);
    }
}
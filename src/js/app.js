import GamePage from './gamePage/gamePage.js'
import { default as CONFIG } from "../data/configuration.js"
import ConfigurationPage from "./configurationPage/configurationPage.js"

const startGame = (configurationPage) => {
    const selectedOption = configurationPage.selectedGameOption;
    if (selectedOption.rowsCount !== null
        && selectedOption.columnsCount !== null
        && selectedOption.minesCount !== null) {
        const userBoard = new GamePage(
            selectedOption.rowsCount,
            selectedOption.columnsCount,
            selectedOption.minesCount);
        const configurationPage = document.getElementById("configuration-page");
        if (configurationPage !== null) {
            document.body.removeChild(configurationPage);
            userBoard.render();
        }
    }
};

const configurationPage = new ConfigurationPage({
    builtinOptions: CONFIG.builtinOptions,
    ...CONFIG.customOptionDefaults,
    onStartGameClick: startGame
});
configurationPage.render();
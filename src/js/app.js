import GamePage from './gamePage/gamePage.js'
import ConfigurationPage from "./configurationPage/configurationPage.js"

// Todo: Usually what we do here is get the row, column and mine count from user input
// Todo: Also these options would usually be in a separate config file (to make the app.js as clean as possible)

const builtinOptions = [
    {
        description: "Easy",
        rowsCount: 9,
        columnsCount: 9,
        minesCount: 10,
        classList: ["green"]
    },
    {
        description: "Medium",
        rowsCount: 16,
        columnsCount: 16,
        minesCount: 40,
        classList: ["yellow"]
    },
    {
        description: "Hard",
        rowsCount: 16,
        columnsCount: 30,
        minesCount: 99,
        classList: ["orange"]
    }
];

const startGame = (configurationPage) => {
    const selectedOption = configurationPage.selectedOption;
    if (selectedOption.rowsCount !== null
        && selectedOption.columnsCount !== null
        && selectedOption.minesCount !== null) {
        const userBoard = new GamePage(
            selectedOption.rowsCount,
            selectedOption.columnsCount,
            selectedOption.minesCount);
        // Todo: make sure there's a configuration page rendered before trying to remove it
        document.body.removeChild(document.getElementById("configuration-page"));
        userBoard.render();
    }
};

// Todo: add all of the max and min params to the configuration (i.e builtinOptions)
const configurationPage = new ConfigurationPage({
    builtinOptions,
    minCustomRowsCount: 9,
    maxCustomRowsCount: 24,
    minCustomColumnsCount: 9,
    maxCustomColumnsCount: 30,
    minCustomMinesCount: 10,
    customOptionClassList: ["purple"],
    onStartGameClick: startGame
});
configurationPage.render();


// const configurationPage = new ConfigurationPage({
//     builtinOptions,
//     minCustomRowsCount: 9,
//     maxCustomRowsCount: 24,
//     minCustomColumnsCount: 9,
//     maxCustomColumnsCount: 30,
//     minCustomMinesCount: 10,
//     customOptionClassList: ["purple"]
// });
// configurationPage.render();

// const userBoard = new GamePage(ROW_CELLS_COUNT, COLUMN_CELLS_COUNT, MINES_COUNT);
// userBoard.render();
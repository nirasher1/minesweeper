import Board from './board.js'
import ConfigurationPage from "./configurationPage.js"

// Todo: general note: Organizing your files into folders can really help

// const ROW_CELLS_COUNT = 9;
// const COLUMN_CELLS_COUNT = 9;
// const MINES_COUNT = 10;

const ROW_CELLS_COUNT = 16;
const COLUMN_CELLS_COUNT = 16;
const MINES_COUNT = 40;

// const ROW_CELLS_COUNT = 16;
// const COLUMN_CELLS_COUNT = 30;
// const MINES_COUNT = 99;

// CUSTOM
// columns range 9 - 30
// rows range 9 - 24
// mines amount range 10 - (x-1)(y-1)

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
        const userBoard = new Board(
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

// const userBoard = new Board(ROW_CELLS_COUNT, COLUMN_CELLS_COUNT, MINES_COUNT);
// userBoard.render();
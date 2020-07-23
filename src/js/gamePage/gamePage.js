import {
    generateDistinctPoint as generatePointCoordinates,
    getPointIndex,
    getSurroundingPoints
} from "./boardUtils/generatePointUtils.js";
import Cell from "./cell.js"
import USER_MARK from "./boardUtils/userMark.js";
import MessageModal from "../messageModal/messageModal.js"
import ControlPanel from "./controlPanel/ControlPanel.js";

// Todo: all of these functions and variables should be in the gamePage class
// Change func(gamePage) to func.call(this) and then func() with no need of params
let minesPoints = [];
let cleanPointsToExpose = [];

const startANewGame = () => {
    location.reload();
};

const iterateMatrix = (board, callback) => {
    for (let rowIndex = 0; rowIndex < board.rowsCount; rowIndex++) {
        for (let columnIndex = 0; columnIndex < board.columnsCount; columnIndex++) {
            callback(board.matrix[rowIndex][columnIndex])
        }
    }
};

const removeAllBoardListeners = (board) => {
    iterateMatrix(board, cell => cell.removeAllListeners());
};

const exposeUnexposedMines = board => {
    minesPoints.forEach(point => {
        const currentPoint = board.matrix[point.rowIndex][point.columnIndex];
        if (!currentPoint.isExposed && currentPoint.userMark !== USER_MARK.FLAGm) {
            currentPoint.isExposed = true;
            currentPoint.render()
        }
    });
};

const exposeMistakeFlags = board => {
    iterateMatrix(board, (cell) => {
        if (!cell.isMine && cell.userMark === USER_MARK.FLAG) {
            cell.markAsUserMistake();
        }
    })
};

const getPointsWithoutMines = board => {
    const cleanPoints = [];
    for (let rowIndex = 0; rowIndex < board.rowsCount; rowIndex++) {
        for (let columnIndex = 0; columnIndex < board.columnsCount; columnIndex++) {
            if (!board.matrix[rowIndex][columnIndex].isMine) {
                cleanPoints.push({
                    rowIndex,
                    columnIndex
                })
            }
        }
    }
    return cleanPoints
};

const countSurroundingMines = (board) => {
    const rowsCount = board.rowsCount;
    const columnsCount = board.columnsCount;
    for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
        for (let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
            let minesAround = 0;
            let surroundingPoints = getSurroundingPoints(
                { rowIndex, columnIndex }, rowsCount, columnsCount);
            surroundingPoints.forEach(point => {
                if (board.matrix[point.rowIndex][point.columnIndex].isMine) {
                    minesAround++;
                }
            });
            board.matrix[rowIndex][columnIndex].minesAroundCount = minesAround;
        }
    }
};

const firstMove = (board, clickedPoint) => {
    locateMines(board, clickedPoint);
    board.controlPanel.watch.start();
    countSurroundingMines(board);
    cleanPointsToExpose = getPointsWithoutMines(board);
};

const exposeSurroundingCells = (board, clickedCell, clickedCellPoint) => {
    if (!clickedCell.isMine && clickedCell.minesAroundCount === 0) {
        let surroundingPoints = getSurroundingPoints(clickedCellPoint, board.rowsCount, board.columnsCount);
        surroundingPoints.forEach(point => {
            const currentCell = board.matrix[point.rowIndex][point.columnIndex];
            if (!currentCell.isExposed && currentCell.userMark === USER_MARK.NONE) {
                onCellClick(board, point, false);
            }
        });
    }
};

const finishGameAsWin = board => {
    board.isWinDetected = true;
    board.controlPanel.watch.stop();
    removeAllBoardListeners(board);
    new MessageModal(
        "win",
        true,
        [{
        title: "NEW GAME",
        onClick: startANewGame
    }]).render();
};

const finishGameAsLose = (board, clickedCell) => {
    board.controlPanel.watch.stop();
    clickedCell.markAsBombed();
    exposeUnexposedMines(board);
    exposeMistakeFlags(board);
    removeAllBoardListeners(board);
    new MessageModal(
        "lose",
        true,
        [{
        title: "NEW GAME",
        onClick: startANewGame
    }]).render();
};

const onCellClick = (board, clickedPoint, isUserEvent = false) => {
    const clickedCell = board.matrix[clickedPoint.rowIndex][clickedPoint.columnIndex];

    if (isUserEvent && board.movesCount === 0) {
        firstMove(board, clickedPoint);
    }

    clickedCell.isExposed = true;
    if (!clickedCell.isMine) {
        cleanPointsToExpose.splice(getPointIndex(clickedPoint, cleanPointsToExpose), 1);
        exposeSurroundingCells(board, clickedCell, clickedPoint);
    }
    if (isUserEvent) {
        board.movesCount++;
    }
    clickedCell.render();

    if (clickedCell.isMine) {
        finishGameAsLose(board, clickedCell);
    }
    if (cleanPointsToExpose.length === 0) {
        if (!board.isWinDetected) {
            finishGameAsWin(board);
        }
    }
};

const locateMines = (board, clickedPoint) => {
    for (let mineIndex = 0; mineIndex < board.minesCount; mineIndex++) {
        let newPoint = generatePointCoordinates(
            board.rowsCount, board.columnsCount, minesPoints, clickedPoint);
        minesPoints.push(newPoint);
        board.matrix[newPoint.rowIndex][newPoint.columnIndex].isMine = true;
    }
};

const createMatrixStructure = (board) => {
    const controlPanel = board.controlPanel;
    const matrix = [];
    for (let rowIndex = 0; rowIndex < board.rowsCount; rowIndex++) {
        matrix.push([]);
        for (let columnIndex = 0; columnIndex < board.columnsCount; columnIndex++) {
            matrix[rowIndex].push(new Cell({
                onClick: () => onCellClick(
                    board,
                    { rowIndex, columnIndex },
                    true),
                onPutFlag: controlPanel.decreaseMinesToMarkCount.bind(controlPanel),
                onDeleteFlag: controlPanel.increaseMinesToMarkCount.bind(controlPanel)
            }));
        }
    }
    board.matrix = matrix;
};


export default class GamePage {
    constructor(rowsCount, columnsCount, minesCount) {
        this.movesCount = 0;
        this.rowsCount = rowsCount;
        this.columnsCount = columnsCount;
        this.minesCount = minesCount;
        this.matrix = undefined;
        this.isWinDetected = false;
        this.controlPanel = new ControlPanel(this.minesCount, this.movesCount, startANewGame);
        createMatrixStructure(this);
        console.log(this.matrix)
    }

    render() {
        let boardDiv = document.createElement("div");
        boardDiv.id = "minesweeper-board";

        boardDiv.appendChild(this.controlPanel.render());

        const tableElement = document.createElement("table");
        boardDiv.appendChild(tableElement);
        for (let rowIndex = 0; rowIndex < this.rowsCount; rowIndex++) {
            let currentRowElement = document.createElement("tr");
            tableElement.appendChild(currentRowElement);
            for (let columnIndex = 0; columnIndex < this.columnsCount; columnIndex++) {
                currentRowElement.appendChild(this.matrix[rowIndex][columnIndex].render());
            }
        }

        document.body.appendChild(boardDiv);
    }
}
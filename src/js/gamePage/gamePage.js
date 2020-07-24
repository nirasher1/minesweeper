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

const onCellClick = (board, clickedPoint, isUserEvent = false) => {
    const clickedCell = board.matrix[clickedPoint.rowIndex][clickedPoint.columnIndex];

    if (isUserEvent && board.movesCount === 0) {
        board[_firstMove](clickedPoint);
    }

    clickedCell.isExposed = true;
    if (!clickedCell.isMine) {
        cleanPointsToExpose.splice(getPointIndex(clickedPoint, cleanPointsToExpose), 1);
        board[_exposeSurroundingCells](clickedCell, clickedPoint);
    }
    if (isUserEvent) {
        board.movesCount++;
    }
    clickedCell.render();

    if (clickedCell.isMine) {
        board[_finishGameAsLose](clickedCell);
    }
    if (cleanPointsToExpose.length === 0) {
        if (!board.isWinDetected) {
            board[_finishGameAsWin]();
        }
    }
};

const _createMatrixStructure = Symbol("createMatrixStructure");
const _locateMines = Symbol("locateMines");
const _firstMove = Symbol("firstMove");
const _finishGameAsWin = Symbol("finishGameAsWin");
const _finishGameAsLose = Symbol("finishGameAsLose");
const _exposeSurroundingCells = Symbol("exposeSurroundingCells");
const _calculateSurroundingMines = Symbol("calculateSurroundingMines");
const _getPointsWithoutMines = Symbol("getPointsWithoutMines");
const _exposeUnexposedMines = Symbol("exposeUnexposedMines");
const _exposeMistakeFlags = Symbol("exposeMistakeFlags");
const _iterateMatrix = Symbol("iterateMatrix");
const _removeAllBoardListeners = Symbol("removeAllBoardListeners");

export default class GamePage {
    constructor(rowsCount, columnsCount, minesCount) {
        this.movesCount = 0;
        this.rowsCount = rowsCount;
        this.columnsCount = columnsCount;
        this.minesCount = minesCount;
        this.matrix = null;
        this.isWinDetected = false;
        this.controlPanel = new ControlPanel(this.minesCount, this.movesCount, startANewGame);
        this[_createMatrixStructure]();
    }

    [_createMatrixStructure]() {
        const controlPanel = this.controlPanel;
        const matrix = [];
        for (let rowIndex = 0; rowIndex < this.rowsCount; rowIndex++) {
            matrix.push([]);
            for (let columnIndex = 0; columnIndex < this.columnsCount; columnIndex++) {
                matrix[rowIndex].push(new Cell({
                    onClick: () => onCellClick(
                        this,
                        { rowIndex, columnIndex },
                        true),
                    onPutFlag: controlPanel.decreaseMinesToMarkCount.bind(controlPanel),
                    onDeleteFlag: controlPanel.increaseMinesToMarkCount.bind(controlPanel)
                }));
            }
        }
        this.matrix = matrix;
    };

    [_locateMines](clickedPoint) {
        for (let mineIndex = 0; mineIndex < this.minesCount; mineIndex++) {
            let newPoint = generatePointCoordinates(
                this.rowsCount, this.columnsCount, minesPoints, clickedPoint);
            minesPoints.push(newPoint);
            this.matrix[newPoint.rowIndex][newPoint.columnIndex].isMine = true;
        }
    };

    [_firstMove](clickedPoint) {
        this[_locateMines](clickedPoint);
        this.controlPanel.watch.start();
        this[_calculateSurroundingMines]();
        cleanPointsToExpose = this[_getPointsWithoutMines]();
    };

    [_finishGameAsWin]() {
        this.isWinDetected = true;
        this.controlPanel.watch.stop();
        this[_removeAllBoardListeners]();
        new MessageModal(
            "win",
            true,
            [{
                title: "NEW GAME",
                onClick: startANewGame
            }]).render();
    };

    [_finishGameAsLose](clickedCell) {
        this.controlPanel.watch.stop();
        clickedCell.markAsBombed();
        this[_exposeUnexposedMines]();
        this[_exposeMistakeFlags]();
        this[_removeAllBoardListeners]();
        new MessageModal(
            "lose",
            true,
            [{
                title: "NEW GAME",
                onClick: startANewGame
            }]).render();
    };

    [_exposeSurroundingCells] = (clickedCell, clickedCellPoint) => {
        if (!clickedCell.isMine && clickedCell.minesAroundCount === 0) {
            let surroundingPoints = getSurroundingPoints(
                clickedCellPoint,
                this.rowsCount,
                this.columnsCount);
            surroundingPoints.forEach(point => {
                const currentCell = this.matrix[point.rowIndex][point.columnIndex];
                if (!currentCell.isExposed && currentCell.userMark === USER_MARK.NONE) {
                    onCellClick(this, point, false);
                }
            });
        }
    };

    [_calculateSurroundingMines]() {
        const rowsCount = this.rowsCount;
        const columnsCount = this.columnsCount;
        for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
            for (let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
                let minesAround = 0;
                let surroundingPoints = getSurroundingPoints(
                    { rowIndex, columnIndex }, rowsCount, columnsCount);
                surroundingPoints.forEach(point => {
                    if (this.matrix[point.rowIndex][point.columnIndex].isMine) {
                        minesAround++;
                    }
                });
                this.matrix[rowIndex][columnIndex].minesAroundCount = minesAround;
            }
        }
    };

    [_getPointsWithoutMines]() {
        const cleanPoints = [];
        for (let rowIndex = 0; rowIndex < this.rowsCount; rowIndex++) {
            for (let columnIndex = 0; columnIndex < this.columnsCount; columnIndex++) {
                if (!this.matrix[rowIndex][columnIndex].isMine) {
                    cleanPoints.push({
                        rowIndex,
                        columnIndex
                    })
                }
            }
        }
        return cleanPoints
    };

    [_exposeUnexposedMines]() {
        minesPoints.forEach(point => {
            const currentPoint = this.matrix[point.rowIndex][point.columnIndex];
            if (!currentPoint.isExposed && currentPoint.userMark !== USER_MARK.FLAG) {
                currentPoint.isExposed = true;
                currentPoint.render()
            }
        });
    };

    [_exposeMistakeFlags]() {
        this[_iterateMatrix]((cell) => {
            if (!cell.isMine && cell.userMark === USER_MARK.FLAG) {
                cell.markAsUserMistake();
            }
        })
    };

    [_iterateMatrix](callback) {
        for (let rowIndex = 0; rowIndex < this.rowsCount; rowIndex++) {
            for (let columnIndex = 0; columnIndex < this.columnsCount; columnIndex++) {
                callback(this.matrix[rowIndex][columnIndex])
            }
        }
    };

    [_removeAllBoardListeners]() {
        this[_iterateMatrix](cell => cell.removeAllListeners());
    };

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
import {
    generateDistinctPoint as generatePointCoordinates,
    getPointIndex,
    getSurroundingPoints
} from "./boardUtils/generatePointUtils.js";
import Cell from "./cell.js"
import USER_MARK from "./boardUtils/userMark.js";
import MessageModal from "../messageModal/messageModal.js"
import ControlPanel from "./controlPanel/ControlPanel.js";


const startANewGame = () => {
    location.reload();
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
const _onCellClick = Symbol("onCellClick");
const _movesCount = Symbol("movesCount");
const _rowsCount = Symbol("rowsCount");
const _columnsCount = Symbol("columnsCount");
const _minesCount = Symbol("minesCount");
const _matrix = Symbol("matrix");
const _isWinDetected = Symbol("isWinDetected");
const _controlPanel = Symbol("controlPanel");
const _minesPoints = Symbol("minesPoints");
const _cleanPointsToExpose = Symbol("cleanPointsToExpose");

export default class GamePage {
    constructor(rowsCount, columnsCount, minesCount) {
        this[_movesCount] = 0;
        this[_rowsCount] = rowsCount;
        this[_columnsCount] = columnsCount;
        this[_minesCount] = minesCount;
        this[_matrix] = null;
        this[_isWinDetected] = false;
        this[_controlPanel] = new ControlPanel(this[_minesCount], this[_movesCount], startANewGame);
        this[_minesPoints] = [];
        this[_cleanPointsToExpose] = [];

        this[_createMatrixStructure]();
    }

    [_createMatrixStructure]() {
        const controlPanel = this[_controlPanel];
        const matrix = [];
        for (let rowIndex = 0; rowIndex < this[_rowsCount]; rowIndex++) {
            matrix.push([]);
            for (let columnIndex = 0; columnIndex < this[_columnsCount]; columnIndex++) {
                matrix[rowIndex].push(new Cell({
                    onClick: () => this[_onCellClick](
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
        for (let mineIndex = 0; mineIndex < this[_minesCount]; mineIndex++) {
            let newPoint = generatePointCoordinates(
                this[_rowsCount], this[_columnsCount], this[_minesPoints], clickedPoint);
            this[_minesPoints].push(newPoint);
            this.matrix[newPoint.rowIndex][newPoint.columnIndex].isMine = true;
        }
    };

    [_firstMove](clickedPoint) {
        this[_locateMines](clickedPoint);
        this[_controlPanel].watch.start();
        this[_calculateSurroundingMines]();
        this[_cleanPointsToExpose] = this[_getPointsWithoutMines]();
    };

    [_finishGameAsWin]() {
        this.isWinDetected = true;
        this[_controlPanel].watch.stop();
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
        this[_controlPanel].watch.stop();
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
                this[_rowsCount],
                this[_columnsCount]);
            surroundingPoints.forEach(point => {
                const currentCell = this.matrix[point.rowIndex][point.columnIndex];
                if (!currentCell.isExposed && currentCell.userMark === USER_MARK.NONE) {
                    this[_onCellClick](point, false);
                }
            });
        }
    };

    [_calculateSurroundingMines]() {
        const rowsCount = this[_rowsCount];
        const columnsCount = this[_columnsCount];
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
        for (let rowIndex = 0; rowIndex < this[_rowsCount]; rowIndex++) {
            for (let columnIndex = 0; columnIndex < this[_columnsCount]; columnIndex++) {
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
        this[_minesPoints].forEach(point => {
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
        for (let rowIndex = 0; rowIndex < this[_rowsCount]; rowIndex++) {
            for (let columnIndex = 0; columnIndex < this[_columnsCount]; columnIndex++) {
                callback(this.matrix[rowIndex][columnIndex])
            }
        }
    };

    [_removeAllBoardListeners]() {
        this[_iterateMatrix](cell => cell.removeAllListeners());
    };

    [_onCellClick](clickedPoint, isUserEvent = false) {
        const clickedCell = this.matrix[clickedPoint.rowIndex][clickedPoint.columnIndex];

        if (isUserEvent && this[_movesCount] === 0) {
            this[_firstMove](clickedPoint);
        }

        clickedCell.isExposed = true;
        if (!clickedCell.isMine) {
            this[_cleanPointsToExpose].splice(getPointIndex(clickedPoint, this[_cleanPointsToExpose]), 1);
            this[_exposeSurroundingCells](clickedCell, clickedPoint);
        }
        if (isUserEvent) {
            this[_movesCount]++;
        }
        clickedCell.render();

        if (clickedCell.isMine) {
            this[_finishGameAsLose](clickedCell);
        }
        if (this[_cleanPointsToExpose].length === 0) {
            if (!this.isWinDetected) {
                this[_finishGameAsWin]();
            }
        }
    };

    render() {
        let boardDiv = document.createElement("div");
        boardDiv.id = "minesweeper-board";

        boardDiv.appendChild(this[_controlPanel].render());

        const tableElement = document.createElement("table");
        boardDiv.appendChild(tableElement);
        for (let rowIndex = 0; rowIndex < this[_rowsCount]; rowIndex++) {
            let currentRowElement = document.createElement("tr");
            tableElement.appendChild(currentRowElement);
            for (let columnIndex = 0; columnIndex < this[_columnsCount]; columnIndex++) {
                currentRowElement.appendChild(this.matrix[rowIndex][columnIndex].render());
            }
        }

        document.body.appendChild(boardDiv);
    }
}
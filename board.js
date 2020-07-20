// Todo: long imports are usually broken into multiple lines as well
import { generateDistinctPoint as generatePointCoordinates, getPointIndex, getSurroundingPoints } from "./generatePointUtils.js";
import Cell from "./cell.js"
import USER_MARK from "./userMark.js";

// Todo: all of these functions and variables should be in the board class
// Change func(board) to func.call(this) and then func() with no need of params
let minesPoints = [];
let cleanPointsToExpose = [];

// Todo: In this situation it could be very helpful to have a util function that iterates over the matrix and calls a callback function
// i.e: iterateMatrix(board.matrix, (cell) => { return cell.foo })
const removeAllBoardListeners = (board) => {
    for (let rowIndex = 0; rowIndex < board.rowsCount; rowIndex++) {
        for (let columnIndex = 0; columnIndex < board.columnsCount; columnIndex++) {
            board.matrix[rowIndex][columnIndex].removeAllListeners();
        }
    }
};

// Todo: rename to something like expose all mines
const bombAllHidingMines = (board) => {
    // Todo: inline forEach is better performance wise
    for (let point of minesPoints) {
        const currentPoint = board.matrix[point.rowIndex][point.columnIndex];
        if (!currentPoint.isExposed && currentPoint.userMark === USER_MARK.NONE) {
            currentPoint.isExposed = true;
            currentPoint.render()
        }
    }
};

// Todo: rename (not sure what you mean by clean points)
const getCleanPoints = board => {
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

// Todo: can rename to countSurroundingMines or something shorter
const calcMinesSurroundingEachCell = (board) => {
    const rowsCount = board.rowsCount;
    const columnsCount = board.columnsCount;
    for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
        for (let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
            let minesAround = 0;
            let surroundingPoints = getSurroundingPoints(
                { rowIndex, columnIndex }, rowsCount, columnsCount);
            for (let point of surroundingPoints) {
                if (board.matrix[point.rowIndex][point.columnIndex].isMine) {
                    minesAround++;
                }
            }
            board.matrix[rowIndex][columnIndex].minesAroundCount = minesAround;
        }
    }
};

const firstMove = (board, clickedPoint) => {
    locateMines(board, clickedPoint);
    calcMinesSurroundingEachCell(board);
    cleanPointsToExpose = getCleanPoints(board);
};

const exposeSurroundingCells = (board, clickedCell, clickedCellPoint) => {
    if (!clickedCell.isMine && clickedCell.minesAroundCount === 0) {
        let surroundingPoints = getSurroundingPoints(clickedCellPoint, board.rowsCount, board.columnsCount);
        for (let point of surroundingPoints) {
            if (!board.matrix[point.rowIndex][point.columnIndex].isExposed) {
                onCellClick(board, point, false);
            }
        }
    }
};

const finishGameAsWin = board => {
    alert("win");
    removeAllBoardListeners(board)
};

const finishGameAsLose = (board, clickedCell) => {
    alert("lose");
    clickedCell.markAsBombed();
    bombAllHidingMines(board);
    removeAllBoardListeners(board)
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
        finishGameAsWin(board);
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
    const matrix = [];
    for (let rowIndex = 0; rowIndex < board.rowsCount; rowIndex++) {
        matrix.push([]);
        for (let columnIndex = 0; columnIndex < board.columnsCount; columnIndex++) {
            matrix[rowIndex].push(new Cell({onClick: () => onCellClick(
                board,
                { rowIndex, columnIndex },
                true)}));
        }
    }
    board.matrix = matrix;
};


export default class Board {
    constructor(rowsCount, columnsCount, minesCount) {
        this.movesCount = 0;
        this.rowsCount = rowsCount;
        this.columnsCount = columnsCount;
        this.minesCount = minesCount;
        this.matrix = undefined;
        createMatrixStructure(this);
        console.log(this.matrix)
    }

    render() {
        let boardDiv = document.createElement("div");
        boardDiv.id = "minesweeper-board";

        boardDiv.appendChild(document.createElement("table"));
        for (let rowIndex = 0; rowIndex < this.rowsCount; rowIndex++) {
            boardDiv.appendChild(document.createElement("tr"));
            for (let columnIndex = 0; columnIndex < this.columnsCount; columnIndex++) {
                boardDiv.appendChild(this.matrix[rowIndex][columnIndex].render());
            }
        }

        document.body.appendChild(boardDiv);
    }
}
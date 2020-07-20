const possibleSurroundingPoints = (centerPoint) => {
    const { rowIndex, columnIndex } = centerPoint;
    return [{
        rowIndex: rowIndex - 1,
        columnIndex: columnIndex - 1
    },
        {
            rowIndex: rowIndex - 1,
            columnIndex
        },
        {
            rowIndex: rowIndex - 1,
            columnIndex: columnIndex + 1
        },
        {
            rowIndex,
            columnIndex: columnIndex - 1
        },
        {
            rowIndex,
            columnIndex: columnIndex + 1
        },
        {
            rowIndex: rowIndex + 1,
            columnIndex: columnIndex - 1
        },
        {
            rowIndex: rowIndex + 1,
            columnIndex
        },
        {
            rowIndex: rowIndex + 1,
            columnIndex: columnIndex + 1
        }];
};

const isPointExist = (point, rowsCount, columnsCount) => {
    const { rowIndex, columnIndex } = point;
    return rowIndex >= 0 && rowIndex < rowsCount && columnIndex >= 0 && columnIndex < columnsCount;
};

export const getSurroundingPoints = (centerPoint, rowsCount, columnsCount) => {
    const existingPoints = [];

    const pointsToCheck = possibleSurroundingPoints(centerPoint);
    for (let point of pointsToCheck) {
        if (isPointExist(point, rowsCount, columnsCount)) {
            existingPoints.push(point)
        }
    }

    return existingPoints;
};

const generateNumber = highest => {
    return Math.floor(Math.random() * (highest + 1));
};

const generatePoint = (highestRowIndex, highestColumnIndex) => {
    return {
        rowIndex: generateNumber(highestRowIndex),
        columnIndex: generateNumber(highestColumnIndex)
    }
};

export const getPointIndex = (generatedPoint, points) => {
    for (let index = 0; index < points.length; index++){
        let point = points[index];
        if (point.rowIndex === generatedPoint.rowIndex && point.columnIndex === generatedPoint.columnIndex) {
            return index;
        }
    }
    return -1;
};

export const isMinePointExist = (generatedPoint, points) => {
    return getPointIndex(generatedPoint, points) >= 0;
};

export const generateDistinctPoint = (rowsCount, columnsCount, points, clickedPoint) => {
    let pointsToExclude = getSurroundingPoints(clickedPoint, rowsCount, columnsCount);
    pointsToExclude.push(clickedPoint);
    pointsToExclude = pointsToExclude.concat(points);
    console.log(pointsToExclude);
    let newPoint = generatePoint(rowsCount - 1, columnsCount - 1);
    while (isMinePointExist(newPoint, pointsToExclude)) {
        console.log("point exists");
        newPoint = generatePoint(rowsCount - 1, columnsCount - 1);
    }
    return newPoint;
};
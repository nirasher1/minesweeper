export default {
    builtinOptions: [
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
    ],
    customOptionDefaults: {
        minCustomRowsCount: 9,
        maxCustomRowsCount: 24,
        minCustomColumnsCount: 9,
        maxCustomColumnsCount: 30,
        minCustomMinesCount: 10,
        customOptionClassList: ["purple"]
    }
};
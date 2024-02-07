'use strict'

function setMinesAroundCount(rowIdx, colIdx) {
    var minesAroundCounter = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if(i < 0 || j < 0 || i >= gBoard.length || j >= gBoard[0].length) continue
            if(gBoard[i][j].isMine) minesAroundCounter++
        }
    }
    return minesAroundCounter
}

function randomMines(rowIdx, colIdx) {

    for (var i = 0; i < gLevel.mines; i++) { //amount of mines according to the level
        const randomLocationRow = getRandomIntInclusive(0, gLevel.size - 1)
        const randomLocationCol = getRandomIntInclusive(0, gLevel.size - 1)
        if (randomLocationCol === colIdx && randomLocationRow === rowIdx) {
            i--
            continue
        }
        console.log(randomLocationRow, randomLocationCol)
        gBoard[randomLocationRow][randomLocationCol].isMine = true
    }
    console.table(gBoard)
    // renderBoard(gBoard)
}
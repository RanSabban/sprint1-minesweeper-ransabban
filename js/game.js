'use strict'

const gMine = `<img src = "../images/mine.jpeg>"`
var gBoard = []
const gLevel = {
    size: 4,
    mines: 2
}

const gLife = 3
const sizeSelector = [4, 8, 12]
const gFlag = '🚩'

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    livesCount: 3,
    minesCount: 0
}

const div = document.querySelector('.table-container')
// div.addEventListener("contextmenu", (e) => {e.preventDefault()});

function onInit() {
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        livesCount: gLife,
        minesCount: 0
    }
    renderLives()
    createButtons()
    gBoard = createBoard()
    renderBoard(gBoard)
}

function createBoard() {
    const size = gLevel.size
    const board = []
    for (let i = 0; i < size; i++) {
        board.push([])
        for (let j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
                // const cell = board[i][j]
                const className = `cell cell-${i}-${j}`
                const neigboardsCount = setMinesAroundCount(i,j)
                strHTML += `<td onclick="onCellClicked(this,${i},${j})" oncontextmenu="flagCell(this,${i},${j})" class ="${className}"></td>`
            }
        }
        strHTML += `</tr>`
        const elContainer = document.querySelector('.table-container')
        elContainer.innerHTML = strHTML
    }

function createButtons() {
    var strHTML = ''
    for (var i = 0; i < sizeSelector.length; i++) {
        strHTML += `<button onclick="chooseSize(${sizeSelector[i]})">${sizeSelector[i]}</button>`
    }
    const elContainer = document.querySelector('.button-container')
    elContainer.innerHTML = strHTML
}

function chooseSize(size) {
    gLevel.size = size
    onInit()
}

function onCellClicked(cellEl,rowIdx,colIdx) {
    if(!gGame.shownCount) randomMines(rowIdx,colIdx)
    if(gBoard[rowIdx][colIdx].isMarked === true) return
    if(gBoard[rowIdx][colIdx].isMine){
        cellEl.classList.add("mine")
        gGame.livesCount--
        gGame.minesCount++
        renderLives()
    } else if(!gBoard[rowIdx][colIdx].isMine){
        const neigboardsCount = setMinesAroundCount(rowIdx,colIdx)
        if (neigboardsCount){
            cellEl.innerText = neigboardsCount
            cellEl.classList.add('revealed')
            gGame.shownCount++
            gBoard[rowIdx][colIdx].isShown = true
            console.log(gGame.shownCount)
        }
        else {
            revealAround(rowIdx,colIdx)
        }
    }
    checkVictory()
}

function flagCell(el,i,j){
    // console.log(el,i,j)
    if(gBoard[i][j].isShown) return
    if (el.innerText === gFlag){
        gGame.markedCount--
        gBoard[i][j].isMarked = false
        el.innerText = ''
        el.classList.remove("flag")
        console.log(gGame.markedCount)
    } else {
        gGame.markedCount++
        gBoard[i][j].isMarked = true
        el.innerText = gFlag
        el.classList.add("flag")
        console.log(gGame.markedCount)
    }
    checkVictory()
}

function revealAround(rowIdx,colIdx){
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if(i < 0 || j < 0 || i >= gBoard.length || j >= gBoard[0].length) continue
            const cellEl = document.querySelector(`.cell-${i}-${j}`)
            const aroundCounter = setMinesAroundCount(i,j)
            if(aroundCounter){
                cellEl.innerText = aroundCounter
                cellEl.classList.add('revealed')
                if(!gBoard[i][j].isShown){
                    gBoard[i][j].isShown = true
                    gGame.shownCount++
                } 
            } else {
                cellEl.classList.add('revealed')
                gBoard.isShown = true
                if(!gBoard[i][j].isShown){
                    gBoard[i][j].isShown = true
                    gGame.shownCount++
                } 
            }
        }
    }
    console.log(gGame.shownCount)
}

function renderLives(){
    const livesEl = document.querySelector(".lives-container")
    var strHTML = ''
    for (var i = 0 ; i < gGame.livesCount; i++){
        strHTML+= `<img class ="lives" src="images/lives.png">`
    }
    livesEl.innerHTML = strHTML
}

function checkVictory(){
    const regularCells = gLevel.size**2 - gLevel.mines 
    const minesShown = gGame.markedCount + gGame.minesCount
    if(gGame.shownCount === regularCells && minesShown === gLevel.mines){
        console.log('VICTORY!')
    }
}








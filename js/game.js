'use strict'

const gMine = `<img src = "../images/mine.jpeg>"`
var gBoard = []
const gLevel = {
    size: 5,
    mines: 3
}


const gLife = 3
const sizeSelector = [5, 8, 12]
const gFlag = '🚩'
var gHintTimeout

var gGame = {
    isOn: false,
    shownCount: 0,
    flaggedCount: 0,
    secsPassed: 0,
    livesCount: 3,
    minesCount: 0,
    safeClickCount: 3
}

var gHints = []
var isHintActive = false

const div = document.querySelector('.table-container')
div.addEventListener("contextmenu", (e) => { e.preventDefault() });

function onInit() {
    gGame = {
        isOn: false,
        shownCount: 0,
        flaggedCount: 0,
        secsPassed: 0,
        livesCount: gLife,
        minesCount: 0,
        safeClickCount: 3
    }
    renderLives()
    renderHints()
    createButtons()
    gBoard = createBoard()
    renderBoard(gBoard)
    defaultSmiley()
    updateScore()
    renderSafeClicksAttemps()
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
            const neigboardsCount = setMinesAroundCount(i, j)
            strHTML += `<td onclick="onCellClicked(this,${i},${j})" oncontextmenu="onCellRightClick(this,${i},${j})" class ="${className}"></td>`
        }
    }
    strHTML += `</tr>`
    const elContainer = document.querySelector('.table-container')
    elContainer.innerHTML = strHTML
}

function createButtons() {
    var strHTML = ''
    for (var i = 0; i < sizeSelector.length; i++) {
        if (i === 0) {
            strHTML += `<button class = "lvlsBtns" onclick="chooseSize(${sizeSelector[i]})">Beginner</button>`
        }
        if (i === 1) {
            strHTML += `<button class = "lvlsBtns" onclick="chooseSize(${sizeSelector[i]})">Intermidate</button>`
        }
        if (i === 2) {
            strHTML += `<button class = "lvlsBtns" onclick="chooseSize(${sizeSelector[i]})">Expert</button>`
        }

    }
    const elContainer = document.querySelector('.button-container')
    elContainer.innerHTML = strHTML
}

function renderMinesSize(size){
    if (size === 5){
        gLevel.mines = 3
    }
    if (size === 8){
        gLevel.mines = 14
    }
    if (size === 12){
        gLevel.mines = 32
    }
}



function chooseSize(size) {
    gLevel.size = size
    renderMinesSize(gLevel.size)
    onInit()
}

function onCellClicked(cellEl, rowIdx, colIdx) {
    if (isHintActive) {
        revealHintCell(cellEl, rowIdx, colIdx)
        return
    }
    if (!gGame.isOn) {
        randomMines(rowIdx, colIdx)
        gGame.isOn = true
        startTimer()
    }
    if (gBoard[rowIdx][colIdx].isMarked === true) return
    if (gBoard[rowIdx][colIdx].isMine) {
        cellEl.classList.add("mine")
        gGame.livesCount--
        gBoard[rowIdx][colIdx].isShown = true
        if (gGame.livesCount === 0) {
            gGame.minesCount++
            gameOver()
        } else {
            gGame.minesCount++
            renderLives()
        }
    } else if (!gBoard[rowIdx][colIdx].isMine) {
        const neigboardsCount = setMinesAroundCount(rowIdx, colIdx)
        if (neigboardsCount) {
            cellEl.innerText = neigboardsCount
            cellEl.classList.add('revealed')
            gGame.shownCount++
            gBoard[rowIdx][colIdx].isShown = true
            console.log(gGame.shownCount)
        }
        else {
            revealAround(rowIdx, colIdx)
        }
    }
    updateScore()
    checkVictory()
}

function onCellRightClick(el, i, j) {
    // console.log(el,i,j)
    if (gBoard[i][j].isShown) return
    if (gBoard[i][j].isMine && gBoard[i][j].isShown) return
    if (el.innerText === gFlag) {
        gGame.flaggedCount--
        gBoard[i][j].isMarked = false
        el.innerText = ''
        el.classList.remove("flag")
        console.log(gGame.flaggedCount)
    } else {
        gGame.flaggedCount++
        gBoard[i][j].isMarked = true
        el.innerText = gFlag
        el.classList.add("flag")
        console.log(gGame.flaggedCount)
    }
    updateScore()
    checkVictory()
}

function revealAround(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i < 0 || j < 0 || i >= gBoard.length || j >= gBoard[0].length) continue
            const cellEl = document.querySelector(`.cell-${i}-${j}`)
            const aroundCounter = setMinesAroundCount(i, j)
            if (aroundCounter) {
                cellEl.innerText = aroundCounter
                cellEl.classList.add('revealed')
                if (!gBoard[i][j].isShown) {
                    gBoard[i][j].isShown = true
                    gGame.shownCount++
                }
            } else {
                cellEl.classList.add('revealed')
                gBoard.isShown = true
                if (!gBoard[i][j].isShown) {
                    gBoard[i][j].isShown = true
                    gGame.shownCount++
                    revealAround(i, j)
                }
            }
        }
    }
    console.log(gGame.shownCount)
}

function renderLives() {
    const livesEl = document.querySelector(".lives-container")
    var strHTML = ''
    for (var i = 0; i < gGame.livesCount; i++) {
        strHTML += `<img class ="lives" src="images/lives.png">`
    }
    livesEl.innerHTML = strHTML
}

function checkVictory() {
    const regularCells = gLevel.size ** 2 - gLevel.mines
    const calculateScore = gGame.flaggedCount + gGame.minesCount
    if (gGame.shownCount === regularCells && calculateScore === gLevel.mines) {
        const smileyEl = document.querySelector(".smiley-btn")
        smileyEl.innerText = '😎'
    }
}

function gameOver() {
    const smileyEl = document.querySelector(".smiley-btn")
    smileyEl.innerText = '🤯'
    bestScore()
}

function defaultSmiley() {
    const smileyEl = document.querySelector(".smiley-btn")
    smileyEl.innerText = '😁'
}

function renderHints() {
    const hintsEl = document.querySelector(".hints-container")
    var strHTML = ''
    for (var i = 0; i < 3; i++) {
        gHints[i] = {
            isUsed: false
        }
        strHTML += `<button class = "hint btn-${i}" onclick = "activateHint(this,${i})"><img src="images/hint.png"/></button>`
    }
    hintsEl.innerHTML = strHTML
}

function activateHint(hintEl, hintIdx) {
    if (gHints[hintIdx].isUsed) return
    gHints[hintIdx].isUsed = true
    hintEl.style.backgroundColor = "green"
    isHintActive = true
}

function revealHintCell(cellEl, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i < 0 || j < 0 || i >= gBoard.length || j >= gBoard[0].length) continue
            const cellEl = document.querySelector(`.cell-${i}-${j}`)
            const aroundCounter = setMinesAroundCount(i, j)
            if (gBoard[i][j].isMine) {
                cellEl.classList.add("mine")
            }
            else if (aroundCounter) {
                cellEl.innerText = aroundCounter
                cellEl.classList.add('revealed')
            } else {
                cellEl.classList.add('revealed')
            }
        }
    }
    setTimeout(hideHint, 1000, rowIdx, colIdx)
}


function hideHint(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i < 0 || j < 0 || i >= gBoard.length || j >= gBoard[0].length) continue
            if (gBoard[i][j].isShown) continue
            const cellEl = document.querySelector(`.cell-${i}-${j}`)
            const aroundCounter = setMinesAroundCount(i, j)

            if (gBoard[i][j].isMine) {
                cellEl.classList.remove("mine")
            }
            else if (aroundCounter) {
                cellEl.innerText = ''
                cellEl.classList.remove('revealed')
            } else {
                cellEl.classList.remove('revealed')
            }
        }
    }
    isHintActive = false
}

function updateScore() {
    const revealed = gGame.flaggedCount + gGame.minesCount
    gGame.score = gLevel.mines - revealed
    const scoreEl = document.querySelector(".score-container")
    scoreEl.innerText = "Score: " + gGame.score
    localStorage.scores.push
}

function renderSafeClicksAttemps() {
    const safeClickEl = document.querySelector(".attemps-remaining")
    safeClickEl.innerText = `${gGame.safeClickCount} clicks available`
}

function safeClick() {
    if (!gGame.safeClickCount) return
    var randomI = getRandomIntInclusive(0, gBoard.length - 1)
    var randomJ = getRandomIntInclusive(0, gBoard.length - 1)
    while (gBoard[randomI][randomJ].isMine || gBoard[randomI][randomJ].isShown) {
        randomI = getRandomIntInclusive(0, gBoard.length - 1)
         randomJ = getRandomIntInclusive(0, gBoard.length - 1)
   }
   const cellEl = document.querySelector(`.cell-${randomI}-${randomJ}`)
   cellEl.classList.add('safe-click')
   gGame.safeClickCount--
   renderSafeClicksAttemps()
   setTimeout(hideSafeClick, 2000, cellEl)
}

function hideSafeClick(cellEl){
    cellEl.classList.remove('safe-click')
}


// function bestScore(){
//     if(gLevel.size === 5){
//         localStorage.setItem(gGame.score,"")
//     }
//     if(gLevel.size === 8){
//         localStorage.setItem(gGame.score,"")
//     }
//     if(gLevel.size === 12){
//         localStorage.setItem(gGame.score,"")
//     }
// }






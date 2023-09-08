

/*-------------------------------- Constants --------------------------------*/
const rows = 20 
const columns = 10
const tetrominos = {
  I: { 
    shape: [[1,1,1,1]],
    color: 'cyan' 
  },
  I: { 
    shape: [[1],
            [1],
            [1],
            [1]],
    color: 'cyan'
  },
  J: {
    shape: [[0,1],
            [0,1],
            [1,1]],
    color: 'blue'
  },
  L: {
    shape: [[1,0],
            [1,0],
            [1,1]],
    color: 'orange'
  },
  O: {
    shape: [[1,1],
            [1,1]],
    color: 'yellow'
  },
  S: {
    shape: [[0,1,1],
            [1,1,0]],
    color: 'green'
  },
  T: {
    shape: [[0,1,0],
            [1,1,1]],
    color: 'purple'
  },
  T: {
    shape: [[1,1,1],
            [0,1,0]],
    color: 'purple'
  },
  Z: {
    shape: [[1,1,0],
            [0,1,1]],
    color: 'red'
  },
}
const tetrominoQueue = []

const gameBoard = Array.from({ length: rows }, () => Array(columns).fill(0))

const scoring = {
  single: 100,  
  double: 300,  
  triple: 500,
  tetris: 800   
};


/*---------------------------- Variables ----------------------------*/
let currentTetromino = getRandomTetromino()
let currentPosition 
let gameIntervalId 
let spawnIntervalId
let gameIsOver = false
let score
let gameSpeed = 1000; // Default game speed (1 second)
/*------------------------ Cached Element References ------------------------*/
const board = document.querySelector('.tetris-board')
let gameMessage = document.getElementById('message')
let startBtn = document.getElementById('start-button')
let endBtn = document.getElementById('end-button')
let gameScore = document.getElementById('score')
let easyBtn = document.getElementById('easy-button')
let mediumBtn = document.getElementById('medium-button')
let hardBtn = document.getElementById('hard-button')
/*----------------------------- Event Listeners -----------------------------*/
document.addEventListener('keydown', handleKeyPress)
startBtn.addEventListener('click', () => {
  clearInterval(gameIntervalId)
  clearInterval(spawnIntervalId)
  startBtn.style.display = 'none'
  endBtn.style.display = 'inline'
  easyBtn.style.display = 'none'
  mediumBtn.style.display = 'none'
  hardBtn.style.display = 'none'
  gameMessage.textContent = ' '
  init()

})
endBtn.addEventListener('click', resetGame)

easyBtn.addEventListener("click", function () {
  gameSpeed = 1000 
})

mediumBtn.addEventListener("click", function () {
  gameSpeed = 500
})

hardBtn.addEventListener("click", function () {
  gameSpeed = 250 
})

/*-------------------------------- Functions --------------------------------*/
function init() {
  if (gameIsOver === true){
    return
  } else {
    createBoard()
    startGameLoop()
    currentPosition = { row: 0, col: Math.floor(columns / 2) - 1 }
    score = 0
    render()
    spawnIntervalId = setInterval(queueRandomeTetromino, 2000)
  }
}


function render() {
  updateBoard(currentTetromino, currentPosition, currentTetromino.Color)
}

function createBoard() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const cell = document.createElement('div')
      cell.classList.add('cell', `row-${row}`, `col-${col}`)
      board.appendChild(cell)
    }
  } 
}

function startGameLoop() {
  gameIntervalId = setInterval(() => {
    if (canMoveDown(currentTetromino, currentPosition)) {
      clearPreviousPosition(currentTetromino, currentPosition)
      currentPosition.row++
      updateBoard(currentTetromino, currentPosition, currentTetromino.color)     
    } else {
      if (isGameOver(currentTetromino, currentPosition)) {
        clearInterval(gameIntervalId)
          return
      } else {
        setCurrentTetrominoFromQueue()
        clearFullRows()
      } 
    } 
  }, gameSpeed)
}

function getRandomTetromino() {
  const tetrominoKeys = Object.keys(tetrominos)
  const randomKey = tetrominoKeys[Math.floor(Math.random() * tetrominoKeys.length)]
  return tetrominos[randomKey]
}

function queueRandomeTetromino () {
  tetrominoQueue.push(getRandomTetromino())
}

function setCurrentTetrominoFromQueue() {
  currentTetromino = tetrominoQueue.shift()
  currentPosition = { row: 0, col: Math.floor(columns / 2) - 1 }
  clearFullRows()
  updateBoard(currentTetromino,currentPosition,currentTetromino.color)
}

function updateBoard(tetromino, position, tetrominoColor) {
  for (let row = 0; row < tetromino.shape.length; row++) {
    for (let col = 0; col < tetromino.shape[row].length; col++) {
      if (tetromino.shape[row][col] === 1) {
        const boardRow = position.row + row
        const boardCol = position.col + col
        const cell = document.querySelector(`.row-${boardRow}.col-${boardCol}`)
        if (cell) {
          cell.style.backgroundColor = tetrominoColor
          gameBoard[boardRow][boardCol] = 1
        }
      }
    }
  }
}


function canMoveDown(currentTetromino, currentPosition) {
  for (let row = 0; row < currentTetromino.shape.length; row++) {
    for (let col = 0; col < currentTetromino.shape[row].length; col++) {
      if (currentTetromino.shape[row][col] === 1) {
        const newRow = currentPosition.row + row + 1
        const newCol = currentPosition.col + col
        if (
          newRow >= rows || isCellOccupied(newRow,newCol)
        ) {
          return false
        }
      }
    }
  }
  return true
}

function isGameOver(tetromino, position) {
  for (let row = 0; row < tetromino.shape.length; row++) {
    for (let col = 0; col < tetromino.shape[row].length; col++) {
      if (tetromino.shape[row][col] === 1) {
        const boardRow = position.row + row
        const boardCol = position.col + col
        if (
          boardRow < 0 ||                 
          (boardRow === 0 && gameBoard[boardRow][boardCol] === 1) 
        ) {
          gameMessage.textContent = 'Game is over'
          gameIsOver = true
          return true
        }     
      }
    }
  }
  return false
}
function isCellOccupied(row, col) {
  return gameBoard[row][col] === 1 && !isCellPartOfTetromino(row, col, currentTetromino, currentPosition);
}


function isCellPartOfTetromino(row, col, tetromino, position) {
  for (let tetrominoRow = 0; tetrominoRow < tetromino.shape.length; tetrominoRow++) {
    for (let tetrominoCol = 0; tetrominoCol < tetromino.shape[tetrominoRow].length; tetrominoCol++) {
      if (
        tetromino.shape[tetrominoRow][tetrominoCol] === 1 &&
        row === position.row + tetrominoRow &&
        col === position.col + tetrominoCol
      ) {
        return true;
      }
    }
  }
  return false;
}



function clearPreviousPosition(tetromino, position) {
  for (let row = 0; row < tetromino.shape.length; row++) {
    for (let col = 0; col < tetromino.shape[row].length; col++) {
      if (tetromino.shape[row][col] === 1) {
        const boardRow = position.row + row
        const boardCol = position.col + col
        const cell = document.querySelector(`.row-${boardRow}.col-${boardCol}`)
        if (cell) {
          cell.style.backgroundColor = ''
          gameBoard[boardRow][boardCol] = 0
        }
      }
    }
  }
}

function handleKeyPress(event) {
  switch (event.key) {
    case 'ArrowLeft' :
      if (canMoveLeft(currentTetromino, currentPosition)) {
        clearPreviousPosition(currentTetromino,currentPosition)
        currentPosition.col--
        updateBoard(currentTetromino, currentPosition, currentTetromino.color)
      }
      break
    case 'ArrowRight':
      if (canMoveRight(currentTetromino, currentPosition)) {
        clearPreviousPosition(currentTetromino,currentPosition)
        currentPosition.col++
        updateBoard(currentTetromino, currentPosition, currentTetromino.color)
      }
      break
  }
}

function canMoveLeft(currentTetromino, currentPosition) {
  for (let row = 0; row < currentTetromino.shape.length; row++) {
    for (let col = 0; col < currentTetromino.shape[row].length; col++) {
      if (currentTetromino.shape[row][col] === 1) {
        const newRow = currentPosition.row + row
        const newCol = currentPosition.col + col - 1

        if (
          newRow >= 0 &&            
          newCol >= 0 &&            
          !isCellOccupied(newRow, newCol) 
        ) {
          return true
        }
        return false
      }
    }
  }
}

function canMoveRight(currentTetromino, currentPosition) {
  for (let row = 0; row < currentTetromino.shape.length; row++) {
    for (let col = 0; col < currentTetromino.shape[row].length; col++) {
      if (currentTetromino.shape[row][col] === 1) {
        const newRow = currentPosition.row + row
        const newCol = currentPosition.col + col + 1

        if (
          newRow >= 0 &&               
          newCol < columns &&         
          !isCellOccupied(newRow, newCol) 
        ) {
          return true
        }
        return false
      }
    }
  }
}

function isRowFull(row) {
  for (let col = 0; col < columns; col++) {
    if (gameBoard[row][col] !== 1) {
      return false
    }
  }
  return true
}

function clearFullRows() {
  let rowsCleared = 0
  for (let row = rows - 1; row >= 0; row--) {
    if (isRowFull(row)) {
      clearRowInDOM(row)
      shiftColorsDown(row)
      gameBoard.splice(row, 1)
      gameBoard.unshift(Array(columns).fill(0))
      row++
      rowsCleared++
    }
  }
  updateScore(rowsCleared)
}

function clearRowInDOM(row) {
  for (let col = 0; col < columns; col++) {
    const cell = document.querySelector(`.row-${row}.col-${col}`)
    if (cell) {
      cell.style.backgroundColor = ''
    }
  }
}

function shiftColorsDown(fromRow) {
  for (let row = fromRow; row >= 1; row--) {
    for (let col = 0; col < columns; col++) {
      const cellAbove = document.querySelector(`.row-${row - 1}.col-${col}`)
      const cellBelow = document.querySelector(`.row-${row}.col-${col}`)     
      if (cellAbove && cellBelow) {
        const backgroundColor = cellAbove.style.backgroundColor
        cellBelow.style.backgroundColor = backgroundColor
      }
    }
  }
}

function resetGame() {
  clearInterval(gameIntervalId)
  clearInterval(spawnIntervalId)
  currentTetromino = getRandomTetromino()
  currentPosition = { row: 0, col: Math.floor(columns / 2) - 1 }
  gameBoard.length = 0
  for (let row = 0; row < rows; row++) {
    gameBoard.push(Array(columns).fill(0))
  }
  const cells = document.querySelectorAll('.cell')
  cells.forEach((cell) => {
    cell.style.backgroundColor = ''
  })
  endBtn.style.display = 'none'
  startBtn.style.display = 'inline'
  easyBtn.style.display = 'inline'
  mediumBtn.style.display = 'inline'
  hardBtn.style.display = 'inline'
  score = 0 
  gameScore.textContent = score.toString()
  gameIsOver = false
  gameMessage.textContent = 'Get Ready!'
}

function updateScore(rowsCleared) {
  switch (rowsCleared) {
    case 1:
      score += scoring.single
      break
    case 2:
      score += scoring.double
      break
    case 3:
      score += scoring.triple
      break
    case 4:
      score += scoring.tetris
      break
  }
  gameScore.textContent = score.toString()
}


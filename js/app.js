

/*-------------------------------- Constants --------------------------------*/
const rows = 20 
const columns = 10
const tetrominos = {
  I: { 
    shape: [[1,1,1,1]],
    color: 'cyan'
  },
  J: {
    shape: [[0,0,1],
            [1,1,1],],
    color: 'blue'
  },
  L: {
    shape: [[1,0,0],
            [1,1,1]],
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
  Z: {
    shape: [[1,1,0],
            [0,1,1]],
    color: 'red'
  },
}
const tetrominoQueue = []
console.log(tetrominoQueue)
const gameBoard = Array.from({ length: rows }, () => Array(columns).fill(0))

/*---------------------------- Variables ----------------------------*/
let currentTetromino = getRandomTetromino()
let currentPosition 
let gameIntervalId 
let spawnIntervalId
let gameIsOver = false
/*------------------------ Cached Element References ------------------------*/
const board = document.querySelector('.tetris-board')
let gameMessage = document.getElementById('message')

/*----------------------------- Event Listeners -----------------------------*/
document.addEventListener('keydown', handleKeyPress)

/*-------------------------------- Functions --------------------------------*/
// intitialization function to start the game, calls functions to create the board and render 
function init() {
  if (gameIsOver === true){
    return
  } else {
    createBoard()
    startGameLoop()
    currentPosition = { row: 0, col: Math.floor(columns / 2) - 1 }
    render()
    setInterval(queueRandomeTetromino, 3000)
  }
}

init()


function render() {
  updateBoard(currentTetromino, currentPosition, currentTetromino.Color)
}

function createBoard() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const cell = document.createElement('div')
      cell.classList.add('cell', `row-${row}`, `col-${col}`)
      board.appendChild(cell)
      console.log('hi')
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
        console.log(gameBoard)
      } 
    } 
  }, 1000)
}

function getRandomTetromino() {
  const tetrominoKeys = Object.keys(tetrominos)
  const randomKey = tetrominoKeys[Math.floor(Math.random() * tetrominoKeys.length)]
  console.log('randomizer works')
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
  // Iterate through the tetromino's shape
  for (let row = 0; row < tetromino.shape.length; row++) {
    for (let col = 0; col < tetromino.shape[row].length; col++) {
      if (tetromino.shape[row][col] === 1) {
        // Calculate the position of the cell on the game board
        const boardRow = position.row + row
        const boardCol = position.col + col
        // Find the corresponding cell element in the DOM
        const cell = document.querySelector(`.row-${boardRow}.col-${boardCol}`)
        // Update the cell's class to set the background color
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
          newRow >= rows ||             // Check if it's at the bottom of the board
          // newCol < 0 || newCol >= columns ||// Check if it's out of bounds horizontally
            // Check if the cell is occupied
            isCellOccupied(newRow,newCol)
        ) {
          console.log('it cant move')
          return false
        }
      }
    }
  }
  console.log('it can move')
  return true
}

function isGameOver(tetromino, position) {
  for (let row = 0; row < tetromino.shape.length; row++) {
    for (let col = 0; col < tetromino.shape[row].length; col++) {
      if (tetromino.shape[row][col] === 1) {
        const boardRow = position.row + row
        const boardCol = position.col + col
        console.log('gameoverloop')
        if (
          boardRow < 0 ||                 
          (boardRow === 0 && gameBoard[boardRow][boardCol] === 1) 
        ) {
          console.log('game is over')
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
      // Check if the tetromino can move left
      if (canMoveLeft(currentTetromino, currentPosition)) {
        clearPreviousPosition(currentTetromino,currentPosition)
        currentPosition.col--
        updateBoard(currentTetromino, currentPosition, currentTetromino.color)
      }
      break
    case 'ArrowRight':
      // Check if the tetromino can move right
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
          newRow >= 0 &&               // Check if it's within the top boundary
          newCol >= 0 &&               // Check if it's within the left boundary
          !isCellOccupied(newRow, newCol) // Check if the cell is not occupied
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
          newRow >= 0 &&               // Check if it's within the top boundary
          newCol < columns &&          // Check if it's within the right boundary
          !isCellOccupied(newRow, newCol) // Check if the cell is not occupied
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
  for (let row = rows - 1; row >= 0; row--) {
    if (isRowFull(row)) {
      // Clear the row in the DOM
      clearRowInDOM(row)
      // Remove the full row from the game board
      // Shift colors down
      shiftColorsDown(row)
      gameBoard.splice(row, 1)
      // Add an empty row at the top
      gameBoard.unshift(Array(columns).fill(0))
      // Increment row to check the same row again
      row++
    }
  }
}

function clearRowInDOM(row) {
  // Loop through the cells in the specified row and clear their background color
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
      const cellAbove = document.querySelector(`.row-${row - 1}.col-${col}`);
      const cellBelow = document.querySelector(`.row-${row}.col-${col}`);
      
      if (cellAbove && cellBelow) {
        const backgroundColor = cellAbove.style.backgroundColor
        cellBelow.style.backgroundColor = backgroundColor
      }
    }
  }
}
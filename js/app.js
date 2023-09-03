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

/*---------------------------- Variables (state) 
----------------------------*/
let currentTetromino = getRandomTetromino()

let currentPosition 
let gameIntervalId 


/*------------------------ Cached Element References ------------------------*/
const board = document.querySelector('.tetris-board')

/*----------------------------- Event Listeners -----------------------------*/


/*-------------------------------- Functions --------------------------------*/
// intitialization function to start the game, calls functions to create the board and render 
function init() {
  render()
  createBoard()
  console.log('init works')
  startGameLoop()
}
init()
function render() {
  currentPosition = { row: 0, col: Math.floor(columns / 2) - 1 }
  getRandomTetromino()
  updateBoard(currentTetromino, currentPosition, currentTetromino.Color)
  console.log('render works')
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
      currentPosition.row++ 
      clearPreviousPosition(currentTetromino, currentPosition)
      updateBoard(currentTetromino, currentPosition, currentTetromino.color)
    } else {
      updateBoard(currentTetromino, currentPosition, currentTetromino.color)
      currentPosition = { row: 0, col: Math.floor(columns / 2) - 1 };
      currentTetromino = getRandomTetromino()
      if (isGameOver(currentTetromino, currentPosition)) {
        clearInterval(gameIntervalId)
        return
      }
      updateBoard(currentTetromino, currentPosition, currentTetromino.color)
    }
  }, 1000)
}

function getRandomTetromino() {
  const tetrominoKeys = Object.keys(tetrominos)
  const randomKey = tetrominoKeys[Math.floor(Math.random() * tetrominoKeys.length)]
  console.log('randomizer works')
  return tetrominos[randomKey]
}

function updateBoard(tetromino, position, tetrominoColor) {
  
}

function canMoveDown(currentTetromino, currentPosition) {
  for (let row = 0; row < currentTetromino.shape.length; row++) {
    for (let col = 0; col < currentTetromino.shape[row].length; col++) {
      if (currentTetromino.shape[row][col] === 1) {
        const newRow = currentPosition.row + row + 1 
        const newCol = currentPosition.col + col
        if (newRow >= rows || newCol < 0 || newCol >= columns) {
          return false 
        }
        const cell = document.querySelector(`.row-${newRow}.col-${newCol}`)
        if (cell && cell.classList.contains(`occupied`)){
          return false
        }
      }
    }
  }
}
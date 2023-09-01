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

/*---------------------------- Variables (state) ----------------------------*/

const randomTetromino = getRandomTetromino()

/*------------------------ Cached Element References ------------------------*/
const board = document.querySelector('.tetris-board')

/*----------------------------- Event Listeners -----------------------------*/


/*-------------------------------- Functions --------------------------------*/
// intitialization function to start the game, calls functions to create the board and render 
function init() {
  render()
}
init()
function render() {
  createBoard()
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

function getRandomTetromino() {
  const tetrominoKeys = Object.keys(tetrominos);
  const randomKey = tetrominoKeys[Math.floor(Math.random() * tetrominoKeys.length)];
  return tetrominos[randomKey];
}

function updateBoard(tetromino, position, tetrominoColor) {
  
}

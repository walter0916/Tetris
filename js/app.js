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
console.log(tetrominos)
/*---------------------------- Variables (state) ----------------------------*/


/*------------------------ Cached Element References ------------------------*/
const board = document.querySelector('.tetris-board')

/*----------------------------- Event Listeners -----------------------------*/


/*-------------------------------- Functions --------------------------------*/
function init(){
  createBoard()
  render()
}

function render() {

}

function createBoard() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const cell = document.createElement('div')
      cell.classList.add('cell')
      board.appendChild(cell)
      console.log('hi')
    }
  } 
}
createBoard()
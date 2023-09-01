/*-------------------------------- Constants --------------------------------*/
const rows = 20 
const columns = 10
/*---------------------------- Variables (state) ----------------------------*/


/*------------------------ Cached Element References ------------------------*/
const board = document.querySelector('.tetris-board')

/*----------------------------- Event Listeners -----------------------------*/


/*-------------------------------- Functions --------------------------------*/

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
const { sqrt, random, floor } = Math;
let size = 3;
size = size * size;
let difficulty = (sqrt(size) - 1) * sqrt(size);
let width = 50 * size + 100;
let height = 50 * size + 100;
let numbers = [];
let randomNumbers = [];
let solvedSudokuBoard = [];
let sudokuBoard = [];
let emptyCellStack = [];
let visitedCellStack = [];
let solved = false;
let timeOut = false;

const generateRandomNumber = () => {
  for (let i = 0; i < size; i++) {
    numbers.push(i + 1);
  }
  for (let i = 0 < 0; i < size; i++) {
    const temp = floor(random() * numbers.length);
    randomNumbers.push(numbers[temp]);
    numbers.splice(temp, 1);
  }
  for (let i = 0; i < size; i++) {
    numbers.push(i + 1);
  }
  return randomNumbers;
};

const shiftArrayElements = ([...arr], value) => {
  for (let i = 0; i < value; i++) {
    const temp = arr.shift();
    arr.push(temp);
  }
  return arr;
};

const createSudokuBoard = () => {
  let temp = sqrt(size);
  solvedSudokuBoard.push(generateRandomNumber());
  for (let i = 1; i < size; i++) {
    if (i % temp == 0) solvedSudokuBoard.push(shiftArrayElements(solvedSudokuBoard[solvedSudokuBoard.length - 1], 1));
    else solvedSudokuBoard.push(shiftArrayElements(solvedSudokuBoard[solvedSudokuBoard.length - 1], temp));
  }
  temp = [];
  for (let row = 0; row < size; row++) {
    sudokuBoard.push([]);
    for (let col = 0; col < size; col++) {
      temp.push({ row, col });
      sudokuBoard[row].push(undefined);
    }
  }
  for (let i = 0; i < size * difficulty; i++) {
    const randNum = floor(random() * temp.length);
    const { row, col } = temp[randNum];
    sudokuBoard[row][col] = solvedSudokuBoard[row][col];
    temp.splice(randNum, 1);
  }
};

const drawLines = () => {
  stroke(100);
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      rect(col * 50 + 50, row * 50 + 50, 50, 50);
    }
  }
};

const clearPosition = (row, col) => {
  noStroke();
  fill('white');
  rect(col * 50 + 50 + 2, row * 50 + 2 + 50, 50 - 4, 50 - 4);
};

const drawBorders = () => {
  const temp = sqrt(size);
  stroke(100);
  strokeWeight(4);
  for (let i = 0; i < temp - 1; i++) {
    line(i * temp * 50 + temp * 50 + 50, 0 + 50, i * temp * 50 + temp * 50 + 50, height - 50);
    line(0 + 50, i * temp * 50 + temp * 50 + 50, width - 50, i * temp * 50 + temp * 50 + 50);
  }
};

const fillNumbers = color => {
  noStroke();
  fill(color);
  textSize(24);
  textAlign('center');
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (!sudokuBoard[row][col]) continue;
      text(sudokuBoard[row][col], col * 50 + 75, row * 50 + 85);
    }
  }
};

const fillNumber = (row, col, color) => {
  noStroke();
  fill(color);
  textSize(24);
  textAlign('center');
  text(sudokuBoard[row][col], col * 50 + 75, row * 50 + 85);
};

// solving sudoku
const getEmptyCellStack = () => {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (!sudokuBoard[row][col]) emptyCellStack.push({ row, col });
    }
  }
  emptyCellStack.reverse();
};

// solving sudoku
const getUsedNumbers = (row, col) => {
  const usedNumbers = new Set();
  for (let i = 0; i < size; i++) {
    if (sudokuBoard[row][i]) usedNumbers.add(sudokuBoard[row][i]);
    if (sudokuBoard[i][col]) usedNumbers.add(sudokuBoard[i][col]);
  }

  const temp = sqrt(size);
  row = floor(row / temp) * temp;
  col = floor(col / temp) * temp;

  for (let i = row; i < row + temp; i++) {
    for (let j = col; j < col + temp; j++) {
      if (sudokuBoard[i][j]) usedNumbers.add(sudokuBoard[i][j]);
    }
  }
  return usedNumbers;
};

// solving sudoku
const dfs = (row, col, index) => {
  clearPosition(row, col);
  const usedNumbers = getUsedNumbers(row, col);

  if (index == numbers.length - 1 || usedNumbers.size == numbers.length) {
    emptyCellStack.push({ row, col });
    const temp = visitedCellStack.pop();
    sudokuBoard[temp.row][temp.col] = undefined;
    emptyCellStack.push(temp);
    return;
  }

  for (let i = index + 1 || 0; i < numbers.length; i++) {
    if (usedNumbers.has(numbers[i])) {
      if (i == numbers.length - 1) {
        emptyCellStack.push({ row, col });
        const temp = visitedCellStack.pop();
        sudokuBoard[temp.row][temp.col] = undefined;
        emptyCellStack.push(temp);
      }
      continue;
    }
    sudokuBoard[row][col] = numbers[i];
    visitedCellStack.push({ row, col, index: i });
    break;
  }

  fillNumber(row, col, 'blue');
};

function setup() {
  let canvas = createCanvas(width, height);
  canvas.position(20, 20);
  createSudokuBoard();
  getEmptyCellStack();
  drawLines();
  drawBorders();
  fillNumbers('red');
}

function draw() {
  if (solved) {
    size = floor(sqrt(size));
    size++;
    if (size > 5) size = 3;
    size = size * size;
    difficulty = (sqrt(size) - 1) * sqrt(size);
    width = 50 * size + 100;
    height = 50 * size + 100;
    numbers = [];
    randomNumbers = [];
    solvedSudokuBoard = [];
    sudokuBoard = [];
    emptyCellStack = [];
    visitedCellStack = [];
    solved = false;
    setup();
  }

  frameRate(20);
  if (emptyCellStack.length) {
    const { row, col, index } = emptyCellStack.pop();
    dfs(row, col, index);
  } else {
    if (!timeOut) {
      setTimeout(() => {
        solved = true;
        timeOut = false;
      }, 1000);
      timeOut = true;
    }
  }
}

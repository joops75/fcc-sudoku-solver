const textArea = document.getElementById('text-input');
const clearButton = document.getElementById('clear-button');
const solveButton = document.getElementById('solve-button');
const errorDiv = document.getElementById('error-msg');

document.addEventListener('DOMContentLoaded', function() {
  // Load a simple puzzle into the text area
  const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
  textArea.value = puzzle;

  fillGrid(puzzle);

  function textAreaListener(e) {
    const str = e.target.value;
    fillGrid(str);
    validateTextArea(str);
  }

  textArea.addEventListener('input', textAreaListener);
  textArea.addEventListener('paste', textAreaListener);

  function inputListener(e) {
    const value = e.target.value;
    const letter = e.target.id.slice(0, 1);
    const number = +e.target.id.slice(1);
    const index = 9 * (letter.charCodeAt(0) - 65) + number - 1;
    const textAreaContent = textArea.value.split('');
    if (value && validNumber(value)) {
      textAreaContent[index] = value;
    } else if (!value) {
      textAreaContent[index] = '.';
    }
    for (let i = 0; i < 81; i ++) {
      if (!textAreaContent[i]) {
        textAreaContent[i] = '.';
      }
    }
    textArea.value = textAreaContent.join('');
    validateTextArea(textArea.value);
  }

  for (let i = 0; i < 81; i ++) {
    const cell = getCell(i);
    cell.addEventListener('input', inputListener)
  }

  function clearButtonListener() {
    fillGrid('');
    textArea.value = '';
    errorMsg('');
  }

  clearButton.addEventListener('click', clearButtonListener);
  solveButton.addEventListener('click', solveButtonListener);
});

function validNumber(str) {
  return /^[1-9]$/.test(str);
}

function fillGrid(str) {
  for (let i = 0; i < 81; i ++) {
    const cell = getCell(i);
    if (str[i] && validNumber(str[i])) {
      cell.value = str[i];
    } else if (!str[i] || str[i] === '.') {
      cell.value = '';
    }
  }
}

function validLength(str) {
  return str.length === 81;
}

function validCharacters(str) {
  return !/[^1-9\.]/.test(str);
}

function errorMsg(str) {
  errorDiv.innerText = str;
}

function validateTextArea(str) {
  if (!str || validLength(str) && validCharacters(str)) {
    errorMsg('');
    return true;
  } else if (!validLength(str)) {
    errorMsg('Error: Expected puzzle to be 81 characters long.');
  } else if (!validCharacters(str)) {
    errorMsg('Error: Only numbers 1-9 and . are valid input characters.');
  }
}

function getCell(index) {
  const letter = String.fromCharCode(Math.floor(index / 9) + 65);
  const number = index % 9 + 1;
  return document.getElementById(letter + number);
}

function parsePuzzle(str) {
  const parsed = [];
  for (let i = 0; i < str.length; i += 9) {
    parsed.push(str.slice(i, i + 9).split(''));
  }
  return parsed;
}

function lineIsValid(arr) {
  const validLine = '123456789';
  return arr.sort().join('') === validLine;
}

function boxIsValid(arr) {
  const nums = [];
  for (let i = 0; i < arr.length; i ++) {
    for (let j = 0; j < arr[0].length; j ++) {
      nums.push(arr[i][j]);
    }
  }
  return lineIsValid(nums);
}

function puzzleIsValid(str) {
  const parsed = parsePuzzle(str);
  let isValid = true;

  // check rows
  for (let i = 0; isValid && i < parsed.length; i ++) {
    // be sure not to mutate parsed array
    if (!lineIsValid(parsed[i].slice())) {
      isValid = false;
    }
  }

  // check columns
  for (let j = 0; isValid && j < parsed[0].length; j ++) {
    const col = [];
    for (let i = 0; i < parsed.length; i ++) {
      col.push(parsed[i][j]);
    }
    if (!lineIsValid(col)) {
      isValid = false;
    }
  }

  // check boxes
  for (let i = 0; isValid && i < parsed.length; i += 3) {
    for (let j = 0; isValid && j < parsed[0].length; j += 3) {
      const box = [];
      for (let i2 = i; i2 < i + 3; i2 ++) {
        const row = [];
        for (let j2 = j; j2 < j + 3; j2 ++) {
          row.push(parsed[i2][j2]);
        }
        box.push(row);
      }
      if (!boxIsValid(box)) {
        isValid = false;
      }
    }
  }

  return isValid;
}

function getBoxIndex(i, j) {
  return Math.floor((i / 3)) * 3 + Math.floor(j / 3);
}

function sudokuSolver(str) {
  // setup possibitity sets
  const rowPossibilites = [];
  const colPossibilites = [];
  const boxPossibilites = [];
  for (let i = 0; i < 9; i ++) {
    rowPossibilites.push(new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9']));
    colPossibilites.push(new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9']));
    boxPossibilites.push(new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9']));
  }
  
  // scan grid and eliminate possibilities from rows, columns and boxes
  const grid = parsePuzzle(str);
  const emptyCells = [];
  for (let i = 0; i < grid.length; i ++) {
    for (let j = 0; j < grid[0].length; j ++) {
      const value = grid[i][j];
      if (validNumber(value)) {
        if (!rowPossibilites[i].delete(value)) {
          return { solution: str, error: `Row ${i + 1} has duplicate value ${value}` };
        }
        if (!colPossibilites[j].delete(value)) {
          return { solution: str, error: `Column ${j + 1} has duplicate value ${value}` };
        }
        const boxIndex = getBoxIndex(i, j);
        if (!boxPossibilites[boxIndex].delete(value)) {
          return { solution: str, error: `Box ${boxIndex + 1} has duplicate value ${value}` };
        }
      } else if (value === '.') {
        emptyCells.push([i, j]);
      } else {
        // should never run if early return present at start of function
        return { solution: str, error: `Invalid character at cell ${getCell(i * 9 + j).id}` };
      }
    }
  }

  function allCounterpartRowsAndColumnsHaveNumber(i, j, number) {
    const rowIndexes = [];
    const colIndexes = [];
    for (let k = 0; k < 9; k ++) {
      if (i !== k && Math.floor(k / 3) === Math.floor(i / 3)) {
        rowIndexes.push(k);
      }
      if (j !== k && Math.floor(k / 3) === Math.floor(j / 3)) {
        colIndexes.push(k);
      }
    }
    const allCounterpartRowsHaveNumber = rowIndexes.every(function(index) {
      return !rowPossibilites[index].has(number);
    });
    const allCounterpartColumnsHaveNumber = colIndexes.every(function(index) {
      return !colPossibilites[index].has(number);
    });
    if (allCounterpartRowsHaveNumber && allCounterpartColumnsHaveNumber) {
      return true;
    }
    return false;
  }

  // check if only one possibility
  function enterNumber(counterpartRowColumnCheck) {
    for (let m = 0; m < emptyCells.length; m ++) {
      const i = emptyCells[m][0];
      const j = emptyCells[m][1];
      const boxIndex = getBoxIndex(i, j);
      let numberToEnter = '';
      for (let n = 1; n <= 9; n ++) {
        const number = '' + n;
        if (rowPossibilites[i].has(number) && colPossibilites[j].has(number) && boxPossibilites[boxIndex].has(number)) {
          if (counterpartRowColumnCheck) {
            // checking counterpart rows and columns is not needed to solve the puzzles in public/puzzle-strings.js
            // check function with 9............9......................................9...........................9
            if (allCounterpartRowsAndColumnsHaveNumber(i, j, number)) {
              numberToEnter = number;
              // this check has identified number as being the only possibility so can early exit from loop
              break;
            }
          } else {
            if (!numberToEnter) {
              numberToEnter = number;
            } else {
              // More than one possibility for cell so cannot enter number. Move on to next cell.
              numberToEnter = '';
              break;
            }
          }
        }
      }
      if (numberToEnter) {
        // enter number into cell
        grid[i][j] = numberToEnter;
        // remove number from each possibilty set
        rowPossibilites[i].delete(numberToEnter);
        colPossibilites[j].delete(numberToEnter);
        boxPossibilites[boxIndex].delete(numberToEnter);
        // remove cell from list and return it
        return emptyCells.splice(m, 1);
      }
    }
  }
  
  // as long as cells are removed from emptyCells array, continue trying to enter numbers in the grid
  let incomplete = true;
  while (incomplete) {
    if (!enterNumber(false) && !enterNumber(true)) {
      incomplete = false;
    }
  }

  // confirm solution is valid
  const solution = JSON.stringify(grid).replace(/[^1-9\.]/g, '');
  const error = emptyCells.length ? 'Cannot solve puzzle.' : !puzzleIsValid(solution) ? 'Solution is invalid.' : '';

  return { solution, error };
}

function solveButtonListener() {
  // early exit if current error or blank puzzle
  if (errorDiv.innerText || !textArea.value) {
    return;
  }

  const { solution, error } = sudokuSolver(textArea.value);

  // print new grid
  textArea.value = solution;
  fillGrid(solution);
  
  // print message
  error ? errorMsg(error) : errorMsg('Puzzle solved!');
}

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {
    validNumber,
    validLength,
    parsePuzzle,
    puzzleIsValid,
    sudokuSolver,
    getCell
  }
} catch (e) {}

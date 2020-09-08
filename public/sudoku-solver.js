const textArea = document.getElementById('text-input');
const clearButton = document.getElementById('clear-button');

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
});

function validNumber(str) {
  return /^[1-9]$/.test(str);
}

function fillGrid(str) {
  for (let i = 0; i < 81; i ++) {
    const cell = getCell(i);
    if (str[i] && validNumber(str[i])) {
      cell.value = str[i];
    } else if (!str[i]) {
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
  const errorDiv = document.getElementById('error-msg');
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
    puzzleIsValid
  }
} catch (e) {}

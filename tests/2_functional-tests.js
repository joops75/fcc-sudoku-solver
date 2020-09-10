/*
*
*
*       FILL IN EACH FUNCTIONAL test BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chai = require("chai");
const assert = chai.assert;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let Solver;

suite('Functional Tests', () => {
  suiteSetup(() => {
    // DOM already mocked -- load sudoku solver then run tests
    Solver = require('../public/sudoku-solver.js');
  });
  
  suite('Text area and sudoku grid update automatically', () => {
    // Entering a valid number in the text area populates 
    // the correct cell in the sudoku grid with that number
    test('Valid number in text area populates correct cell in grid', () => {
      const textarea = document.getElementById('text-input');
      const event = document.createEvent('Event');
      event.initEvent('input', false, true);
      const cellFirst = document.getElementById('A1');
      const cellLast = document.getElementById('I9');

      // clear grid
      textarea.value = '';
      textarea.dispatchEvent(event);
      assert.isTrue(!textarea.value, 'Textarea is blank.');
      assert.isTrue(!cellFirst.value, 'Cell is blank.');
      assert.isTrue(!cellLast.value, 'Cell is blank.');

      // populate textarea and check cell values
      const textareaValue = '1' + '.'.repeat(79) + '9';
      textarea.value = textareaValue;
      textarea.dispatchEvent(event);
      assert.equal(textareaValue.length, 81, `Textarea value is 81 characters long.`);
      assert.equal(textarea.value, textareaValue, `Textarea value is ${textareaValue}.`);
      assert.equal(cellFirst.value, '1', 'Cell value is 1.');
      assert.equal(cellLast.value, '9', 'Cell value is 9.');
    });

    // Entering a valid number in the grid automatically updates
    // the puzzle string in the text area
    test('Valid number in grid updates the puzzle string in the text area', () => {
      const textarea = document.getElementById('text-input');
      const event = document.createEvent('Event');
      event.initEvent('input', false, true);
      const cellFirst = document.getElementById('A1');
      const cellLast = document.getElementById('I9');

      // clear grid
      textarea.value = '';
      textarea.dispatchEvent(event);
      assert.isTrue(!textarea.value, 'Textarea is blank.');
      assert.isTrue(!cellFirst.value, 'Cell is blank.');
      assert.isTrue(!cellLast.value, 'Cell is blank.');

      // populate first cell and check textarea value
      cellFirst.value = '1';
      cellFirst.dispatchEvent(event);
      let expectedTextareaValue = '1' + '.'.repeat(80);
      assert.equal(expectedTextareaValue.length, 81, `expectedTextareaValue value is 81 characters long.`);
      assert.equal(textarea.value, expectedTextareaValue, `Textarea value is ${expectedTextareaValue}.`);

      // populate last cell and check textarea value
      cellLast.value = '9';
      cellLast.dispatchEvent(event);
      expectedTextareaValue = '1' + '.'.repeat(79) + '9';
      assert.equal(expectedTextareaValue.length, 81, `expectedTextareaValue value is 81 characters long.`);
      assert.equal(textarea.value, expectedTextareaValue, `Textarea value is ${expectedTextareaValue}.`);
    });
  });
  
  suite('Clear and solve buttons', () => {
    // Pressing the "Clear" button clears the sudoku 
    // grid and the text area
    test('Function clearInput()', () => {
      const clearButton = document.getElementById('clear-button');
      const textarea = document.getElementById('text-input');
      const cellFirst = document.getElementById('A1');
      const cellLast = document.getElementById('I9');
      const event = document.createEvent('Event');
      event.initEvent('input', false, true);

      // populate textarea and grid
      const textareaValue = '9....5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3....6';
      textarea.value = textareaValue;
      textarea.dispatchEvent(event);
      assert.equal(textareaValue.length, 81, `TextareaValue is 81 characters long.`);
      assert.equal(textarea.value, textareaValue, `Textarea value is ${textareaValue}.`);
      assert.equal(cellFirst.value, '9');
      assert.equal(cellLast.value, '6');

      // clear grid
      clearButton.click();
      assert.isTrue(!textarea.value, 'Textarea is blank.');
      assert.isTrue(!cellFirst.value, 'First cell is blank.');
      assert.isTrue(!cellLast.value, 'Last cell is blank.');
    });
    
    // Pressing the "Solve" button solves the puzzle and
    // fills in the grid with the solution
    test('Function showSolution(solve(input))', () => {
      const textarea = document.getElementById('text-input');
      const solveButton = document.getElementById('solve-button');
      const errorDiv = document.getElementById('error-msg');
      const { puzzlesAndSolutions } = require('../public/puzzle-strings');

      for (let i = 0; i < puzzlesAndSolutions.length; i ++) {
        textarea.value = puzzlesAndSolutions[i][0];
        // clear any message so solveButtonListener can run properly
        errorDiv.innerText = '';
        solveButton.click();
        const solution = puzzlesAndSolutions[i][1];
        assert.equal(textarea.value, solution, 'Textarea value equals expected solution.');
        for (let j = 0; j < solution.length; j ++) {
          const cell = Solver.getCell(j);
          assert.equal(cell.value, solution[j], `Cell ${cell.id} has expected value ${solution[j]}.`);
        }
      }
    });
  });
});


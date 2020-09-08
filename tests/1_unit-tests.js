/*
 *
 *
 *       FILL IN EACH UNIT TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]----
 *       (if additional are added, keep them at the very end!)
 */

const chai = require('chai');
const assert = chai.assert;

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
let Solver;

suite('UnitTests', () => {
  suiteSetup(done => {
    // Mock the DOM for testing and load Solver
    JSDOM.fromFile('./views/index.html', { runScripts: 'dangerously', resources: "usable" })
      .then((dom) => {
        global.window = dom.window;
        global.document = dom.window.document;

        Solver = require('../public/sudoku-solver.js');
        done();
      });
  });
  
  // Only the digits 1-9 are accepted
  // as valid input for the puzzle grid
  suite('Function ____()', () => {
    test('Valid "1-9" characters', () => {
      const input = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
      
      for (let i = 0; i < input.length; i ++) {
        assert.isTrue(Solver.validNumber(input[i]), `String '${input[i]}' is recognized as a number 1-9.`);
      }
    });

    // Invalid characters or numbers are not accepted 
    // as valid input for the puzzle grid
    test('Invalid characters (anything other than "1-9") are not accepted', () => {
      const input = ['!', 'a', '/', '+', '-', '0', '10', 0, '.'];

      for (let i = 0; i < input.length; i ++) {
        assert.isFalse(Solver.validNumber(input[i]), `String '${input[i]}' is not recognized as a number 1-9.`);
      }
    });
  });
  
  suite('Function ____()', () => {
    test('Parses a valid puzzle string into an object', done => { // tests stop here unless 'done' is used
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      
      assert.equal(input.length, 81, 'String length is 81');
      const parsed = Solver.parsePuzzle(input);
      assert.isArray(parsed);
      assert.equal(parsed.length, 9, 'Array length is 9');
      for (let i = 0; i < parsed.length; i += 9) {
        assert.isArray(parsed[i]);
        assert.equal(parsed[i].length, 9, 'Array length is 9');
        assert.equal(parsed[i].join(''), input.slice(i, 9), 'Array elements match string characters.');
      }

      done();
    });
    
    // Puzzles that are not 81 numbers/periods long show the message 
    // "Error: Expected puzzle to be 81 characters long." in the
    // `div` with the id "error-msg"
    test('Shows an error for puzzles that are not 81 numbers long', () => {
      const shortStr = '83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const longStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...';
      const correctStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const errorMsg = 'Error: Expected puzzle to be 81 characters long.';
      const errorDiv = document.getElementById('error-msg');
      const textarea = document.getElementById('text-input');
      const event = document.createEvent('Event');
      event.initEvent('input', false, true);

      // check for string less than 81 characters
      assert.isTrue(shortStr.length < 81);
      assert.isFalse(Solver.validLength(shortStr), `'${shortStr}' is not 81 characters long.`);
      textarea.value = shortStr;
      textarea.dispatchEvent(event);
      assert.equal(errorDiv.innerText, errorMsg, `Message '${errorDiv.innerText}' equals ${errorMsg}`);

      // check for string equal to 81 characters
      assert.equal(correctStr.length, 81);
      assert.isTrue(Solver.validLength(correctStr), `'${correctStr}' is 81 characters long.`);
      textarea.value = correctStr;
      textarea.dispatchEvent(event);
      assert.isEmpty(errorDiv.innerText, `Message is blank`);
      
      // check for string more than 81 characters
      assert.isTrue(longStr.length > 81);
      assert.isFalse(Solver.validLength(longStr), `'${longStr}' is not 81 characters long.`);
      textarea.value = longStr;
      textarea.dispatchEvent(event);
      assert.equal(errorDiv.innerText, errorMsg, `Message '${errorDiv.innerText}' equals ${errorMsg}`);
    });
  });

  suite('Function ____()', () => {
    // Valid complete puzzles pass
    test('Valid puzzles pass', () => {
      const input = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';

      assert.isTrue(Solver.puzzleIsValid(input));
    });

    // Invalid complete puzzles fail
    test('Invalid puzzles fail', () => {
      const input = '779235418851496372432178956174569283395842761628713549283657194516924837947381625';

      assert.isFalse(Solver.puzzleIsValid(input));
    });
  });
  
  
  suite('Function ____()', () => {
    // Returns the expected solution for a valid, incomplete puzzle
    test.skip('Returns the expected solution for an incomplete puzzle', done => {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      
      // done();
    });
  });
});

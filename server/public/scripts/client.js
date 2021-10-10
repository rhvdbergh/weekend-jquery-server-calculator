console.log(`in js`);

// checks to see whether user has submitted a calculation
// used to display latestResult from server or not
let beforeFirstSubmit = true;

// if the calcInput is displaying results, it's OK to start adding operators
// but NOT OK to start adding numbers
// this is how most calculators work
let firstEntryAfterResultsReceived = false;

$(onReady);

// save the latest clicked math symbol
// let mathSymbol;

function onReady() {
  console.log(`in jq`);

  // update the DOM with data from the server
  updateDOM();

  // add event listeners
  $(`.symbolButton`).on(`click`, addSymbol);
  $(`#equalsButton`).on(`click`, submitCalc);
  $(`#clearButton`).on(`click`, clearInputs);
  $(`#clearHistoryButton`).on(`click`, clearHistory);
  $(`#resultsHistory`).on(`click`, `.oldResult`, rerunOldResult);
}

//
function addSymbol() {
  let newValue;
  // grab the current display on the calc
  let calcInputVal = $(`#calcInput`).val();
  // get the user's input
  let userInput = $(this).text().trim();

  // if there's only 0 on the screen and the user inputs ., display 0.
  if (calcInputVal === '' && userInput === '.') {
    userInput = '0.';
  }
  // add the symbol of the selected button to the calculation
  // use trim() to delete any whitespace added by html formatting
  // if the previous result is displaying on the calcInput screen
  // we should add the symbol if it is an operator
  // but if not, we should first clear the calcInput
  if (
    (firstEntryAfterResultsReceived && `+-*/`.includes(userInput)) ||
    !firstEntryAfterResultsReceived
  ) {
    newValue = calcInputVal + userInput;
  } else {
    newValue = userInput;
  }

  $(`#calcInput`).val(newValue);
  firstEntryAfterResultsReceived = false;
}

function submitCalc() {
  // only submit this information if the necessary fields
  // have been filled in and selected
  // let firstNumber = $(`#firstNumberInput`).val();
  // let secondNumber = $(`#secondNumberInput`).val();
  // TODO: send alert on invalid input
  let formula = $(`#calcInput`).val();
  if (validInput(formula)) {
    getCalc(formula);
  } // end if
}

function getCalc(formula) {
  $.ajax({
    method: 'POST',
    url: '/calculate',
    data: {
      formulaToCalculate: formula,
    },
  }).then((res) => {
    // clear inputs
    clearInputs();
    // a calc has been submitted, so
    beforeFirstSubmit = false;
    updateDOM(res);
  });
}

function updateDOM() {
  console.log(`in updateDOM()`);
  // fetch the latest data
  $.ajax({ method: `GET`, url: `/results` }).then(renderToDOM);
}

function renderToDOM(res) {
  console.log(`in renderToDOM`);
  console.log(`response is`, res);
  // update the latest calc's results
  // but only if the user has engaged
  // if the user hasn't submitted any calculation,
  // don't display this information!
  if (!beforeFirstSubmit) {
    $(`#calcInput`).val(res.latestResult);
    firstEntryAfterResultsReceived = true;
  }
  // update the results history
  $(`#resultsHistory`).empty();
  for (let result of res.resultsHistory) {
    $(`#resultsHistory`).append(`
      <li class="oldResult">${result}</li>
    `);
  }
}

function clearInputs() {
  // clear the inputs
  $(`.calcInput`).val(``);
  // focus on the first number
  $(`#calcInput`).focus();
}

// clears history and updatesDOM
function clearHistory() {
  $.ajax({ method: 'DELETE', url: `/clear-history` }).then(updateDOM);
}

function rerunOldResult() {
  console.log(`in rerunOldResult`);
  console.log(`this is`, $(this));
  getCalc($(this).text());
}

function validInput(formula) {
  // validation: only accept formulas that include 01234567890+-*/
  // otherwise reject with a bad request
  for (let char of formula) {
    if (!`.01234567890+-*/ `.includes(char)) {
      // there's a char here that we can't process
      console.log(
        `there's a char in the input field that can't be processed mathematically`
      );
      alert(
        `There's a char in the input field that can't be processed mathematically. Please correct.`
      );
      return false;
    }
  }
  // if the first operator is /, this will cause a division by zero
  if (formula[0] === `/`) {
    console.log(
      `formula can't start by / --- division by zero error will result`
    );
    alert(
      `The formula can't start with division - a division by zero error will result. Please correct.`
    );
    return false;
  }

  let containsOperators = false;
  // test whether any two operators are directly next to each other
  for (let i = 0; i < formula.length - 1; i++) {
    // at the same time, check whether there are any operators listed at all
    // if no operators are listed, no calc can be performed
    if (`+-*/`.includes(formula[i])) {
      containsOperators = true;
    }
    if (`+-*/`.includes(formula[i]) && `+-*/`.includes(formula[i + 1])) {
      // the operators are directly next to each other!
      console.log(`the operators are next to each other`);
      alert(
        `There are two mathematical operators right next to each other. Please correct.`
      );
      return false;
    }
  }
  // if there are no operators, no calc can be performed
  if (!containsOperators) {
    console.log(`the formula contains no operators`);
    alert(
      `There are no mathematical operators in this formula. Please correct.`
    );
    return false;
  }
  return true;
}

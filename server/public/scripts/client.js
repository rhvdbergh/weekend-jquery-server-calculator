console.log(`in js`);

// checks to see whether user has submitted a calculation
// used to display latestResult from server or not
let beforeFirstSubmit = true;

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
}

//
function addSymbol() {
  // add the symbol of the selected button to the calculation
  // use trim() to delete any whitespace added by html formatting
  let newValue = $(`#calcInput`).val() + $(this).text().trim();
  $(`#calcInput`).val(newValue);
  // $(this).addClass(`selectedSymbol`);
}

function submitCalc() {
  // only submit this information if the necessary fields
  // have been filled in and selected
  // let firstNumber = $(`#firstNumberInput`).val();
  // let secondNumber = $(`#secondNumberInput`).val();
  // TODO: validate before input, currently set to true to run
  let formula = $(`#calcInput`).val();
  if (validInput(formula)) {
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
  } // end if
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
    $(`#currentResult`).text(res.latestResult);
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

function validInput(formula) {
  // validation: only accept formulas that include 01234567890+-*/
  // otherwise reject with a bad request
  for (let char of formula) {
    if (!`01234567890+-*/`.includes(char)) {
      // there's a char here that we can't process
      console.log(
        `there's a char in the input field that can't be processed mathematically`
      );
      return false;
    }
  }
  // if the first operator is /, this will cause a division by zero
  if (formula[0] === `/`) {
    console.log(
      `formula can't start by / --- division by zero error will result`
    );
    return false;
  }
  // test whether any two operators are directly next to each other
  for (let i = 0; i < formula.length - 1; i++) {
    if (`+-*/`.includes(formula[i]) && `+-*/`.includes(formula[i + 1])) {
      // the operators are directly next to each other!
      console.log(`the operators are next to each other`);
      return false;
    }
  }
  return true;
}

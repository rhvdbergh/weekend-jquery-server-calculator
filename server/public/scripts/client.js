console.log(`in js`);

// checks to see whether user has submitted a calculation
// used to display latestResult from server or not
let beforeFirstSubmit = true;

$(onReady);

// save the latest clicked math symbol
let mathSymbol;

function onReady() {
  console.log(`in jq`);

  // update the DOM with data from the server
  updateDOM();

  // add event listeners
  $(`.mathSymbolButton`).on(`click`, changeSymbol);
  $(`#equalsButton`).on(`click`, submitCalc);
}

//
function changeSymbol() {
  // the text of this button is the math operator needed
  mathSymbol = $(this).text();
  console.log('mathSymbol is', mathSymbol);
}

function submitCalc() {
  $.ajax({
    method: 'POST',
    url: '/calculate',
    data: {
      firstNumber: $(`#firstNumberInput`).val(),
      secondNumber: $(`#secondNumberInput`).val(),
      mathSymbol,
    },
  }).then((res) => {
    // clear the inputs
    $(`.calcInput`).val(``);
    // focus on the first number
    $(`#firstNumberInput`).focus();
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
    $(`#currentResultContainer`).text(res.latestResult);
  }
  // update the results history
  $(`#resultsHistory`).empty();
  for (let result of res.resultsHistory) {
    $(`#resultsHistory`).append(`
      <li class="oldResult">${result}</li>
    `);
  }
}

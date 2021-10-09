console.log(`in js`);

$(onReady);

// save the latest clicked math symbol
let mathSymbol;

function onReady() {
  console.log(`in jq`);

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
  }).then(updateDOM);
}

function updateDOM(res) {
  console.log(`in updateDOM()`);
  // fetch the latest data
  $.ajax({ method: `GET`, url: `/results` }).then(renderToDOM);
}

function renderToDOM(res) {
  console.log(`in renderToDOM`);
  console.log(`response is`, res);
  // update the latest calc's results
  $(`#currentResultContainer`).text(res.latestResult);
  // update the results history
  $(`#resultsHistory`).empty();
  for (let result of res.resultsHistory) {
    $(`#resultsHistory`).append(`
      <li class="oldResult">${result}</li>
    `);
  }
}

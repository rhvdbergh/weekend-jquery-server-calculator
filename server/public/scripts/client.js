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
}

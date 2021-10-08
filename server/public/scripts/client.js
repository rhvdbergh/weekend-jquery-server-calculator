console.log(`in js`);

$(onReady);

// save the latest clicked math symbol
let mathSymbol;

function onReady() {
  console.log(`in jq`);

  // add event listeners
  $(`.mathSymbolButton`).on(`click`, changeSymbol);
}

//
function changeSymbol() {
  // the text of this button is the math operator needed
  mathSymbol = $(this).text();
  console.log('mathSymbol is', mathSymbol);
}

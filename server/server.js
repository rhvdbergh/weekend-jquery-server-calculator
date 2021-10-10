const express = require(`express`);
const bodyParser = require(`body-parser`);
const validInput = require(`./modules/validation`);
const { sanitizeFormula, findOperatorIndices } = require(`./modules/helpers`);

// Heroku will assign a PORT automatically
// see the app.listen below
const PORT = 5000;

const app = express();

// a variable to keep track of what the last result was
let latestResult;
// store the history of calculations
let resultsHistory = [];

// set up the static folder to server index.html
app.use(express.static(`./server/public`));

// set up the bodyParser so we can use req.body
app.use(bodyParser.urlencoded({ extended: true }));

// heroku will set the port automatically via process.env.PORT
// if there is no process.env.PORT, fall back on PORT assigned as const above
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`READY TO DO SOME MATH YEAH!`);
});

// return the latest result and the history of results
app.get(`/results`, (req, res) => {
  res.send({
    latestResult,
    resultsHistory,
  });
});

// resets the data on the server, including the latest results
app.delete(`/clear-history`, (req, res) => {
  resultsHistory = [];
  latestResult = 0;
  res.send(200);
});

// receive a formula and do the calc for that formula
app.post(`/calculate`, (req, res) => {
  console.log(`POST /calculate`);

  // sanitize the input to make sure there aren't any operators at the start or end
  let formula = sanitizeFormula(req.body.formulaToCalculate);
  let operators = findOperatorIndices(formula); // an array of operator objects, each containing index and math symbol
  // the numbers that operations will be done on
  let num1; // num to the left of operator
  let num2; // num to the right of operator

  // if the formula is invalid, send back a bad request signal
  if (!validInput(formula)) {
    res.sendStatus(400);
    return;
  }

  // reset latestResult to 0
  latestResult = 0;

  // // do the calculations one for one until complete
  while (operators.length > 0) {
    let result = 0;

    // recalculate the operators after formula has changed
    // because a calc has been done and the formula has changed
    operators = findOperatorIndices(formula);

    // determine the order of calculations
    // if there's a * or / do that first
    // the following .findIndex() returns the index of the first / or *, or returns
    // -1 if there aren't any left
    nextOperationIndex = operators.findIndex((operation) => {
      console.log(`in the nextOpI .find(), operation is:`, operation);
      console.log(
        `in the nextOpI .find(), operation.operator is`,
        operation.operator
      );
      return operation.operator === '*' || operation.operator === '/';
    });

    if (nextOperationIndex === -1) {
      // there's no * or / or there aren't any left, so
      // we take the operators in the order they appear
      nextOperationIndex = 0;
    }

    let startFrom;
    let endAt;

    // retrieve the number before and after this index
    // the first number should be up to just before this index, starting from:
    // -- if this operator is the first entry in the operators array, at the start of formula
    // -- or, just after the index of the previous operator in the operators array
    endAt = operators[nextOperationIndex].index;
    nextOperationIndex === 0
      ? (startFrom = 0)
      : (startFrom = operators[nextOperationIndex - 1].index + 1);
    num1 = Number(formula.substring(startFrom, endAt));
    // the second number should start just after this index, up to:
    // -- if this is operator is the last entry in the operators array, up to the end of the array
    // -- or, just before the index of the next operation in the operators array
    startFrom = operators[nextOperationIndex].index + 1;
    nextOperationIndex === operators.length - 1
      ? (num2 = Number(formula.substring(startFrom)))
      : (num2 = Number(
          formula.substring(startFrom, operators[nextOperationIndex + 1].index)
        ));

    console.log(`this is num1`, num1);
    console.log(`this is num2`, num2);

    switch (operators[nextOperationIndex].operator) {
      case '+':
        result = result + num1 + num2;
        break;
      case '-':
        result = result + num1 - num2;
        break;
      case '*':
        result = result + num1 * num2;
        break;
      case '/':
        result = result + num1 / num2;
    }

    // we have resolved one operator of the formula
    // now we can replace that subformula with its result
    // we'll use a replace
    // a replace will find the first match, which will be this operation
    let currentFormula =
      '' + num1 + operators[nextOperationIndex].operator + num2;
    console.log(`this is the currentFormula`, currentFormula);
    console.log(`and this is the result`, result);
    formula = formula.replace(currentFormula, result);

    console.log(`this is the new formula after a calc`, formula);

    //remove this operator from the operators array
    operators.splice(nextOperationIndex, 1);
    latestResult = result;
  } // end while
  // then save result
  // save the formula as received by user
  resultsHistory.unshift(req.body.formulaToCalculate);
  console.log(latestResult);
  console.log(resultsHistory);
  res.sendStatus(201);
});

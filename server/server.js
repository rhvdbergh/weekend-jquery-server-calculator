const express = require(`express`);
const bodyParser = require(`body-parser`);

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

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`READY TO DO SOME MATH YEAH!`);
});

app.post(`/calculate`, (req, res) => {
  console.log(`POST /calculate`);
  // do some logic, save the result, and then
  // send back the status to say it's created (that's probably the best code to use)

  latestResult = 0;

  let formula = req.body.formulaToCalculate;
  let numbers = [];
  let operators = [];
  // the numbers that operations will be done on
  let num1; // num to the left of operator
  let num2; // num to the right of operator

  // add 0 to the beginning of formula if the first sign is an operator
  // this is to make the calculation easier
  if (`+-*`.includes(formula[0])) {
    formula = `0${formula}`;
    console.log(`first included +-* so 0 added:`, formula);
  }

  // but if the operator is /, this will cause a division by zero
  // so send a Bad Request status code
  if (formula[0] === `/`) {
    res.sendStatus(400);
    return;
  }

  // if the last sign is an operator, add 0 to the end
  if (`+-*/`.includes(formula[formula.length - 1])) {
    formula += `0`;
  }

  // find the indices of the operators
  for (let i = 0; i < formula.length; i++) {
    // if it's an operator, push it to the operators array
    // include the operator and the index
    if (`+-*/`.includes(formula[i])) {
      operators.push({
        operator: formula[i],
        index: i,
      });
    }
  }

  console.log(`this is operators`, operators);

  // do the calculations one for one until complete
  let nextOperationIndex;
  while (operators.length > 0) {
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

    if (nextOperationIndex !== -1) {
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
    num1 = formula.substring(startFrom, endAt);
    // the second number should start just after this index, up to:
    // -- if this is operator is the last entry in the operators array, up to the end of the array
    // -- or, just before the index of the next operation in the operators array
    startFrom = operators[nextOperationIndex].index + 1;
    nextOperationIndex === operators.length - 1
      ? (num2 = formula.substring(startFrom))
      : (num2 = formula.substring(
          startFrom,
          operators[nextOperationIndex].index
        ));

    console.log(`this is num1`, num1);
    console.log(`this is num2`, num2);

    // if there are no * or / left, do the operations in order

    //remove this operator from the operators array
    operators.splice(nextOperationIndex, 1);
  }
  // then save result

  resultsHistory.push(req.body.formulaToCalculate);
  console.log(latestResult);
  console.log(resultsHistory);
  res.sendStatus(201);
});

// return the latest result and the history of results
app.get(`/results`, (req, res) => {
  res.send({
    latestResult,
    resultsHistory,
  });
});

// function add(num1, num2) {
//   return num1 + num2;
// }

// function minus(num1, num2) {
//   return num1 - num2;
// }

// function multiply(num1, num2) {
//   return num1 * num2;
// }

// function divide(num1, num2) {
//   return num1 / num2;
// }

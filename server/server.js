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
  // data should look like this:
  /*
  {
    firstNumber,
    secondNumber,
    mathSymbol
  }
  */

  latestResult = 0;

  let num1 = req.body.firstNumber;
  let num2 = req.body.secondNumber;

  switch (req.body.mathSymbol) {
    case '+':
      latestResult = num1 + num2;
      break;
    case '-':
      latestResult = num1 - num2;
      break;
    case '*':
      latestResult = num1 * num2;
      break;
    case '/':
      latestResult = num1 / num2;
  }

  resultsHistory.push(
    `${num1} ${req.body.mathSymbol} ${num2} = ${latestResult}`
  );
  console.log(latestResult);
  console.log(resultsHistory);
  res.sendStatus(201);
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

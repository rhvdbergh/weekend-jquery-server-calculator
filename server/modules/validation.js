function validInput(formula) {
  // validation: only accept formulas that include 01234567890+-*/
  // otherwise reject with a bad request

  for (let char of formula) {
    if (!`.01234567890+-*/ `.includes(char)) {
      // there's a char here that we can't process
      return false;
    }
  }
  // if the first operator is /, this will cause a division by zero
  if (formula[0] === `/`) {
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
      return false;
    }
  }
  // if there are no operators, no calc can be performed
  if (!containsOperators) {
    return false;
  }
  if (!containsOperators) {
    return false;
  }
  return true;
}

module.exports = validInput;

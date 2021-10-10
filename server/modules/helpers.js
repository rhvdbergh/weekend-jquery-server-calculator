function sanitizeFormula(formula) {
  // add 0 to the beginning of formula if the first sign is an operator
  // this is to make the calculation easier
  if (`+-*`.includes(formula[0])) {
    formula = `0${formula}`;
    console.log(`first included +-* so 0 added:`, formula);
  }

  // if the last sign is an operator, add 0 to the end
  if (`+-*/`.includes(formula[formula.length - 1])) {
    formula += `0`;
  }

  // if there's any whitespace, remove it
  formula.replace(' ', '');
  return formula;
}

function findOperatorIndices(formula) {
  let operators = [];
  // find the indices of the operators in the formula
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
  return operators;
}

module.exports = {
  sanitizeFormula,
  findOperatorIndices,
};

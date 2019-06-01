export function approx(actual, expected, prec = 12) {
  if (typeof expected === 'number') {
    let result = actual.toPrecision(prec) === expected.toPrecision(prec);
    if ( ! result ) {
      console.log(`*** Expected=${expected}\n    Actual  =${actual}`);
    }
    return result;
  }
  return actual === expected;
}

export function logNames(leafArray) {
  leafArray.forEach((leaf)=>{
    console.log(leaf.fullName());
  });
}

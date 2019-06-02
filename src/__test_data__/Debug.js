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

// Difference in parts-per-factor
export function ppFactor(factor, actual, expected, limit = 1) {
  if (typeof expected === 'number') {
    let diff = Math.abs(actual-expected);
    let ppDiff = factor * (diff/expected);
    if ( ppDiff > limit ) {
      console.log(`*** Expected=${expected}\n    Actual  =${actual}\n    Diff    =${diff}\n    Pp ${factor} =${ppDiff}`);;
      return false;
    }
    return true;
  }
  return actual === expected;
}

export function ppb(actual, expected, limit = 1) {
  return ppFactor(1000000000, actual, expected, limit);
}

export function ppm(actual, expected, limit = 1) {
  return ppFactor(1000000, actual, expected, limit);
}

export function ppk(actual, expected, limit = 1) {
  return ppFactor(1000, actual, expected, limit);
}

export function ppp(actual, expected, limit = 1) {
  return ppFactor(100, actual, expected, limit);
}

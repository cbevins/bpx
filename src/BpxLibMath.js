/**
 * @file Class of static math functions used by other BehavePlus Explorer files.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

export default class BpxLibMath {
  static and(a, b) {
    return a && b;
  }

  static between(x, mn, mx) {
    return (x > mn && x < mx);
  }

  static within(x, mn, mx) {
    return (x >= mn && x <= mx);
  }

  // Safe division
  static div(a, b) {
    return (b === 0) ? 0 : a / b;
  }

  // Constrains `a` to range [0..1]
  static fraction(a) {
    return Math.max(0, Math.min(1, a));
  }

  static ge(a, b) {
    return a >= b;
  }

  static gt(a, b) {
    return a > b;
  }

  // Safe division
  static inverse(a) {
    return (a === 0) ? 0 : 1 / a;
  }

  static le(a, b) {
    return a <= b;
  }

  static lt(a, b) {
    return a < b;
  }

  static max(...args) {
    return Math.max(...args);
  }

  static min(...args) {
    return Math.min(...args);
  }

  static mul(...args) {
    return args.reduce((previous, current) => previous * current);
  }

  static or(a, b) {
    return a || b;
  }

  // Safe division with contraint to [0..1]
  static portion(a, b) {
    return BpxLibMath.fraction(BpxLibMath.div(a, b));
  }

  static sum(...theArgs) {
    return theArgs.reduce((previous, current) => previous + current);
  }

  // Sum of products
  // If there are 6 args, returns a[0]*a[3] + a[1]*a[4] + a[2]*a[5]
  /* eslint-disable prefer-rest-params */
  static sumProd() {
    const pairs = arguments.length / 2;
    let s = 0;
    for (let idx = 0; idx < pairs; idx += 1) {
      s += arguments[idx] * arguments[idx + pairs];
    }
    return s;
  }
  /* eslint-enable prefer-rest-params */
}

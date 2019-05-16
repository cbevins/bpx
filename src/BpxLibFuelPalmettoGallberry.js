/**
 * @file Class of static BehavePlus Explorer palmetto-gallberry dynamic fuel model equations
 * as described by Hough and Albini (1978) and as implemented by BehavePlus V6.
 * @copyright Systems for Environmentl Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

class BpxLibFuelPalmettoGallberry {
  static domain() {
    return 'palmettoGallberry';
  }

  // dead 0 to 0.25 inch
  static deadFineLoad(age, ht) {
    return Math.max(0.0, -0.00121 + 0.00379 * Math.log(age) + 0.00118 * ht * ht);
  }

  // dead 0.25 to 1 inch
  static deadSmallLoad(age, cover) {
    return Math.max(0.0, -0.00775 + 0.00021 * cover + 0.00007 * age * age);
  }

  // dead foliage
  static deadFoliageLoad(age, cover) {
    return 0.00221 * (age ** 0.51263) * Math.exp(0.02482 * cover);
  }

  // L layer
  static deadLitterLoad(age, basalArea) {
    return (0.03632 + 0.0005336 * basalArea) * (1.0 - (0.25 ** age));
  }

  static fuelDepth(ht) {
    return Math.max(0.01, (2.0 * ht / 3.0));
  }

  // live 0 to 0.25 inch
  static liveFineLoad(age, ht) {
    return Math.max(0.0, 0.00546 + 0.00092 * age + 0.00212 * ht * ht);
  }

  // live 0.25 to 1 inch
  static liveSmallLoad(age, ht) {
    return Math.max(0.0, -0.02128 + 0.00014 * age * age + 0.00314 * ht * ht);
  }

  // live foliage
  static liveFoliageLoad(age, cover, ht) {
    return Math.max(0.0, -0.0036 + 0.00253 * age + 0.00049 * cover + 0.00282 * ht * ht);
  }
}

export default BpxLibFuelPalmettoGallberry;

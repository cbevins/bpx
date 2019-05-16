/**
 * @file Class of static BehavePlus Explorer standard Behave fuel model equations.
 * @copyright Systems for Environmentl Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

class BpxLibFuelBehave {
  static curedHerbFraction(liveHerbMc) {
    const fraction = 1.333 - 1.11 * liveHerbMc;
    return Math.max(0.0, Math.min(1.0, fraction));
  }

  static domain() {
    return 'behave';
  }

  static deadHerbLoad(totalHerbLoad, curedHerbFraction) {
    return totalHerbLoad * curedHerbFraction;
  }

  static liveHerbLoad(totalHerbLoad, curedHerbFraction) {
    return totalHerbLoad * (1.0 - curedHerbFraction);
  }
}

export default BpxLibFuelBehave;

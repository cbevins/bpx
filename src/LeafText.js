/**
 * @file Defines the base LeafText class, which is extended by
 * many of the Leaf* classes.
 * @copyright Systems for Environmentl Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import Leaf from './Leaf';
import BpxStrings from './BpxStrings';

class LeafText extends Leaf {
  constructor(branch, name) {
    super(branch, name).value('');
    this.own.units = 'any';
  }

  ensureUnits(units, fn) {
    if (!LeafText.hasUnits(units)) {
      throw new Error(`${fn}' called on '${this.name()}' with invalid units '${units}'`);
    }
  }

  static hasUnits(units) {
    return Object.keys(BpxStrings).includes(units);
  }

  units(units = undefined) {
    if (units !== undefined) {
      this.ensureUnits(units, 'LeafText.units');
      this.own.units = units;
      return this;
    }
    return this.own.units;
  }
}

export default LeafText;

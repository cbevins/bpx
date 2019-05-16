/**
 * @file Defines the base LeafQuantity class, which is extended by
 * many of the Leaf classes.
 * @copyright Systems for Environmentl Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import Leaf from './Leaf';
import BpxUnits from './BpxUnits';

class LeafQuantity extends Leaf {
  constructor(branch, name) {
    super(branch, name).value(0);
    this.own.units = 'factor';
  }

  ensureUnits(units, fn) {
    if (!LeafQuantity.hasUnits(units)) {
      throw new Error(`${fn}' called on '${this.name()}' with invalid units '${units}'`);
    }
  }

  static hasUnits(units) {
    return Object.keys(BpxUnits).includes(units);
  }

  units(units = undefined) {
    if (units !== undefined) {
      this.ensureUnits(units, 'LeafQuantity.units');
      this.own.units = units;
      return this;
    }
    return this.own.units;
  }
}

export default LeafQuantity;

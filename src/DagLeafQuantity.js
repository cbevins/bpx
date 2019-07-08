/**
 * @file Defines the base DagLeafQuantity class, which is extended by
 * many of the DagLeaf classes.
 * @copyright Systems for Environmentl Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagLeaf from './DagLeaf';
import BpxUnits from './BpxUnits';

export default class DagLeafQuantity extends DagLeaf {
  constructor(branch, name) {
    super(branch, name).value(0);
    this.own.units = 'factor';
  }

  displayDecimals() {
    const quantity = BpxUnits[this.own.units];
    if (quantity.hasOwnProperty('units')) {
      return quantity.display.decimals;
    }
    return 2;
  }

  displayUnits() {
    const quantity = BpxUnits[this.own.units];
    if (quantity.hasOwnProperty('units')) {
      return quantity.display.units;
    }
    return "TBD";
  }

  ensureUnits(units, fn) {
    if (!DagLeafQuantity.hasUnits(units)) {
      throw new Error(`${fn}' called on '${this.name()}' with invalid units '${units}'`);
    }
  }

  static hasUnits(units) {
    return Object.keys(BpxUnits).includes(units);
  }

  units(units = undefined) {
    if (units !== undefined) {
      this.ensureUnits(units, 'DagLeafQuantity.units');
      this.own.units = units;
      return this;
    }
    return this.own.units;
  }

  unitsData(units) {
    this.ensureUnits(units, 'DagLeafQuantity.units');
    return BpxUnits[units];
  }
}

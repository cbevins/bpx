/**
 * @file Defines the DagLeafText class.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagLeaf from './DagLeaf';
import BpxStrings from './BpxStrings';

export default class DagLeafText extends DagLeaf {
  constructor(branch, name) {
    super(branch, name).value('');
    this.own.units = 'any';
  }

  ensureUnits(units, fn) {
    if (!DagLeafText.hasUnits(units)) {
      throw new Error(`${fn}' called on '${this.name()}' with invalid units '${units}'`);
    }
  }

  static hasUnits(units) {
    return Object.keys(BpxStrings).includes(units);
  }

  units(units = undefined) {
    if (units !== undefined) {
      this.ensureUnits(units, 'DagLeafText.units');
      this.own.units = units;
      return this;
    }
    return this.own.units;
  }
}

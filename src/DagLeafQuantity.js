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

  baseUnits() {
    return BpxUnits[this.own.units].set.base[0];
  }

  baseValueToDisplayValue(baseValue) {
    return BpxUnits[this.own.units].units[this.displayUnits()]
      .fromBase(baseValue)
      .toFixed(this.displayDecimals());
  }

  displayDecimals() {
    return BpxUnits[this.own.units].display.decimals;
  }

  displayInputs() {
    return this.own.inputs.map(x => this.baseValueToDisplayValue(x));
  }

  displayUnits() {
    return BpxUnits[this.own.units].display.units;
  }

  displayValue() {
    return this.baseValueToDisplayValue(this.own.value);
  }

  displayValueToBaseValue(displayValue) {
    return BpxUnits[this.own.units].units[this.displayUnits()]
      .intoBase(displayValue);
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

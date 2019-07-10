/**
 * @file Defines the base DagLeafQuantity class, which is extended by
 * many of the DagLeaf classes.
 * @copyright Systems for Environmentl Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagLeaf from './DagLeaf';

export default class DagLeafQuantity extends DagLeaf {
  constructor(branch, name) {
    super(branch, name).value(0);
    this.own.units = 'factor';
  }

  baseUnits() {
    return this.own.dag.units.baseUnits(this.own.units);
  }

  baseValueToDisplayValue(baseValue) {
    return this.own.dag.units.baseValueToDisplayValue(this.own.units, baseValue);
  }

  displayDecimals() {
    return this.own.dag.units.displayDecimals(this.own.units);
  }

  displayInputs() {
    return this.own.inputs.map(x => this.baseValueToDisplayValue(x));
  }

  displayUnits() {
    return this.own.dag.units.displayUnits(this.own.units);
  }

  displayValue() {
    return this.own.dag.units.baseValueToDisplayValue(this.own.units, this.own.value);
  }

  displayValueToBaseValue(displayValue) {
    return this.own.dag.units.displayValueToBaseValue(this.own.units, displayValue);
  }

  validateBaseValue(baseValue) {
    return this.own.dag.units.validateBaseValue(this.own.units, baseValue);
  }

  validateDisplayValue(displayValue) {
    return this.own.dag.units.validateDisplayValue(this.own.units, displayValue);
  }

  ensureUnits(units, fn) {
    if (!this.hasUnits(units)) {
      throw new Error(`${fn}' called on '${this.name()}' with invalid units '${units}'`);
    }
  }

  hasUnits(units) {
    // Modified to defer an actual test until this.own.dag.units has been set
    return (this.own.dag===undefined || this.own.dag.units===undefined)
      ? true : this.own.dag.units.hasUnits(units);
  }

  units(units = undefined) {
    if (units !== undefined) {
      this.ensureUnits(units, 'DagLeafQuantity.units');
      this.own.units = units;
      return this;
    }
    return this.own.units;
  }

  // unitsData(units) {
  //   this.ensureUnits(units, 'DagLeafQuantity.units');
  //   return BpxUnits[units];
  // }
}

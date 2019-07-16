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

  isQuantity() {
    return true;
  }

  units(units = undefined) {
    if (units !== undefined) {
      this.ensureUnits(units, 'DagLeafQuantity.units');
      this.own.units = units;
      return this;
    }
    return this.own.units;
  }

  // Returns an array of valid units-of-measure for this leaf
  unitsOfMeasure() {
    return this.own.dag.units.unitsOfMeasure(this.own.units);
  }

  // Validates raw input string
  // Returns a 2-element array [errorMsg, value]
  // On success errorMsg is null and value non-null.
  // On error, errorMsg is a string lietral and value is null.
  validateInput(input) {
    //alert(`validating '${input}'`);
    const content = input.trim();
    if ( content==='') {
      return [`INPUT_IS_REQUIRED`, null];
    }
    let val = Number.parseFloat(content);
    if (Number.isNaN(val)) {
      return [`VALUE_MUST_BE_NUMERIC: '${content}'`, null];
    }
    const result = this.validateDisplayValue(val);
    if (result !== null ) {
      return [result[0], null];
    }
    return [null, val];
  }
}

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

  currentUnits() {
    const {uom, apply} = BpxUnits[this.own.units];
    return uom[apply];
  }

  currentUnitsString() {
    let str = '';
    let numer = 0;
    let denom = 0;
    const uom = this.currentUnits();
    Object.keys(uom).forEach((unit) => {
      let power = uom[unit];
      if (power===0) {
        str += ((numer>0) ? '-' : '') + unit;
        numer+=1;
      } else if (power>0) {
        str += ((numer>0) ? '-' : '') + unit;
        str += (power>1) ? ('^' + power) : '';
        numer+=1;
      } else {
        str += ((denom>0) ? '-' : '/') + unit;
        str += (power<-1) ? ('^' + Math.abs(power)) : '';
        denom+=1;
      }
    })
    if (str === 'percent') {
      str = '%';
    } else if (str==='ratio'||str==='real'||str==='factor') {
      str = 'dl';
    }
    return str;
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

/*
 * @file Defines the BehavePlus Explorer Fuel Bed Canopy
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import BpxTreeFuelBed from './BpxTreeFuelBed';

export default class BpxTreeFuelBedCanopy extends BpxTreeFuelBed {
  constructor(parent, name) {
    super(parent, name);
  }
  connect(tree) {
    BpxTreeFuelBed.prototype.connect.call(this, tree);
    this.waf.fixed(0.4);
    this.windHeadingFromUpslope.fixed(0);
    this.slopeSteepnessRatio.fixed(0);
  }
}

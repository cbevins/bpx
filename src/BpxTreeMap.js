/**
 * @file Defines the BehavePlus Explorer map tree and leafs.
 * @copyright Systems for Environmentl Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';
import DagLeafQuantity from './DagLeafQuantity';
import BpxLibMath from './BpxLibMath';
import BpxLibCompass from './BpxLibCompass';

export default class BpxTreeMap extends DagBranch {
  constructor(parent, name = 'map') {
    super(parent, name);
    new DagLeafQuantity(this, 'scale')
      .desc('map scale (e.g., 24000)')
      .units('factor').value(1);
    new DagLeafQuantity(this, 'factor')
      .desc('map factor (1/scale)')
      .units('factor').value(1);
    new DagLeafQuantity(this, 'interval')
      .desc('map contour interval')
      .units('distanceFt').value(1);
    new DagLeafQuantity(this, 'contours')
      .desc('number of map contours crossed over the measured map distance')
      .units('nonNegative').value(0);
    new DagLeafQuantity(this, 'distance')
      .desc('measured map distance')
      .units('distanceFt').value(1);
    new DagLeafQuantity(this, 'slope')
      .desc('measured map slope ratio')
      .units('slopeSteepness').value(0);
  }

  connect(/* tree */) {
    this.scale.input();
    this.interval.input()
    this.contours.input()
    this.distance.input()
    this.factor.calc(BpxLibMath.div, 1, this.scale);
    this.slope.calc(BpxLibCompass.slopeRatioMap,
      this.scale, this.interval, this.contours, this.distance);
}
}

/**
 * @file Defines the BehavePlus Explorer map tree and leafs.
 * @copyright Systems for Environmentl Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';
import DagLeafQuantity from './DagLeafQuantity';
import BpxLibMath from './BpxLibMath';

export default class BpxTreeMap extends DagBranch {
  constructor(parent, name = 'map') {
    super(parent, name);
    new DagLeafQuantity(this, 'scale')
      .desc('map scale (e.g., 24000)')
      .units('factor').value(1);
    new DagLeafQuantity(this, 'factor')
      .desc('map factor (1/scale)')
      .units('factor').value(1);
    new DagLeafQuantity(this, 'contourInterval')
      .desc('map contour interval')
      .units('distanceFt').value(1);
    new DagLeafQuantity(this, 'contoursCrossed')
      .desc('number of map contours crossed over the measured map distance')
      .units('nonNegative').value(0);
    new DagLeafQuantity(this, 'mapDistance')
      .desc('measured map distance')
      .units('distanceFt').value(1);
  }

  connect(/* tree */) {
    this.scale.input();
    this.contourInterval.input()
    this.contoursCrossed.input()
    this.mapDistance.input()
    this.factor.calc(BpxLibMath.div, 1, this.scale);
  }
}

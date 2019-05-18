/**
 * @file Defines the BehavePlus Explorer slope model tree and leafs.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';
import DagLeafQuantity from './DagLeafQuantity';
import BpxLibCompass from './BpxLibCompass';

export class BpxTreeSlopeDirection extends DagBranch {
  constructor(parent, name = 'direction') {
    super(parent, name);
    new DagLeafQuantity(this, 'aspect')
      .desc('slope aspect (downslope direction) from North')
      .units('azimuth').value(180);
    new DagLeafQuantity(this, 'upslope')
      .desc('upslope from North')
      .units('slopeSteepness').value(0);
  }

  connect(/* tree */) {
    this.aspect.input();
    this.upslope.calc(BpxLibCompass.opposite, this.aspect);
  }
}

export class BpxTreeSlopeSteepness extends DagBranch {
  constructor(parent, name = 'steepness') {
    super(parent, name);
    new DagLeafQuantity(this, 'degrees')
      .desc('slope steepness in degrees from horizontal')
      .units('slopeSteepness').value(0);
    new DagLeafQuantity(this, 'ratio')
      .desc('slope steepness ratio of vertical rise to horizonatl reach')
      .units('slopeSteepness').value(0);
  }

  connect(tree) {
    const cfgSlope = tree.configs.slope.steepness;
    const map = tree.site.map;
    this.degrees
      .inputIf(cfgSlope, 'degrees')
      .calc(BpxLibCompass.slopeDegrees, this.ratio);

    this.ratio
      .calcIf(cfgSlope, 'degrees',BpxLibCompass.slopeDegrees, this.degrees)
      .calcIf(cfgSlope, 'map', BpxLibCompass.slopeRatioMap,
        map.scl, map.cint, map.cont, map.dist)
      .input();
  }
}

export default class BpxTreeSlope extends DagBranch {
  constructor(parent, name = 'slope') {
    super(parent, name);
    new BpxTreeSlopeDirection(this);
    new BpxTreeSlopeSteepness(this);
  }
}

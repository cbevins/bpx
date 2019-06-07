/**
 * @file Defines the BehavePlus Explorer slope model tree and leafs.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';
import DagLeafQuantity from './DagLeafQuantity';
import BpxLibCompass from './BpxLibCompass';

export class BpxTreeSiteSlopeDirection extends DagBranch {
  constructor(parent, name) {
    super(parent, name);

    new DagLeafQuantity(this, 'aspect')
      .desc('slope aspect (downslope direction) from North')
      .label('Aspect')
      .units('azimuth').value(180);

    new DagLeafQuantity(this, 'upslope')
      .desc('upslope from North')
      .label('Upslope Dir from North')
      .units('azimuth').value(0);
  }

  connect(/* tree */) {
    this.aspect.input();
    this.upslope.calc(BpxLibCompass.opposite, this.aspect);
  }
}

export class BpxTreeSiteSlopeSteepness extends DagBranch {
  constructor(parent, name) {
    super(parent, name);

    new DagLeafQuantity(this, 'degrees')
      .desc('slope steepness in degrees from horizontal')
      .label('Slope Steepness')
      .units('slopeSteepness').value(0);

    new DagLeafQuantity(this, 'ratio')
      .desc('slope steepness ratio of vertical rise to horizontal reach')
      .label('Slope Steepness')
      .units('slopeSteepness').value(0.25);
  }

  connect(tree) {
    const cfgSlope = tree.configs.slope.steepness;
    const map = tree.site.map;
    this.degrees
      .inputIf(cfgSlope, 'degrees')
      .calc(BpxLibCompass.slopeDegrees, this.ratio);

    this.ratio
      .calcIf(cfgSlope, 'degrees', BpxLibCompass.slopeRatio, this.degrees)
      .bindIf(cfgSlope, 'map', map.slope )
      // .calcIf(cfgSlope, 'map', BpxLibCompass.slopeRatioMap,
      //   map.scale, map.interval, map.contours, map.distance)
      .input();
  }
}

export default class BpxTreeSiteSlope extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    new BpxTreeSiteSlopeDirection(this, 'direction');
    new BpxTreeSiteSlopeSteepness(this, 'steepness');
  }
}

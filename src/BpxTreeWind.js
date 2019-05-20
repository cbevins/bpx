/**
 * @file Defines the BehavePlus Explorer wind model tree and leafs.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';
import DagLeafQuantity from './DagLeafQuantity';
import BpxLibCompass from './BpxLibCompass';
import BpxLibWind from './BpxLibWind';

export class BpxTreeWindDirection extends DagBranch {
  constructor(parent, name = 'direction') {
    super(parent, name);
    new DagLeafQuantity(this, 'headingFromUpslope')
      .desc('wind heading direction from Upslope')
      .units('azimuth').value(0);
    new DagLeafQuantity(this, 'sourceFromUpslope')
      .desc('wind source direction from Upslope')
      .units('azimuth').value(180);
    new DagLeafQuantity(this, 'sourceFromNorth')
      .desc('wind source direction from North')
      .units('azimuth').value(180);
    new DagLeafQuantity(this, 'headingFromNorth')
      .desc('wind heading direction from North')
      .units('azimuth').value(0);
  }

  connect(tree) {
    const cfg = tree.configs.wind.direction;
    const upslope = tree.site.slope.direction.upslope;
    this.sourceFromNorth
      .calcIf(cfg, 'headingFromUpslope', BpxLibCompass.opposite, this.headingFromNorth)
      .inputIf(cfg, 'sourceFromNorth')
      .calcIf(cfg, 'upslope', BpxLibCompass.opposite, upslope)
    this.headingFromNorth
      .calcIf(cfg, 'headingFromUpslope', BpxLibCompass.sum, this.headingFromUpslope, upslope)
      .calcIf(cfg, 'sourceFromNorth', BpxLibCompass.opposite, this.sourceFromNorth)
      .bindIf(cfg, 'upslope', upslope);
    this.headingFromUpslope
      .inputIf(cfg, 'headingFromUpslope')
      .calcIf(cfg, 'sourceFromNorth', BpxLibCompass.diff, this.headingFromNorth, upslope)
      .fixedIf(cfg, 'upslope', 0);
    this.sourceFromUpslope
      .calc(BpxLibCompass.opposite, this.headingFromUpslope);
   }
}

export class BpxTreeWindSpeed extends DagBranch {
  constructor(parent, name = 'speed') {
    super(parent, name);
    new DagLeafQuantity(this, 'at10m')
      .desc('at 10-m')
      .units('windSpeed').value(0);
    new DagLeafQuantity(this, 'at20ft')
      .desc('at 20-ft')
      .units('windSpeed').value(0);
  }

  connect(tree) {
    const cfg = tree.configs.wind.speed;
    this.at10m
      .inputIf(cfg, 'at10m')
      .calc(BpxLibWind.at10m, this.at20ft);
    this.at20ft
      .inputIf(cfg, 'at20ft')
      //.calcIf(cfg, 'atMidflame', BpxLibWind.at20ftFromMidflame, wsmid, mwaf)
      .calc(BpxLibWind.at20ft, this.at10m);
   }
}

export default class BpxTreeWind extends DagBranch {
  constructor(parent, name = 'wind') {
    super(parent, name);
    new BpxTreeWindDirection(this);
    new BpxTreeWindSpeed(this);
  }
}

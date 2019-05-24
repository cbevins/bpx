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
  constructor(parent, name) {
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
  constructor(parent, name) {
    super(parent, name);
    new DagLeafQuantity(this, 'at10m')
      .desc('at 10-m')
      .units('windSpeed').value(0);
    new DagLeafQuantity(this, 'at20ft')
      .desc('at 20-ft')
      .units('windSpeed').value(0);
    new DagLeafQuantity(this, 'atMidflame')
      .desc('at midflame height')
      .units('windSpeed').value(0);
    new DagLeafQuantity(this, 'waf')
      .desc('midflame wind speed adjustment factor')
      .units('factor').value(1);
  }

  connect(tree) {
    const cfgSpd = tree.configs.wind.speed;
    const cfgWaf = tree.configs.fuel.waf;
    const canopy = tree.site.canopy;
    const fuelDepth = tree.surface.fuel.primary.bed.depth;

    this.at10m
      .inputIf(cfgSpd, 'at10m')
      .calc(BpxLibWind.at10m, this.at20ft);
    this.at20ft
      .inputIf(cfgSpd, 'at20ft')
      .calcIf(cfgSpd, 'at10m', BpxLibWind.at20ft, this.at10m)
      .calc(BpxLibWind.at20ftFromMidflame, this.atMidflame, this.waf);
    this.atMidflame
      .inputIf(cfgSpd, 'atMidflame')
      .calc(BpxLibWind.atMidflame, this.at20ft, this.waf);
    this.waf.input();
   }
}

export default class BpxTreeWind extends DagBranch {
  constructor(parent, name = 'wind') {
    super(parent, name);
    new BpxTreeWindDirection(this, 'direction');
    new BpxTreeWindSpeed(this, 'speed');
  }
}

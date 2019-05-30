/**
 * @file Defines the BehavePlus Explorer fire inputs tree and leafs.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';
import DagLeafQuantity from './DagLeafQuantity';

import BpxLibCompass from './BpxLibCompass';
import BpxLibSurfaceFire from './BpxLibSurfaceFire';

/**
 * Defines the fire ellipse's fire spread vector leafs.
*/
export class TreeFireVector extends DagBranch {
  constructor(parent, name) {
    super(parent, name);

    new DagLeafQuantity(this, 'fromHead')
      .desc('fire spread vector from fire head')
      .units('azimuth').value(0);

    new DagLeafQuantity(this, 'fromNorth')
      .desc('fire spread vector from north')
      .units('azimuth').value(0);

    new DagLeafQuantity(this, 'fromUpslope')
      .desc('fire spread vector from upslope direction')
      .units('azimuth').value(0);
  }
}

/**
 * Defines all possible fire behavior inputs used by BPX.
 */
export default class BpxTreeSiteFire extends DagBranch {
  constructor(parent, name) {
    super(parent, name);

    new DagLeafQuantity(this, 'airTemp')
      .desc('ambient air temperature')
      .units('temperature').value(77);

    new DagLeafQuantity(this, 'effectiveWindSpeed')
      .desc('effective wind speed')
      .units('windSpeed').value(0);

    new DagLeafQuantity(this, 'firelineIntensity')
      .desc('maximum fireline intensity')
      .units('fireFli').value(1);

    new DagLeafQuantity(this, 'flameLength')
      .desc('maximum flame length')
      .units('fireFlame').value(1);

    new DagLeafQuantity(this, 'headingFromUpslope')
      .desc('direction of maximum spread, degrees clockwise from upslope')
      .units('azimuth').value(0);

    new DagLeafQuantity(this, 'headingFromNorth')
      .desc('direction of maximum spread, degrees clockwise from north')
      .units('azimuth').value(0);

    new DagLeafQuantity(this, 'heatPerUnitArea')
      .desc('heat per unit area')
      .units('fireHpua').value(1);

    new DagLeafQuantity(this, 'lengthToWidthRatio')
      .desc('fire ellipse length-to-width ratio')
      .units('fireLwr').value(1);

    new DagLeafQuantity(this, 'midflameWindSpeed')
      .desc('wind speed at midflame height')
      .units('windSpeed').value(0);

    new DagLeafQuantity(this, 'reactionIntensity')
      .desc('reaction intensity')
      .units('fireRxi').value(1);

    new DagLeafQuantity(this, 'ros')
      .desc('fire spread rate')
      .units('fireRos').value(0);

    new DagLeafQuantity(this, 'scorchHt')
      .desc('fire spread vector maximum scorch height')
      .units('fireScorch').value(0);

    new DagLeafQuantity(this, 'sinceIgnition')
      .desc('elapsed time since fire ignition')
      .units('timeMin').value(0);

    new TreeFireVector(this, 'vector');
  }

  connect( tree ) {
    // These configurations are handled by this tree:
    const cfgDir = tree.configs.wind.direction;
    const cfgFli = tree.configs.fire.fli;
    const cfgLwr = tree.configs.fire.lwr;
    const cfgScorch = tree.configs.fire.scorchHt;

    // *FromNorth azimuths require 1 slope leaf: direction.upslope
    const slope = tree.site.slope;

    // Always input
    this.airTemp.input();
    this.heatPerUnitArea.input();
    this.reactionIntensity.input();
    this.ros.input();
    this.sinceIgnition.input();
    this.vector.fromHead.input();
    this.vector.fromNorth.input();
    this.vector.fromUpslope.input();

    // Is wind 'sourceFromNorth' or 'headingFromUpslope'?
    this.headingFromUpslope
      .inputIf(cfgDir, 'headingFromUpslope')
      .calc(BpxLibCompass.diff,
        this.headingFromNorth,
        slope.direction.upslope);

    this.headingFromNorth
      .inputIf(cfgDir, 'sourceFromNorth')
      .calc(BpxLibCompass.sum,
        slope.direction.upslope,
        this.headingFromUpslope);

    // Delegate midflame wind speed to the wind speed module
    this.midflameWindSpeed
      .bind(tree.site.wind.speed.atMidflame);

    // Prefer to enter 'lengthToWidthRatio' or 'effectiveWindSpeed'
    this.lengthToWidthRatio
      .inputIf(cfgLwr, 'lengthToWidthRatio')
      .calc(BpxLibSurfaceFire.lengthToWidthRatio,
        this.effectiveWindSpeed);

    this.effectiveWindSpeed
      .inputIf(cfgLwr, 'effectiveWindSpeed')
      .calc(BpxLibSurfaceFire.effectiveWindSpeedFromLwr,
        this.lengthToWidthRatio);

    // Prefer to enter 'firelineIntensity' or 'flameLength'
    this.firelineIntensity
      .inputIf(cfgFli, 'firelineIntensity')
      .calc(BpxLibSurfaceFire.fliFromFlameLength,
        this.flameLength);

    this.flameLength
      .inputIf(cfgFli, 'flameLength')
      .calc(BpxLibSurfaceFire.flameLength,
        this.firelineIntensity);

    // Prefer to input or estimate scorch height?
    this.scorchHt
      .calcIf(cfgScorch, 'estimated',
        BpxLibSurfaceFire.scorchHt,
          this.firelineIntensity,
          this.midflameWindSpeed,
          this.airTemp)
      .input();
  }
}

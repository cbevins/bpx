/**
 * @file Defines the BehavePlus Explorer Weighted Fire sub-tree.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';
import DagLeafBool from './DagLeafBool';
import DagLeafQuantity from './DagLeafQuantity';

import BpxLibMath from './BpxLibMath';
import BpxLibSurfaceFire from './BpxLibSurfaceFire';

/**
 * Defines the surface fuel weighted fire behavior tree-leaf structure.
 */
export class TreeFireWeighted extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    new DagLeafQuantity(this, 'primaryCover')
      .desc('fraction of surface area covered by the primary fuel')
      .units('fuelCover').value(1);

    // These are always bound to the Primary Surface Fuel and Fire
    new DagLeafQuantity(this, 'effectiveWindSpeed')
      .desc('effective wind speed')
      .units('windSpeed').value(0);
    new DagLeafQuantity(this, 'headingFromUpslope')
      .desc('direction of maximum spread, degrees clockwise from upslope')
      .units('azimuth').value(0);
    new DagLeafQuantity(this, 'lengthToWidthRatio')
      .desc('fire ellipse length-to-width ratio')
      .units('fireLwr').value(1);
    new DagLeafQuantity(this, 'midflameWindSpeed')
      .desc('midflame wind speed')
      .units('windSpeed').value(0);
    new DagLeafQuantity(this, 'waf')
      .desc('applied midflame wind speed adjustment factor')
      .units('fraction').value(1);

    // These are assigned the maximum value
    new DagLeafQuantity(this, 'firelineIntensity')
      .desc('maximum fireline intensity')
      .units('fireFli').value(1);

    new DagLeafQuantity(this, 'flameLength')
      .desc('maximum flame length')
      .units('fireFlame').value(1);

    new DagLeafQuantity(this, 'heatPerUnitArea')
      .desc('heat per unit area')
      .units('fireHpua').value(1);

    new DagLeafQuantity(this, 'reactionIntensity')
      .desc('reaction intensity')
      .units('fireRxi').value(1);
    // fuelDepth?

    // These are assigned the minimum value
    new DagLeafBool(this, 'effectiveWindSpeedExceeded')
      .desc('effective wind speed limit is exceeded')
      .value(false);
    new DagLeafQuantity(this, 'effectiveWindSpeedLimit')
      .desc('upper limit of the effective wind speed')
      .units('windSpeed').value(88000);

    new DagLeafQuantity(this, 'ros')
      .desc('applied maximum spread rate')
      .units('fireRos').value(0);

    new DagLeafQuantity(this, 'rosArithmetic')
      .desc('arithmetic mean maximum spread rate')
      .units('fireRos').value(0);

    new DagLeafQuantity(this, 'rosExpected')
      .desc('expected maximum spread rate')
      .units('fireRos').value(0);

    new DagLeafQuantity(this, 'rosHarmonic')
      .desc('harmonic mean maximum spread rate')
      .units('fireRos').value(0);
  }
}

/**
 * Implements the Bpx surface fire weighted subtree
 * with the following structue:
 * - tree.surface.fuel.primary
 * - tree.surface.fuel.secondary
 * - tree.surface.fire.weighted
 */
export default class BpxTreeFireWeighted extends TreeFireWeighted {
  connect(tree) {
    const cfgFuel2 = tree.configs.fuel.secondary;
    const cfgWtg = tree.configs.fire.weightingMethod;
    const fuel1 = tree.surface.fuel.primary;
    const fuel2 = tree.surface.fuel.secondary;

    this.primaryCover
      .fixedIf(cfgFuel2, 'none', 1)
      .input();

    // These are always bound to the Primary Surface Fuel and Fire
    this.effectiveWindSpeed
      .bind(fuel1.fire.effectiveWindSpeed);
    this.headingFromUpslope
      .bind(fuel1.fire.headingFromUpslope);
    this.lengthToWidthRatio
      .bind(fuel1.fire.lengthToWidthRatio);
    this.midflameWindSpeed
      .bind(fuel1.fire.wind.atMidflame);
    this.waf
      .bind(fuel1.fire.wind.waf);

    // These are always assigned the maximum value
    this.firelineIntensity
      .bindIf(cfgFuel2, 'none', fuel1.fire.firelineIntensity)
      .calc(BpxLibMath.max,
        fuel1.fire.firelineIntensity,
        fuel2.fire.firelineIntensity);
    this.flameLength
      .bindIf(cfgFuel2, 'none', fuel1.fire.flameLength)
      .calc(BpxLibMath.max,
        fuel1.fire.flameLength,
        fuel2.fire.flameLength);
    this.heatPerUnitArea
      .bindIf(cfgFuel2, 'none', fuel1.fire.heatPerUnitArea)
      .calc(BpxLibMath.max,
        fuel1.fire.heatPerUnitArea,
        fuel2.fire.heatPerUnitArea);
    this.reactionIntensity
      .bindIf(cfgFuel2, 'none', fuel1.fire.reactionIntensity)
      .calc(BpxLibMath.max,
        fuel1.fire.reactionIntensity,
        fuel2.fire.reactionIntensity);

    // These are always assigned the minimum value
    this.effectiveWindSpeedLimit
      .bindIf(cfgFuel2, 'none', fuel1.fire.limit.ews)
      .calc(BpxLibMath.min,
        fuel1.fire.limit.ews,
        fuel2.fire.limit.ews);
    this.effectiveWindSpeedExceeded
      .bindIf(cfgFuel2, 'none', fuel1.fire.exceeded.ews)
      .calc(BpxLibMath.or,
        fuel1.fire.exceeded.ews,
        fuel2.fire.exceeded.ews);

    // Mean spread reactionIntensity
    this.rosArithmetic
      .bindIf(cfgFuel2, 'none', fuel1.fire.ros)
      .calc(BpxLibSurfaceFire.rosArithmetic,
        this.primaryCover,
        fuel1.fire.ros,
        fuel2.fire.ros);
    this.rosExpected
      .bindIf(cfgFuel2, 'none', fuel1.fire.ros)
      .calc(BpxLibSurfaceFire.rosExpectedMOCK,
        this.primaryCover,
        fuel1.fire.ros,
        fuel2.fire.ros);
    this.rosHarmonic
      .bindIf(cfgFuel2, 'none', fuel1.fire.ros)
      .calc(BpxLibSurfaceFire.rosHarmonic,
        this.primaryCover,
        fuel1.fire.ros,
        fuel2.fire.ros);
    this.ros
      .bindIf(cfgWtg, 'expected', this.rosExpected)
      .bindIf(cfgWtg, 'harmonic', this.rosHarmonic)
      .bind(this.rosArithmetic);
  }
}

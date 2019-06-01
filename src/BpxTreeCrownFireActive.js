/**
 * @file Defines the BehavePlus Explorer active crown fire subtree and leafs.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';
import DagLeafBool from './DagLeafBool';
import DagLeafQuantity from './DagLeafQuantity';

import BpxLibCrownFire from './BpxLibCrownFire';
import BpxLibFireEllipse from './BpxLibFireEllipse';
import BpxLibMath from './BpxLibMath';
import BpxLibSurfaceFire from './BpxLibSurfaceFire';

import { TreeFireEllipseSize, TreeFireEllipseMap } from './BpxTreeFireEllipse';

export class BpxTreeCrownFireEllipseSizeActive extends TreeFireEllipseSize {
  constructor(parent, name) {
    super(parent, name);
  }
  connect( tree ) {
    const ros = tree.crown.fire.active.ros;
    const lwr = tree.crown.fire.active.lengthToWidthRatio;
    const elapsed = tree.site.fire.sinceIgnition;

    this.length.calc(BpxLibSurfaceFire.distance, ros, elapsed);
    this.width.calc(BpxLibMath.div, this.length, lwr);
    // BehavePlus always uses Rothermel's crown fire periemeter & area equations
    this.perimeter.calc(BpxLibCrownFire.perimeter, this.length, lwr);
    this.area.calc(BpxLibCrownFire.area, this.length, lwr);
    // The following are NOT used!
    //this.perimeter.calc(BpxLibFireEllipse.perimeter, this.length, this.width);
    //this.area.calc(BpxLibFireEllipse.area, this.length, lwr);
  }
}

export class BpxTreeCrownFireEllipseMapActive extends TreeFireEllipseMap {
  constructor(parent, name) {
    super(parent, name);
  }

  connect(tree) {
    const scale = tree.site.map.scale;
    const size = tree.crown.fire.active.size;

    this.area.calc(BpxLibFireEllipse.mapArea, size.area, scale);
    this.length.calc(BpxLibMath.div, size.length, scale);
    this.width.calc(BpxLibMath.div, size.width, scale);
    this.perimeter.calc(BpxLibMath.div, size.perimeter, scale);
  }
}

/**
 * Active crown fire variables per Rothermel (1991)
 *
 * These variables require links to:
 * - wind at 20-ft for length-to-width ratio and power-of-wind
 * - moisture contents for Ractive
 * - surface fire and canopy HPUA for any plume vs wind-driven
 *
 * So it can easily be managed by a user in stand-alone mode.
 */
export default class BpxTreeCrownFireActive extends DagBranch {
  constructor(parent, name) {
    super(parent, name);

    new BpxTreeCrownFireEllipseSizeActive(this, 'size');
    new BpxTreeCrownFireEllipseMapActive(this, 'map');

    new DagLeafQuantity(this, 'lengthToWidthRatio')
      .desc('crown fire ellipse length-to-width ratio')
      .units('fireLwr').value(1);

    new DagLeafQuantity(this, 'ros')
      .desc('active crown fire spread rate (Ractive)')
      .units('fireRos').value(0);

    new DagLeafQuantity(this, 'firelineIntensity')
      .desc('active crown fire fire fireline intensity')
      .units('fireFli').value(0);

    new DagLeafQuantity(this, 'flameLength')
      .desc('active crown fire flame length')
      .units('fireFlame').value(0);

    new DagLeafQuantity(this, 'heatPerUnitArea')
      .desc('active crown fire heat per unit area')
      .units('fireHpua').value(0);

    new DagLeafQuantity(this, 'powerOfTheFire')
      .desc('active crown fire power-of-the-fire')
      .units('firePower').value(0);

    new DagLeafQuantity(this, 'powerOfTheWind')
      .desc('active cronw fire power-of-the-wind')
      .units('firePower').value(0);

    new DagLeafQuantity(this, 'powerRatio')
      .desc('active crown fire fire-to-wind power ratio')
      .units('ratio').value(0);

    new DagLeafBool(this, 'isPlumeDominated')
      .desc('active crown fire is plume dominated')
      .value(true);

    new DagLeafBool(this, 'isWindDriven')
      .desc('active crown fire is wind driven')
      .value(false);
  }

  connect( tree ) {
    const crown = tree.crown;
    const { canopy, wind } = tree.site;

    // Needs 20-ft wind speed
    this.lengthToWidthRatio
      .calc(BpxLibCrownFire.lengthToWidthRatio,
        wind.speed.at20ft);

    this.powerOfTheWind
      .calc(BpxLibCrownFire.powerOfTheWind,
        wind.speed.at20ft,
        this.ros);

    // Needs moisture contents
    this.ros
      .calc(BpxLibCrownFire.rActive,
        crown.fuel.canopy.fire.ros);  // the Fuel Model 10 ros

    // If plume vs wind-driven, then we need surface and canopy HPUA
    this.heatPerUnitArea
      .calc(BpxLibCrownFire.hpuaActive,
        canopy.heatPerUnitArea,
        crown.fire.surface.heatPerUnitArea);

    this.firelineIntensity
      .calc(BpxLibCrownFire.fliActive,
        this.heatPerUnitArea,
        this.ros);

    this.flameLength
      .calc(BpxLibCrownFire.flThomas,
        this.firelineIntensity);

    this.powerOfTheFire
      .calc(BpxLibCrownFire.powerOfTheFire,
        this.firelineIntensity);

    this.powerRatio
      .calc(BpxLibMath.div,
        this.powerOfTheFire,
        this.powerOfTheWind);

    this.isPlumeDominated
      .calc(BpxLibCrownFire.isPlumeDominated,
        this.powerRatio);

    this.isWindDriven
      .calc(BpxLibCrownFire.isWindDriven,
        this.powerRatio);
  }
}

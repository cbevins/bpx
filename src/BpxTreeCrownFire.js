/**
 * @file Defines the BehavePlus Explorer crown fire subtree and leafs.
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

/**
 * Defines the fire ellipse's fire spread vector leafs.
*/
export default class BpxTreeCrownFire extends DagBranch {
  constructor(parent, name) {
    super(parent, name);

    // Crown fire
    new DagLeafQuantity(this, 'lengthToWidthRatio')
      .desc('crown fire ellipse length-to-width ratio')
      .units('fireLwr').value(1);

    const surface = new DagBranch(this, 'surface');

    new DagLeafQuantity(surface, 'firelineIntensity')
      .desc('surface fire fireline intensity')
      .units('fireFli').value(0);

    new DagLeafQuantity(surface, 'heatPerUnitArea')
      .desc('surface fire heat per unit area')
      .units('fireHpua').value(0);

    new DagLeafQuantity(surface, 'flameLength')
      .desc('surface fire flame length')
      .units('fireFlame').value(0);

    const active = new DagBranch(this, 'active');

    new DagLeafQuantity(active, 'spreadRate')
      .desc('active crown fire spread rate (Ra)')
      .units('fireRos').value(0);

    new DagLeafQuantity(active, 'firelineIntensity')
      .desc('active crown fire fire fireline intensity')
      .units('fireFli').value(0);

    new DagLeafQuantity(active, 'flameLength')
      .desc('active crown fire flame length')
      .units('fireFlame').value(0);

    new DagLeafQuantity(active, 'heatPerUnitArea')
      .desc('active crown fire heat per unit area')
      .units('fireHpua').value(0);

    new DagLeafQuantity(active, 'powerOfTheFire')
      .desc('active crown fire power-of-the-fire')
      .units('firePower').value(0);

    new DagLeafQuantity(active, 'powerOfTheWind')
      .desc('active cronw fire power-of-the-wind')
      .units('firePower').value(0);

    new DagLeafQuantity(active, 'powerRatio')
      .desc('active crown fire fire-to-wind power ratio')
      .units('ratio').value(0);

    new DagLeafBool(active, 'isPlumeDominated')
      .desc('active crown fire is plume dominated')
      .value(true);

    new DagLeafBool(active, 'isWindDriven')
      .desc('active crown fire is wind driven')
      .value(false);

    new TreeFireEllipseSize(this, 'size');
    new TreeFireEllipseMap(this, 'map');
    }

  connect(tree) {
    const fireLink = tree.surface.fire.weighted;
    const fireInput = tree.site.fire;
    const map = tree.site.map;
    const crown = this.own.parent;
    const { canopy, wind } = tree.site;
    const surface = tree.surface.fire.weighted;

    // If LINKED to SURFACE
    this.surface.heatPerUnitArea
      .bind(surface.heatPerUnitArea);

    this.surface.firelineIntensity
      .bind(surface.firelineIntensity);

    this.surface.flameLength
      .bind(surface.flameLength);

    // Derived
    this.active.spreadRate
      .calc(BpxLibCrownFire.rActive,
        crown.fuel.canopy.fire.ros);  // the Fuel Model 10 ros

    this.lengthToWidthRatio
      .calc(BpxLibCrownFire.lengthToWidthRatio,
        wind.speed.at20ft);

    this.active.powerOfTheWind
      .calc(BpxLibCrownFire.powerOfTheWind,
        wind.speed.at20ft,
        this.active.spreadRate);

    this.active.heatPerUnitArea
      .calc(BpxLibCrownFire.hpuaActive,
        canopy.heatPerUnitArea,
        this.surface.heatPerUnitArea);

    this.active.firelineIntensity
      .calc(BpxLibCrownFire.fliActive,
        this.active.heatPerUnitArea,
        this.active.spreadRate);

    this.active.flameLength
      .calc(BpxLibCrownFire.flThomas,
        this.active.firelineIntensity);

    this.active.powerOfTheFire
      .calc(BpxLibCrownFire.powerOfTheFire,
        this.active.firelineIntensity);

    this.active.powerRatio
      .calc(BpxLibMath.div,
        this.active.powerOfTheFire,
        this.active.powerOfTheWind);

    this.active.isPlumeDominated
      .calc(BpxLibCrownFire.isPlumeDominated,
        this.active.powerRatio);

    this.active.isWindDriven
      .calc(BpxLibCrownFire.isWindDriven,
        this.active.powerRatio);


    this.size.length
      .calc(BpxLibSurfaceFire.distance,
        this.active.spreadRate,
        fireInput.sinceIgnition);

    this.size.width
      .calc(BpxLibMath.div,
        this.lengthToWidthRatio,
        this.size.length);

    this.size.perimeter
      .calc(BpxLibCrownFire.perimeter,
        this.size.length,
        this.lengthToWidthRatio);

    this.size.area
      .calc(BpxLibCrownFire.area,
        this.size.length,
        this.lengthToWidthRatio);

    this.map.area
      .calc(BpxLibFireEllipse.mapArea,
        this.size.area,
        map.scale);

    this.map.length
      .calc(BpxLibMath.div,
        this.size.length,
        map.scale);

    this.map.width
      .calc(BpxLibMath.div,
        this.size.width,
        map.scale);

    this.map.perimeter
      .calc(BpxLibMath.div,
        this.size.perimeter,
        map.scale);
  }
}

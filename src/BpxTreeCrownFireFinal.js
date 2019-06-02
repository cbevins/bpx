/**
 * @file Defines the BehavePlus Explorer final crown fire subtree and leafs.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';
import DagLeafQuantity from './DagLeafQuantity';

import BpxLibCrownFire from './BpxLibCrownFire';
import BpxLibFireEllipse from './BpxLibFireEllipse';
import BpxLibMath from './BpxLibMath';
import BpxLibSurfaceFire from './BpxLibSurfaceFire';

import { TreeFireEllipseSize, TreeFireEllipseMap } from './BpxTreeFireEllipse';

export class BpxTreeCrownFireEllipseSizeFinal extends TreeFireEllipseSize {
  constructor(parent, name) {
    super(parent, name);
  }
  connect( tree ) {
    const ros = tree.crown.fire.final.ros;
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

export class BpxTreeCrownFireEllipseMapFinal extends TreeFireEllipseMap {
  constructor(parent, name) {
    super(parent, name);
  }

  connect(tree) {
    const scale = tree.site.map.scale;
    const size = tree.crown.fire.final.size;

    this.area.calc(BpxLibFireEllipse.mapArea, size.area, scale);
    this.length.calc(BpxLibMath.div, size.length, scale);
    this.width.calc(BpxLibMath.div, size.width, scale);
    this.perimeter.calc(BpxLibMath.div, size.perimeter, scale);
  }
}

/**
 * Crown fire intensity and final ros per Scott & Reinhardt (2001)
 *
 * These require significantly more inputs, including:
 * surface fire ros0, ros, waf, windB, windK, and phiS
 * (or savr and beta instead of windB, windK, and phiS).
 *
 * This class assumes a surface PRIMARY FUEL linkage,
 * rather than the many stand-alone inputs.
 */
export default class BpxTreeCrownFireFinal extends DagBranch {
  constructor(parent, name) {
    super(parent, name);

    new BpxTreeCrownFireEllipseSizeFinal(this, 'size');
    new BpxTreeCrownFireEllipseMapFinal(this, 'map');

    new DagLeafQuantity(this, 'rSa')
      .desc('surface fire spread rate under wind speed of O`active')
      .units('fireRos').value(0);

    new DagLeafQuantity(this, 'crownFractionBurned')
      .desc('crown fire crown fraction burned')
      .units('fraction').value(0);

    new DagLeafQuantity(this, 'ros')
      .desc('final crown fire spread rate per Scott & Reinhardt (2001)')
      .units('fireRos').value(0);

    new DagLeafQuantity(this, 'firelineIntensity')
      .desc('final crown fire fireline intensity rate per Scott & Reinhardt (2001)')
      .units('fireFli').value(0);

    new DagLeafQuantity(this, 'flameLength')
      .desc('final crown fire fireline intensity rate per Scott & Reinhardt (2001)')
      .units('fireFli').value(0);
  }

  connect( tree ) {
    const crown = tree.crown;
    const { canopy } = tree.site;
    const { primary } = tree.surface.fuel;

    this.rSa
      .calc(BpxLibCrownFire.rSa,
        crown.fire.initiation.oActive,
        primary.bed.ros0,
        primary.fire.wind.waf,
        primary.fire.wind.b,
        primary.fire.wind.k,
        primary.fire.slope.phi);

    this.crownFractionBurned
      .calc(BpxLibCrownFire.crownFractionBurned,
        primary.fire.ros,
        crown.fire.initiation.ros,
        this.rSa);

    this.ros
      .calc(BpxLibCrownFire.rFinal,
        primary.fire.ros,
        crown.fire.active.ros,
        this.crownFractionBurned);

    this.firelineIntensity
      .calc(BpxLibCrownFire.fliFinal,
        this.ros,
        this.crownFractionBurned,
        canopy.heatPerUnitArea,
        crown.fire.surface.heatPerUnitArea);

    // NOTE that if this is a SURFACE fire,
    // this flame length != the surface fire flame length
    this.flameLength
      .calc(BpxLibCrownFire.flThomas,
        this.firelineIntensity);
  }
}

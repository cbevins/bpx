/**
 * @file Defines the BehavePlus Explorer crown fire initiation subtree and leafs.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';
import DagLeafBool from './DagLeafBool';
import DagLeafOption from './DagLeafOption';
import DagLeafQuantity from './DagLeafQuantity';

import BpxLibCrownFire from './BpxLibCrownFire';

export class BpxLeafCrownFireType extends DagLeafOption {
  constructor(branch, name) {
    super(branch, name)
      .desc('crown fire types')
      .header('crown fire type')
      .item('surface', 'surface fire', true)
      .item('passive', 'passive (torching) crown fire')
      .item('active', 'active crown fire')
      .item('conditional', 'insufficient surface fire intensity to initiate crown fire');
  }
}

/**
 * Crown fire initiation per Scott & Reinhardt (2001)
 *
 * Modestly extends the Rothermel crown model requirements to include:
 * - surface fire fireline intensity,
 * - canopy foliar moisture
 */
export default class BpxTreeCrownFireInitiation extends DagBranch {
  constructor(parent, name) {
    super(parent, name);

    new DagLeafQuantity(this, 'firelineIntensity')
      .desc('critical (minimum) fireline intensity of a surface fire to initiate a crown fire (I`initiation)')
      .units('fireFli').value(0);

    new DagLeafQuantity(this, 'ros')
      .desc('critical (minimum) spread rate of a surface fire to initiate a crown fire (R`initiation)')
      .units('fireRos').value(0);

    new DagLeafQuantity(this, 'rosPrime')
      .desc('critical (minimum) spread rate of a crown fire to sustain active crowning (R`active)')
      .units('fireRos').value(0);

    new DagLeafQuantity(this, 'transitionRatio')
      .desc('crown fire transition ratio')
      .units('ratio').value(0);

    new DagLeafBool(this, 'canTransition')
      .desc('the surface fire intensity is sufficient to transition to the crown')
      .value(false);

    new DagLeafQuantity(this, 'activeRatio')
      .desc('active crown fire ratio')
      .units('ratio').value(0);

    new BpxLeafCrownFireType(this, 'type');

    new DagLeafBool(this, 'isActiveCrownFire')
      .desc('the fire is an active crown fire')
      .value(false);

    new DagLeafBool(this, 'isPassiveCrownFire')
      .desc('the fire is a passive crown fire')
      .value(false);

    new DagLeafBool(this, 'isConditionalCrownFire')
      .desc('if the surface fire was sufficient to transition, an active crown fire would result')
      .value(false);

    new DagLeafBool(this, 'isSurfaceFire')
      .desc('the fire is a surface fire')
      .value(false);

    new DagLeafQuantity(this, 'oActive')
      .desc('the critical open wind speed at 20-ft above the canopy sufficient for an active crown fire')
      .units('windSpeed').value(0);

    new DagLeafQuantity(this, 'crowningIndex')
      .desc('the Scott & Reinhardt Crowning Index (km/h')
      .units('factor').value(0);
  }

  connect( tree ) {
    const crown = tree.crown;
    const { canopy } = tree.site;

    this.firelineIntensity
      .calc(BpxLibCrownFire.fliInit,
        canopy.foliarMoisture,
        canopy.crownBase);

    this.ros
      .calc(BpxLibCrownFire.rInit,
        this.firelineIntensity,
        crown.fire.surface.heatPerUnitArea);

    this.rosPrime
      .calc(BpxLibCrownFire.rPrimeActive,
        canopy.bulkDensity);

    this.transitionRatio
      .calc(BpxLibCrownFire.transitionRatio,
        crown.fire.surface.firelineIntensity,
        this.firelineIntensity);

    this.canTransition
      .calc(BpxLibCrownFire.canTransition,
        this.transitionRatio);

    this.activeRatio
      .calc(BpxLibCrownFire.activeRatio,
        crown.fire.active.ros,
        this.rosPrime);

    this.type
      .calc(BpxLibCrownFire.type,
        this.transitionRatio,
        this.activeRatio);

    this.isActiveCrownFire
      .calc(BpxLibCrownFire.isActive,
        this.transitionRatio,
        this.activeRatio);

    this.isConditionalCrownFire
      .calc(BpxLibCrownFire.isConditional,
        this.transitionRatio,
        this.activeRatio);

    this.isPassiveCrownFire
      .calc(BpxLibCrownFire.isPassive,
        this.transitionRatio,
        this.activeRatio);

    this.isSurfaceFire
      .calc(BpxLibCrownFire.isSurface,
        this.transitionRatio,
        this.activeRatio);

    this.oActive
      .calc(BpxLibCrownFire.oActive,
        canopy.bulkDensity,
        crown.fuel.canopy.fire.firelineIntensity,
        crown.fuel.canopy.bed.heatSink,
        crown.fuel.canopy.fire.slope.phi);

    this.crowningIndex
      .calc(BpxLibCrownFire.crowningIndex,
        this.oActive);
  }
}

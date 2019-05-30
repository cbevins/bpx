/**
 * @file Defines the BehavePlus Explorer base fuel bed sub-tree.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';
import DagLeafQuantity from './DagLeafQuantity';

import { BpxLeafFuelDomain } from './BpxLeafOptions';

import BpxLibFuelBed from './BpxLibFuelBed';
import BpxLibMath from './BpxLibMath';

import {
  BpxTreeFuelCategoryDead,
  BpxTreeFuelCategoryLive,
} from './BpxTreeFuelCategory';

export default class BpxTreeBaseFuelBed extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    // Fuel bed level DagBranches
    new BpxTreeFuelCategoryDead(this, 'dead');
    new BpxTreeFuelCategoryLive(this, 'live');

    // Fuel bed level DagLeafs
    new DagLeafQuantity(this, 'area')
      .desc('fuel bed total surface area')
      .units('fuelArea').value(0);
    new DagLeafQuantity(this, 'bulkDensity')
      .desc('fuel bed bulk density')
      .units('fuelDens').value(0);
    new DagLeafQuantity(this, 'depth')
      .desc('fuel bed depth')
      .units('fuelDepth').value(0.01);
    new BpxLeafFuelDomain(this, 'domain');
    new DagLeafQuantity(this, 'heatPreignition')
      .desc('fuel bed heat of pre-ignition')
      .units('fuelHeat').value(0)
    new DagLeafQuantity(this, 'heatSink')
      .desc('fuel bed heat sink')
      .units('fuelSink').value(0);
    new DagLeafQuantity(this, 'load')
      .desc('fuel bed total oven-dry load')
      .units('fuelLoad').value(0);
    new DagLeafQuantity(this, 'openWaf')
      .desc('fuel bed open-canopy midflame windspeed adjustment factor')
      .units('fraction').value(1);
    new DagLeafQuantity(this, 'packingRatio')
      .desc('fuel bed packing ratio')
      .units('fraction').value(0);
    new DagLeafQuantity(this, 'packingRatioOptimum')
      .desc('fuel bed optimum packing ratio')
      .units('fraction').value(0);
    new DagLeafQuantity(this, 'packingRatioRatio')
      .desc('ratio of fuel bed packing ratio-to-optimum packing ratio')
      .units('ratio').value(0);
    new DagLeafQuantity(this, 'propagatingFluxRatio')
      .desc('fuel bed propagating flux ratio')
      .units('fraction').value(0);
    new DagLeafQuantity(this, 'reactionIntensity')
      .desc('fuel bed reaction intensity')
      .units('fireRxi').value(0);
    new DagLeafQuantity(this, 'reactionVelocityExp')
      .desc('fuel bed reaction velocity exponent A')
      .units('factor').value(1);
    new DagLeafQuantity(this, 'reactionVelocityMax')
      .desc('fuel bed maximum reaction velocity')
      .units('fireRxv').value(0);
    new DagLeafQuantity(this, 'reactionVelocityOpt')
      .desc('fuel bed optimum reaction velocity')
      .units('fireRxv').value(0);
    new DagLeafQuantity(this, 'ros0')
      .desc('fuel bed no-wind, no-slope fire spread rate')
      .units('fireRos').value(0);
    new DagLeafQuantity(this, 'savr')
      .desc('fuel bed weighted surface area-to-volume ratio')
      .units('fuelSavr').value(1);
    new DagLeafQuantity(this, 'savr15')
      .desc('fuel bed weighted savr raised to the 1.5 power')
      .units('factor').value(1);
  }

  baseConnect(/*tree*/) {
    // Note that depth and dead mext are connected in FuelComplex,
    // which has access to, and is parent of, the FuelModel

    // Live category mext
    this.live.mxtk.calc(BpxLibFuelBed.mxtk, this.dead.efld, this.live.efld);
    this.live.mext.calc(BpxLibFuelBed.mext,
      this.live.mxtk, this.dead.efmc, this.dead.mext);

    this.area.calc(BpxLibMath.sum, this.dead.area, this.live.area);
    this.bulkDensity.calc(BpxLibMath.div, this.load, this.depth);
    this.load.calc(BpxLibMath.sum, this.dead.load, this.live.load);
    this.dead.awtg.calc(BpxLibMath.div, this.dead.area, this.area);
    this.live.awtg.calc(BpxLibMath.div, this.live.area, this.area);
    this.savr.calc(BpxLibMath.sumProd,
      this.dead.awtg, this.live.awtg, this.dead.savr, this.live.savr);
    this.savr15.calc(BpxLibFuelBed.savr15, this.savr);

    // Packing ratio
    this.packingRatio.calc(BpxLibFuelBed.beta, this.dead.pprc, this.live.pprc, this.depth);
    this.packingRatioOptimum.calc(BpxLibFuelBed.beto, this.savr);
    this.packingRatioRatio.calc(BpxLibMath.div,
      this.packingRatio, this.packingRatioOptimum);

    // Heat
    this.propagatingFluxRatio.calc(BpxLibFuelBed.pflx, this.savr, this.packingRatio);
    this.heatPreignition.calc(BpxLibMath.sumProd,
      this.dead.awtg, this.live.awtg, this.dead.qign, this.live.qign);
    this.heatSink.calc(BpxLibFuelBed.heatSink, this.heatPreignition, this.bulkDensity);

    // Reaction velocity
    this.reactionVelocityExp.calc(BpxLibFuelBed.rxva, this.savr);
    this.reactionVelocityMax.calc(BpxLibFuelBed.rxvm, this.savr15);
    this.reactionVelocityOpt.calc(BpxLibFuelBed.rxvo,
      this.packingRatioRatio, this.reactionVelocityMax, this.reactionVelocityExp);

    // Reaction intensity
    this.dead.rxiDry.calc(BpxLibFuelBed.rxiDry,
      this.reactionVelocityOpt, this.dead.wnet, this.dead.heat, this.dead.mineralDamping);
    this.dead.rxi.calc(BpxLibMath.mul, this.dead.rxiDry, this.dead.moistureDamping);

    this.live.rxiDry.calc(BpxLibFuelBed.rxiDry,
      this.reactionVelocityOpt, this.live.wnet, this.live.heat, this.live.mineralDamping);
    this.live.rxi.calc(BpxLibMath.mul, this.live.rxiDry, this.live.moistureDamping);

    this.reactionIntensity.calc(BpxLibMath.sum, this.dead.rxi, this.live.rxi);

    // Fuel bed fire spread rate
    this.ros0.calc(BpxLibFuelBed.ros0,
      this.reactionIntensity, this.propagatingFluxRatio, this.heatSink);

    this.openWaf.calc(BpxLibFuelBed.openWaf, this.depth);
    }
}

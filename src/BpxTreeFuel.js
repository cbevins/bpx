/**
 * @file Composes DagBranches and DagLeafs into the following objects:
 *
 * - BpxTreeFuelBed composed of bed-level DagLeafs and:
 *    - BpxTreeFuelCategoryDead composed of dead category DagLeafs and:
 *      - BpxTreeFuelParticlesDead composed of 4 instances of
 *        - BpxTreeFuelParticle composed of
 *          - the 8 Fuel DagLeafs (Dens, Heat, Label, Load, Mois, Savr, Seff, Stot)
 *    - BpxTreeFuelCategoryLive composed of live category DagLeafs and:
 *      - BpxTreeFuelParticlesLive composed of 5 instance of
 *        - BpxTreeFuelParticle composed of
 *          - the 8 Fuel DagLeafs (Dens, Heat, Label, Load, Mois, Savr, Seff, Stot)
 *
 * - BpxTreeFuelModel composed of:
 *    - BpxTreeFuelModelBehave
 *    - BpxTreeFuelModelChaparral
 *    - BpxTreeFuelModelPalmettoGallberry
 *    - BpxTreeFuelModelWesternAspen
 *
 * - BpxTreeFuelComplex composed of:
 *    - BpxTreeFuelModel
 *    - BpxTreeFuelBed
 *
 * - BpxTreeFuel composed of:
 *    - BpxTreeFuelComplexPrimary
 *    - BpxTreeFuelComplexSecondary
 *
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';
import BpxTreeFuelModel from './BpxTreeFuelModel';
import BpxTreeFuelParticle from './BpxTreeFuelParticle';
import {
  BpxTreeFuelCategoryDead,
  BpxTreeFuelCategoryLive,
} from './BpxTreeFuelCategory';

import BpxLibMath from'./BpxLibMath';
import BpxLibFuelBed from './BpxLibFuelBed';
import BpxLibSurfaceFire from './BpxLibSurfaceFire';
import BpxLibWind from './BpxLibWind';

import { BpxLeafFuelDomain } from './BpxLeafOptions';
import DagLeafQuantity from './DagLeafQuantity';

export class BpxTreeFuelBed extends DagBranch {
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
    new DagLeafQuantity(this, 'ewsLimit')
      .desc('fuel bed effective wind speed limit')
      .units('windSpeed').value(88000);
    new DagLeafQuantity(this, 'heatPreignition')
      .desc('fuel bed heat of pre-ignition')
      .units('fuelHeat').value(0)
    new DagLeafQuantity(this, 'heatSink')
      .desc('fuel bed heat sink')
      .units('fuelSink').value(0);
    new DagLeafQuantity(this, 'hpua')
      .desc('fuel bed heat per unit area')
      .units('fireHpua').value(0);
    new DagLeafQuantity(this, 'packingRatio')
      .desc('fuel bed packing ratio')
      .units('fraction').value(0);
    new DagLeafQuantity(this, 'packingRatioOptimum')
      .desc('fuel bed optimum packing ratio')
      .units('fraction').value(0);
    new DagLeafQuantity(this, 'packingRatioRatio')
      .desc('ratio of fuel bed packing ratio-to-optimum packing ratio')
      .units('ratio').value(0);
    new DagLeafQuantity(this, 'phiLimit')
      .desc('fuel bed wind-slope coefficient upper limit')
      .units('factor').value(1);
    new DagLeafQuantity(this, 'propagatingFluxRatio')
      .desc('fuel bed propagating flux ratio')
      .units('fraction').value(0);
    new DagLeafQuantity(this, 'reactionVelocityExp')
      .desc('fuel bed reaction velocity exponent A')
      .units('factor').value(1);
    new DagLeafQuantity(this, 'reactionIntensity')
      .desc('fuel bed reaction intensity')
      .units('fireRxi').value(0);
    new DagLeafQuantity(this, 'reactionVelocityMax')
      .desc('fuel bed maximum reaction velocity')
      .units('fireRxv').value(0);
    new DagLeafQuantity(this, 'reactionVelocityOpt')
      .desc('fuel bed optimum reaction velocity')
      .units('fireRxv').value(0);
    new DagLeafQuantity(this, 'flameResidenceTime')
      .desc('fuel bed flame residence time')
      .units('timeMin').value(0);
    new DagLeafQuantity(this, 'load')
      .desc('fuel bed total oven-dry load')
      .units('fuelLoad').value(0);
    new DagLeafQuantity(this, 'openWaf')
      .desc('fuel bed open-canopy midflame windspeed adjustment factor')
      .units('fraction').value(1);
    new DagLeafQuantity(this, 'ros0')
      .desc('fuel bed no-wind, no-slope fire spread rate')
      .units('fireRos').value(0);
    new DagLeafQuantity(this, 'rosLimit')
      .desc('fuel bed fire spread rate upper limit')
      .units('fireRos').value(0);
    new DagLeafQuantity(this, 'savr')
      .desc('fuel bed weighted surface area-to-volume ratio')
      .units('fuelSavr').value(1);
    new DagLeafQuantity(this, 'savr15')
      .desc('fuel bed weighted savr raised to the 1.5 power')
      .units('factor').value(1);
    new DagLeafQuantity(this, 'slopeK')
      .desc('fuel bed slope coefficient intermediate factor')
      .units('factor').value(1);
    new DagLeafQuantity(this, 'windB')
      .desc('fuel bed wind coefficient intermediate factor B')
      .units('factor').value(1);
    new DagLeafQuantity(this, 'windB')
      .desc('fuel bed wind coefficient intermediate factor B')
      .units('factor').value(1);
    new DagLeafQuantity(this, 'windC')
      .desc('fuel bed wind coefficient intermediate factor C')
      .units('factor').value(1);
    new DagLeafQuantity(this, 'windE')
      .desc('fuel bed wind coefficient intermediate factor E')
      .units('factor').value(1);
    new DagLeafQuantity(this, 'windK')
      .desc('fuel bed wind coefficient intermediate factor K')
      .units('factor').value(1);
    new DagLeafQuantity(this, 'windI')
      .desc('inverse of fuel bed wind coefficient intermediate factor K')
      .units('factor').value(1);

    // Continue adding leafs for fire spread inputs
    new DagLeafQuantity(this, 'waf')
      .desc('applied midflame wind speed adjustment factor')
      .units('fraction').value(1);
    new DagLeafQuantity(this, 'midflameWindSpeed')
      .desc('midflame wind speed')
      .units('windSpeed').value(0);
    new DagLeafQuantity(this, 'slopeSteepnessRatio')
      .desc('slope steepness ratio')
      .units('slopeSteepness').value(0);
    new DagLeafQuantity(this, 'windHeadingFromUpslope')
      .desc('wind heading direction from Upslope')
      .units('azimuth').value(0);

    // Continue adding leafs for fire spread outputs
    new DagLeafQuantity(this, 'phiS')
      .desc('spread rate slope coefficient')
      .units('factor').value(0);
    new DagLeafQuantity(this, 'phiW')
      .desc('spread rate wind coefficient')
      .units('factor').value(0);
    new DagLeafQuantity(this, 'phiEw')
      .desc('spread rate cross-slope, cross-wind effective wind coefficient')
      .units('factor').value(1);

    // Fire spread direction branch
    new DagLeafQuantity(this, 'dirRosSlope')
      .desc('spread rate due to the slope coefficient')
      .units('fireRos').value(0);
    new DagLeafQuantity(this, 'dirRosWind')
      .desc('spread rate due to the wind coefficient')
      .units('fireRos').value(0);
    new DagLeafQuantity(this, 'dirXComp')
      .desc('directional spread rate x-component')
      .units('factor').value(0);
    new DagLeafQuantity(this, 'dirYComp')
      .desc('directional spread rate y-component')
      .units('factor').value(0);
    new DagLeafQuantity(this, 'dirRosVector')
      .desc('directional spread rate at vector')
      .units('fireRos').value(0);
    new DagLeafQuantity(this, 'headingFromUpslope')
      .desc('direction of maximum spread, degrees clockwise from upslope')
      .units('azimuth').value(0);
  }

  connect(tree) {
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

    this.flameResidenceTime.calc(BpxLibFuelBed.taur, this.savr);

    // Reaction intensity
    this.dead.rxiDry.calc(BpxLibFuelBed.rxiDry,
      this.reactionVelocityOpt, this.dead.wnet, this.dead.heat, this.dead.mineralDamping);
    this.dead.rxi.calc(BpxLibMath.mul, this.dead.rxiDry, this.dead.moistureDamping);

    this.live.rxiDry.calc(BpxLibFuelBed.rxiDry,
      this.reactionVelocityOpt, this.live.wnet, this.live.heat, this.live.mineralDamping);
    this.live.rxi.calc(BpxLibMath.mul, this.live.rxiDry, this.live.moistureDamping);

    this.reactionIntensity.calc(BpxLibMath.sum, this.dead.rxi, this.live.rxi);

    // Fuel bed fire spread rate and heat
    this.ros0.calc(BpxLibFuelBed.ros0,
      this.reactionIntensity, this.propagatingFluxRatio, this.heatSink);

    this.hpua.calc(BpxLibMath.mul, this.reactionIntensity, this.flameResidenceTime);

    // Fuel bed wind-slope factors
    this.slopeK.calc(BpxLibFuelBed.slopeK, this.packingRatio);
    this.windB.calc(BpxLibFuelBed.windB, this.savr);
    this.windC.calc(BpxLibFuelBed.windC, this.savr);
    this.windE.calc(BpxLibFuelBed.windE, this.savr);
    this.windK.calc(BpxLibFuelBed.windK, this.packingRatioRatio, this.windE, this.windC);
    this.windI.calc(BpxLibFuelBed.windI, this.packingRatioRatio, this.windE, this.windC);
    this.openWaf.calc(BpxLibFuelBed.openWaf, this.depth);

    // Fuel bed effective wind, wind coefficient, and spread rate limits
    this.ewsLimit.calc(BpxLibFuelBed.ewsLimit, this.reactionIntensity);
    this.phiLimit.calc(BpxLibFuelBed.phiLimit, this.ewsLimit, this.windB, this.windK);
    this.rosLimit.calc(BpxLibFuelBed.rosLimit, this.ros0, this.phiLimit);

    // Access these from outside the class
    const canopy = tree.site.canopy;
    const { speed, direction } = tree.site.wind;
    const { steepness } = tree.site.slope;
    const cfgSpd = tree.configs.wind.speed;
    const cfgWaf = tree.configs.fuel.waf;
    const fireLib = BpxLibSurfaceFire;

    this.windHeadingFromUpslope.bind(direction.headingFromUpslope);
    this.slopeSteepnessRatio.bind(steepness.ratio);

    // The fuel bed WAF is either from the site's WAF input
    // or calculated from canopy inputs
    this.waf
      .bindIf(cfgWaf, 'input', speed.waf)
      .calc(BpxLibFuelBed.waf, canopy.sheltersFuel, canopy.shelteredWaf, this.openWaf);

    // Midflame wind speed is either from the site midflame windspeed,
    // or estimated from the site's 20-ft windspeed and this fuel bed's WAF
    this.midflameWindSpeed
      .bindIf(cfgSpd, 'atMidflame', speed.atMidflame)
      .calc(BpxLibWind.atMidflame, speed.at20ft, this.waf)

    this.phiW.calc(fireLib.phiW, this.midflameWindSpeed, this.windB, this.windK);
    this.phiS.calc(fireLib.phiS, this.slopeSteepnessRatio, this.slopeK);

    // Direction of maximum spread
    this.dirRosSlope.calc(fireLib.spreadDirSlopeRate, this.ros0, this.phiS);
    this.dirRosWind.calc(fireLib.spreadDirWindRate, this.ros0, this.phiW);
    this.dirXComp.calc(fireLib.spreadDirXComp,
      this.rosWind, this.rosSlope, this.windHeadingFromUpslope);
    this.dirYComp.calc(fireLib.spreadDirXComp,
      this.rosWind, this.windHeadingFromUpslope);
    this.dirRosVector.calc(fireLib.spreadDirVectorRate,
      this.dirXComp, this.dirYComp);
    this.headingFromUpslope.calc(fireLib.spreadDirFromUpslope,
      this.dirXComp, this.dirYComp, this.RosVector);
  }
}

export class BpxTreeFuelBedCanopy extends BpxTreeFuelBed {
  constructor(parent, name) {
    super(parent, name);
  }
  connect(tree) {
    BpxTreeFuelBed.prototype.connect.call(this, tree);
    this.waf.fixed(0.4);
    this.windHeadingFromUpslope.fixed(0);
    this.slopeSteepnessRatio.fixed(0);
  }
}

export class BpxTreeFuelComplex extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    new BpxTreeFuelBed(this, 'bed');
    new BpxTreeFuelModel(this, 'model');
  }

  /**
   * FuelComplex provides connections between 4 possible FuelModel domains
   * and a resulting single FuelBed. There are two design possibilities:
   *  - Each FuelModel domain encapsulates its own FuelBed description, which
   *  simplifies connect() here but requires 4 x 74 = 296 additional leafs,
   *  - Each FuelModel domain simply produces its own derived parameters,
   * and connect() here deals with complexity of assignment to the single FuelBed.
   */
  connect(tree) {
    const pdead = this.bed.dead.particle;
    const plive = this.bed.live.particle;
    const b = this.model.behave;
    const c = this.model.chaparral;
    const p = this.model.palmettoGallberry;
    const w = this.model.westernAspen;

    const { pick } = BpxLibFuelBed;
    const { domain } = this.model;

    this.bed.depth.calc(pick, domain,
      b.parms.depth, c.parms.depth, p.derived.depth, w.derived.depth);

    this.bed.dead.mext.calc(pick, domain, b.parms.deadMext, 0.3, 0.4, 0.25);

    // Load for 5 dead and 5 live classes
    pdead.class1.load.calc(pick, this.model.domain,
      b.parms.dead1Load, c.derived.deadFineLoad, p.derived.deadFineLoad, w.derived.deadFineLoad);

    pdead.class2.load.calc(pick, this.model.domain,
      b.parms.dead10Load, c.derived.deadSmallLoad,
      p.derived.deadSmallLoad, w.derived.deadSmallLoad);

    pdead.class3.load.calc(pick, domain,
      b.parms.dead100Load, c.derived.deadMediumLoad, p.derived.deadFoliageLoad, 0);

    pdead.class4.load.calc(pick, domain,
      b.derived.deadHerbLoad, c.derived.deadLargeLoad, p.derived.deadLitterLoad, 0);

    pdead.class5.load.fixed(0);

    plive.class1.load.calc(pick, domain,
      b.derived.liveHerbLoad, c.derived.liveFineLoad,
      p.derived.liveFineLoad, w.derived.liveHerbLoad);

    plive.class2.load.calc(pick, domain,
      b.parms.liveStemLoad, c.derived.liveSmallLoad,
      p.derived.liveSmallLoad, w.derived.liveStemLoad);

    plive.class3.load.calc(pick, domain,
      0, c.derived.liveMediumLoad, p.derived.liveFoliageLoad, 0);

    plive.class4.load.calc(pick, domain,
      0, c.derived.liveLargeLoad, 0, 0);

    plive.class5.load.calc(pick, domain,
      0, c.derived.liveLeafLoad, 0, 0);

    // Savr for 5 dead and 5 live classes
    pdead.class1.savr.calc(pick, domain, b.parms.dead1Savr, 640, 350, w.derived.deadFineSavr);
    pdead.class2.savr.calc(pick, domain, 109, 127, 140, 109);
    pdead.class3.savr.calc(pick, domain, 30, 61, 2000, 1);
    pdead.class4.savr.calc(pick, domain, b.parms.liveHerbSavr, 27, 2000, 1);
    pdead.class5.savr.fixed(1);
    plive.class1.savr.calc(pick, domain, b.parms.liveHerbSavr, 640, 350, 2800);
    plive.class2.savr.calc(pick, domain, b.parms.liveStemSavr, 127, 140, w.derived.liveStemSavr);
    plive.class3.savr.calc(pick, domain, 1, 61, 1, 1);
    plive.class4.savr.calc(pick, domain, 1, 27, 1, 1);
    plive.class5.savr.calc(pick, domain, 1, 2200, 1, 1);

    // Heat for 5 dead and 5 live classes
    pdead.class1.heat.calc(pick, domain, b.parms.deadHeat, 8000, 8300, 8000);
    pdead.class2.heat.calc(pick, domain, b.parms.deadHeat, 8000, 8300, 8000);
    pdead.class3.heat.calc(pick, domain, b.parms.deadHeat, 8000, 8300, 8000);
    pdead.class4.heat.calc(pick, domain, b.parms.deadHeat, 8000, 8300, 8000);
    pdead.class5.heat.fixed(8000);
    plive.class1.heat.calc(pick, domain, b.parms.liveHeat, 10500, 8300, 8000);
    plive.class2.heat.calc(pick, domain, b.parms.liveHeat, 9550, 8300, 8000);
    plive.class3.heat.calc(pick, domain, b.parms.liveHeat, 9550, 8300, 8000);
    plive.class4.heat.calc(pick, domain, b.parms.liveHeat, 9550, 8300, 8000);
    plive.class5.heat.calc(pick, domain, b.parms.liveHeat, 10500, 8300, 8000);

    // Dens for 5 dead and 5 live classes
    pdead.class1.dens.calc(pick, domain, 32, 46, 30, 32);
    pdead.class2.dens.calc(pick, domain, 32, 46, 30, 32);
    pdead.class3.dens.calc(pick, domain, 32, 46, 30, 32);
    pdead.class4.dens.calc(pick, domain, 32, 46, 30, 32);
    pdead.class5.dens.fixed(32);
    plive.class1.dens.calc(pick, domain, 32, 46, 46, 32);
    plive.class2.dens.calc(pick, domain, 32, 46, 46, 32);
    plive.class3.dens.calc(pick, domain, 32, 46, 46, 32);
    plive.class4.dens.calc(pick, domain, 32, 46, 46, 32);
    plive.class5.dens.calc(pick, domain, 32, 32, 46, 32);

    // Seff for 5 dead and 5 live classes
    pdead.class1.seff.calc(pick, domain, 0.01, 0.015, 0.010, 0.01);
    pdead.class2.seff.calc(pick, domain, 0.01, 0.015, 0.010, 0.01);
    pdead.class3.seff.calc(pick, domain, 0.01, 0.015, 0.010, 0.01);
    pdead.class4.seff.calc(pick, domain, 0.01, 0.015, 0.010, 0.01);
    pdead.class5.seff.fixed(0.01);
    plive.class1.seff.calc(pick, domain, 0.01, 0.015, 0.015, 0.01);
    plive.class2.seff.calc(pick, domain, 0.01, 0.015, 0.015, 0.01);
    plive.class3.seff.calc(pick, domain, 0.01, 0.015, 0.015, 0.01);
    plive.class4.seff.calc(pick, domain, 0.01, 0.015, 0.015, 0.01);
    plive.class5.seff.calc(pick, domain, 0.01, 0.035, 0.015, 0.01);

    // Stot for 5 dead and 5 live classes
    pdead.class1.stot.calc(pick, domain, 0.0555, 0.055, 0.03, 0.055);
    pdead.class2.stot.calc(pick, domain, 0.0555, 0.055, 0.03, 0.055);
    pdead.class3.stot.calc(pick, domain, 0.0555, 0.055, 0.03, 0.055);
    pdead.class4.stot.calc(pick, domain, 0.0555, 0.055, 0.03, 0.055);
    pdead.class5.stot.fixed(0.0555);
    plive.class1.stot.calc(pick, domain, 0.0555, 0.055, 0.03, 0.055);
    plive.class2.stot.calc(pick, domain, 0.0555, 0.055, 0.03, 0.055);
    plive.class3.stot.calc(pick, domain, 0.0555, 0.055, 0.03, 0.055);
    plive.class4.stot.calc(pick, domain, 0.0555, 0.055, 0.03, 0.055);
    plive.class5.stot.calc(pick, domain, 0.0555, 0.055, 0.03, 0.055);

    // Mois for 5 dead and 5 live classes
    const d1 = tree.site.moisture.dead.tl1h;
    const d10 = tree.site.moisture.dead.tl10h;
    const d100 = tree.site.moisture.dead.tl100h;
    const { herb } = tree.site.moisture.live;
    const { stem } = tree.site.moisture.live;
    pdead.class1.mois.calc(pick, domain, d1, d1, d1, d1);
    pdead.class2.mois.calc(pick, domain, d10, d10, d10, d10);
    pdead.class3.mois.calc(pick, domain, d100, d10, d1, 5);
    pdead.class4.mois.calc(pick, domain, d1, d100, d100, 5);
    pdead.class5.mois.fixed(5);
    plive.class1.mois.calc(pick, domain, herb, stem, stem, herb);
    plive.class2.mois.calc(pick, domain, stem, stem, stem, stem);
    plive.class3.mois.calc(pick, domain, 5, stem, stem, 5);
    plive.class4.mois.calc(pick, domain, 5, stem, 5, 5);
    plive.class5.mois.calc(pick, domain, 5, herb, 5, 5);

    // Labels
    pdead.class1.label.calc(pick, domain,
      'Dead 1-h time-lag (0 to 0.25 inch diameter) branch wood',
      'Dead 1-h time-lag (0 to 0.25 inch diameter) stem wood',
      'Dead 1-h time-lag (0 to 0.25 inch diameter) stem wood',
      'Dead 1-h time-lag (0 to 0.25 inch diameter) stem wood');
    pdead.class2.label.calc(pick, domain,
      'Dead 10-h time-lag (0.25 to 1 inch diameter) branch wood',
      'Dead small 10-h time-lag (0.25 to 0.5 inch diameter) stem wood',
      'Dead 10-h time-lag (0.25 to 1 inch diameter) stem wood',
      'Dead 10-h time-lag (0.25 to 1 inch diameter) stem wood');
    pdead.class3.label.calc(pick, domain,
      'Dead 100-h time-lag (1 to 3 inch diameter) branch wood',
      'Dead medium 10-h time-lag (0.5 to 1 inch diameter) stem wood',
      'Dead foliage',
      'unused');
    pdead.class4.label.calc(pick, domain,
      'Dead herb',
      'Dead 100-h time-lag (1 to 3 inch diameter) stem wood',
      'Litter layer',
      'unused');
    pdead.class5.label.fixed('unused');
    plive.class1.label.calc(pick, domain,
      'Live herb',
      'Live fine (0 to 0.25 inch diameter) stem wood',
      'Live 0 to 0.25 inch diameter stem wood',
      'Live herb');
    plive.class2.label.calc(pick, domain,
      'Live stem wood',
      'Live small (0.25 to 0.5 inch diameter) stem wood',
      'Live 0.25 to 1 inch diameter stem wood',
      'Live woody');
    plive.class3.label.calc(pick, domain,
      'unused',
      'Live medium (0.5 to 1 inch diameter) stem wood',
      'Live foliage',
      'unused');
    plive.class4.label.calc(pick, domain,
      'unused',
      'Live large (1 to 3 inch diameter) stem wood',
      'unused',
      'unused');
    plive.class5.label.calc(pick, domain,
      'unused',
      'Live leaves',
      'unused',
      'unused');
  }
}

export default class BpxTreeFuel extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    new BpxTreeFuelComplex(this, 'primary');
    new BpxTreeFuelComplex(this, 'secondary');
  }
}

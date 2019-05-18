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
//const Fuel = require('./BpxLeafOptions');
import BpxLibFuelCatalog from './BpxLibFuelCatalog';
import BpxTreeFuelModelBehave from './BpxTreeFuelModelBehave';
import BpxTreeFuelModelChaparral from './BpxTreeFuelModelChaparral';
import BpxTreeFuelModelPalmettoGallberry from './BpxTreeFuelModelPalmettoGallberry';
import BpxTreeFuelModelWesternAspen from './BpxTreeFuelModelWesternAspen';

import BpxLibMath from'./BpxLibMath';
import BpxLibFuelParticle from './BpxLibFuelParticle';
import BpxLibFuelBed from './BpxLibFuelBed';

import { BpxLeafFuelDomain } from './BpxLeafOptions';
import DagLeafQuantity from './DagLeafQuantity';
import DagLeafText from './DagLeafText';

/* eslint-disable no-new */

export class BpxTreeFuelParticle extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    // 8 input
    new DagLeafQuantity(this, 'dens')
      .desc('fuel particle density')
      .units('fuelDens').value(32);
    new DagLeafQuantity(this, 'heat')
      .desc('fuel particle low heat of combustion')
      .units('fuelHeat').value(8000);
    new DagLeafText(this, 'label')
      .desc('brief fuel particle description')
      .units('fuelLabel').value('unspecified');
    new DagLeafQuantity(this, 'load')
      .desc('fuel particle oven-dry fuel load')
      .units('fuelLoad').value(0);
    new DagLeafQuantity(this, 'mois')
      .desc('fuel particle moisture content')
      .units('fuelMois').value(5);
    new DagLeafQuantity(this, 'savr')
      .desc('fuel paryicle surface area-to-volume ratio')
      .units('fuelSavr').value(1);
    new DagLeafQuantity(this, 'seff')
      .desc('fuel particle effective (silica-free) mineral content')
      .units('fuelSeff').value(0.01);
    new DagLeafQuantity(this, 'stot')
      .desc('fuel particle total mineral content')
      .units('fuelStot').value(0.0555);
    // 12 Derived
    new DagLeafQuantity(this, 'area')
      .desc('fuel particle surface area')
      .units('fuelArea').value(0);
    new DagLeafQuantity(this, 'awtg')
      .desc('fuel particle surface area weighting factor')
      .units('fraction').value(0);
    new DagLeafQuantity(this, 'diam')
      .desc('fuel particle equivalent cylindrical diameter')
      .units('fuelDiam').value(0);
    new DagLeafQuantity(this, 'efhn')
      .desc('fuel particle effective heating number; fraction of fuel involved in ignition')
      .units('fraction').value(0);
    new DagLeafQuantity(this, 'efld')
      .desc('effective fuel load; load of fuel involved in ingition')
      .units('fuelLoad').value(0);
    new DagLeafQuantity(this, 'efwl')
      .desc('effective fuel water load; amount of water within the effective fuel load')
      .units('fuelLoad').value(0);
    new DagLeafQuantity(this, 'pprc')
      .desc('fuel particle packing ratio contribution')
      .units('fuelDepth').value(0);
    new DagLeafQuantity(this, 'qign')
      .desc('fuel particle heat of pre-ignition')
      .units('fuelHeat').value(0);
    new DagLeafQuantity(this, 'size')
      .desc('fuel particle size class [0..6]')
      .units('index').value(6);
    new DagLeafQuantity(this, 'swtg')
      .desc('fuel particle size class surface area weighting factor')
      .units('fraction').value(0);
    new DagLeafQuantity(this, 'volm')
      .desc('fuel particle equivalent cylindrical volume')
      .units('fuelVolm').value(0);
    new DagLeafQuantity(this, 'wnet')
      .desc('fuel particle net (mineral-free) oven-dry load')
      .units('fuelLoad').value(0);
  }

  connect(/* tree */) {
    // Following can be determined from own properties
    this.area.calc(BpxLibFuelParticle.area, this.load, this.savr, this.dens);
    this.diam.calc(BpxLibFuelParticle.diam, this.savr);
    this.efhn.calc(BpxLibFuelParticle.efhn, this.savr);
    this.efwl.calc(BpxLibFuelParticle.efwl, this.efld, this.mois);
    this.pprc.calc(BpxLibFuelParticle.pprc, this.load, this.dens);
    this.qign.calc(BpxLibFuelParticle.qign, this.mois, this.efhn);
    this.size.calc(BpxLibFuelParticle.size, this.savr);
    this.volm.calc(BpxLibFuelParticle.volm, this.load, this.dens);
    this.wnet.calc(BpxLibFuelParticle.wnet, this.load, this.stot);
  }
}

export class BpxTreeFuelParticles extends DagBranch {
  constructor(parent, name = 'particle') {
    super(parent, name);
    new BpxTreeFuelParticle(this, 'class1');
    new BpxTreeFuelParticle(this, 'class2');
    new BpxTreeFuelParticle(this, 'class3');
    new BpxTreeFuelParticle(this, 'class4');
    new BpxTreeFuelParticle(this, 'class5');
  }
}

export class BpxTreeFuelCategory extends DagBranch {
  constructor(parent, name = 'dead') {
    super(parent, name);
    // DagBranches
    new BpxTreeFuelParticles(this);
    // DagLeafs
    new DagLeafQuantity(this, 'area')
      .desc('life category fuel surface area')
      .units('fuelArea').value(0);
    new DagLeafQuantity(this, 'awtg')
      .desc('life category surface area weighting factor')
      .units('fraction');
    new DagLeafQuantity(this, 'mineralDamping')
      .desc('life category mineral damping coefficient')
      .units('fraction').value(0);
    new DagLeafQuantity(this, 'moistureDamping')
      .desc('life category moisture damping coefficient')
      .units('fraction').value(0);
    new DagLeafQuantity(this, 'heat')
      .desc('life category weighted low heat of combustion')
      .units('fuelHeat').value(0);
    new DagLeafQuantity(this, 'load')
      .desc('life category total fuel load')
      .units('fuelLoad').value(0);
    new DagLeafQuantity(this, 'efld')
      .desc('life category total effective fuel load')
      .units('fuelLoad').value(0);
    new DagLeafQuantity(this, 'efwl')
      .desc('life category effective fuel water load')
      .units('fuelLoad').value(0);
    new DagLeafQuantity(this, 'mext')
      .desc('life category moisture content of extinction')
      .units('fuelMois').value(5);
    new DagLeafQuantity(this, 'mois')
      .desc('life category weighted fuel moisture content')
      .units('fuelMois').value(5);
    new DagLeafQuantity(this, 'efmc')
      .desc('life category effective fuel moisture content')
      .units('fuelMois').value(5);
    new DagLeafQuantity(this, 'pprc')
      .desc('life category contribution to fuel bed packing ratio')
      .units('fuelDepth').value(0);
    new DagLeafQuantity(this, 'qign')
      .desc('life category heat of pre-ignition')
      .units('fuelHeat').value(0);
    new DagLeafQuantity(this, 'rxi')
      .desc('life category reaction intensity')
      .units('fireRxi').value(0);
    new DagLeafQuantity(this, 'rxiDry')
      .desc('life category oven-dry reaction intensity')
      .units('fireRxi').value(0);
    new DagLeafQuantity(this,'savr')
      .desc('life category weighted surface area-to-volume ratio')
      .units('fuelSavr').value(1);
    new DagLeafQuantity(this, 'seff')
      .desc('life category weighted effective (silica-free) mineral content')
      .units('fuelSeff').value(0.01);
    new DagLeafQuantity(this, 'swtg') // Actually an Array of weights
      .desc('life category surface area weighting factors by size class')
      .units('index'); //.value([0,0,0,0,0,0]);
    new DagLeafQuantity(this, 'wnet')
      .desc('life category weighted effective (mineral-free) fuel load')
      .units('fuelLoad').value(0);
  }

  connect(/* tree */) {
    const particles = Object.values(this.particle);
    const [c1, c2, c3, c4, c5] = particles;
    const efld = (this.name() === 'dead')
      ? BpxLibFuelParticle.efld : BpxLibFuelParticle.efll;
    // Fuel particle derived properties
    particles.forEach((c) => {
      c.awtg.calc(BpxLibMath.div, c.area, this.area);
      c.efld.calc(efld, c.savr, c.load); // NOTE calls 'efld' for dead, 'efll' for live
      c.swtg.calc(BpxLibFuelParticle.swtg, c.size, this.swtg);
    });

    // Life category properties summed over all life particles
    ['area', 'efld', 'efwl', 'load', 'pprc'].forEach((prop) => {
      this[prop].calc(BpxLibMath.sum, c1[prop], c2[prop], c3[prop], c4[prop], c5[prop]);
    });

    // Weighted life category properties
    ['heat', 'mois', 'qign', 'savr', 'seff'].forEach((prop) => {
      this[prop].calc(BpxLibMath.sumProd,
        c1.awtg, c2.awtg, c3.awtg, c4.awtg, c5.awtg,
        c1[prop], c2[prop], c3[prop], c4[prop], c5[prop]);
    });
    this.swtg.calc(BpxLibFuelBed.swtg,
      c1.area, c1.size, c2.area, c2.size, c3.area, c3.size,
      c4.area, c4.size, c5.area, c5.size);
    this.wnet.calc(BpxLibMath.sumProd,
      c1.swtg, c2.swtg, c3.swtg, c4.swtg, c5.swtg,
      c1.wnet, c2.wnet, c3.wnet, c4.wnet, c5.wnet );

    this.efmc.calc(BpxLibMath.div, this.efwl, this.efld);
    this.mineralDamping.calc(BpxLibFuelBed.etas, this.seff);
    this.moistureDamping.calc(BpxLibFuelBed.etam, this.mois, this.mext);
  }
}

export class BpxTreeFuelCategoryDead extends BpxTreeFuelCategory {
  constructor(parent, name = 'dead') {
    super(parent, name);
  }
}

export class BpxTreeFuelCategoryLive extends BpxTreeFuelCategory {
  constructor(parent, name = 'live') {
    super(parent, name);
    // Unique to the live fuel category
    new DagLeafQuantity(this, 'mxtk')
      .desc('live fuel category moisture of extinction centent factor')
      .units('factor').value(1);
  }
}

export class BpxTreeFuelBed extends DagBranch {
  constructor(parent, name = 'bed') {
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
  }

  connect(/* tree */) {
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

    // Fuel bed effective wind, wind coefficient, and spread rate limits
    this.ewsLimit.calc(BpxLibFuelBed.ewsLimit, this.reactionIntensity);
    this.phiLimit.calc(BpxLibFuelBed.phiLimit, this.ewsLimit, this.windB, this.windK);
    this.rosLimit.calc(BpxLibFuelBed.rosLimit, this.ros0, this.phiLimit);
  }
}

//---------------------------------
// put following in their own files
//---------------------------------

export class BpxTreeFuelModel extends DagBranch {
  constructor(parent, name = 'model') {
    super(parent, name);
    // DagBranches
    new BpxTreeFuelModelBehave(this);
    new BpxTreeFuelModelChaparral(this);
    new BpxTreeFuelModelPalmettoGallberry(this);
    new BpxTreeFuelModelWesternAspen(this);
    // Leaves
    new BpxLeafFuelDomain(this, 'domain');
    new DagLeafText(this, 'key')
      .desc('fuel model catalog key')
      .units('fuelKey').value('10');
  }

  connect(tree) {
    const cfgFuel = tree.configs.fuel.primary;
    const cfgCuredHerb = tree.configs.fuel.curedHerbFraction;
    const cfgTotalLoad = tree.configs.fuel.chaparralTotalLoad;
    const liveHerbMois = tree.site.moisture.live.herb;

    this.key.input();
    this.domain
      .calcIf(cfgFuel, 'catalog', BpxLibFuelCatalog.domain, this.key)
      .fixedIf(cfgFuel, this.behave.domain.value(), this.behave.domain.value())
      .fixedIf(cfgFuel, this.chaparral.domain.value(), this.chaparral.domain.value())
      .fixedIf(cfgFuel, this.palmettoGallberry.domain.value(),
        this.palmettoGallberry.domain.value())
      .fixedIf(cfgFuel, this.westernAspen.domain.value(), this.westernAspen.domain.value())
      .fixed('none');

    this.behave.subconnect(cfgFuel, cfgCuredHerb, liveHerbMois, this.key);
    this.chaparral.subconnect(cfgFuel, cfgTotalLoad, this.key);
    this.palmettoGallberry.subconnect(cfgFuel, this.key);
    this.westernAspen.subconnect(cfgFuel, this.key);
  }
}

export class BpxTreeFuelComplex extends DagBranch {
  constructor(parent, name = 'complex') {
    super(parent, name);
    new BpxTreeFuelBed(this);
    new BpxTreeFuelModel(this);
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

class BpxTreeFuel extends DagBranch {
  constructor(parent, name = 'fuel') {
    super(parent, name);
    new BpxTreeFuelComplex(this, 'primary');
    new BpxTreeFuelComplex(this, 'secondary');
  }
}

export default BpxTreeFuel;

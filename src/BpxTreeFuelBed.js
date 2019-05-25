/*
 * @file Defines the BehavePlus Explorer Fuel Bed sub-tree.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';
import DagLeafQuantity from './DagLeafQuantity';

import { BpxLeafFuelDomain } from './BpxLeafOptions';

import BpxLibFuelBed from './BpxLibFuelBed';
import BpxLibMath from './BpxLibMath';
import BpxLibSurfaceFire from './BpxLibSurfaceFire';
import BpxLibWind from './BpxLibWind';

import {
  BpxTreeFuelCategoryDead,
  BpxTreeFuelCategoryLive,
} from './BpxTreeFuelCategory';

export default class BpxTreeFuelBed extends DagBranch {
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

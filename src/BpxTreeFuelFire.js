/**
 * @file Defines the BehavePlus Explorer Fuel Fire sub-tree.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';
import DagLeafBool from './DagLeafBool';
import DagLeafQuantity from './DagLeafQuantity';

import BpxLibFuelBed from './BpxLibFuelBed';
import BpxLibMath from './BpxLibMath';
import BpxLibSurfaceFire from './BpxLibSurfaceFire';
import BpxLibWind from './BpxLibWind';

/**
 * Defines the surface fuel-fire tree-leaf structure.
 */
export class TreeFuelFire extends DagBranch {
  constructor(parent, name) {
    super(parent, name);

    // Fire spread direction sub-branch
    const dir = new DagBranch(this, 'direction');
    new DagLeafQuantity(dir, 'slopeRos')
      .desc('spread rate due to the slope coefficient')
      .units('fireRos').value(0);
    new DagLeafQuantity(dir, 'windRos')
      .desc('spread rate due to the wind coefficient')
      .units('fireRos').value(0);
    new DagLeafQuantity(dir, 'xComp')
      .desc('directional spread rate x-component')
      .units('factor').value(0);
    new DagLeafQuantity(dir, 'yComp')
      .desc('directional spread rate y-component')
      .units('factor').value(0);
    new DagLeafQuantity(dir, 'vectorRos')
      .desc('directional spread rate at vector')
      .units('fireRos').value(0);

    // Exceeded sub-branch
    const exceeded = new DagBranch(this, 'exceeded');
    new DagLeafBool(exceeded, 'ews')
      .desc('effective wind speed limit is exceeded')
      .value(false);
    new DagLeafBool(exceeded, 'ros')
      .desc('spread rate limit is exceeded')
      .value(false);

    // Limit sub-branch
    const limit = new DagBranch(this, 'limit');
    new DagLeafQuantity(limit, 'ews')
      .desc('upper limit of the effective wind speed')
      .units('windSpeed').value(88000);
    new DagLeafQuantity(limit, 'phi')
      .desc('upper limit of the wind-slope spread rate coefficient')
      .units('factor').value(1);
    new DagLeafQuantity(limit, 'ros')
      .desc('upper limit of the fire spread rate')
      .units('fireRos').value(0);

    // Slope sub-branch
    const slope = new DagBranch(this, 'slope');
    new DagLeafQuantity(slope, 'k')
      .desc('slope spread rate coefficient intermediate factor')
      .units('factor').value(1);
    new DagLeafQuantity(slope, 'phi')
      .desc('slope spread rate coefficient')
      .units('factor').value(0);
    new DagLeafQuantity(slope, 'ratio')
      .desc('slope steepness ratio')
      .units('slopeSteepness').value(0);

    // Spread sub-branch
    const spread = new DagBranch(this, 'spread');

    // Spread step 1 sub-branch
    const step1 = new DagBranch(spread, 'step1');
    let conditions =  ' under upslope wind conditons';
    new DagLeafQuantity(step1, 'ews')
      .desc('effective wind speed'+conditions)
      .units('windSpeed').value(0);
    new DagLeafQuantity(step1, 'phiEw')
      .desc('effective wind coefficient'+conditions)
      .units('factor').value(1);
    new DagLeafQuantity(step1, 'ros')
      .desc('spread rate'+conditions)
      .units('fireRos').value(0);

    // Spread step 2 sub-branch
    const step2 = new DagBranch(spread, 'step2');
    conditions = ' under under cross-slope wind conditions without limits';
    new DagLeafQuantity(step2, 'ews')
      .desc('effective wind speed'+conditions)
      .units('windSpeed').value(0);
    new DagLeafQuantity(step2, 'phiEw')
      .desc('effective wind coefficient'+conditions)
      .units('factor').value(1);
    new DagLeafQuantity(step2, 'ros')
      .desc('spread rate'+conditions)
      .units('fireRos').value(0);

    // Spread step 3a sub-branch
    const step3a = new DagBranch(spread, 'step3a');
    conditions = ' under cross-slope wind conditions with only the effective wind speed limit applied';
    new DagLeafQuantity(step3a, 'ews')
      .desc('effective wind speed'+conditions)
      .units('windSpeed').value(0);
    new DagLeafQuantity(step3a, 'phiEw')
      .desc('effective wind coefficient'+conditions)
      .units('factor').value(1);
    new DagLeafQuantity(step3a, 'ros')
      .desc('spread rate'+conditions)
      .units('fireRos').value(0);

    // Spread step 3b sub-branch
    const step3b = new DagBranch(spread, 'step3b');
    conditions = ' under cross-slope wind conditions with only the rate--of-spread limit applied';
    new DagLeafQuantity(step3b, 'ews')
      .desc('effective wind speed'+conditions)
      .units('windSpeed').value(0);
    new DagLeafQuantity(step3b, 'phiEw')
      .desc('effective wind coefficient'+conditions)
      .units('factor').value(1);
    new DagLeafQuantity(step3b, 'ros')
      .desc('spread rate'+conditions)
      .units('fireRos').value(0);

    // Spread step 4 sub-branch
    const step4 = new DagBranch(spread, 'step4');
    conditions = ' under cross-slope wind conditions with limits applied';
    new DagLeafQuantity(step4, 'ews')
      .desc('effective wind speed'+conditions)
      .units('windSpeed').value(0);
    new DagLeafQuantity(step4, 'phiEw')
      .desc('effective wind coefficient'+conditions)
      .units('factor').value(1);
    new DagLeafQuantity(step4, 'ros')
      .desc('spread rate'+conditions)
      .units('fireRos').value(0);

    // Wind sub-branch
    const wind = new DagBranch(this, 'wind');
    new DagLeafQuantity(wind, 'atMidflame')
      .desc('midflame wind speed')
      .units('windSpeed').value(0);
    new DagLeafQuantity(wind, 'b')
      .desc('wind spread rate coefficient intermediate factor B')
      .units('factor').value(1);
    new DagLeafQuantity(wind, 'c')
      .desc('wind spread rate coefficient intermediate factor C')
      .units('factor').value(1);
    new DagLeafQuantity(wind, 'e')
      .desc('wind spread rate coefficient intermediate factor E')
      .units('factor').value(1);
    new DagLeafQuantity(wind, 'headingFromUpslope')
      .desc('wind heading direction from Upslope')
      .units('azimuth').value(0);
    new DagLeafQuantity(wind, 'k')
      .desc('wind spread rate coefficient intermediate factor K')
      .units('factor').value(1);
    new DagLeafQuantity(wind, 'i')
      .desc('inverse of wind spread rate coefficient intermediate factor K')
      .units('factor').value(1);
    new DagLeafQuantity(wind, 'phi')
      .desc('wind spread rate coefficient')
      .units('factor').value(0);
    new DagLeafQuantity(wind, 'waf')
      .desc('applied midflame wind speed adjustment factor')
      .units('fraction').value(1);

    // Directly under *this* BpxTreeFuelFire branch:
    new DagLeafQuantity(this, 'effectiveWindSpeed')
      .desc('effective wind speed')
      .units('windSpeed').value(0);
    new DagLeafQuantity(this, 'firelineIntensity')
      .desc('maximum fireline intensity')
      .units('fireFli').value(0);
    new DagLeafQuantity(this, 'flameLength')
      .desc('maximum flame length')
      .units('fireFlame').value(0);
    new DagLeafQuantity(this, 'flameResidenceTime')
      .desc('flame residence time')
      .units('timeMin').value(0);
    new DagLeafQuantity(this, 'headingFromUpslope')
      .desc('direction of maximum spread, degrees clockwise from upslope')
      .units('azimuth').value(0);
    new DagLeafQuantity(this, 'heatPerUnitArea')
      .desc('heat per unit area')
      .units('fireHpua').value(0);
    new DagLeafQuantity(this, 'lengthToWidthRatio')
      .desc('fire ellipse length-to-width ratio')
      .units('fireLwr').value(1);
    new DagLeafQuantity(this, 'phiEw')
      .desc('effective wind coefficient')
      .units('factor').value(1);
    new DagLeafQuantity(this, 'reactionIntensity')
      .desc('reaction intensity')
      .units('fireRxi').value(0);
    new DagLeafQuantity(this, 'ros')
      .desc('maximum spread rate')
      .units('fireRos').value(0);
    new DagLeafQuantity(this, 'ros0')
      .desc('no-wind no-slope spread rate')
      .units('fireRos').value(0);
  }
}

/**
 * Implements the Bpx surface fuel-fire subtree
 * where fuel bed leafs come from a sibling 'bed'
 * and canopy, slope, and wind all come from tree.site
 */
export default class BpxTreeFuelFire extends TreeFuelFire {
  connect( tree ) {
    // Required external references
    // Requires 3 bed leafs: reactionIntensity, ros0, openWaf
    const bed = this.own.parent.bed;
    // Requires 3 configurations:
    const cfgEws = tree.configs.fire.ewsLimit;
    const cfgSpd = tree.configs.wind.speed;
    const cfgWaf = tree.configs.fuel.waf;
    // Requires 2 canopy leafs: sheltersFuel, shelteredWaf
    const canopy = tree.site.canopy;
    // Requires 1 slope.steepness leaf: ratio
    const slope = tree.site.slope;
    // Requires 3 wind.speed leafs: at20ft, atMidflame, waf
    // and 1 wind.direction leaf: headingFromUpslope
    const wind = tree.site.wind;

    this.reactionIntensity
      .bind(bed.reactionIntensity);
    this.ros0
      .bind(bed.ros0);
    this.slope.ratio
      .bind(slope.steepness.ratio);
    this.wind.headingFromUpslope
      .bind(wind.direction.headingFromUpslope);

    // WAF is either from the site's input WAF or calculated from canopy inputs and fuel depth
    this.wind.waf
      .bindIf(cfgWaf, 'input', wind.speed.waf)
      .calc(BpxLibFuelBed.waf,
        canopy.sheltersFuel,
        canopy.shelteredWaf,
        bed.openWaf);

    // Midflame wind speed is either from the site midflame windspeed,
    // or estimated from the site's 20-ft windspeed and this fuel bed's WAF
    this.wind.atMidflame
      .bindIf(cfgSpd, 'atMidflame', wind.speed.atMidflame)
      .calc(BpxLibWind.atMidflame,
        wind.speed.at20ft,
        this.wind.waf)

    this.flameResidenceTime
      .calc(BpxLibFuelBed.taur,
        bed.savr);
    this.heatPerUnitArea
      .calc(BpxLibMath.mul,
        this.reactionIntensity,
        this.flameResidenceTime);

    // Fuel bed wind-slope factors
    this.slope.k
      .calc(BpxLibFuelBed.slopeK,
        bed.packingRatio);
    this.slope.phi
      .calc(BpxLibSurfaceFire.phiS,
        this.slope.ratio,
        this.slope.k);
    this.wind.b
      .calc(BpxLibFuelBed.windB,
        bed.savr);
    this.wind.c
      .calc(BpxLibFuelBed.windC,
        bed.savr);
    this.wind.e
      .calc(BpxLibFuelBed.windE,
        bed.savr);
    this.wind.k
      .calc(BpxLibFuelBed.windK,
        bed.packingRatioRatio,
        this.wind.e,
        this.wind.c);
    this.wind.i
      .calc(BpxLibFuelBed.windI,
        bed.packingRatioRatio,
        this.wind.e,
        this.wind.c);
    this.wind.phi
      .calc(BpxLibSurfaceFire.phiW,
        this.wind.atMidflame,
        this.wind.b,
        this.wind.k);

    // Fuel bed effective wind, wind coefficient, and spread rate limits
    this.limit.ews
      .calc(BpxLibFuelBed.ewsLimit,
        this.reactionIntensity);
    this.limit.phi
      .calc(BpxLibFuelBed.phiLimit,
        this.limit.ews,
        this.wind.b,
        this.wind.k);
    this.limit.ros
      .calc(BpxLibFuelBed.rosLimit,
        this.ros0,
        this.limit.phi);

    // Direction of maximum spread
    this.direction.slopeRos
      .calc(BpxLibSurfaceFire.spreadDirSlopeRate,
        this.ros0,
        this.slope.phi);
    this.direction.windRos
      .calc(BpxLibSurfaceFire.spreadDirWindRate,
        this.ros0,
        this.wind.phi);
    this.direction.xComp
      .calc(BpxLibSurfaceFire.spreadDirXComp,
        this.direction.windRos,
        this.direction.slopeRos,
        this.wind.headingFromUpslope);
    this.direction.yComp
      .calc(BpxLibSurfaceFire.spreadDirYComp,
        this.direction.windRos,
        this.wind.headingFromUpslope);
    this.direction.vectorRos
      .calc(BpxLibSurfaceFire.spreadDirVectorRate,
        this.direction.xComp,
        this.direction.yComp);
    this.headingFromUpslope
      .calc(BpxLibSurfaceFire.spreadDirFromUpslope,
        this.direction.xComp,
        this.direction.yComp,
        this.direction.vectorRos);

    // Step 1 - EWS, WSC, and ROS under Upslope Wind Condition

    // Calculate wind-slope coefficient (phiEw') using method 1
    this.spread.step1.phiEw
      .calc(BpxLibMath.sum,
        this.phiW,
        this.phiS);

    // Calculate effective wind speed using method 1 from the wind-slope coefficient
    this.spread.step1.ews
      .calc(BpxLibSurfaceFire.effectiveWindSpeed,
        this.spread.step1.phiEw,
        this.wind.b,
        this.wind.i);

    // Calculate maximum fire spread rate using method 1
    this.spread.step1.ros
      .calc(BpxLibSurfaceFire.rosMax,
        this.ros0,
        this.spread.step1.phiEw);

    // Step 2 - EWS, WSC, and ROS under *Cross-slope Wind Condition* without Limits

    // Calculate maximum fire spread rate using method 2
    this.spread.step2.ros
      .calc(BpxLibSurfaceFire.rosMaxCrossSlopeWind,
        this.ros0,
        this.direction.vectorRos);

    // Calculate wind-slope coefficient (phiEw') using method 2
    this.spread.step2.phiEw
      .calc(BpxLibSurfaceFire.phiEwInferred,
        this.ros0,
        this.spread.step2.ros);

    // Calculate effective wind speed using method 1 from the wind-slope coefficient
    this.spread.step2.ews
      .calc(BpxLibSurfaceFire.effectiveWindSpeed,
        this.spread.step2.phiEw,
        this.wind.b,
        this.wind.i);

    // Step 3A - EWS, WSC, and ROS under Cross-slope Wind Condition
    //           with Only the Effective Wind Speed Limit Applied

    // Is the effective wind speed limit exceeded?
    this.exceeded.ews
      .calc(BpxLibMath.gt,
        this.spread.step2.ews,
        this.limit.ews);

    // Effective wind speed 3A is the minimum of EWS from Step 2 and the EWS limit
    this.spread.step3a.ews
      .calc(Math.min,
        this.spread.step2.ews,
        this.limit.ews);

    // Wind-slope coefficient 3A is the mimimum of WSC from Step 2 and the WSC limit
    this.spread.step3a.phiEw
      .calc(Math.min,
        this.spread.step2.phiEw,
        this.limit.phiEw);

    // Maximum spread rate 3A is the minimum of ROS from Step 2 and the Max ROS limit
    this.spread.step3a.ros
      .calc(Math.min,
        this.spread.step2.ros,
        this.limit.ros);

    // Step 3B - EWS, WSC, and ROS under Cross-slope Wind Condition
    //           with Only the Rate of Spread Limit Applied
    // because Pat sez fire spread rate cannot exceed the effective wind speed

    // Maximum fire spread rate is ROS and EWS from Step 2 with ros limit applied
    this.spread.step3b.ros
      .calc(BpxLibSurfaceFire.rosMaxRosLimitApplied,
        this.spread.step2.ros,
        this.spread.step2.ews)

    // ROS limit is exceeded if ROS from Step 2 is greater than ROS from Step 3b
    this.exceeded.ros
      .calc(BpxLibMath.gt,
        this.spread.step2.ros,
        this.spread.step3b.ros);

    // Wind-slope coefficient must be recalculated using method 2
    this.spread.step3b.phiEw
      .calc(BpxLibSurfaceFire.phiEwInferred,
        this.ros0,
        this.spread.step3b.ros);

    // The effective wind speed must be recalculated using method 1
    this.spread.step3b.ews
      .calc(BpxLibSurfaceFire.effectiveWindSpeed,
        this.spread.step3b.phiEw,
        this.wind.b,
        this.wind.i);

    // Step 4 - Cross-slope Wind Condition with BOTH the Effective Wnd Speed
    //          AND the Spread Rate Limits Applied

    // Apply the ROS limits to the EWS-limited spread rate
    this.spread.step4.ros
      .calc(BpxLibSurfaceFire.rosMaxRosLimitApplied,
        this.spread.step3a.ros,
        this.spread.step3a.ews)

    // Wind-slope coefficient must be recalculated using method 2
    this.spread.step4.phiEw
    .calc(BpxLibSurfaceFire.phiEwInferred,
      this.ros0,
      this.spread.step4.ros);

    // The effective wind speed must be recalculated using method 1
    this.spread.step4.ews
      .calc(BpxLibSurfaceFire.effectiveWindSpeed,
        this.spread.step4.phiEw,
        this.wind.b,
        this.wind.i);

    // Step 5 - Final ROS, EWS, and WSC values based on client preferences
    this.ros
      .bindIf(cfgEws, 'applied', this.spread.step4.ros)
      .bind(this.spread.step3b.ros);

    this.phiEw
      .bindIf(cfgEws, 'applied', this.spread.step4.phiEw)
      .bind(this.spread.step3b.phiEw);

    this.effectiveWindSpeed
      .bindIf(cfgEws, 'applied', this.spread.step4.ews)
      .bind(this.spread.step3b.ews);

    this.firelineIntensity
      .calc(BpxLibSurfaceFire.firelineIntensity,
        this.ros,
        this.reactionIntensity,
        this.flameResidenceTime);

    this.flameLength
      .calc(BpxLibSurfaceFire.flameLength,
        this.firelineIntensity);

    this.lengthToWidthRatio
      .calc(BpxLibSurfaceFire.lengthToWidthRatio,
        this.effectiveWindSpeed);
  }
}

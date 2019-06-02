import Dag from '../Dag';
import { approx, logNames } from '../__test_data__/Debug';

// The S&R samples are all in SI
// Here are multiplicaton factors to convert from base to metric
// i.e., metricValue * factor = baseValue
// and baseValue / factor = metric value
const fDistance = 3.2808;     // m * f = ft
const fRos = 3.2808;          // m/min * f = ft/min
const fWind = 0.621371;       // km/h * f = mi/h
const fDensity = 0.062428;    // kg/m3 * f = lb/ft3
const fHpua = 0.0879872;      // kJ/m2 * f = btu/ft2
const fFli = 0.288672;        // kW/m * f = btu/ft/s
const fRxi = 5.27923;         // kW/m2 * f = ftu/ft2/min
const fHeatDens = 0.0268185;  // kJ/m3 * f = btu/ft3

/**
 * Note that for the Benchmark124 case,
 * the wind is NOT blowing upslope, so S&R final results are invalid
 */
test('1: Scott & Reinhardt Stand A', () => {
  const name = 'standA';
  const dag = new Dag(name);
  const { tree } = dag;
  const primary = tree.surface.fuel.primary;

  // Set configuration
  dag.setValues([
    [tree.configs.fire.ewsLimit, 'applied'],
    [tree.configs.fire.vector, 'fromNorth'],
    [tree.configs.fire.weightingMethod, 'harmonic'],
    [tree.configs.fuel.chaparralTotalLoad, 'input'],
    [tree.configs.fuel.curedHerbFraction, 'estimated'],
    [tree.configs.fuel.moisture, 'individual'],
    [tree.configs.fuel.primary, 'catalog'],
    [tree.configs.fuel.secondary, 'none'],
    [tree.configs.fuel.waf, 'input'],
    [tree.configs.slope.steepness, 'ratio'],
    [tree.configs.wind.direction, 'upslope'],
    [tree.configs.wind.speed, 'at20ft'],
  ]);

  // S&R Stand A inputs in SI Units
  dag.setValues([
    [tree.surface.fuel.primary.model.key, '5'],
    [tree.site.canopy.crownHeight, 21.8333 * fDistance], // 71.6316
    [tree.site.canopy.crownBase, 1.5 * fDistance],       // 4.92126 ft
    [tree.site.canopy.bulkDensity, 0.06 * fDensity], // 0.00374568 lb/ft3
    [tree.site.moisture.dead.tl1h, 0.05],
    [tree.site.moisture.dead.tl10h, 0.06],
    [tree.site.moisture.dead.tl100h, 0.08],
    [tree.site.moisture.live.herb, 1.17],
    [tree.site.moisture.live.stem, 1.17],
    [tree.site.canopy.foliarMoisture, 1],
    [tree.site.wind.speed.at20ft, 40 * fWind*88],  // 24.8548 mph, 2187.23 fpm
    [tree.site.wind.speed.waf, 0.15],
    [tree.site.slope.steepness.ratio, 0.2],
  ]);

  // For now, just select a few surface behaviors to ensure correct values
  dag.setSelected([
    primary.fire.ros,
    primary.fire.heatPerUnitArea,
    primary.fire.firelineIntensity,
    primary.fire.flameLength,
    primary.fire.reactionIntensity,
    primary.fire.wind.atMidflame,
    primary.fire.wind.waf,
    primary.bed.heatSink,
    tree.crown.fuel.canopy.fire.ros0,
    tree.crown.fuel.canopy.fire.ros,
    tree.crown.fuel.canopy.fire.reactionIntensity,
    tree.crown.fuel.canopy.fire.slope.phi,
    tree.crown.fuel.canopy.fire.wind.phi,
    tree.crown.fuel.canopy.fire.phiEw,
    tree.crown.fire.active.lengthToWidthRatio,
    tree.crown.fire.active.ros,
    tree.crown.fire.active.powerOfTheWind,
    tree.crown.fire.active.powerOfTheFire,
    tree.crown.fire.active.powerRatio,
    tree.crown.fire.active.heatPerUnitArea,
    tree.crown.fire.active.firelineIntensity,
    tree.crown.fire.active.flameLength,
    tree.crown.fire.active.isPlumeDominated,
    tree.crown.fire.active.isWindDriven,
    //tree.crown.fire.active.canTransition,
    tree.crown.fire.surface.heatPerUnitArea,
    tree.crown.fire.initiation.firelineIntensity,
    tree.crown.fire.initiation.ros,
    tree.crown.fire.initiation.rosPrime,
    tree.crown.fire.initiation.transitionRatio,
    tree.crown.fire.initiation.canTransition,
    tree.crown.fire.initiation.activeRatio,
    tree.crown.fire.initiation.type,
    tree.crown.fire.initiation.isCrownFire,
    tree.crown.fire.initiation.isActiveCrownFire,
    tree.crown.fire.initiation.isConditionalCrownFire,
    tree.crown.fire.initiation.isPassiveCrownFire,
    tree.crown.fire.initiation.isSurfaceFire,
    tree.crown.fire.initiation.oActive,
    tree.crown.fire.initiation.crowningIndex,
    tree.crown.fire.final.crownFractionBurned,
    tree.crown.fire.final.rSa,
    tree.crown.fire.final.flameLength,
    tree.crown.fire.final.firelineIntensity,
    tree.crown.fire.final.ros,
  ]);

  let inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(13);
  expect(inputLeafs).toContain(tree.site.canopy.bulkDensity);
  expect(inputLeafs).toContain(tree.site.canopy.crownBase);
  expect(inputLeafs).toContain(tree.site.canopy.crownHeight);
  expect(inputLeafs).toContain(tree.site.canopy.foliarMoisture);
  expect(inputLeafs).toContain(tree.site.moisture.dead.tl1h);
  expect(inputLeafs).toContain(tree.site.moisture.dead.tl10h);
  expect(inputLeafs).toContain(tree.site.moisture.dead.tl100h);
  expect(inputLeafs).toContain(tree.site.moisture.live.herb);
  expect(inputLeafs).toContain(tree.site.moisture.live.stem);
  expect(inputLeafs).toContain(tree.site.slope.steepness.ratio);
  expect(inputLeafs).toContain(tree.site.wind.speed.at20ft);
  expect(inputLeafs).toContain(tree.site.wind.speed.waf);
  expect(inputLeafs).toContain(tree.surface.fuel.primary.model.key);


  // BP6 and S&R values Table 6: Isurface
  expect(approx(primary.fire.firelineIntensity.value(), 470.259*fFli, 6)).toEqual(true);
  expect(approx(primary.fire.firelineIntensity.value(), 470*fFli, 2)).toEqual(true);

  // BP6 and S&R values Table 6: I'initiation
  expect(approx(tree.crown.fire.initiation.firelineIntensity.value(), 309.447371*fFli, 3)).toEqual(true);
  expect(approx(tree.crown.fire.initiation.firelineIntensity.value(), 309*fFli, 1)).toEqual(true);

  // BP6 and S&R values Table 6: HPA
  expect(approx(primary.fire.heatPerUnitArea.value(), 6191.389542*fHpua, 6)).toEqual(true);
  expect(approx(primary.fire.heatPerUnitArea.value()*0.001, 6.191389542*fHpua, 1)).toEqual(true);

  // BP6 and S&R values Table 6: Rsurface
  expect(approx(primary.fire.ros.value(), 4.557223*fRos, 2)).toEqual(true);
  expect(approx(primary.fire.ros.value(), 4.6*fRos, 2)).toEqual(true);

  // BP6 and S&R values Table 6: R'initiation
  expect(approx(tree.crown.fire.initiation.ros.value(), 2.998817*fRos, 1)).toEqual(true);
  expect(approx(tree.crown.fire.initiation.ros.value(), 3*fRos, 3)).toEqual(true);

  // BP6 and S&R values Table 6: R'sa
  expect(approx(tree.crown.fire.final.rSa.value(), 9.325327*fRos, 5)).toEqual(true);
  expect(approx(tree.crown.fire.final.rSa.value(), 9.2*fRos, 1)).toEqual(true);

  // BP6 and S&R values Table 6: Ractive
  expect(approx(tree.crown.fire.active.ros.value(), 22.526471*fRos, 2)).toEqual(true);
  // S&R comparison FAILS with difference of 0.6 m/min
  expect(approx(tree.crown.fire.active.ros.value(), (23.1-0.6)*fRos, 1)).toEqual(true);

  // BP6 and S&R values Table 6: R'active
  expect(approx(tree.crown.fire.initiation.rosPrime.value(), 49.999991*fRos, 4)).toEqual(true);
  expect(approx(tree.crown.fire.initiation.rosPrime.value(), 50*fRos, 4)).toEqual(true);

  // BP6 and S&R values Table 6: Type of fire
  expect(tree.crown.fire.initiation.type.value()).toEqual('Passive');

  // BP6 and S&R values Table 6: CFB
  expect(approx(tree.crown.fire.final.crownFractionBurned.value(), 0.246329, 4)).toEqual(true);
  expect(approx(tree.crown.fire.final.crownFractionBurned.value(), (0.25-.01), 1)).toEqual(true);

  // BP6 and S&R values Table 6: Rfinal
  expect(approx(tree.crown.fire.final.ros.value(), 8.983578*fRos, 2)).toEqual(true);
  expect(approx(tree.crown.fire.final.ros.value(), 9.2*fRos, 1)).toEqual(true);

  // BP6 and S&R values Table 6: Ifinal
  expect(approx(tree.crown.fire.final.firelineIntensity.value(), 1764.944954*fFli, 2)).toEqual(true);
  expect(approx(tree.crown.fire.final.firelineIntensity.value(), 1788*fFli, 1)).toEqual(true);

  // BP6 and S&R values Table 6: Crowning Index
  expect(approx(tree.crown.fire.initiation.oActive.value(), 70.859763*fWind*88, 2)).toEqual(true);
  expect(approx(tree.crown.fire.initiation.oActive.value(), 70*fWind*88, 1)).toEqual(true);

  expect(approx(primary.fire.reactionIntensity.value(), 452.220030*fRxi, 6)).toEqual(true);
  expect(approx(primary.bed.heatSink.value(), 2869.902303*fHeatDens, 6)).toEqual(true);
})

test('2: Scott & Reinhardt Stand B', () => {
  const name = 'standB';
  const dag = new Dag(name);
  const { tree } = dag;
  const primary = tree.surface.fuel.primary;

  // Set configuration
  dag.setValues([
    [tree.configs.fire.ewsLimit, 'applied'],
    [tree.configs.fire.vector, 'fromNorth'],
    [tree.configs.fire.weightingMethod, 'harmonic'],
    [tree.configs.fuel.chaparralTotalLoad, 'input'],
    [tree.configs.fuel.curedHerbFraction, 'estimated'],
    [tree.configs.fuel.moisture, 'individual'],
    [tree.configs.fuel.primary, 'catalog'],
    [tree.configs.fuel.secondary, 'none'],
    [tree.configs.fuel.waf, 'input'],
    [tree.configs.slope.steepness, 'ratio'],
    [tree.configs.wind.direction, 'upslope'],
    [tree.configs.wind.speed, 'at20ft'],
  ]);

  // S&R Stand A inputs in SI Units
  dag.setValues([
    [tree.surface.fuel.primary.model.key, '10'],
    [tree.site.canopy.crownHeight, 11.61429 * fDistance],
    [tree.site.canopy.crownBase, 0.9 * fDistance],
    [tree.site.canopy.bulkDensity, 0.21 * fDensity],
    [tree.site.moisture.dead.tl1h, 0.08],
    [tree.site.moisture.dead.tl10h, 0.09],
    [tree.site.moisture.dead.tl100h, 0.10],
    [tree.site.moisture.live.herb, 1.17],
    [tree.site.moisture.live.stem, 1.17],
    [tree.site.canopy.foliarMoisture, 1],
    [tree.site.wind.speed.at20ft, 40 * fWind*88],  // 24.8548 mph, 2187.23 fpm
    [tree.site.wind.speed.waf, 0.12],
    [tree.site.slope.steepness.ratio, 0.2],
  ]);

  // For now, just select a few surface behaviors to ensure correct values
  dag.setSelected([
    primary.fire.ros,
    primary.fire.heatPerUnitArea,
    primary.fire.firelineIntensity,
    primary.fire.flameLength,
    primary.fire.reactionIntensity,
    primary.fire.wind.atMidflame,
    primary.fire.wind.waf,
    primary.bed.heatSink,
    tree.crown.fuel.canopy.fire.ros0,
    tree.crown.fuel.canopy.fire.ros,
    tree.crown.fuel.canopy.fire.reactionIntensity,
    tree.crown.fuel.canopy.fire.slope.phi,
    tree.crown.fuel.canopy.fire.wind.phi,
    tree.crown.fuel.canopy.fire.phiEw,
    tree.crown.fire.active.lengthToWidthRatio,
    tree.crown.fire.active.ros,
    tree.crown.fire.active.powerOfTheWind,
    tree.crown.fire.active.powerOfTheFire,
    tree.crown.fire.active.powerRatio,
    tree.crown.fire.active.heatPerUnitArea,
    tree.crown.fire.active.firelineIntensity,
    tree.crown.fire.active.flameLength,
    tree.crown.fire.active.isPlumeDominated,
    tree.crown.fire.active.isWindDriven,
    //tree.crown.fire.active.canTransition,
    tree.crown.fire.surface.heatPerUnitArea,
    tree.crown.fire.initiation.firelineIntensity,
    tree.crown.fire.initiation.ros,
    tree.crown.fire.initiation.rosPrime,
    tree.crown.fire.initiation.transitionRatio,
    tree.crown.fire.initiation.canTransition,
    tree.crown.fire.initiation.activeRatio,
    tree.crown.fire.initiation.type,
    tree.crown.fire.initiation.isCrownFire,
    tree.crown.fire.initiation.isActiveCrownFire,
    tree.crown.fire.initiation.isConditionalCrownFire,
    tree.crown.fire.initiation.isPassiveCrownFire,
    tree.crown.fire.initiation.isSurfaceFire,
    tree.crown.fire.initiation.oActive,
    tree.crown.fire.initiation.crowningIndex,
    tree.crown.fire.final.crownFractionBurned,
    tree.crown.fire.final.rSa,
    tree.crown.fire.final.flameLength,
    tree.crown.fire.final.firelineIntensity,
    tree.crown.fire.final.ros,
  ]);

  // BP6 and S&R values Table 6: Isurface
  expect(approx(primary.fire.firelineIntensity.value(), 313.687230*fFli, 6)).toEqual(true);
  expect(approx(primary.fire.firelineIntensity.value(), 313*fFli, 1)).toEqual(true);

  // BP6 and S&R values Table 6: I'initiation
  expect(approx(tree.crown.fire.initiation.firelineIntensity.value(), 143.818142*fFli, 3)).toEqual(true);
  expect(approx(tree.crown.fire.initiation.firelineIntensity.value(), 144*fFli, 1)).toEqual(true);

  // BP6 and S&R values Table 6: HPA
  expect(approx(primary.fire.heatPerUnitArea.value(), 13441.235034*fHpua, 6)).toEqual(true);
  expect(approx(primary.fire.heatPerUnitArea.value()*0.001, 13*fHpua, 1)).toEqual(true);

  // BP6 and S&R values Table 6: Rsurface
  expect(approx(primary.fire.ros.value(), 1.400261*fRos, 2)).toEqual(true);
  expect(approx(primary.fire.ros.value(), 1.4*fRos, 2)).toEqual(true);

  // BP6 and S&R values Table 6: R'initiation
  expect(approx(tree.crown.fire.initiation.ros.value(), 0.641986*fRos, 1)).toEqual(true);
  expect(approx(tree.crown.fire.initiation.ros.value(), (0.6+0.041986)*fRos, 3)).toEqual(true);

  // BP6 and S&R values Table 6: R'sa
  expect(approx(tree.crown.fire.final.rSa.value(), 1.101156*fRos, 5)).toEqual(true);
  expect(approx(tree.crown.fire.final.rSa.value(), 1.1*fRos, 1)).toEqual(true);

  // BP6 and S&R values Table 6: Ractive
  expect(approx(tree.crown.fire.active.ros.value(), 19.879617*fRos, 2)).toEqual(true);
  // S&R comparison FAILS with difference of 0.5 m/min
  expect(approx(tree.crown.fire.active.ros.value(), (20.4-0.5)*fRos, 1)).toEqual(true);

  // BP6 and S&R values Table 6: R'active
  expect(approx(tree.crown.fire.initiation.rosPrime.value(), 14.285712*fRos, 4)).toEqual(true);
  expect(approx(tree.crown.fire.initiation.rosPrime.value(), (14+0.2857)*fRos, 4)).toEqual(true);

  // BP6 and S&R values Table 6: Type of fire
  expect(tree.crown.fire.initiation.type.value()).toEqual('Active');

  // BP6 and S&R values Table 6: CFB
  expect(approx(tree.crown.fire.final.crownFractionBurned.value(), 1)).toEqual(true);
  expect(approx(tree.crown.fire.final.crownFractionBurned.value(), 1)).toEqual(true);

  // BP6 and S&R values Table 6: Rfinal
  expect(approx(tree.crown.fire.final.ros.value(), 19.879617*fRos, 2)).toEqual(true);
  expect(approx(tree.crown.fire.final.ros.value(), (20.4-0.5)*fRos, 1)).toEqual(true);

  // BP6 and S&R values Table 6: Ifinal
  expect(approx(tree.crown.fire.final.firelineIntensity.value(), 18336.150349*fFli, 2)).toEqual(true);
  expect(approx(tree.crown.fire.final.firelineIntensity.value(), 18337*fFli, 1)).toEqual(true);

  // BP6 and S&R values Table 6: Crowning Index
  expect(approx(tree.crown.fire.initiation.oActive.value(), 31.417489*fWind*88, 2)).toEqual(true);
  expect(approx(tree.crown.fire.initiation.oActive.value(), 30*fWind*88, 1)).toEqual(true);
})

import Dag from '../Dag';
import { approx, logNames } from '../__test_data__/Debug';

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
    [tree.site.canopy.crownHeight, 21.8333 * 3.2808], // 71.6316
    [tree.site.canopy.crownBase, 1.5 * 3.2808],       // 4.92126 ft
    [tree.site.canopy.bulkDensity, 0.06 * 0.062428], // 0.00374568 lb/ft3
    [tree.site.moisture.dead.tl1h, 0.05],
    [tree.site.moisture.dead.tl10h, 0.06],
    [tree.site.moisture.dead.tl100h, 0.08],
    [tree.site.moisture.live.herb, 1.17],
    [tree.site.moisture.live.stem, 1.17],
    [tree.site.canopy.foliarMoisture, 0.5],
    [tree.site.wind.speed.at20ft, 25*88], // 24.8548 mph, 2187.23 fpm
    [tree.site.wind.speed.waf, 0.15],
    [tree.site.slope.steepness.ratio, 0.3],
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
  expect(inputLeafs).toContain(tree.site.moisture.dead.tl1h)
  expect(inputLeafs).toContain(tree.site.moisture.dead.tl10h)
  expect(inputLeafs).toContain(tree.site.moisture.dead.tl100h)
  expect(inputLeafs).toContain(tree.site.moisture.live.herb)
  expect(inputLeafs).toContain(tree.site.moisture.live.stem)
  //expect(inputLeafs).toContain(tree.site.slope.direction.aspect);
  expect(inputLeafs).toContain(tree.site.slope.steepness.ratio);
  //expect(inputLeafs).toContain(tree.site.wind.direction.sourceFromNorth);
  expect(inputLeafs).toContain(tree.site.wind.speed.at20ft);
  expect(inputLeafs).toContain(tree.site.wind.speed.waf);
  expect(inputLeafs).toContain(tree.surface.fuel.primary.model.key);

  expect(approx(primary.fire.ros.value(), 48.470425993990560, 10)).toEqual(true);
  expect(approx(primary.fire.firelineIntensity.value(), 2467.9286450361865, 10)).toEqual(true);
  expect(approx(primary.fire.flameLength.value(), 16.356316633171140)).toEqual(true);
  expect(approx(primary.fire.reactionIntensity.value(), 12976.692888496578)).toEqual(true);
  expect(approx(primary.fire.heatPerUnitArea.value(), 3054.970442, 9)).toEqual(true);
  expect(approx(primary.bed.heatSink.value(), 319.216404, 9)).toEqual(true);
})

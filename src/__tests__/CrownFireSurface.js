import Dag from '../Dag';
import { approx, logNames } from '../__test_data__/Debug';

/**
 * Note that for the Benchmark124 case,
 * the wind is NOT blowing upslope, so S&R final results are invalid
 */
test('1: Non-crown fire fire per BP6', () => {
  const name = 'benchmark124';
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
    [tree.configs.wind.direction, 'sourceFromNorth'],
    [tree.configs.wind.speed, 'at20ft'],
  ]);

  // Set all possible input values up front
  dag.setValues([
    [tree.site.canopy.bulkDensity, 0.005,], // changed from 0.02
    [tree.site.canopy.crownBase, 10],
    [tree.site.canopy.crownHeight, 90],     // changed from 100
    [tree.site.canopy.foliarMoisture, 0.7], // changed from 0.5
    [tree.site.fire.airTemp, 95],
    [tree.site.fire.sinceIgnition, 60],
    [tree.site.fire.vector.fromNorth, 45],
    [tree.site.map.scale, 12000],
    [tree.site.moisture.dead.tl1h, 0.05],
    [tree.site.moisture.dead.tl10h, 0.07],
    [tree.site.moisture.dead.tl100h, 0.09],
    [tree.site.moisture.live.herb, 1.5],    // changed from 0.5
    [tree.site.moisture.live.stem, 1.5],
    [tree.site.slope.direction.aspect, 180],
    [tree.site.slope.steepness.ratio, 0.25],
    [tree.site.wind.direction.sourceFromNorth, 270],
    [tree.site.wind.speed.at20ft, 25*88],
    [tree.site.wind.speed.waf, 0.4],
    [tree.surface.fuel.primary.model.key, '124'],
  ]);

  // For now, just select a few surface behaviors to ensure correct values
  dag.setSelected([
    primary.fire.ros,
    primary.fire.heatPerUnitArea,
    primary.fire.flameLength,
    primary.fire.firelineIntensity,
    primary.fire.reactionIntensity,
    primary.bed.heatSink,
  ]);

  // Just 6 inputs because waf, slope, and fuel model are fixed
  let inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(11);
  expect(inputLeafs).toContain(tree.site.moisture.dead.tl1h)
  expect(inputLeafs).toContain(tree.site.moisture.dead.tl10h)
  expect(inputLeafs).toContain(tree.site.moisture.dead.tl100h)
  expect(inputLeafs).toContain(tree.site.moisture.live.herb)
  expect(inputLeafs).toContain(tree.site.moisture.live.stem)
  expect(inputLeafs).toContain(tree.site.slope.direction.aspect);
  expect(inputLeafs).toContain(tree.site.slope.steepness.ratio);
  expect(inputLeafs).toContain(tree.site.wind.direction.sourceFromNorth);
  expect(inputLeafs).toContain(tree.site.wind.speed.at20ft);
  expect(inputLeafs).toContain(tree.site.wind.speed.waf);
  expect(inputLeafs).toContain(tree.surface.fuel.primary.model.key);

  expect(approx(primary.fire.ros.value(), 8.574903, 6)).toEqual(true);
  expect(approx(primary.fire.firelineIntensity.value(), 102.375854, 6)).toEqual(true);
  expect(approx(primary.fire.flameLength.value(), 3.783584, 6)).toEqual(true);
  expect(approx(primary.fire.reactionIntensity.value(), 3042.822367, 6)).toEqual(true);
  expect(approx(primary.fire.heatPerUnitArea.value(), 716.340633, 9)).toEqual(true);
  expect(approx(primary.bed.heatSink.value(), 423.102321, 6)).toEqual(true);

  // Now request the Rothermel crown fire results
  dag.setSelected([
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
  ]);

  inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(14);
  expect(inputLeafs).toContain(tree.site.canopy.bulkDensity);
  expect(inputLeafs).toContain(tree.site.canopy.crownBase);
  expect(inputLeafs).toContain(tree.site.canopy.crownHeight);

  expect(approx(tree.crown.fuel.canopy.fire.ros0.value(), 0.67900860922904482)).toEqual(true);
  expect(approx(tree.crown.fuel.canopy.fire.slope.phi.value(), 0)).toEqual(true);
  expect(approx(tree.crown.fuel.canopy.fire.wind.phi.value(), 26.298112107312534)).toEqual(true);
  expect(approx(tree.crown.fuel.canopy.fire.phiEw.value(), 26.298112107312534)).toEqual(true);
  expect(approx(tree.crown.fuel.canopy.fire.ros.value(), 18.535653136564)).toEqual(true);
  expect(approx(tree.crown.fuel.canopy.fire.reactionIntensity.value(), 5794.6954002291168)).toEqual(true);

  expect(approx(tree.site.canopy.bulkDensity.value(), 0.005)).toEqual(true);
  expect(approx(tree.site.canopy.fuelLoad.value(), 0.4)).toEqual(true);
  expect(approx(tree.site.canopy.heatPerUnitArea.value(), 3200)).toEqual(true);
  expect(approx(tree.crown.fire.surface.heatPerUnitArea.value(), 716.340633, 9)).toEqual(true);
  expect(approx(tree.crown.fire.active.heatPerUnitArea.value(), 3916.340633, 9)).toEqual(true);

  expect(approx(tree.crown.fire.active.lengthToWidthRatio.value(), 4.125)).toEqual(true);
  expect(approx(tree.crown.fire.active.ros.value(), 61.909081476126)).toEqual(true);
  expect(approx(tree.crown.fire.active.powerOfTheWind.value(), 47.96568165233)).toEqual(true);
  expect(approx(tree.crown.fire.active.powerOfTheFire.value(), 31.3252004271, 9)).toEqual(true);
  expect(approx(tree.crown.fire.active.powerRatio.value(), 0.653075, 6)).toEqual(true);
  expect(approx(tree.crown.fire.active.firelineIntensity.value(), 4040.950855, 9)).toEqual(true);
  expect(approx(tree.crown.fire.active.flameLength.value(), 50.740223, 7)).toEqual(true);
  expect(tree.crown.fire.active.isPlumeDominated.value()).toEqual(false);
  expect(tree.crown.fire.active.isWindDriven.value()).toEqual(true);

  // Now request crown fire initiation
  dag.setSelected([
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
  ]);

  inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(15);
  expect(inputLeafs).toContain(tree.site.canopy.foliarMoisture);

  expect(approx(tree.crown.fire.initiation.firelineIntensity.value(), 166.466274, 9)).toEqual(true);
  expect(approx(tree.crown.fire.initiation.ros.value(), 13.943054, 7)).toEqual(true);
  expect(approx(tree.crown.fire.initiation.rosPrime.value(), 122.88966339231122)).toEqual(true);
  expect(approx(tree.crown.fire.initiation.transitionRatio.value(), 0.614995, 6)).toEqual(true);
  expect(approx(tree.crown.fire.initiation.activeRatio.value(), 0.5037777772935131)).toEqual(true);
  expect(tree.crown.fire.initiation.canTransition.value()).toEqual(false);
  expect(tree.crown.fire.initiation.type.value()).toEqual('Surface');
  expect(tree.crown.fire.initiation.isActiveCrownFire.value()).toEqual(false);
  expect(tree.crown.fire.initiation.isConditionalCrownFire.value()).toEqual(false);
  expect(tree.crown.fire.initiation.isPassiveCrownFire.value()).toEqual(false);
  expect(tree.crown.fire.initiation.isSurfaceFire.value()).toEqual(true);
  expect(approx(tree.crown.fire.initiation.oActive.value(), 3599.1528163069893)).toEqual(true);
  //expect(approx(tree.crown.fire.initiation.crowningIndex.value(),)).toEqual(true);

  dag.setSelected([
    tree.crown.fire.final.crownFractionBurned,
    tree.crown.fire.final.rSa,
    tree.crown.fire.final.flameLength,
    tree.crown.fire.final.firelineIntensity,
    tree.crown.fire.final.ros,
  ]);

  inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(15);

  expect(approx(tree.crown.fire.final.rSa.value(), 16.93053675249959)).toEqual(true);
  expect(approx(tree.crown.fire.final.crownFractionBurned.value(), 0)).toEqual(true);
  expect(approx(tree.crown.fire.final.ros.value(), 8.574903, 6)).toEqual(true);
  expect(approx(tree.crown.fire.final.firelineIntensity.value(), 102.375854, 9)).toEqual(true);
  // NOTE that if this is a SURFACE fire,
  // this flame length != the surface fire flame length
  expect(approx(primary.fire.flameLength.value(), 3.783584, 6)).toEqual(true);
  expect(approx(tree.crown.fire.final.flameLength.value(), 4.3768502, 6)).toEqual(true);
})

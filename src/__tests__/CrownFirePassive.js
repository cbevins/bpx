import Dag from '../Dag';
import { approx, logNames } from '../__test_data__/Debug';

/**
 * Note that for the Benchmark124 case,
 * the wind is NOT blowing upslope, so S&R final results are invalid
 */
test('1: Passive crown fire per BP6', () => {
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
  // ONLY THE CANOPY FACTORS ARE CHANGED!!
  dag.setValues([
    [tree.site.canopy.bulkDensity, 0.005,], // changed from 0.02
    [tree.site.canopy.crownBase, 10],
    [tree.site.canopy.crownHeight, 100],
    [tree.site.canopy.foliarMoisture, 0.5],
    [tree.site.temperature.air, 95],
    [tree.site.fire.time.sinceIgnition, 60],
    [tree.site.fire.vector.fromNorth, 45],
    [tree.site.map.scale, 12000],
    [tree.site.moisture.dead.tl1h, 0.05],
    [tree.site.moisture.dead.tl10h, 0.07],
    [tree.site.moisture.dead.tl100h, 0.09],
    [tree.site.moisture.live.herb, 0.5],
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

  expect(approx(primary.fire.ros.value(), 48.470425993990560, 10)).toEqual(true);
  expect(approx(primary.fire.firelineIntensity.value(), 2467.9286450361865, 10)).toEqual(true);
  expect(approx(primary.fire.flameLength.value(), 16.356316633171140)).toEqual(true);
  expect(approx(primary.fire.reactionIntensity.value(), 12976.692888496578)).toEqual(true);
  expect(approx(primary.fire.heatPerUnitArea.value(), 3054.970442, 9)).toEqual(true);
  expect(approx(primary.bed.heatSink.value(), 319.216404, 9)).toEqual(true);

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
  expect(approx(tree.site.canopy.fuelLoad.value(), 0.45)).toEqual(true);
  expect(approx(tree.site.canopy.heatPerUnitArea.value(), 3600)).toEqual(true);
  expect(approx(tree.crown.fire.surface.heatPerUnitArea.value(), 3054.970441574617)).toEqual(true);
  expect(approx(tree.crown.fire.active.heatPerUnitArea.value(), 6654.970441574616)).toEqual(true);

  expect(approx(tree.crown.fire.active.lengthToWidthRatio.value(), 4.125)).toEqual(true);
  expect(approx(tree.crown.fire.active.ros.value(), 61.909081476126)).toEqual(true);
  expect(approx(tree.crown.fire.active.powerOfTheWind.value(), 47.96568165233)).toEqual(true);
  expect(approx(tree.crown.fire.active.powerOfTheFire.value(), 53.23037561868951)).toEqual(true);
  expect(approx(tree.crown.fire.active.powerRatio.value(), 1.1097595986338438)).toEqual(true);
  expect(approx(tree.crown.fire.active.firelineIntensity.value(), 6866.718454810946)).toEqual(true);
  expect(approx(tree.crown.fire.active.flameLength.value(), 72.25415444164292)).toEqual(true);
  expect(tree.crown.fire.active.isPlumeDominated.value()).toEqual(true);
  expect(tree.crown.fire.active.isWindDriven.value()).toEqual(false);

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

  expect(approx(tree.crown.fire.initiation.firelineIntensity.value(), 112.938700503)).toEqual(true);
  expect(approx(tree.crown.fire.initiation.ros.value(), 2.21813014553, 11)).toEqual(true);
  expect(approx(tree.crown.fire.initiation.rosPrime.value(), 122.88966339231122)).toEqual(true);
  expect(approx(tree.crown.fire.initiation.transitionRatio.value(), 21.851930596532, 11)).toEqual(true);
  expect(approx(tree.crown.fire.initiation.activeRatio.value(), 0.5037777772935131)).toEqual(true);
  expect(tree.crown.fire.initiation.canTransition.value()).toEqual(true);
  expect(tree.crown.fire.initiation.type.value()).toEqual('Passive');
  expect(tree.crown.fire.initiation.isActiveCrownFire.value()).toEqual(false);
  expect(tree.crown.fire.initiation.isConditionalCrownFire.value()).toEqual(false);
  expect(tree.crown.fire.initiation.isPassiveCrownFire.value()).toEqual(true);
  expect(tree.crown.fire.initiation.isSurfaceFire.value()).toEqual(false);
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

  expect(approx(tree.crown.fire.final.rSa.value(), 95.70141510896958)).toEqual(true);
  expect(approx(tree.crown.fire.final.crownFractionBurned.value(), 0.4947654103826835)).toEqual(true);
  expect(approx(tree.crown.fire.final.ros.value(), 55.119407888803835)).toEqual(true);
  expect(approx(tree.crown.fire.final.firelineIntensity.value(), 4442.739952139114)).toEqual(true);
  expect(approx(tree.crown.fire.final.flameLength.value(), 54.05019409941576)).toEqual(true);

  // Finally, verify distances and sizes
  dag.setSelected([
    tree.crown.fire.active.size.length,
    tree.crown.fire.active.size.width,
    tree.crown.fire.active.size.perimeter,
    tree.crown.fire.active.size.area,
    tree.crown.fire.active.map.length,
    tree.crown.fire.active.map.width,
    tree.crown.fire.active.map.perimeter,
    tree.crown.fire.active.map.area,
    tree.crown.fire.final.size.length,
    tree.crown.fire.final.size.width,
    tree.crown.fire.final.size.perimeter,
    tree.crown.fire.final.size.area,
    tree.crown.fire.final.map.length,
    tree.crown.fire.final.map.width,
    tree.crown.fire.final.map.perimeter,
    tree.crown.fire.final.map.area,
  ]);

  inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(17);
  expect(inputLeafs).toContain(tree.site.fire.time.sinceIgnition);
  expect(inputLeafs).toContain(tree.site.map.scale);

  expect(approx(tree.crown.fire.active.size.length.value(), 3714.544888567592)).toEqual(true);
  expect(approx(tree.crown.fire.active.size.width.value(), 900.495730561840)).toEqual(true);
  expect(approx(tree.crown.fire.active.size.perimeter.value(), 7249.28885253776)).toEqual(true);
  expect(approx(tree.crown.fire.active.size.area.value(), 2627103.302726261)).toEqual(true);
  expect(approx(tree.crown.fire.active.map.length.value(), 3714.544888567592/12000)).toEqual(true);
  expect(approx(tree.crown.fire.active.map.width.value(), 900.495730561840/12000)).toEqual(true);
  expect(approx(tree.crown.fire.active.map.perimeter.value(), 7249.28885253776/12000)).toEqual(true);
  expect(approx(tree.crown.fire.active.map.area.value(), 2627103.302726261/12000/12000)).toEqual(true);

  expect(approx(tree.crown.fire.final.size.length.value(), 3307.16447332823)).toEqual(true);
  expect(approx(tree.crown.fire.final.size.width.value(), 801.73684201896449)).toEqual(true);
  expect(approx(tree.crown.fire.final.size.perimeter.value(), 6454.247093310093)).toEqual(true);
  expect(approx(tree.crown.fire.final.size.area.value(), 2082464.0672270376)).toEqual(true);
  expect(approx(tree.crown.fire.final.map.length.value(), 3307.16447332823/12000)).toEqual(true);
  expect(approx(tree.crown.fire.final.map.width.value(), 801.73684201896449/12000)).toEqual(true);
  expect(approx(tree.crown.fire.final.map.perimeter.value(), 6454.247093310093/12000)).toEqual(true);
  expect(approx(tree.crown.fire.final.map.area.value(), 2082464.0672270376/12000/12000)).toEqual(true);
})

import Dag from '../Dag';
import { approx, logNames } from '../__test_data__/Debug';

test('1: Batch standard fuel test', () => {
  const name = 'batch';
  const dag = new Dag(name);
  const { tree } = dag;
  const primary = tree.surface.fuel.primary;

  // Set configuration
  dag.setValues([
    [tree.configs.fire.ewsLimit, 'applied'],
    [tree.configs.fire.vector, 'fromNorth'],
    [tree.configs.fire.weightingMethod, 'harmonic'],
    [tree.configs.fuel.chaparralTotalLoad, 'input'],
    [tree.configs.fuel.curedHerbFraction, 'input'],
    [tree.configs.fuel.moisture, 'individual'],
    [tree.configs.fuel.primary, 'catalog'],
    [tree.configs.fuel.secondary, 'none'],
    [tree.configs.fuel.waf, 'input'],
    [tree.configs.slope.steepness, 'ratio'],
    [tree.configs.wind.direction, 'headingFromUpslope'],
    [tree.configs.wind.speed, 'at20ft'],
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

  let inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(11);
  expect(inputLeafs).toContain(tree.surface.fuel.primary.model.key);
  expect(inputLeafs).toContain(tree.surface.fuel.primary.model.behave.parms.curedHerbFraction);
  expect(inputLeafs).toContain(tree.site.moisture.dead.tl1h)
  expect(inputLeafs).toContain(tree.site.moisture.dead.tl10h)
  expect(inputLeafs).toContain(tree.site.moisture.dead.tl100h)
  expect(inputLeafs).toContain(tree.site.moisture.live.herb)
  expect(inputLeafs).toContain(tree.site.moisture.live.stem)
  expect(inputLeafs).toContain(tree.site.wind.direction.headingFromUpslope);
  expect(inputLeafs).toContain(tree.site.slope.steepness.ratio);
  expect(inputLeafs).toContain(tree.site.wind.speed.at20ft);
  expect(inputLeafs).toContain(tree.site.wind.speed.waf);

  // Set all possible input values up front
  dag.setValues([
    [tree.site.moisture.dead.tl1h, 0.05],
    [tree.site.moisture.dead.tl10h, 0.07],
    [tree.site.moisture.dead.tl100h, 0.09],
    [tree.site.moisture.live.herb, 0.5],
    [tree.site.moisture.live.stem, 1.5],
    [tree.site.slope.steepness.ratio, 0.25],
    [tree.site.wind.direction.headingFromUpslope, 90],
    [tree.site.wind.speed.at20ft, 25*88],
    [tree.site.wind.speed.waf, 0.4],
    [tree.surface.fuel.primary.model.key, '10'],
    [tree.surface.fuel.primary.model.behave.parms.curedHerbFraction, 0],
  ]);

  dag.setBatchInputs([
    [tree.site.moisture.dead.tl1h, [0.03, 0.05, 0.07]],
  ]);

  dag.updateBatch();

  // expect(approx(primary.fire.ros.value(), 48.470425993990560, 10)).toEqual(true);
  // expect(approx(primary.fire.firelineIntensity.value(), 2467.9286450361865, 10)).toEqual(true);
  // expect(approx(primary.fire.flameLength.value(), 16.356316633171140)).toEqual(true);
  // expect(approx(primary.fire.reactionIntensity.value(), 12976.692888496578)).toEqual(true);
  // expect(approx(primary.fire.heatPerUnitArea.value(), 3054.970442, 9)).toEqual(true);
  // expect(approx(primary.bed.heatSink.value(), 319.216404, 9)).toEqual(true);
})
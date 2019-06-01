import Dag from '../Dag';
import { approx, logNames } from '../__test_data__/Debug';

test('1: Establish Crown Fire Canopy Fuel (FM 10) benchmarks', () => {
  const name = 'dumpCostsNOT';
  const dag = new Dag(name);
  const { tree } = dag;
  const { moisture, slope, wind } = tree.site;
  const { model, fire } = tree.surface.fuel.primary;
  const cfgPrimary = tree.configs.fuel.primary;
  const cfgDir = tree.configs.wind.direction;
  const cfgSpeed = tree.configs.wind.speed;
  const cfgWaf = tree.configs.fuel.waf;

  dag.setSelected([
    fire.slope.phi,
    fire.wind.phi,
    fire.phiEw,
    fire.ros0,
    fire.ros,
    fire.reactionIntensity
  ]);

  let windDir = 'upslope';

  dag.setValues([
    [cfgDir, windDir],
    [cfgPrimary, 'catalog'],
    [cfgSpeed, 'at20ft'],
    [cfgWaf, 'input'],
  ]);

  let inputLeafs = dag.getRequiredInputLeafs();
  //logNames(inputLeafs);
  expect(inputLeafs).toContain(model.key);
  expect(inputLeafs).toContain(model.behave.parms.curedHerbFraction);
  expect(inputLeafs).toContain(moisture.dead.tl1h)
  expect(inputLeafs).toContain(moisture.dead.tl10h)
  expect(inputLeafs).toContain(moisture.dead.tl100h)
  expect(inputLeafs).toContain(moisture.live.herb)
  expect(inputLeafs).toContain(moisture.live.stem)
  expect(inputLeafs).toContain(slope.steepness.ratio);
  expect(inputLeafs).toContain(wind.speed.at20ft);
  expect(inputLeafs).toContain(wind.speed.waf);

  dag.setValues([
    [model.key, '10'],
    [model.behave.parms.curedHerbFraction, 0],
    [moisture.dead.tl1h, 0.05],
    [moisture.dead.tl10h, 0.07],
    [moisture.dead.tl100h, 0.09],
    [moisture.live.herb, 0.5],
    [moisture.live.stem, 1.5],
    [wind.speed.at20ft, 25 * 88],
    [wind.speed.waf, 0.4],
  ]);

  if (windDir == 'upslope') {
    expect(inputLeafs.length).toEqual(10);
  } else if (windDir == 'headingFromUpslope') {
    expect(inputLeafs.length).toEqual(11);
    expect(inputLeafs).toContain(wind.direction.headingFromUpslope);
    dag.setValue(wind.direction.headingFromUpslope, 0);
  } else if (windDir == 'sourceFromNorth') {
    expect(inputLeafs.length).toEqual(12);
    expect(inputLeafs).toContain(wind.direction.sourceFromNorth);
    expect(inputLeafs).toContain(slope.direction.aspect);
    dag.setValues([
      [wind.direction.sourceFromNorth, 180],
      [slope.direction.aspect, 180],
    ]);
  }

  expect(approx(fire.ros0.value(), 0.67900860922904482)).toEqual(true);
  expect(approx(fire.slope.phi.value(), 0)).toEqual(true);
  expect(approx(fire.wind.phi.value(), 26.298112107312534)).toEqual(true);
  expect(approx(fire.phiEw.value(), 26.298112107312534)).toEqual(true);
  let ros = 1 + 0.67900860922904482 * 26.298112107312534;
  expect(approx(fire.ros.value(), 18.535653136564)).toEqual(true);
  expect(approx(fire.reactionIntensity.value(), 5794.6954002291168)).toEqual(true);
})

test('2: Rothermel active crown fire', () => {
  const name = 'rothermel';
  const dag = new Dag(name);
  const { tree } = dag;
  const { crown, site } = tree;
  const { canopy, moisture, slope, wind } = site;
  const { model } = tree.surface.fuel.primary;
  const { fire, fuel } = crown;
  const fm10 = fuel.canopy.fire;

  // These require the minimum set of inputs
  dag.setSelected([
    fm10.ros0, fm10.ros, fm10.slope.phi, fm10.wind.phi, fm10.phiEw,
    fire.active.lengthToWidthRatio,
    fire.active.ros,
    fire.active.powerOfTheWind,
  ]);

  // Just 6 inputs because waf, slope, and fuel model are fixed
  let inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(6);
  expect(inputLeafs).toContain(moisture.dead.tl1h)
  expect(inputLeafs).toContain(moisture.dead.tl10h)
  expect(inputLeafs).toContain(moisture.dead.tl100h)
  expect(inputLeafs).toContain(moisture.live.herb)
  expect(inputLeafs).toContain(moisture.live.stem)
  expect(inputLeafs).toContain(wind.speed.at20ft);

  dag.setValues([
    [moisture.dead.tl1h, 0.05],
    [moisture.dead.tl10h, 0.07],
    [moisture.dead.tl100h, 0.09],
    [moisture.live.herb, 0.5],
    [moisture.live.stem, 1.5],
    [wind.speed.at20ft, 25 * 88],
  ])

  expect(approx(fm10.ros0.value(), 0.67900860922904482)).toEqual(true);
  expect(approx(fm10.slope.phi.value(), 0)).toEqual(true);
  expect(approx(fm10.wind.phi.value(), 26.298112107312534)).toEqual(true);
  expect(approx(fm10.phiEw.value(), 26.298112107312534)).toEqual(true);
  expect(approx(fm10.ros.value(), 18.535653136564)).toEqual(true);
  expect(approx(fire.active.lengthToWidthRatio.value(), 4.125)).toEqual(true);
  expect(approx(fire.active.ros.value(), 3.34 * 18.535653136564832)).toEqual(true);
  expect(approx(fire.active.ros.value(), 61.909081476126)).toEqual(true);
  expect(approx(fire.active.powerOfTheWind.value(), 47.96568165233)).toEqual(true);

  // By requesting power of the wind (or crown fire intensity),
  // we need a surface fire
  dag.setSelected([
    fire.surface.heatPerUnitArea,
    // fire.surface.firelineIntensity,
    // fire.surface.flameLength,
    fire.active.heatPerUnitArea,
    fire.active.firelineIntensity,
    fire.active.flameLength,
    fire.active.powerOfTheFire,
    fire.active.powerRatio,
    fire.active.isPlumeDominated,
    fire.active.isWindDriven,
  ]);

  inputLeafs = dag.getRequiredInputLeafs();
  logNames(inputLeafs);
  expect(inputLeafs.length).toEqual(11);
  expect(inputLeafs).toContain(model.key);
  expect(inputLeafs).toContain(model.behave.parms.curedHerbFraction);
  expect(inputLeafs).toContain(canopy.crownBase);
  expect(inputLeafs).toContain(canopy.crownHeight);
  expect(inputLeafs).toContain(canopy.bulkDensity);

  dag.setValues([
    [model.key, '124'],
    [model.behave.parms.curedHerbFraction, 0.778],
    [canopy.crownBase, 10],
    [canopy.crownHeight, 100],
    [canopy.bulkDensity, 0.02],
  ]);

  expect(approx(fire.surface.heatPerUnitArea.value(), 12976.692888496578 * 0.23541979977677915)).toEqual(true);
  expect(approx(fire.active.heatPerUnitArea.value(), 17454.97044157461)).toEqual(true);
  expect(approx(fire.active.firelineIntensity.value(), 18010.35312051372)).toEqual(true);
  expect(approx(fire.active.flameLength.value(), 137.418376789506)).toEqual(true);
  expect(approx(fire.active.powerOfTheFire.value(), 139.615140469098)).toEqual(true);
  expect(approx(fire.active.powerRatio.value(), 2.9107298314046)).toEqual(true);
  expect(fire.active.isPlumeDominated.value()).toEqual(true);
  expect(fire.active.isWindDriven.value()).toEqual(false);
})

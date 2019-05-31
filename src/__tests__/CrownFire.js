import Dag from '../Dag';
import { approx, logNames } from '../__test_data__/Debug';

test('1: Establish FM 10 benchmarks', () => {
  const name = 'dumpCostsNOT';
  const dag = new Dag(name);
  const { tree } = dag;
  const { canopy, moisture, slope, wind } = tree.site;
  const { at10m, at20ft, atMidflame, waf } = wind.speed;
  const { bed, model, fire } = tree.surface.fuel.primary;
  const cfgPrimary = tree.configs.fuel.primary;
  const cfgDir = tree.configs.wind.direction;
  const cfgSpeed = tree.configs.wind.speed;
  const cfgWaf = tree.configs.fuel.waf;

  dag.setSelected([
    fire.slope.phi,
    fire.wind.phi,
    fire.phiEw,
    fire.ros0,
    fire.ros]);

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
    [moisture.live.herb, 1.5],
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
})

test('2: Rothermel crown fire', () => {
  const name = 'rothermel';
  const dag = new Dag(name);
  const { tree } = dag;
  const { canopy, moisture, slope, wind } = tree.site;

  const { rActive } = tree.crown.fire;
  const fm10 = tree.crown.fuel.canopy.fire;

  dag.setSelected([
    fm10.ros0, fm10.ros, fm10.slope.phi, fm10.wind.phi, fm10.phiEw,
    rActive]);

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
    [moisture.live.herb, 1.5],
    [moisture.live.stem, 1.5],
    [wind.speed.at20ft, 25 * 88],
  ])

  expect(approx(fm10.ros0.value(), 0.67900860922904482)).toEqual(true);
  expect(approx(fm10.slope.phi.value(), 0)).toEqual(true);
  expect(approx(fm10.wind.phi.value(), 26.298112107312534)).toEqual(true);
  expect(approx(fm10.phiEw.value(), 26.298112107312534)).toEqual(true);
  expect(approx(fm10.ros.value(), 18.535653136564)).toEqual(true);
  expect(approx(rActive.value(), 3.34 * 18.535653136564832)).toEqual(true);
  expect(approx(rActive.value(), 61.909081476126)).toEqual(true);
})

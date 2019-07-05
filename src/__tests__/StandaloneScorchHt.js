import Dag from '../Dag';
import { approx, logNames } from '../__test_data__/Debug';
import BpxLibSurfaceFire from '../BpxLibSurfaceFire';

test('1: Stand-alone scorch height', () => {
  const dag = new Dag('scorchHt');
  const { tree } = dag;
  const cfgFli = tree.configs.fire.fli;
  const cfgScorch = tree.configs.fire.scorchHt;
  const cfgWind = tree.configs.wind.speed;
  const { scorchHt, flameLength, firelineIntensity } = tree.site.fire;
  const midflameWindSpeed = tree.site.wind.speed.atMidflame;

  dag.setValue(cfgScorch, 'estimated');
  dag.setValue(cfgFli, 'flameLength');
  dag.setValue(cfgWind, 'atMidflame');

  dag.setSelected([scorchHt]);

  let inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(3);
  expect(inputLeafs).toContain(tree.site.temperature.air);
  expect(inputLeafs).toContain(midflameWindSpeed);
  expect(inputLeafs).toContain(flameLength);

  dag.setValues([
    [flameLength, 1],
    [midflameWindSpeed, 10*88],
    [tree.site.temperature.air, 95],
  ]);
  let sht = BpxLibSurfaceFire.scorchHtFromFlame(1, 880, 95);
  expect(approx(scorchHt.value(), sht)).toEqual(true);

  const flameLengthValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const windSpeedValues = [0, 5*88, 10*88, 15*88, 20*88];
  const airValues = [70, 80, 90, 100];

  dag.setBatchInputs([
    [flameLength, flameLengthValues],
    [midflameWindSpeed, windSpeedValues],
    [tree.site.temperature.air, airValues],
  ]);
  dag.updateBatch();

  // Fetch all 200 results
  for (let idx=0; idx<200; idx+=1) {
    let flame = flameLength.fetch(idx);
    let air = tree.site.temperature.air.fetch(idx);
    let wind = midflameWindSpeed.fetch(idx);
    let sht = BpxLibSurfaceFire.scorchHtFromFlame(flame, wind, air);
    expect(approx(scorchHt.fetch(idx), sht)).toEqual(true);
  }
})
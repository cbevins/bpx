import Dag from '../Dag';
import BpxLibSurfaceFire from '../BpxLibSurfaceFire';
import { BpxTreeStandAloneFireEllipse } from '../BpxTree';

function approx(actual, expected, prec = 12) {
  if (typeof expected === 'number') {
    let result = actual.toPrecision(prec) === expected.toPrecision(prec);
    if ( ! result ) {
      console.log('*** Expected='+expected+' Actual='+actual);
    }
    return result;
  }
  return actual === expected;
}

function logNames(leafArray) {
  leafArray.forEach((leaf)=>{
    console.log(leaf.fullName());
  });
}

test('1: Stand-alone scorch height', () => {
  const dag = new Dag('scorchHt');
  const { tree } = dag;
  const cfgFli = tree.configs.fire.fli;
  const cfgScorch = tree.configs.fire.scorchHt;
  const cfgWind = tree.configs.wind.speed;
  const { scorchHt, airTemp, flameLength, firelineIntensity } = tree.site.fire;
  const midflameWindSpeed = tree.site.wind.speed.atMidflame;

  dag.setValue(cfgScorch, 'estimated');
  dag.setValue(cfgFli, 'flameLength');
  dag.setValue(cfgWind, 'atMidflame');

  dag.setSelected([scorchHt]);

  let inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(3);
  expect(inputLeafs).toContain(airTemp);
  expect(inputLeafs).toContain(midflameWindSpeed);
  expect(inputLeafs).toContain(flameLength);

  dag.setValues([
    [flameLength, 1],
    [midflameWindSpeed, 10*88],
    [airTemp, 95],
  ]);
  let sht = BpxLibSurfaceFire.scorchHtFromFlame(1, 880, 95);
  expect(approx(scorchHt.value(), sht)).toEqual(true);

  const flameLengthValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const windSpeedValues = [0, 5*88, 10*88, 15*88, 20*88];
  const airTempValues = [70, 80, 90, 100];

  dag.setBatchInputs([
    [flameLength, flameLengthValues],
    [midflameWindSpeed, windSpeedValues],
    [airTemp, airTempValues],
  ]);
  dag.updateBatch();

  // Fetch all 200 results
  for (let idx=0; idx<200; idx+=1) {
    let flame = flameLength.fetch(idx);
    let air = airTemp.fetch(idx);
    let wind = midflameWindSpeed.fetch(idx);
    let sht = BpxLibSurfaceFire.scorchHtFromFlame(flame, wind, air);
    expect(approx(scorchHt.fetch(idx), sht)).toEqual(true);
  }
})
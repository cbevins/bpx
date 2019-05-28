import Dag from '../Dag';

function approx(actual, expected, prec = 12) {
  if (typeof expected === 'number') {
    return actual.toPrecision(prec) === expected.toPrecision(prec);
  }
  return actual === expected;
}

test('1: Slope direction and steepness', () => {
  const name = 'worksheet1';
  const dag = new Dag(name);
  const { tree } = dag;
  const { slope, map } = tree.site;
  const { scale, interval, contours, distance } = map;
  const { direction, steepness} = slope;
  const { aspect, upslope } = direction;
  const { degrees, ratio } = steepness;
  const cfgSlp = tree.configs.slope.steepness;

  expect(aspect.value()).toEqual(180);
  expect(upslope.value()).toEqual(0);
  expect(degrees.value()).toEqual(0);
  expect(ratio.value()).toEqual(0);

  // Start with just aspect selected
  dag.setSelected([aspect]);
  let selectedLeafs = dag.getSelectedLeafs();
  expect(selectedLeafs.length).toEqual(1);
  expect(selectedLeafs).toContain(aspect);

  let configLeafs = dag.getRequiredConfigLeafs();
  expect(configLeafs.length).toEqual(0);

  let requiredLeafs = dag.getRequiredLeafs();
  expect(requiredLeafs.length).toEqual(1);
  expect(requiredLeafs).toContain(aspect);

  let inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs).toContain(aspect);

  // Add upslope to selected list
  dag.setSelected([upslope]);
  selectedLeafs = dag.getSelectedLeafs();
  expect(selectedLeafs.length).toEqual(2);
  expect(selectedLeafs).toContain(aspect);
  expect(selectedLeafs).toContain(upslope);

  requiredLeafs = dag.getRequiredLeafs();
  expect(requiredLeafs.length).toEqual(2);
  expect(requiredLeafs).toContain(aspect);
  expect(requiredLeafs).toContain(upslope);

  inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(1);
  expect(inputLeafs).toContain(aspect);
  dag.setValues([[aspect, 45]]);
  expect(upslope.value()).toEqual(225);
  // inputLeafs.forEach((leaf) => {
  //   console.log('1.2: '+leaf.name());
  // });

  // Add ratio to selected list
  dag.setSelected([ratio]);
  selectedLeafs = dag.getSelectedLeafs();
  expect(selectedLeafs.length).toEqual(3);
  expect(selectedLeafs).toContain(aspect);
  expect(selectedLeafs).toContain(upslope);
  expect(selectedLeafs).toContain(ratio);

  requiredLeafs = dag.getRequiredLeafs();
  expect(requiredLeafs.length).toEqual(4);
  expect(requiredLeafs).toContain(aspect);
  expect(requiredLeafs).toContain(upslope);
  expect(requiredLeafs).toContain(ratio);
  expect(requiredLeafs).toContain(cfgSlp);

  configLeafs = dag.getRequiredConfigLeafs();
  expect(configLeafs.length).toEqual(1);
  expect(configLeafs).toContain(cfgSlp);
  expect(cfgSlp.value()).toEqual('ratio');

  inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(2);
  expect(inputLeafs).toContain(aspect);
  expect(inputLeafs).toContain(ratio);
  dag.setValues([
    [aspect, 90],
    [ratio, 1.0],
  ]);
  expect(aspect.value()).toEqual(90);
  expect(upslope.value()).toEqual(270);
  expect(ratio.value()).toEqual(1);

  // Add degrees to selected list
  dag.setSelected([degrees]);
  selectedLeafs = dag.getSelectedLeafs();
  expect(selectedLeafs.length).toEqual(4);
  expect(selectedLeafs).toContain(aspect);
  expect(selectedLeafs).toContain(upslope);
  expect(selectedLeafs).toContain(ratio);
  expect(selectedLeafs).toContain(degrees);

  requiredLeafs = dag.getRequiredLeafs();
  expect(requiredLeafs.length).toEqual(5);
  expect(requiredLeafs).toContain(aspect);
  expect(requiredLeafs).toContain(upslope);
  expect(requiredLeafs).toContain(ratio);
  expect(requiredLeafs).toContain(cfgSlp);
  expect(requiredLeafs).toContain(degrees);

  configLeafs = dag.getRequiredConfigLeafs();
  expect(configLeafs.length).toEqual(1);
  expect(configLeafs).toContain(cfgSlp);
  expect(cfgSlp.value()).toEqual('ratio');

  inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(2);
  expect(inputLeafs).toContain(aspect);
  expect(inputLeafs).toContain(ratio);
  dag.setValues([
    [aspect, -90],
    [ratio, 1.0],
  ]);
  expect(aspect.value()).toEqual(-90);
  expect(upslope.value()).toEqual(90);
  expect(ratio.value()).toEqual(1);
  expect(degrees.value()).toEqual(45);

  // Configure for degrees input
  selectedLeafs = dag.getSelectedLeafs();
  expect(selectedLeafs.length).toEqual(4);
  expect(selectedLeafs).toContain(aspect);
  expect(selectedLeafs).toContain(upslope);
  expect(selectedLeafs).toContain(ratio);
  expect(selectedLeafs).toContain(degrees);

  dag.setValue(cfgSlp, 'degrees');
  expect(cfgSlp.value()).toEqual('degrees');
  inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(2);
  expect(inputLeafs).toContain(aspect);
  expect(inputLeafs).toContain(degrees);
  dag.setValues([
    [aspect, 270],
    [degrees, 45],
  ]);
  expect(aspect.value()).toEqual(270);
  expect(upslope.value()).toEqual(90);
  expect(degrees.value()).toEqual(45);
  expect(approx(ratio.value(),1)).toEqual(true);

  // Configure for map input
  dag.setValue(cfgSlp, 'map');
  expect(cfgSlp.value()).toEqual('map');
  inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(5);
  expect(inputLeafs).toContain(aspect);
  expect(inputLeafs).toContain(scale);
  expect(inputLeafs).toContain(interval);
  expect(inputLeafs).toContain(contours);
  expect(inputLeafs).toContain(distance);
  dag.setValues([
    [aspect, 270],
    [scale, 24000],
    [interval, 20],
    [contours, 5],
    [distance, 1/12],
  ]);
  expect(aspect.value()).toEqual(270);
  expect(upslope.value()).toEqual(90);
  expect(scale.value()).toEqual(24000);
  expect(interval.value()).toEqual(20);
  expect(contours.value()).toEqual(5);
  expect(distance.value()).toEqual(1/12);
  expect(approx(ratio.value(),0.05)).toEqual(true);
  expect(approx(degrees.value(), 2.862405226, 10)).toEqual(true);
});

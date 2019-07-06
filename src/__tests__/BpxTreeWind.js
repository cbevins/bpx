import Dag from '../Dag';

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
    console.log(leaf.name());
  });
}

test('1: Wind direction', () => {
  const name = 'worksheet1';
  const dag = new Dag(name);
  const { tree } = dag;
  const { slope, wind } = tree.site;
  const { upslope, aspect } = slope.direction;
  const { headingFromUpslope, headingFromNorth } = wind.direction;
  const { sourceFromNorth, sourceFromUpslope } = wind.direction;
  const { at10m, at20ft } = wind.speed;
  const cfgDir = tree.configs.wind.direction;
  const cfgSpd = tree.configs.wind.speed;

  expect(cfgDir.value()).toEqual('headingFromUpslope');
  expect(cfgSpd.value()).toEqual('at20ft');

  expect(headingFromUpslope.value()).toEqual(0);
  expect(headingFromNorth.value()).toEqual(0);
  expect(sourceFromNorth.value()).toEqual(180);
  expect(sourceFromUpslope.value()).toEqual(180);
  expect(at10m.value()).toEqual(0);
  expect(at20ft.value()).toEqual(0);

  let selectedLeafs = dag.getSelectedLeafs();
  expect(selectedLeafs.length).toEqual(0);

  // Start with just at20ft selected
  dag.setSelected([at20ft]);
  selectedLeafs = dag.getSelectedLeafs();
  expect(selectedLeafs.length).toEqual(1);
  expect(selectedLeafs).toContain(at20ft);

  let configLeafs = dag.getRequiredConfigLeafs();
  expect(configLeafs.length).toEqual(1);
  expect(configLeafs).toContain(cfgSpd);

  let requiredLeafs = dag.getRequiredLeafs();
  expect(requiredLeafs.length).toEqual(2);
  expect(requiredLeafs).toContain(at20ft);
  expect(requiredLeafs).toContain(cfgSpd);

  let inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs).toContain(at20ft);

  dag.setValue(at20ft, 12.3);
  expect(at20ft.value()).toEqual(12.3);
  expect(at10m.value()).toEqual(0);

  // Add at10m as selected
  dag.setSelected([at10m])
  expect(at10m.value()).toEqual(12.3 * 1.13);

  selectedLeafs = dag.getSelectedLeafs();
  expect(selectedLeafs.length).toEqual(2);
  expect(selectedLeafs).toContain(at20ft);
  expect(selectedLeafs).toContain(at10m);

  configLeafs = dag.getRequiredConfigLeafs();
  expect(configLeafs.length).toEqual(1);
  expect(configLeafs).toContain(cfgSpd);

  requiredLeafs = dag.getRequiredLeafs();
  expect(requiredLeafs.length).toEqual(3);
  expect(requiredLeafs).toContain(at20ft);
  expect(requiredLeafs).toContain(at10m);
  expect(requiredLeafs).toContain(cfgSpd);

  inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(1);
  expect(inputLeafs).toContain(at20ft);

  dag.setValue(at20ft, 10);
  expect(at20ft.value()).toEqual(10);
  expect(approx(at10m.value(), 11.3)).toEqual(true);
  // at10m is NOT an input, so should have no effect
  dag.setValue(at10m, 1234);
  expect(at20ft.value()).toEqual(10);
  expect(approx(at10m.value(), 11.3)).toEqual(true);

  dag.setValue(cfgSpd, 'at10m');
  inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(1);
  expect(inputLeafs).toContain(at10m);
  // at10m IS now an input, so should have effect
  dag.setValue(at10m, 123);
  expect(at10m.value()).toEqual(123);
  expect(at20ft.value()).toEqual(123/1.13);

  // Add headingFromUpslope as a selected leaf
  dag.setSelected([headingFromUpslope]);
  selectedLeafs = dag.getSelectedLeafs();
  expect(selectedLeafs.length).toEqual(3);
  expect(selectedLeafs).toContain(at20ft);
  expect(selectedLeafs).toContain(at10m);
  expect(selectedLeafs).toContain(headingFromUpslope);

  configLeafs = dag.getRequiredConfigLeafs();
  expect(configLeafs.length).toEqual(2);
  expect(configLeafs).toContain(cfgSpd);
  expect(configLeafs).toContain(cfgDir);

  requiredLeafs = dag.getRequiredLeafs();
  expect(requiredLeafs.length).toEqual(5);
  expect(requiredLeafs).toContain(at20ft);
  expect(requiredLeafs).toContain(at10m);
  expect(requiredLeafs).toContain(headingFromUpslope);
  expect(requiredLeafs).toContain(cfgSpd);
  expect(requiredLeafs).toContain(cfgDir);

  inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(2);
  expect(inputLeafs).toContain(at10m);

  dag.setValues([
    [at10m, 11.3],
    [headingFromUpslope, 45]
  ]);
  expect(at10m.value()).toEqual(11.3);
  expect(approx(at20ft.value(), 10)).toEqual(true);
  expect(headingFromUpslope.value()).toEqual(45);

  // Add sourceFromUpslope as selected
  dag.setSelected([sourceFromUpslope]);
  selectedLeafs = dag.getSelectedLeafs();
  expect(selectedLeafs.length).toEqual(4);
  expect(selectedLeafs).toContain(at20ft);
  expect(selectedLeafs).toContain(at10m);
  expect(selectedLeafs).toContain(headingFromUpslope);
  expect(selectedLeafs).toContain(sourceFromUpslope);

  requiredLeafs = dag.getRequiredLeafs();
  expect(requiredLeafs.length).toEqual(6);
  expect(requiredLeafs).toContain(at20ft);
  expect(requiredLeafs).toContain(at10m);
  expect(requiredLeafs).toContain(headingFromUpslope);
  expect(requiredLeafs).toContain(sourceFromUpslope);
  expect(requiredLeafs).toContain(cfgSpd);
  expect(requiredLeafs).toContain(cfgDir);
  // Still just 2 inputs
  inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(2);
  expect(inputLeafs).toContain(at10m);
  expect(inputLeafs).toContain(headingFromUpslope);

  expect(headingFromUpslope.value()).toEqual(45);
  expect(approx(sourceFromUpslope.value(), 225)).toEqual(true);

  // Change direction config to 'sourceFromNorth'
  dag.setValue(cfgDir, 'sourceFromNorth');
  // Still just 4 selected Leafs
  selectedLeafs = dag.getSelectedLeafs();
  expect(selectedLeafs.length).toEqual(4);
  expect(selectedLeafs).toContain(at20ft);
  expect(selectedLeafs).toContain(at10m);
  expect(selectedLeafs).toContain(headingFromUpslope);
  expect(selectedLeafs).toContain(sourceFromUpslope);
  // But now sourceFromNorth is required (even if not selected)
  // as is the upslope direction
  requiredLeafs = dag.getRequiredLeafs();
  expect(requiredLeafs.length).toEqual(10);
  expect(requiredLeafs).toContain(at20ft);
  expect(requiredLeafs).toContain(at10m);
  expect(requiredLeafs).toContain(headingFromUpslope);
  expect(requiredLeafs).toContain(sourceFromUpslope);
  expect(requiredLeafs).toContain(sourceFromNorth);
  expect(requiredLeafs).toContain(headingFromNorth);
  expect(requiredLeafs).toContain(upslope);
  expect(requiredLeafs).toContain(aspect);
  expect(requiredLeafs).toContain(cfgSpd);
  expect(requiredLeafs).toContain(cfgDir);
  // Now getRequiredInputLeafs 3 inputs
  inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(3);
  expect(inputLeafs).toContain(at10m);
  expect(inputLeafs).toContain(aspect);
  expect(inputLeafs).toContain(sourceFromNorth);
  dag.setValues([
    [aspect, 225],
    [sourceFromNorth, 90],
    [at10m, 30],
  ]);
  expect(aspect.value()).toEqual(225);
  expect(at10m.value()).toEqual(30);
  expect(approx(at20ft.value(), 30/1.13)).toEqual(true);
  expect(approx(upslope.value(), 45)).toEqual(true);
  expect(sourceFromNorth.value()).toEqual(90);
  expect(approx(headingFromNorth.value(), 270)).toEqual(true);
  expect(approx(headingFromUpslope.value(), 225)).toEqual(true);
  expect(approx(sourceFromUpslope.value(), 45)).toEqual(true);

  // Select remaining directions
  dag.setSelected([aspect, sourceFromNorth, headingFromNorth]);

  // Change wind direction config
  dag.setValue(cfgDir, 'headingFromUpslope');
  dag.setValue(headingFromUpslope, 45);

  expect(aspect.value()).toEqual(225);
  expect(upslope.value()).toEqual(45);
  expect(headingFromUpslope.value()).toEqual(45);
  expect(approx(sourceFromUpslope.value(), 225)).toEqual(true);
  expect(approx(headingFromNorth.value(), 90)).toEqual(true);
  expect(approx(sourceFromNorth.value(), 270)).toEqual(true);
})

test('2: Wind directions', () => {
  const name = 'worksheet1';
  const dag = new Dag(name);
  const { tree } = dag;
  const { slope, wind } = tree.site;
  const { upslope, aspect } = slope.direction;
  const { headingFromUpslope, headingFromNorth } = wind.direction;
  const { sourceFromNorth, sourceFromUpslope } = wind.direction;
  const { at10m, at20ft } = wind.speed;
  const cfgDir = tree.configs.wind.direction;
  const cfgSpd = tree.configs.wind.speed;

  const data = [
  // asp,  up, hdgUp, srcUp, hdgNo, srcNo
    [  0, 180,     0,   180,   180,     0],
    [  0, 180,    45,   225,   225,    45],
    [  0, 180,    90,   270,   270,    90],
    [  0, 180,   135,   315,   315,   135],
    [  0, 180,   180,     0,     0,   180],
    [  0, 180,   225,    45,    45,   225],
    [  0, 180,   270,    90,    90,   270],
    [  0, 180,   315,   135,   135,   315],
    [  0, 180,   360,   180,   180,     0],

    [ 45, 225,     0,   180,   225,    45],
    [ 45, 225,    45,   225,   270,    90],
    [ 45, 225,    90,   270,   315,   135],
    [ 45, 225,   135,   315,     0,   180],
    [ 45, 225,   180,     0,    45,   225],
    [ 45, 225,   225,    45,    90,   270],
    [ 45, 225,   270,    90,   135,   315],
    [ 45, 225,   315,   135,   180,     0],
    [ 45, 225,   360,   180,   225,    45],

    [ 90, 270,     0,   180,   270,    90],
    [ 90, 270,    45,   225,   315,   135],
    [ 90, 270,    90,   270,     0,   180],
    [ 90, 270,   135,   315,    45,   225],
    [ 90, 270,   180,     0,    90,   270],
    [ 90, 270,   225,    45,   135,   315],
    [ 90, 270,   270,    90,   180,     0],
    [ 90, 270,   315,   135,   225,    45],
    [ 90, 270,   360,   180,   270,    90],

    [135, 315,     0,   180,   315,   135],
    [135, 315,    45,   225,     0,   180],
    [135, 315,    90,   270,    45,   225],
    [135, 315,   135,   315,    90,   270],
    [135, 315,   180,     0,   135,   315],
    [135, 315,   225,    45,   180,     0],
    [135, 315,   270,    90,   225,    45],
    [135, 315,   315,   135,   270,    90],
    [135, 315,   360,   180,   315,   135],

    [180,   0,     0,   180,     0,   180],
    [180,   0,    45,   225,    45,   225],
    [180,   0,    90,   270,    90,   270],
    [180,   0,   135,   315,   135,   315],
    [180,   0,   180,     0,   180,     0],
    [180,   0,   225,    45,   225,    45],
    [180,   0,   270,    90,   270,    90],
    [180,   0,   315,   135,   315,   135],
    [180,   0,   360,   180,     0,   180],
    [180,   0,   -45,   135,   315,   135],

    [225,  45,     0,   180,    45,   225],
    [225,  45,    45,   225,    90,   270],
    [225,  45,    90,   270,   135,   315],
    [225,  45,   135,   315,   180,     0],
    [225,  45,   180,     0,   225,    45],
    [225,  45,   225,    45,   270,    90],
    [225,  45,   270,    90,   315,   135],
    [225,  45,   315,   135,     0,   180],
    [225,  45,   360,   180,    45,   225],

    [270,  90,     0,   180,    90,   270],
    [270,  90,    45,   225,   135,   315],
    [270,  90,    90,   270,   180,     0],
    [270,  90,   135,   315,   225,    45],
    [270,  90,   180,     0,   270,    90],
    [270,  90,   225,    45,   315,   135],
    [270,  90,   270,    90,     0,   180],
    [270,  90,   315,   135,    45,   225],
    [270,  90,   360,   180,    90,   270],

    [315, 135,     0,   180,   135,   315],
    [315, 135,    45,   225,   180,     0],
    [315, 135,    90,   270,   225,    45],
    [315, 135,   135,   315,   270,    90],
    [315, 135,   180,     0,   315,   135],
    [315, 135,   225,    45,     0,   180],
    [315, 135,   270,    90,    45,   225],
    [315, 135,   315,   135,    90,   270],
    [315, 135,   360,   180,   135,   315],

    [360, 180,     0,   180,   180,     0],
    [360, 180,    45,   225,   225,    45],
    [360, 180,    90,   270,   270,    90],
    [360, 180,   135,   315,   315,   135],
    [360, 180,   180,     0,     0,   180],
    [360, 180,   225,    45,    45,   225],
    [360, 180,   270,    90,    90,   270],
    [360, 180,   315,   135,   135,   315],
    [360, 180,   360,   180,   180,     0],
  ];
  dag.setSelected([
    aspect, upslope,
    sourceFromNorth, sourceFromUpslope,
    headingFromNorth, headingFromUpslope]);

  expect(cfgDir.value()).toEqual('headingFromUpslope');

  let selectedLeafs = dag.getSelectedLeafs();
  expect(selectedLeafs.length).toEqual(6);
  expect(selectedLeafs).toContain(aspect);
  expect(selectedLeafs).toContain(upslope);
  expect(selectedLeafs).toContain(headingFromUpslope);
  expect(selectedLeafs).toContain(headingFromNorth);
  expect(selectedLeafs).toContain(sourceFromUpslope);
  expect(selectedLeafs).toContain(sourceFromNorth);

  let configLeafs = dag.getRequiredConfigLeafs();
  expect(configLeafs.length).toEqual(1);
  expect(configLeafs).toContain(cfgDir);

  let inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(2);
  expect(inputLeafs).toContain(aspect);
  expect(inputLeafs).toContain(headingFromUpslope);

  data.forEach((rec) => {
    let [asp, up, hdgUp, srcUp, hdgNo, srcNo] = rec;
    //console.log(asp, up, hdgUp, srcUp, hdgNo, srcNo);
    dag.setValues([[aspect, asp], [headingFromUpslope, hdgUp]]);
    expect(approx(aspect.value(), asp)).toEqual(true);
    expect(approx(upslope.value(), up)).toEqual(true);
    expect(approx(headingFromUpslope.value(), hdgUp)).toEqual(true);
    expect(approx(headingFromNorth.value(), hdgNo)).toEqual(true);
    expect(approx(sourceFromUpslope.value(), srcUp)).toEqual(true);
    expect(approx(sourceFromNorth.value(), srcNo)).toEqual(true);
  })
})

test('3: Midflame wind speed and WAF', () => {
  const name = 'worksheet1';
  const dag = new Dag(name);
  const { tree } = dag;
  const { canopy, slope, wind } = tree.site;
  const { upslope, aspect } = slope.direction;
  const { headingFromUpslope, headingFromNorth } = wind.direction;
  const { sourceFromNorth, sourceFromUpslope } = wind.direction;
  const { at10m, at20ft, atMidflame, waf } = wind.speed;
  const cfgDir = tree.configs.wind.direction;
  const cfgSpd = tree.configs.wind.speed;
  const cfgWaf = tree.configs.fuel.waf;
  const cfgPrimary = tree.configs.fuel.primary;
  const primary = tree.surface.fuel.primary;

  dag.setValues([
    [cfgDir, 'headingFromUpslope'],
    [cfgSpd, 'atMidflame'],
    [cfgWaf, 'input'],
  ]);
  expect(cfgDir.value()).toEqual('headingFromUpslope');
  expect(cfgSpd.value()).toEqual('atMidflame');
  expect(cfgWaf.value()).toEqual('input');

  // Start with just wind speed at midflame height
  dag.setSelected([atMidflame]);

  let selectedLeafs = dag.getSelectedLeafs();
  expect(selectedLeafs.length).toEqual(1);
  expect(selectedLeafs).toContain(atMidflame);

  let configLeafs = dag.getRequiredConfigLeafs();
  expect(configLeafs.length).toEqual(1);
  expect(configLeafs).toContain(cfgSpd);

  let inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(1);
  expect(inputLeafs).toContain(atMidflame);

  // If we select at20ft
  dag.setSelected([at20ft]);

  selectedLeafs = dag.getSelectedLeafs();
  expect(selectedLeafs.length).toEqual(2);
  expect(selectedLeafs).toContain(atMidflame);
  expect(selectedLeafs).toContain(at20ft);

  configLeafs = dag.getRequiredConfigLeafs();
  expect(configLeafs.length).toEqual(1);
  expect(configLeafs).toContain(cfgSpd);

  inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(2);
  expect(inputLeafs).toContain(atMidflame);
  expect(inputLeafs).toContain(waf);

  dag.setValues([
    [atMidflame, 10],
    [waf, 0.5],
  ]);
  expect(atMidflame.value()).toEqual(10);
  expect(waf.value()).toEqual(0.5);
  expect(approx(at20ft.value(), 20)).toEqual(true);

  // If we set cfgWaf to estimated, no effect
  dag.setValue(cfgWaf, 'estimated');

  configLeafs = dag.getRequiredConfigLeafs();
  expect(configLeafs.length).toEqual(1);
  expect(configLeafs).toContain(cfgSpd);

  inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(2);
  expect(inputLeafs).toContain(atMidflame);
  expect(inputLeafs).toContain(waf);
})

test('4: Midflame wind speed from input waf and at20ft', () => {
  const name = 'worksheet1';
  const dag = new Dag(name);
  const { tree } = dag;
  const { canopy, slope, wind } = tree.site;
  const { at10m, at20ft, atMidflame, waf } = wind.speed;
  const cfgSpd = tree.configs.wind.speed;
  const cfgWaf = tree.configs.fuel.waf;

  dag.setValues([
    [cfgSpd, 'at20ft'],
    [cfgWaf, 'input'],
  ]);
  expect(cfgSpd.value()).toEqual('at20ft');
  expect(cfgWaf.value()).toEqual('input');

  // Start with just wind speed at midflame height
  dag.setSelected([atMidflame]);

  let selectedLeafs = dag.getSelectedLeafs();
  expect(selectedLeafs.length).toEqual(1);
  expect(selectedLeafs).toContain(atMidflame);

  let configLeafs = dag.getRequiredConfigLeafs();
  expect(configLeafs.length).toEqual(1);
  expect(configLeafs).toContain(cfgSpd);

  let inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(2);
  expect(inputLeafs).toContain(at20ft);
  expect(inputLeafs).toContain(waf);

  dag.setValues([
    [at20ft, 10],
    [waf, 0.5],
  ]);
  expect(at20ft.value()).toEqual(10);
  expect(waf.value()).toEqual(0.5);
  expect(atMidflame.value()).toEqual(5);
})


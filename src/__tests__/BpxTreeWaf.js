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

test('1: Select open-canopy WAF only', () => {
  const name = 'worksheet1';
  const dag = new Dag(name);
  const { tree } = dag;
  const { canopy, slope, wind } = tree.site;
  const { at10m, at20ft, atMidflame, waf } = wind.speed;
  const { bed, model, fire } = tree.surface.fuel.primary;
  const cfgPrimary = tree.configs.fuel.primary;
  const cfgSpeed = tree.configs.wind.speed;
  const cfgWaf = tree.configs.fuel.waf;

  // Verify initial configuration
  expect(cfgWaf.value()).toEqual('input');
  expect(cfgPrimary.value()).toEqual('catalog');
  expect(cfgSpeed.value()).toEqual('at20ft');

  // Selecting just the primary fuel bed open-canopy WAF
  // requires just the fuel bed depth
  dag.setSelected([bed.openWaf, bed.depth]);
  let selectedLeafs = dag.getSelectedLeafs();
  expect(selectedLeafs.length).toEqual(2);
  expect(selectedLeafs).toContain(bed.depth);
  expect(selectedLeafs).toContain(bed.openWaf);

  // Fuel bed open-canopy WAF requires just the primary config
  let configLeafs = dag.getRequiredConfigLeafs();
  expect(configLeafs.length).toEqual(1);
  expect(configLeafs).toContain(cfgPrimary);
  dag.setValue(cfgPrimary, 'catalog');

  // So primary fuel model key is the only input
  let inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(1);
  expect(inputLeafs).toContain(model.key);

  // Fuel Model 10 open-canopy WAF
  dag.setValue(model.key, '10');
  let depth = bed.depth.value();
  expect(depth).toEqual(1);
  let waf010 = 1.83/Math.log((20.0+0.36*depth)/(0.13*depth));
  // console.log(waf010); // === 0.36210426360602416
  expect(bed.openWaf.value()).toEqual(0.36210426360602416);

  // Fuel Model 124 open-canopy WAF
  dag.setValue(model.key, '124');
  depth = bed.depth.value();
  expect(depth).toEqual(2.1);
  //let waf124 = 1.83/Math.log((20.0+0.36*depth)/(0.13*depth));
  //console.log(waf124); // === 0.4225236169597915
  expect(bed.openWaf.value()).toEqual(0.4225236169597915);
});

test('2: Fuel bed WAF with input vs estimated WAF', () => {
  const name = 'worksheet1';
  const dag = new Dag(name);
  const { tree } = dag;
  const { canopy, slope, wind } = tree.site;
  const { speed, dir } = wind;
  const { bed, model, fire } = tree.surface.fuel.primary;
  const cfgPrimary = tree.configs.fuel.primary;
  const cfgSpeed = tree.configs.wind.speed;
  const cfgWaf = tree.configs.fuel.waf;

  // Verify initial configuration
  expect(cfgWaf.value()).toEqual('input');
  expect(cfgPrimary.value()).toEqual('catalog');
  expect(cfgSpeed.value()).toEqual('at20ft');

  // Selecting fuel bed WAF with input WAF
  dag.setSelected([fire.wind.waf]);
  let selectedLeafs = dag.getSelectedLeafs();
  expect(selectedLeafs.length).toEqual(1);
  expect(selectedLeafs).toContain(fire.wind.waf);

  let configLeafs = dag.getRequiredConfigLeafs();
  expect(configLeafs.length).toEqual(1);
  expect(configLeafs).toContain(cfgWaf);

  // Since WAF is input, fuel bed waf is bound to site WAF
  let inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(1);
  expect(inputLeafs).toContain(speed.waf);
  dag.setBatchInputs([
    [speed.waf, [0, .5, 1]]
  ]);
  dag.updateBatch();
  expect(fire.wind.waf.fetch(0)).toEqual(0);
  expect(fire.wind.waf.fetch(1)).toEqual(.5);
  expect(fire.wind.waf.fetch(2)).toEqual(1);

  // If WAF is estimated, we need canopy and depth inputs
  dag.setValue(cfgWaf, 'estimated');
  configLeafs = dag.getRequiredConfigLeafs();
  expect(configLeafs.length).toEqual(2);
  expect(configLeafs).toContain(cfgWaf);
  expect(configLeafs).toContain(cfgPrimary);

  inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(4);
  expect(inputLeafs).toContain(canopy.crownBase);
  expect(inputLeafs).toContain(canopy.crownHeight);
  expect(inputLeafs).toContain(canopy.cover);
  expect(inputLeafs).toContain(model.key);

  // We'll want to see these already required intermediates as well
  dag.setSelected([
    bed.openWaf,
    canopy.crownLength,
    canopy.crownRatio,
    canopy.crownFill,
    canopy.sheltersFuel,
    canopy.shelteredWaf]);
  inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(4);

  dag.setValues([
    [model.key, '10'],
    [canopy.cover, 0.5],
    [canopy.crownBase, 10],
    [canopy.crownHeight, 40]
  ]);
  expect(approx(bed.depth.value(), 1)).toEqual(true);
  expect(approx(canopy.cover.value(), 0.5)).toEqual(true);
  expect(approx(canopy.crownBase.value(), 10)).toEqual(true);
  expect(approx(canopy.crownHeight.value(), 40)).toEqual(true);
  expect(approx(canopy.crownLength.value(), 30)).toEqual(true);
  expect(approx(canopy.crownRatio.value(), .75)).toEqual(true);
  //let fill = 0.75 * 0.5 / 3;  // 0.125
  expect(approx(canopy.crownFill.value(), .125)).toEqual(true);
  // let w = BpxLibCanopy.waf(canopy.cover.value(), canopy.crownHeight.value(),
  //   canopy.crownFill.value());
  expect(approx(canopy.shelteredWaf.value(), 0.1313664741590494)).toEqual(true);
  expect(canopy.sheltersFuel.value()).toEqual(true);
  expect(approx(fire.wind.waf.value(), 0.1313664741590494)).toEqual(true);
  expect(bed.openWaf.value()).toEqual(0.36210426360602416);
  //expect(approx(at20ft.value(), 10/0.1313664741590494)).toEqual(true);

  // If fuel is unsheltered, WAF should be openWaf
  dag.setValue(canopy.cover, 0);
  expect(approx(canopy.cover.value(), 0)).toEqual(true);
  expect(approx(canopy.shelteredWaf.value(), 1)).toEqual(true);
  expect(canopy.sheltersFuel.value()).toEqual(false);
  expect(bed.openWaf.value()).toEqual(0.36210426360602416);
  expect(approx(fire.wind.waf.value(), 0.36210426360602416)).toEqual(true);
  //expect(approx(at20ft.value(), 10/0.36210426360602416)).toEqual(true);

  dag.setValues([[canopy.cover, 0.5],[canopy.crownHeight, 5]]);
  expect(canopy.sheltersFuel.value()).toEqual(false);
  expect(bed.openWaf.value()).toEqual(0.36210426360602416);
  expect(approx(fire.wind.waf.value(), 0.36210426360602416)).toEqual(true);

  dag.setValues([[canopy.crownBase, 40],[canopy.crownHeight, 40]]);
  expect(canopy.sheltersFuel.value()).toEqual(false);
  expect(bed.openWaf.value()).toEqual(0.36210426360602416);
  expect(approx(fire.wind.waf.value(), 0.36210426360602416)).toEqual(true);

  dag.setValues([
    [canopy.cover, 0.5],
    [canopy.crownBase, 10],
    [canopy.crownHeight, 40]
  ]);
  expect(canopy.sheltersFuel.value()).toEqual(true);
  expect(approx(canopy.shelteredWaf.value(), 0.1313664741590494)).toEqual(true);
  expect(bed.openWaf.value()).toEqual(0.36210426360602416);
  expect(approx(fire.wind.waf.value(), 0.1313664741590494)).toEqual(true);

  // Change primary fuel input to 'behave'
  // and we must enter the primary behave model depth parameter
  dag.setValue(cfgPrimary, 'behave');

  inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(4);
  expect(inputLeafs).toContain(canopy.crownBase);
  expect(inputLeafs).toContain(canopy.crownHeight);
  expect(inputLeafs).toContain(canopy.cover);
  expect(inputLeafs).toContain(model.behave.parms.depth);

  dag.setValue(model.behave.parms.depth, 2);
  expect(bed.openWaf.value()).toEqual( 0.4179825632019431);
  expect(approx(fire.wind.waf.value(), 0.1313664741590494)).toEqual(true);
  // expect(approx(at20ft.value(), 10/0.1313664741590494)).toEqual(true);
})

test('3: Fuel bed midflame wind speed', () => {
  const name = 'worksheet1';
  const dag = new Dag(name);
  const { tree } = dag;
  const { canopy, slope, wind } = tree.site;
  const { speed, dir } = wind;
  const { bed, model, fire } = tree.surface.fuel.primary;
  const cfgPrimary = tree.configs.fuel.primary;
  const cfgSpeed = tree.configs.wind.speed;
  const cfgWaf = tree.configs.fuel.waf;

  // Verify initial configuration
  expect(cfgWaf.value()).toEqual('input');
  expect(cfgPrimary.value()).toEqual('catalog');
  expect(cfgSpeed.value()).toEqual('at20ft');

  // Selecting fuel bed midflame wind speed
  dag.setSelected([fire.wind.atMidflame]);
  let selectedLeafs = dag.getSelectedLeafs();
  expect(selectedLeafs.length).toEqual(1);
  expect(selectedLeafs).toContain(fire.wind.atMidflame);

  // WAF is input, so no need for fuel
  let configLeafs = dag.getRequiredConfigLeafs();
  expect(configLeafs.length).toEqual(2);
  expect(configLeafs).toContain(cfgSpeed);
  expect(configLeafs).toContain(cfgWaf);

  // Since WAF is input, fuel bed waf is bound to site WAF
  let inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(2);
  expect(inputLeafs).toContain(speed.at20ft);
  expect(inputLeafs).toContain(speed.waf);

  dag.setValues([[speed.at20ft, 20],[speed.waf, 0.5]]);
  expect(fire.wind.atMidflame.value()).toEqual(10);
  dag.setValue(cfgSpeed, 'at10m');
  dag.setValues([[speed.at10m, 20],[speed.waf, 0.5]]);
  expect(fire.wind.atMidflame.value()).toEqual(10/1.13);

  // Set wind speed input to 'atMidflame'
  dag.setValue(cfgSpeed, 'atMidflame');

  // Now the only required config is wind speed
  configLeafs = dag.getRequiredConfigLeafs();
  expect(configLeafs.length).toEqual(1);
  expect(configLeafs).toContain(cfgSpeed);

  inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(1);
  expect(inputLeafs).toContain(speed.atMidflame);

  dag.setValue(speed.atMidflame, 12.3);
  expect(fire.wind.atMidflame.value()).toEqual(12.3);

  // Change wind speed back to 20ft
  dag.setValue(cfgSpeed, 'at20ft');

  configLeafs = dag.getRequiredConfigLeafs();
  expect(configLeafs.length).toEqual(2);
  expect(configLeafs).toContain(cfgSpeed);
  expect(configLeafs).toContain(cfgWaf);

  // Estimate the WAF, and fuel config now needed
  dag.setValue(cfgWaf, 'estimated');

  configLeafs = dag.getRequiredConfigLeafs();
  expect(configLeafs.length).toEqual(3);
  expect(configLeafs).toContain(cfgSpeed);
  expect(configLeafs).toContain(cfgWaf);
  expect(configLeafs).toContain(cfgPrimary);

  dag.setValue(cfgPrimary, 'catalog');

  inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(5);
  expect(inputLeafs).toContain(canopy.crownBase);
  expect(inputLeafs).toContain(canopy.crownHeight);
  expect(inputLeafs).toContain(canopy.cover);
  expect(inputLeafs).toContain(model.key);
  expect(inputLeafs).toContain(speed.at20ft);

  dag.setValues([
    [model.key, '10'],
    [canopy.cover, 0.5],
    [canopy.crownBase, 10],
    [canopy.crownHeight, 40],
    [speed.at20ft, 10],
  ]);
  expect(approx(bed.depth.value(), 1)).toEqual(true);
  expect(approx(canopy.cover.value(), 0.5)).toEqual(true);
  expect(approx(canopy.crownBase.value(), 10)).toEqual(true);
  expect(approx(canopy.crownHeight.value(), 40)).toEqual(true);
  expect(approx(canopy.crownLength.value(), 30)).toEqual(true);
  expect(approx(canopy.crownRatio.value(), .75)).toEqual(true);
  //let fill = 0.75 * 0.5 / 3;  // 0.125
  expect(approx(canopy.crownFill.value(), .125)).toEqual(true);
  // let w = BpxLibCanopy.waf(canopy.cover.value(), canopy.crownHeight.value(),
  //   canopy.crownFill.value());
  expect(approx(canopy.shelteredWaf.value(), 0.1313664741590494)).toEqual(true);
  expect(canopy.sheltersFuel.value()).toEqual(true);
  expect(approx(fire.wind.waf.value(), 0.1313664741590494)).toEqual(true);
  expect(bed.openWaf.value()).toEqual(0.36210426360602416);
  expect(approx(fire.wind.atMidflame.value(), 10 * 0.1313664741590494)).toEqual(true);
})

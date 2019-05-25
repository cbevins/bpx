import Dag from './Dag';
import DagBranch from './DagBranch';
import BpxTreeFuelParticle from './BpxTreeFuelParticle';
import {
  BpxTreeFuelParticles,
  BpxTreeFuelCategory,
  BpxTreeFuelCategoryDead,
  BpxTreeFuelCategoryLive,
  BpxTreeFuelBed,
  BpxTreeFuelBedCanopy,
  BpxTreeFuelModel,
  BpxTreeFuelComplex
} from './BpxTreeFuel';

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

 test('1: new BpxTreeFuelParticle()', () => {
  const root = new DagBranch(null, 'root');
  const name = 'p1';
  const subtree = new BpxTreeFuelParticle(root, name);
  expect(subtree.name()).toEqual(name);
});

test('2: new BpxTreeFuelParticles()', () => {
  const root = new DagBranch(null, 'root');
  const name = 'particles';
  const subtree = new BpxTreeFuelParticles(root, name);
  expect(subtree.name()).toEqual(name);
});

test('3: new BpxTreeFuelCategory()', () => {
  const root = new DagBranch(null, 'root');
  const name = 'category';
  const subtree = new BpxTreeFuelCategory(root, name);
  expect(subtree.name()).toEqual(name);
});

test('4: new BpxTreeFuelCategoryDead()', () => {
  const root = new DagBranch(null, 'root');
  const name = 'dead';
  const subtree = new BpxTreeFuelCategoryDead(root, name);
  expect(subtree.name()).toEqual(name);
});

test('5: new BpxTreeFuelCategoryLive()', () => {
  const root = new DagBranch(null, 'root');
  const name = 'live';
  const subtree = new BpxTreeFuelCategoryLive(root, name);
  expect(subtree.name()).toEqual(name);
});

test('6: new BpxTreeFuelBed()', () => {
  const root = new DagBranch(null, 'root');
  const name = 'bed';
  const subtree = new BpxTreeFuelBed(root, name);
  expect(subtree.name()).toEqual(name);
});

test('7: new BpxTreeFuelModel()', () => {
  const root = new DagBranch(null, 'root');
  const name = 'model';
  const subtree = new BpxTreeFuelModel(root, name);
  expect(subtree.name()).toEqual(name);
});

test('8: new BpxTreeFuelComplex() Primary', () => {
  const root = new DagBranch(null, 'root');
  const name = 'primary';
  const subtree = new BpxTreeFuelComplex(root, name);
  expect(subtree.name()).toEqual(name);
});

test('9: new BpxTreeFuelBedCanopy()', () => {
  const root = new DagBranch(null, 'root');
  const name = 'bed';
  const subtree = new BpxTreeFuelBedCanopy(root, name);
  expect(subtree.name()).toEqual(name);
});

test('10: Fuel bed wind and slope coefficients', () => {
  const name = 'worksheet1';
  const dag = new Dag(name);
  const { tree } = dag;
  const { canopy, slope, wind } = tree.site;
  const { at10m, at20ft, atMidflame, waf } = wind.speed;
  const { bed, model } = tree.surface.fuel.primary;
  const cfgPrimary = tree.configs.fuel.primary;
  const cfgCuredHerb = tree.configs.fuel.curedHerbFraction;
  const cfgChaparral = tree.configs.fuel.chaparralTotalLoad;
  const cfgWindSpeed = tree.configs.wind.speed;
  const cfgSteepness = tree.configs.slope.steepness;
  const cfgWaf = tree.configs.fuel.waf;

  dag.setSelected([bed.phiS]);
  let configLeafs = dag.getRequiredConfigLeafs();
  expect(configLeafs.length).toEqual(4);
  expect(configLeafs).toContain(cfgPrimary);
  expect(configLeafs).toContain(cfgCuredHerb);
  expect(configLeafs).toContain(cfgChaparral);
  expect(configLeafs).toContain(cfgSteepness);

  dag.setValues([
    [cfgPrimary, 'catalog'],
    [cfgCuredHerb, 'input'],
    [cfgChaparral, 'input'],
    [cfgWindSpeed, 'atMidflame'],
    [cfgSteepness, 'ratio'],
    [cfgWaf, 'input'],
  ]);

  let inputLeafs = dag.getRequiredInputLeafs();
  //logNames(inputLeafs);
  expect(inputLeafs.length).toEqual(3);
  expect(inputLeafs).toContain(model.key);
  expect(inputLeafs).toContain(model.behave.parms.curedHerbFraction);
  expect(inputLeafs).toContain(slope.steepness.ratio);


})
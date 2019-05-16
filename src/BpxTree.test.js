import BpxTree from './BpxTree';
import Dag from './Dag';

function approx(actual, expected, prec = 12) {
  return actual.toPrecision(prec) === expected.toPrecision(prec);
}

it('1: BpxTree initial state', () => {
  const name = 'BehavePlusExplorer';
  const desc = 'BehavePlus Explorer in Javascript and React';
  const branch = new BpxTree(name).desc(desc);
  expect(branch.name()).toEqual(name);
  expect(branch.desc()).toEqual(desc);
  expect(branch.fullName()).toEqual(name);
  expect(branch.label()).toEqual(name);
  expect(branch.parent()).toEqual(null);
  expect(branch.connect()).toEqual(branch);

  expect(branch.label('BehavePlus Explorer')).toEqual(branch);
  expect(branch.label()).toEqual('BehavePlus Explorer');
});

test('2: verify BpxTree branch structure', () => {
  const name = 'worksheet1';
  const dag = new Dag(name);
  const { tree } = dag;
  const { surface } = tree;
  const { fuel } = surface;
  const { model } = dag.tree.surface.fuel.primary;
  const { behave } = dag.tree.surface.fuel.primary.model;
  const { chaparral } = dag.tree.surface.fuel.primary.model;
  const palmetto = dag.tree.surface.fuel.primary.model.palmettoGallberry;
  const waspen = dag.tree.surface.fuel.primary.model.westernAspen;
  const { bed } = dag.tree.surface.fuel.primary;
  const d1 = bed.dead.particle.class1;
  expect(tree.name()).toEqual(name);
  expect(model.key.value()).toEqual('10');
  expect(bed.domain.value()).toEqual('behave');
  expect(d1.dens.value()).toEqual(32);
  expect(behave.name()).toEqual('behave');
  expect(chaparral.name()).toEqual('chaparral');
  expect(palmetto.name()).toEqual('palmettoGallberry');
  expect(waspen.name()).toEqual('westernAspen');
});

test('3: Try behave fuel model', () => {
  const name = 'w1';
  const dag = new Dag(name);
  const cfgChf = dag.tree.configs.fuel.curedHerbFraction;
  const { moisture } = dag.tree.site;
  const { model } = dag.tree.surface.fuel.primary;
  const { behave } = model;

  dag.setSelected([
    behave.parms.curedHerbFraction,
    behave.parms.dead1Load,
    behave.derived.deadHerbLoad,
    behave.derived.liveHerbLoad]);

  dag.setValues([[model.key, '10'], [moisture.live.herb, 0.5]]);

  let leaf = cfgChf;
  let expected = 'input';
  expect(leaf.value()).toEqual(expected);

  leaf = moisture.live.herb;
  expected = 0.5;
  expect(leaf.value()).toEqual(expected);

  leaf = behave.parms.dead1Load;
  expected = 0.138;
  expect(leaf.value()).toEqual(expected);

  dag.setValues([[model.key, '124']]);

  dag.setValues([[cfgChf, 'estimated']]);

  leaf = cfgChf;
  expected = 'estimated';
  expect(leaf.value()).toEqual(expected);

  leaf = behave.parms.dead1Load;
  expected = 1.9 * 2000 / 43560;
  expect(approx(leaf.value(), expected)).toEqual(true);

  leaf = moisture.live.herb;
  expected = 0.5;
  expect(leaf.value()).toEqual(expected);

  leaf = behave.parms.curedHerbFraction;
  expected = 0.778;
  expect(approx(leaf.value(), expected)).toEqual(true);
});

test('4: Fuel config propagation thru fuel domain', () => {
  const dag = new Dag('w1');
  const { model } = dag.tree.surface.fuel.primary;
  const { behave } = model;
  const { chaparral } = model;
  const palmetto = model.palmettoGallberry;
  const waspen = model.westernAspen;
  const cfgFuel = dag.tree.configs.fuel.primary;
  const { bed } = dag.tree.surface.fuel.primary;

  const dead1Load = bed.dead.particle.class1.load;
  const deadMext = bed.dead.mext;

  expect(behave.domain.value()).toEqual('behave');
  expect(chaparral.domain.value()).toEqual('chaparral');
  expect(palmetto.domain.value()).toEqual('palmettoGallberry');
  expect(waspen.domain.value()).toEqual('westernAspen');

  expect(cfgFuel.value()).toEqual('catalog');
  expect(model.key.value()).toEqual('10');
  expect(model.domain.value()).toEqual('none');

  dag.setSelected([model.domain, dead1Load, deadMext]);

  expect(model.domain.value()).toEqual('behave');
  dag.setValue(cfgFuel, 'chaparral');
  expect(model.domain.value()).toEqual('chaparral');

  dag.setValue(cfgFuel, 'palmettoGallberry');
  expect(model.domain.value()).toEqual('palmettoGallberry');
  dag.setValue(cfgFuel, 'westernAspen');
  expect(model.domain.value()).toEqual('westernAspen');
  dag.setValue(cfgFuel, 'behave');
  expect(model.domain.value()).toEqual('behave');

  dag.setValues([[cfgFuel, 'catalog'], [model.key, '10']]);
  let expected = 0.138;
  let actual = dead1Load.value();
  expect(approx(actual, expected)).toEqual(true);

  expected = 0.25;
  actual = deadMext.value();
  expect(approx(actual, expected)).toEqual(true);

  dag.setValue(model.key, '124');
  expected = 1.9 * 2000 / 43560;
  actual = dead1Load.value();
  expect(approx(actual, expected)).toEqual(true);

  expected = 0.4;
  actual = deadMext.value();
  expect(approx(actual, expected)).toEqual(true);

  dag.setValue(model.key, 'chamise6');
  expected = 0.5205; // 2.0 lb/ft2, 0.75 dead
  actual = dead1Load.value();
  expect(approx(actual, expected)).toEqual(true);

  expected = 0.3;
  actual = deadMext.value();
  expect(approx(actual, expected)).toEqual(true);

  dag.setValue(model.key, 'pg6');
  expected = 0.0499967975; // 10 y, 6 ft
  actual = dead1Load.value();
  expect(approx(actual, expected, 9)).toEqual(true);

  expected = 0.4;
  actual = deadMext.value();
  expect(approx(actual, expected)).toEqual(true);

  dag.setValue(model.key, 'aspenShrub50');
  expected = 1.056 * 2000 / 43560;
  actual = dead1Load.value();
  expect(approx(actual, expected)).toEqual(true);

  expected = 0.25;
  actual = deadMext.value();
  expect(approx(actual, expected)).toEqual(true);
});




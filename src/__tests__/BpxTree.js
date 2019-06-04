import Dag from '../Dag';
import { approx } from '../__test_data__/Debug';
import BpxTree from '../BpxTree';
import BpxLibFuelParticle from '../BpxLibFuelParticle';

test('1: BpxTree initial state', () => {
  const name = 'BehavePlusExplorer';
  const desc = 'BehavePlus Explorer in Javascript and React';
  const branch = new BpxTree(name).desc(desc);
  expect(branch.name()).toEqual(name);
  expect(branch.desc()).toEqual(desc);
  expect(branch.fullName()).toEqual(name);
  expect(branch.label()).toEqual(null);
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

test('3: Behave Cured Herb Fraction', () => {
  const name = 'w1';
  const dag = new Dag(name);
  expect(dag.getName()).toEqual('w1');
  const cfgChf = dag.tree.configs.fuel.curedHerbFraction;
  const cfgPrimary = dag.tree.configs.fuel.primary;
  const cfgMoisture = dag.tree.configs.fuel.moisture;
  const moisture = dag.tree.site.moisture;
  const model = dag.tree.surface.fuel.primary.model;
  const behave = model.behave;

  // Simple Behave cured herb fraction submodel where CHF is input
  dag.setSelected([
    behave.parms.curedHerbFraction,
    behave.parms.dead1Load,
    behave.derived.deadHerbLoad,
    behave.derived.liveHerbLoad]);

  let selectedLeafs = dag.getSelectedLeafs();
  expect(selectedLeafs.length).toEqual(4);
  expect(selectedLeafs).toContain(behave.parms.curedHerbFraction);

  let requiredLeafs = dag.getRequiredLeafs();
  expect(requiredLeafs.length).toEqual(8);
  expect(requiredLeafs).toContain(model.key);
  expect(requiredLeafs).toContain(behave.parms.curedHerbFraction);
  expect(requiredLeafs).toContain(behave.parms.dead1Load);
  expect(requiredLeafs).toContain(behave.parms.totalHerbLoad);
  expect(requiredLeafs).toContain(behave.derived.deadHerbLoad);
  expect(requiredLeafs).toContain(behave.derived.liveHerbLoad);
  expect(requiredLeafs).toContain(cfgChf);
  expect(requiredLeafs).toContain(cfgPrimary);

 // expect(requiredLeafs).toContain(cfgMoisture);
 // expect(requiredLeafs).toContain(moisture.live.herb);
 // expect(configLeafs).toContain(cfgMoisture);
 // expect(inputLeafs).toContain(moisture.live.herb);

  let configLeafs = dag.getRequiredConfigLeafs();
  expect(configLeafs.length).toEqual(2);
  expect(configLeafs).toContain(cfgChf);
  expect(configLeafs).toContain(cfgPrimary);

  expect(cfgChf.value()).toEqual('input');
  expect(cfgPrimary.value()).toEqual('catalog');

  let inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs).toContain(model.key);
  expect(inputLeafs).toContain(behave.parms.curedHerbFraction);

  dag.setValues([
    [model.key, '10'],
    [behave.parms.curedHerbFraction, 0.5]]);

  expect(model.key.value()).toEqual('10');
  expect(behave.parms.curedHerbFraction.value()).toEqual(0.5);
  expect(behave.parms.dead1Load.value()).toEqual(0.138);
  expect(behave.parms.totalHerbLoad.value()).toEqual(0.0);
  expect(behave.derived.deadHerbLoad.value()).toEqual(0.0);
  expect(behave.derived.liveHerbLoad.value()).toEqual(0.0);

  // Use FM 124 with estimated CHF
  dag.setValues([[model.key, '124']]);
  expect(model.key.value()).toEqual('124');

  dag.setValues([[cfgChf, 'estimated']]);
  expect(cfgChf.value()).toEqual('estimated');

  // Same number of selected Leafs
  selectedLeafs = dag.getSelectedLeafs();
  expect(selectedLeafs.length).toEqual(4);
  expect(selectedLeafs).toContain(behave.parms.curedHerbFraction);

  // Now have two more required Leafs:
  // the fuel moisture LeafConfig
  // the live herb fuel moisture as an input
  requiredLeafs = dag.getRequiredLeafs();
  expect(requiredLeafs.length).toEqual(10);
  expect(requiredLeafs).toContain(cfgMoisture);
  expect(requiredLeafs).toContain(moisture.live.herb);

  expect(cfgMoisture.value()).toEqual('individual');
  dag.setValues([[moisture.live.herb, 0.5]]);
  expect(moisture.live.herb.value()).toEqual(0.5);

  let leaf = behave.parms.dead1Load;
  let expected = 1.9 * 2000 / 43560;
  expect(approx(leaf.value(), expected)).toEqual(true);

  leaf = behave.parms.curedHerbFraction;
  expected = 0.778;
  expect(approx(leaf.value(), expected)).toEqual(true);

  dag.unSelect([
    behave.parms.curedHerbFraction,
    behave.derived.liveHerbLoad]);
  expect(dag.getSelectedLeafs().length).toEqual(2);

  dag.clearSelected();
  expect(dag.getSelectedLeafs().length).toEqual(0);

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


test('5: BpxLibFuelParticle tests for full code coverage', () => {
  const dag = new Dag('w1');
  const { bed, model } = dag.tree.surface.fuel.primary;
  const cfgFuel = dag.tree.configs.fuel.primary;
  const {diam, volm} = bed.dead.particle.class1;

  dag.setSelected([diam, volm]);
  let inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(1);
  expect(inputLeafs).toContain(model.key);

  let configLeafs = dag.getRequiredConfigLeafs();
  //expect(configLeafs.length).toEqual(1);
  expect(configLeafs).toContain(cfgFuel);

  dag.setValue(model.key, '10');
  let diameter = 4/2000;
  expect(diam.value()).toEqual(diameter);
  let volume = 0.138 / 32;
  expect(volm.value()).toEqual(volume);

  // FM 10 10-h
  diameter = 4/192;   // 0,02083333 ft, 0.25 in
  volume = 0.092/32;  // 0.002875 ft3, 4.968 in3
  const length = BpxLibFuelParticle.leng(diameter, volume);
  //console.log(length);// 8.43393 ft
  expect(length).toEqual(volume/(Math.PI * 0.25 * diameter*diameter));

  expect(BpxLibFuelParticle.size(3000)).toEqual(0);
  expect(BpxLibFuelParticle.size(1200)).toEqual(0);

  expect(BpxLibFuelParticle.size(1199)).toEqual(1);
  expect(BpxLibFuelParticle.size(192)).toEqual(1);

  expect(BpxLibFuelParticle.size(191)).toEqual(2);
  expect(BpxLibFuelParticle.size(96)).toEqual(2);

  expect(BpxLibFuelParticle.size(95)).toEqual(3);
  expect(BpxLibFuelParticle.size(48)).toEqual(3);

  expect(BpxLibFuelParticle.size(47)).toEqual(4);
  expect(BpxLibFuelParticle.size(16)).toEqual(4);

  expect(BpxLibFuelParticle.size(15)).toEqual(5);
})

test('6: Fire direction tests', () => {
  const dag = new Dag('w1');
})

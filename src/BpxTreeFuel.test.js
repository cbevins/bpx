import Branch from './Branch';
import { BpxTreeFuelParticle,
  BpxTreeFuelParticles,
  BpxTreeFuelCategory,
  BpxTreeFuelCategoryDead,
  BpxTreeFuelCategoryLive,
  BpxTreeFuelBed,
  BpxTreeFuelModel,
  BpxTreeFuelComplex
} from './BpxTreeFuel';

 test('1: new BpxTreeFuelParticle()', () => {
  const root = new Branch(null, 'root');
  const name = 'p1';
  const subtree = new BpxTreeFuelParticle(root, name);
  expect(subtree.name()).toEqual(name);
});

test('2: new BpxTreeFuelParticles()', () => {
  const root = new Branch(null, 'root');
  const name = 'particles';
  const subtree = new BpxTreeFuelParticles(root, name);
  expect(subtree.name()).toEqual(name);
});

test('3: new BpxTreeFuelCategory()', () => {
  const root = new Branch(null, 'root');
  const name = 'category';
  const subtree = new BpxTreeFuelCategory(root, name);
  expect(subtree.name()).toEqual(name);
});

test('4: new BpxTreeFuelCategoryDead()', () => {
  const root = new Branch(null, 'root');
  const name = 'dead';
  const subtree = new BpxTreeFuelCategoryDead(root, name);
  expect(subtree.name()).toEqual(name);
});

test('5: new BpxTreeFuelCategoryLive()', () => {
  const root = new Branch(null, 'root');
  const name = 'live';
  const subtree = new BpxTreeFuelCategoryLive(root, name);
  expect(subtree.name()).toEqual(name);
});

test('6: new BpxTreeFuelBed()', () => {
  const root = new Branch(null, 'root');
  const subtree = new BpxTreeFuelBed(root);
  const name = 'bed';
  expect(subtree.name()).toEqual(name);
});

test('7: new BpxTreeFuelModel()', () => {
  const root = new Branch(null, 'root');
  const subtree = new BpxTreeFuelModel(root);
  const name = 'model';
  expect(subtree.name()).toEqual(name);
});

test('8: new BpxTreeFuelComplex() Primary', () => {
  const root = new Branch(null, 'root');
  const subtree = new BpxTreeFuelComplex(root, 'primary');
  const name = 'primary';
  expect(subtree.name()).toEqual(name);
});

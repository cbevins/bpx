import DagBranch from './DagBranch';
import { BpxTreeFuelParticle,
  BpxTreeFuelParticles,
  BpxTreeFuelCategory,
  BpxTreeFuelCategoryDead,
  BpxTreeFuelCategoryLive,
  BpxTreeFuelBed,
  BpxTreeFuelBedCanopy,
  BpxTreeFuelModel,
  BpxTreeFuelComplex
} from './BpxTreeFuel';

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

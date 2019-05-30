import Dag from '../Dag';
import { approx, logNames } from '../__test_data__/Debug';

import DagBranch from '../DagBranch';
import BpxTreeSurfaceFuelBed from '../BpxTreeSurfaceFuelBed';
import BpxTreeSurfaceFuelModel from '../BpxTreeSurfaceFuelModel';
import BpxTreeFuelParticle from '../BpxTreeFuelParticle';
import {
  BpxTreeFuelParticles,
  BpxTreeFuelCategory,
  BpxTreeFuelCategoryDead,
  BpxTreeFuelCategoryLive,
} from '../BpxTreeFuelCategory';
import BpxTreeSurfaceFuel from '../BpxTreeSurfaceFuel';

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

test('6: new BpxTreeSurfaceFuelBed()', () => {
  const root = new DagBranch(null, 'root');
  const name = 'bed';
  const subtree = new BpxTreeSurfaceFuelBed(root, name);
  expect(subtree.name()).toEqual(name);
});

test('7: new BpxTreeSurfaceFuelModel()', () => {
  const root = new DagBranch(null, 'root');
  const name = 'model';
  const subtree = new BpxTreeSurfaceFuelModel(root, name);
  expect(subtree.name()).toEqual(name);
});

test('8: new BpxTreeSurfaceFuel()', () => {
  const root = new DagBranch(null, 'root');
  const name = 'primary';
  const subtree = new BpxTreeSurfaceFuel(root, name);
  expect(subtree.name()).toEqual(name);
});

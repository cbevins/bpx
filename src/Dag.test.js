import Dag from './Dag';

it('1: Dag initial state', () => {
  const name = 'BehavePlusExplorer';
  const dag = new Dag(name);
  expect(dag.name).toEqual(name);
  expect(dag.autoConfig).toEqual(true);
  expect(dag.autoUpdate).toEqual(true);
  //expect(dag.leafs).toEqual([]);
  expect(dag.requiredLeafs).toEqual([]);
  expect(dag.requiredConfigLeafs).toEqual([]);
  expect(dag.requiredInputLeafs).toEqual([]);
  expect(dag.selectedLeafs).toEqual([]);
  expect(dag.storedLeafs).toEqual([]);
});

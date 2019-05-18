import DagLeafBool from './DagLeafBool';

it('creates a new LeafBool "leafBool"', () => {
  const leaf = new DagLeafBool(null, 'leafBool');
  expect(leaf.name()).toEqual('leafBool');
  expect(leaf.desc()).toEqual('');
  expect(leaf.value()).toEqual(false);

  expect(leaf.value(123).value(456).value(true)).toEqual(leaf);
  expect(leaf.value()).toEqual(true);
});

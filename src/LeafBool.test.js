import LeafBool from './LeafBool';

it('creates a new LeafBool "leafBool"', () => {
  const leaf = new LeafBool(null, 'leafBool');
  expect(leaf.name()).toEqual('leafBool');
  expect(leaf.desc()).toEqual('');
  expect(leaf.value()).toEqual(false);

  expect(leaf.value(123).value(456).value(true)).toEqual(leaf);
  expect(leaf.value()).toEqual(true);
});

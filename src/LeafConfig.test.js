import LeafConfig from './LeafConfig';

it('creates a new LeafConfig "leafConfig"', () => {
  const leaf = new LeafConfig(null, 'leafConfig');
  expect(leaf.name()).toEqual('leafConfig');
  expect(leaf.desc()).toEqual('');
  expect(leaf.value()).toEqual(null);

  expect(leaf.isConfig()).toEqual(true);
  expect(leaf.isOption()).toEqual(true);
});

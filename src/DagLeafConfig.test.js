import DagLeafConfig from './DagLeafConfig';

it('creates a new DagLeafConfig "leafConfig"', () => {
  const leaf = new DagLeafConfig(null, 'leafConfig');
  expect(leaf.name()).toEqual('leafConfig');
  expect(leaf.desc()).toEqual('');
  expect(leaf.value()).toEqual(null);

  expect(leaf.isConfig()).toEqual(true);
  expect(leaf.isOption()).toEqual(true);
});

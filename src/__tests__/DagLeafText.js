import DagLeafText from '../DagLeafText';

it('creates a new DagLeafText "leafText"', () => {
  const leaf = new DagLeafText(null, 'leafText');
  expect(leaf.name()).toEqual('leafText');
  expect(leaf.desc()).toEqual('');
  expect(leaf.value()).toEqual('');

  expect(leaf.value('abc').value(true).value('someString')).toEqual(leaf);
  expect(leaf.value()).toEqual('someString');
});

import LeafText from './LeafText';

it('creates a new LeafText "leafText"', () => {
  const leaf = new LeafText(null, 'leafText');
  expect(leaf.name()).toEqual('leafText');
  expect(leaf.desc()).toEqual('');
  expect(leaf.value()).toEqual('');

  expect(leaf.value('abc').value(true).value('someString')).toEqual(leaf);
  expect(leaf.value()).toEqual('someString');
});

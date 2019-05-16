import LeafQuantity from './LeafQuantity';

it('creates a new LeafQuantity "leafQuantity"', () => {
  const leaf = new LeafQuantity(null, 'leafQuantity');
  expect(leaf.name()).toEqual('leafQuantity');
  expect(leaf.cost()).toEqual(0);
  expect(leaf.desc()).toEqual('');
  expect(leaf.units()).toEqual('factor');
  expect(leaf.value()).toEqual(0);

  expect(leaf.isOption()).toEqual(false);
  expect(leaf.isConfig()).toEqual(false);

  expect(LeafQuantity.hasUnits('ft')).toEqual(false);
  expect(LeafQuantity.hasUnits('fireDistance')).toEqual(true);

  expect(leaf.units('fireDistance')).toEqual(leaf);
  expect(leaf.units()).toEqual('fireDistance');

  expect(() => { leaf.ensureUnits('noSuchUnits', 'LeafQuantity.test.js.it()'); }).toThrow();
});

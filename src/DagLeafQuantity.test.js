import DagLeafQuantity from './DagLeafQuantity';

it('creates a new DagLeafQuantity "leafQuantity"', () => {
  const leaf = new DagLeafQuantity(null, 'leafQuantity');
  expect(leaf.name()).toEqual('leafQuantity');
  expect(leaf.cost()).toEqual(0);
  expect(leaf.desc()).toEqual('');
  expect(leaf.units()).toEqual('factor');
  expect(leaf.value()).toEqual(0);

  expect(leaf.isOption()).toEqual(false);
  expect(leaf.isConfig()).toEqual(false);

  expect(DagLeafQuantity.hasUnits('ft')).toEqual(false);
  expect(DagLeafQuantity.hasUnits('fireDistance')).toEqual(true);

  expect(leaf.units('fireDistance')).toEqual(leaf);
  expect(leaf.units()).toEqual('fireDistance');

  function badUnits() {
    leaf.ensureUnits('noSuchUnits', 'DagLeafQuantity.test.js.it.badUnits()');
  }
  expect(badUnits).toThrow();
  expect(badUnits).toThrowError(/invalid units/);
  expect(badUnits).toThrowError(/noSuchUnits/);
  expect(badUnits).toThrowError(/badUnits()/);
});

import DagLeafText from './DagLeafText';

it('creates a new DagLeafText "leafText"', () => {
  const leaf = new DagLeafText(null, 'leafText');
  expect(leaf.name()).toEqual('leafText');
  expect(leaf.desc()).toEqual('');
  expect(leaf.units()).toEqual('any');
  expect(leaf.value()).toEqual('');

  expect(leaf.value('abc').value(true).value('someString')).toEqual(leaf);
  expect(leaf.value()).toEqual('someString');

  expect(DagLeafText.hasUnits('noSuchUnits')).toEqual(false);
  expect(DagLeafText.hasUnits('fuelLabel')).toEqual(true);

  expect(leaf.units('fuelLabel')).toEqual(leaf);
  expect(leaf.units()).toEqual('fuelLabel');

  function badUnits() {
    leaf.ensureUnits('noSuchUnits', 'DagLeafText.test.js.it.badUnits()');
  }
  expect(badUnits).toThrow();
  expect(badUnits).toThrowError(/invalid units/);
  expect(badUnits).toThrowError(/noSuchUnits/);
  expect(badUnits).toThrowError(/badUnits()/);
});

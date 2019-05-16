import LeafText from './LeafText';

it('creates a new LeafText "leafText"', () => {
  const leaf = new LeafText(null, 'leafText');
  expect(leaf.name()).toEqual('leafText');
  expect(leaf.desc()).toEqual('');
  expect(leaf.units()).toEqual('any');
  expect(leaf.value()).toEqual('');

  expect(leaf.value('abc').value(true).value('someString')).toEqual(leaf);
  expect(leaf.value()).toEqual('someString');

  expect(LeafText.hasUnits('noSuchUnits')).toEqual(false);
  expect(LeafText.hasUnits('fuelLabel')).toEqual(true);

  expect(leaf.units('fuelLabel')).toEqual(leaf);
  expect(leaf.units()).toEqual('fuelLabel');

  function badUnits() {
    leaf.ensureUnits('noSuchUnits', 'LeafText.test.js.it.badUnits()');
  }
  expect(badUnits).toThrow();
  expect(badUnits).toThrowError(/invalid units/);
  expect(badUnits).toThrowError(/noSuchUnits/);
  expect(badUnits).toThrowError(/badUnits()/);
});

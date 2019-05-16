import { BpxConfigFuelPrimary, BpxConfigFuelSecondary,
  BpxConfigFuelMoisture, BpxConfigFuelCuredHerbFraction,
  BpxConfigFuelChaparralTotalLoad } from './BpxLeafConfigs';

const chp = new BpxConfigFuelChaparralTotalLoad();
const primary = new BpxConfigFuelPrimary();
const secondary = new BpxConfigFuelSecondary();
const moisture = new BpxConfigFuelMoisture();
const chf = new BpxConfigFuelCuredHerbFraction(this);

it('1: Config Leaf names', () => {
  expect(chp.name()).toEqual('chaparralTotalLoad');
  expect(primary.name()).toEqual('primary');
  expect(secondary.name()).toEqual('secondary');
  expect(moisture.name()).toEqual('moisture');
  expect(chf.name()).toEqual('curedHerbFraction');
});


import { BpxConfigFuelPrimary, BpxConfigFuelSecondary,
  BpxConfigFuelMoisture, BpxConfigFuelCuredHerbFraction,
  BpxConfigFuelChaparralTotalLoad } from './BpxLeafConfigs';

  it('1: BpxConfigFuelChaparralTotalLoad', () => {
    const leaf = new BpxConfigFuelChaparralTotalLoad();
    expect(leaf.name()).toEqual('chaparralTotalLoad');
    expect(leaf.value()).toEqual('input');
    expect(leaf.value('estimated').value()).toEqual('estimated');
    expect(leaf.value('input').value()).toEqual('input');
    expect(() => { leaf.value('junk'); }).toThrow();
  });

  it('2: BpxConfigFuelPrimary', () => {
    const leaf = new BpxConfigFuelPrimary();
    expect(leaf.name()).toEqual('primary');
    expect(leaf.value()).toEqual('catalog');
    expect(leaf.value('behave').value()).toEqual('behave');
    expect(leaf.value('chaparral').value()).toEqual('chaparral');
    expect(leaf.value('palmettoGallberry').value()).toEqual('palmettoGallberry');
    expect(leaf.value('westernAspen').value()).toEqual('westernAspen');
    expect(leaf.value('catalog').value()).toEqual('catalog');
    expect(() => { leaf.value('junk'); }).toThrow();
  });

  it('3: BpxConfigFuelSecondary', () => {
    const leaf = new BpxConfigFuelSecondary();
    expect(leaf.name()).toEqual('secondary');
    expect(leaf.value()).toEqual('none');
    expect(leaf.value('behave').value()).toEqual('behave');
    expect(leaf.value('chaparral').value()).toEqual('chaparral');
    expect(leaf.value('palmettoGallberry').value()).toEqual('palmettoGallberry');
    expect(leaf.value('westernAspen').value()).toEqual('westernAspen');
    expect(leaf.value('catalog').value()).toEqual('catalog');
    expect(leaf.value('none').value()).toEqual('none');
    expect(() => { leaf.value('junk'); }).toThrow();
  });

  it('4: BpxConfigFuelMoisture', () => {
    const leaf = new BpxConfigFuelMoisture();
    expect(leaf.name()).toEqual('moisture');
    expect(leaf.value()).toEqual('individual');
    expect(leaf.value('liveCategory').value()).toEqual('liveCategory');
    expect(leaf.value('category').value()).toEqual('category');
    expect(leaf.value('catalog').value()).toEqual('catalog');
    expect(leaf.value('individual').value()).toEqual('individual');
    expect(() => { leaf.value('junk'); }).toThrow();
  });

  it('5: BpxConfigFuelCuredHerbFraction', () => {
    const leaf = new BpxConfigFuelCuredHerbFraction(this);
    expect(leaf.name()).toEqual('curedHerbFraction');
    expect(leaf.value()).toEqual('input');
    expect(leaf.value('estimated').value()).toEqual('estimated');
    expect(leaf.value('input').value()).toEqual('input');
    expect(() => { leaf.value('junk'); }).toThrow();
  });

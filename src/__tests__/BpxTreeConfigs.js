import Dag from '../Dag';

test('1: verify BpxTreeConfigs branch structure', () => {
  const name = 'worksheet1';
  const dag = new Dag(name);
  const { configs } = dag.tree;

  let leaf = configs.fuel.primary;
  expect(leaf.name()).toEqual('primary');
  expect(leaf.value()).toEqual('catalog');
  expect(leaf.value('behave').value()).toEqual('behave');
  expect(leaf.value('chaparral').value()).toEqual('chaparral');
  expect(leaf.value('palmettoGallberry').value()).toEqual('palmettoGallberry');
  expect(leaf.value('westernAspen').value()).toEqual('westernAspen');
  expect(leaf.value('catalog').value()).toEqual('catalog');
  expect(() => { leaf.value('junk'); }).toThrow();

  leaf = configs.fuel.secondary;
  expect(leaf.name()).toEqual('secondary');
  expect(leaf.value()).toEqual('none');
  expect(leaf.value('behave').value()).toEqual('behave');
  expect(leaf.value('chaparral').value()).toEqual('chaparral');
  expect(leaf.value('palmettoGallberry').value()).toEqual('palmettoGallberry');
  expect(leaf.value('westernAspen').value()).toEqual('westernAspen');
  expect(leaf.value('catalog').value()).toEqual('catalog');
  expect(leaf.value('none').value()).toEqual('none');
  expect(() => { leaf.value('junk'); }).toThrow();

  leaf = configs.fuel.moisture;
  expect(leaf.name()).toEqual('moisture');
  expect(leaf.value()).toEqual('individual');
  expect(leaf.value('liveCategory').value()).toEqual('liveCategory');
  expect(leaf.value('category').value()).toEqual('category');
  expect(leaf.value('catalog').value()).toEqual('catalog');
  expect(leaf.value('individual').value()).toEqual('individual');
  expect(() => { leaf.value('junk'); }).toThrow();

  leaf = configs.fuel.waf;
  expect(leaf.name()).toEqual('waf');
  expect(leaf.value()).toEqual('input');
  expect(leaf.value('estimated').value()).toEqual('estimated');
  expect(leaf.value('input').value()).toEqual('input');
  expect(() => { leaf.value('junk'); }).toThrow();

  leaf = configs.fuel.curedHerbFraction;
  expect(leaf.name()).toEqual('curedHerbFraction');
  expect(leaf.value()).toEqual('input');
  expect(leaf.value('estimated').value()).toEqual('estimated');
  expect(leaf.value('input').value()).toEqual('input');
  expect(() => { leaf.value('junk'); }).toThrow();

  leaf = configs.fuel.chaparralTotalLoad;
  expect(leaf.name()).toEqual('chaparralTotalLoad');
  expect(leaf.value()).toEqual('input');
  expect(leaf.value('estimated').value()).toEqual('estimated');
  expect(leaf.value('input').value()).toEqual('input');
  expect(() => { leaf.value('junk'); }).toThrow();

  leaf = configs.slope.steepness;
  expect(leaf.name()).toEqual('steepness');
  expect(leaf.value()).toEqual('ratio');
  expect(leaf.value('degrees').value()).toEqual('degrees');
  expect(leaf.value('map').value()).toEqual('map');
  expect(leaf.value('ratio').value()).toEqual('ratio');
  expect(() => { leaf.value('junk'); }).toThrow();

  leaf = configs.wind.direction;
  expect(leaf.name()).toEqual('direction');
  expect(leaf.value()).toEqual('headingFromUpslope');
  expect(leaf.value('upslope').value()).toEqual('upslope');
  expect(leaf.value('sourceFromNorth').value()).toEqual('sourceFromNorth');
  expect(leaf.value('headingFromUpslope').value()).toEqual('headingFromUpslope');
  expect(() => { leaf.value('junk'); }).toThrow();

  leaf = configs.wind.speed;
  expect(leaf.name()).toEqual('speed');
  expect(leaf.value()).toEqual('at20ft');
  expect(leaf.value('at10m').value()).toEqual('at10m');
  expect(leaf.value('at20ft').value()).toEqual('at20ft');
  expect(leaf.value('atMidflame').value()).toEqual('atMidflame');
  expect(() => { leaf.value('junk'); }).toThrow();

  leaf = configs.fire.ewsLimit;
  expect(leaf.name()).toEqual('ewsLimit');
  expect(leaf.value()).toEqual('applied');
  expect(leaf.value('ignored').value()).toEqual('ignored');
  expect(leaf.value('applied').value()).toEqual('applied');
  expect(() => { leaf.value('junk'); }).toThrow();

  leaf = configs.fire.weightingMethod;
  expect(leaf.name()).toEqual('weightingMethod');
  expect(leaf.value()).toEqual('harmonic');
  expect(leaf.value('arithmetic').value()).toEqual('arithmetic');
  expect(leaf.value('expected').value()).toEqual('expected');
  expect(leaf.value('harmonic').value()).toEqual('harmonic');
  expect(() => { leaf.value('junk'); }).toThrow();

  leaf = configs.fire.vector;
  expect(leaf.name()).toEqual('vector');
  expect(leaf.value()).toEqual('fromHead');
  expect(leaf.value('fromUpslope').value()).toEqual('fromUpslope');
  expect(leaf.value('fromNorth').value()).toEqual('fromNorth');
  expect(leaf.value('fromHead').value()).toEqual('fromHead');
  expect(() => { leaf.value('junk'); }).toThrow();
});

test('2:Secondary fuel config', () => {
  const name = 'worksheet1';
  const dag = new Dag(name);
  const { configs } = dag.tree;
  const { primary, secondary } = configs.fuel;

  expect(secondary.value()).toEqual('none');
  expect(secondary.isRequired()).toEqual(false);
});

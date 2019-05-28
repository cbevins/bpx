import Dag from '../Dag';

it('1: Map tree names', () => {
  const name = 'worksheet1';
  const dag = new Dag(name);
  const { tree } = dag;
  const map = tree.site.map;
  expect(tree.name()).toEqual(name);
  expect(map.name()).toEqual('map');
  expect(map.scale.value()).toEqual(1);
  expect(map.factor.value()).toEqual(1);
  expect(map.interval.value()).toEqual(1);
  expect(map.contours.value()).toEqual(0);
  expect(map.distance.value()).toEqual(1);

  dag.setSelected([map.scale, map.factor, map.slope]);
  dag.setValues([
    [map.scale, 24000],
    [map.interval, 20],
    [map.contours, 5],
    [map.distance, 1/12],
  ]);
  expect(map.scale.value()).toEqual(24000);
  expect(map.factor.value()).toEqual(1/24000);
  expect(map.interval.value()).toEqual(20);
  expect(map.contours.value()).toEqual(5);
  expect(map.distance.value()).toEqual(1/12);
  expect(map.scale.value() * map.distance.value()).toEqual(2000); // reach = 2000 ft
  expect(map.interval.value() * map.contours.value()).toEqual(100); // rise = 100 ft
  expect(map.slope.value()).toEqual(0.05);
});

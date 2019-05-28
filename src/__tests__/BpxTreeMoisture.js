import Dag from '../Dag';

test('1: Moisture DAG ops', () => {
  const name = 'worksheet1';
  const dag = new Dag(name);
  const { tree } = dag;
  expect(tree.name()).toEqual(name);

  const d1 = dag.tree.surface.fuel.primary.bed.dead.particle.class1;
  const l1 = dag.tree.surface.fuel.primary.bed.live.particle.class1;

  const moisCfg = dag.tree.configs.fuel.moisture;
  const moisTl1h = dag.tree.site.moisture.dead.tl1h;
  const moisTl10h = dag.tree.site.moisture.dead.tl10h;
  const moisTl100h = dag.tree.site.moisture.dead.tl100h;
  const moisDead = dag.tree.site.moisture.dead.category;

  const moisHerb = dag.tree.site.moisture.live.herb;
  const moisStem = dag.tree.site.moisture.live.stem;
  const moisLive = dag.tree.site.moisture.live.category;

  dag.setSelected([
    moisTl1h, moisTl10h, moisTl100h, moisDead,
    moisHerb, moisStem, moisLive, d1.mois, l1.mois]);

  dag.setValues([
    [moisTl1h, 0.05], [moisTl10h, 0.07], [moisTl100h, 0.09], [moisDead, 0.06],
    [moisHerb, 0.5], [moisStem, 1.5], [moisLive, 2.0]]);

  expect(moisCfg.value()).toEqual('individual'); //'\nMoisture config is \'individual\'');
  expect(moisTl1h.value()).toEqual(0.05); //'Moisture dead 1-h is 0.05');
  expect(moisTl10h.value()).toEqual(0.07); //'Moisture dead 10-h is 0.07');
  expect(moisTl100h.value()).toEqual(0.09); // 'Moisture dead 100-h is 0.09');
  expect(moisDead.value()).toEqual(0.06); // 'Moisture dead category is 0.06');
  expect(moisHerb.value()).toEqual(0.5); // 'Moisture live herb is 0.5');
  expect(moisStem.value()).toEqual(1.5); // 'Moisture live stem is 1.5');
  expect(moisLive.value()).toEqual(2.0); // 'Moisture live category is 2.0');
  expect(d1.mois.value()).toEqual(0.05); // 'Dead particle class 1 moisture is 0.05');
  expect(l1.mois.value()).toEqual(0.5); // 'Live particle class 1 moisture is 0.5');

  dag.setValues([[moisCfg, 'category']]);
  expect(moisCfg.value()).toEqual('category'); // '\nMoisture config is \'category\'');
  expect(moisTl1h.value()).toEqual(0.06); // 'Moisture dead 1-h is 0.06');
  expect(moisTl10h.value()).toEqual(0.06); // 'Moisture dead 10-h is 0.06');
  expect(moisTl100h.value()).toEqual(0.06); // 'Moisture dead 100-h is 0.06');
  expect(moisDead.value()).toEqual(0.06); // 'Moisture dead category is 0.06');
  expect(moisHerb.value()).toEqual(2); // 'Moisture live herb is 2');
  expect(moisStem.value()).toEqual(2); // 'Moisture live stem is 2');
  expect(moisLive.value()).toEqual(2); // 'Moisture live category is 2');
  expect(d1.mois.value()).toEqual(0.06); // 'Dead particle class 1 moisture is 0.06');
  expect(l1.mois.value()).toEqual(2); // 'Live particle class 1 moisture is 2');
});

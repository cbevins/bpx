import { BpxTreeMoisture, BpxTreeMoistureDead, BpxTreeMoistureLive }
  from './BpxTreeMoisture';

const mois = new BpxTreeMoisture();
const dead = new BpxTreeMoistureDead(mois);
const live = new BpxTreeMoistureLive(mois);

it('1: Config Leaf names', () => {
  expect(mois.name()).toEqual('moisture');
  expect(dead.name()).toEqual('dead');
  expect(live.name()).toEqual('live');
});

import DagLeaf from './DagLeaf';

const leaf = new DagLeaf(null, 'someLeaf');

it('1: Leaf initial state', () => {
  expect(leaf.name()).toEqual('someLeaf');
  expect(leaf.cost()).toEqual(0);
  expect(leaf.desc()).toEqual('');
  expect(leaf.order()).toEqual(0);
  expect(leaf.value()).toEqual(null);
  expect(leaf.users()).toEqual([]);

  expect(leaf.isOption()).toEqual(false);
  expect(leaf.isConfig()).toEqual(false);
  expect(leaf.isBound()).toEqual(false);
  expect(leaf.isCalc()).toEqual(false);
  expect(leaf.isFixed()).toEqual(true);
  expect(leaf.isInput()).toEqual(false);
  expect(leaf.isRequired()).toEqual(false);
  expect(leaf.isSelected()).toEqual(false);
  expect(leaf.required()).toEqual(0);
});

it('2: Leaf getters and setters', () => {
  expect(leaf.value(123).value(456).value(789)).toEqual(leaf);
  expect(leaf.value()).toEqual(789);

  expect(leaf.cost(1234)).toEqual(leaf);
  expect(leaf.cost()).toEqual(1234);

  expect(leaf.desc('A new Leaf')).toEqual(leaf);
  expect(leaf.desc()).toEqual('A new Leaf');

  expect(leaf.setSelected()).toEqual(leaf);
  expect(leaf.isSelected()).toEqual(true);

  expect(leaf.setSelected(false)).toEqual(leaf);
  expect(leaf.isSelected()).toEqual(false);

  expect(leaf.setSelected(true)).toEqual(leaf);
  expect(leaf.isSelected()).toEqual(true);

  expect(leaf.required()).toEqual(0);
  expect(leaf.isRequired()).toEqual(false);

  expect(leaf.setRequired()).toEqual(leaf);
  expect(leaf.isRequired()).toEqual(true);
  expect(leaf.required()).toEqual(1);

  expect(leaf.setRequired()).toEqual(leaf);
  expect(leaf.isRequired()).toEqual(true);
  expect(leaf.required()).toEqual(2);
});

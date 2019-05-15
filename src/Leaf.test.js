import Leaf from './Leaf';

it('creates a new Leaf "mainBranch"', () => {
  const leaf = new Leaf(null, 'someLeaf');
  expect(leaf.name()).toEqual('someLeaf');
  expect(leaf.cost()).toEqual(0);

  expect(leaf.value(123).value(456).value(789)).toEqual(leaf);
  expect(leaf.value()).toEqual(789);
  expect(leaf.isOption()).toEqual(false);
  expect(leaf.isConfig()).toEqual(false);
  expect(leaf.isBound()).toEqual(false);
  expect(leaf.isCalc()).toEqual(false);
  //expect(leaf.isFixed()).toEqual(false);
  expect(leaf.isInput()).toEqual(false);
  expect(leaf.isRequired()).toEqual(false);
  expect(leaf.isSelected()).toEqual(false);
  expect(leaf.required()).toEqual(0);

  expect(leaf.setCost(1234)).toEqual(leaf);
  expect(leaf.cost()).toEqual(1234);

  expect(leaf.setDesc('A new Leaf')).toEqual(leaf);
  expect(leaf.desc()).toEqual('A new Leaf');
});

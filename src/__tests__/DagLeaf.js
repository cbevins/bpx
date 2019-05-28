import DagLeaf from '../DagLeaf';
import DagLeafConfig from '../DagLeafConfig';

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

it('3: Leaf errors', () => {
  const nonLeaf = {};
  const realLeaf = new DagLeaf();
  const nonConfig = {};
  const nonMethod = {};
  const method = Math.max;
  const config = new DagLeafConfig(this,'dummy')
    .header('Dummy config for testing purposes')
    .item('item', 'Item 1', true);
  expect(() => { leaf.bind(nonLeaf); }).toThrow();
  expect(() => { leaf.bindIf(nonConfig, 'junk', nonLeaf); }).toThrow();
  expect(() => { leaf.bindIf(config, 'junk', nonLeaf); }).toThrow();
  expect(() => { leaf.bindIf(config, 'item', nonLeaf); }).toThrow();

  expect(() => { leaf.calc(nonMethod); }).toThrow();
  expect(() => { leaf.calcIf(nonConfig, 'junk'); }).toThrow();
  expect(() => { leaf.calcIf(nonConfig, 'junk', nonMethod); }).toThrow();
  expect(() => { leaf.calcIf(nonConfig, 'junk', method); }).toThrow();
  expect(() => { leaf.calcIf(nonConfig, 'item', method); }).toThrow();
  expect(() => { leaf.calcIf(config, 'junk', nonMethod); }).toThrow();
  expect(() => { leaf.calcIf(config, 'junk', method); }).toThrow();
  expect(() => { leaf.calcIf(config, 'item', nonMethod); }).toThrow();

  expect(() => { leaf.fixed(); }).toThrow();
  expect(() => { leaf.fixed(realLeaf); }).toThrow();
  expect(() => { leaf.fixedIf(nonConfig, 'junk'); }).toThrow();
  expect(() => { leaf.fixedIf(nonConfig, 'junk', realLeaf); }).toThrow();
  expect(() => { leaf.fixedIf(nonConfig, 'item', realLeaf); }).toThrow();
  expect(() => { leaf.fixedIf(config, 'junk', realLeaf); }).toThrow();
  expect(() => { leaf.fixedIf(config, 'junk', 1); }).toThrow();
  expect(() => { leaf.fixedIf(config, 'item', realLeaf); }).toThrow();
  expect(() => { leaf.fixedIf(config, 'item'); }).toThrow();

  expect(() => { leaf.inputIf(nonConfig); }).toThrow();
  expect(() => { leaf.inoputIf(nonConfig, 'junk'); }).toThrow();
})

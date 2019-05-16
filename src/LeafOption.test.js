import LeafOption from './LeafOption';

it('creates a new LeafOption "optionLeaf"', () => {
  const leaf = new LeafOption(null, 'leafOption');
  expect(leaf.name()).toEqual('leafOption');
  expect(leaf.desc()).toEqual('');
  expect(leaf.header()).toEqual('');
  expect(leaf.itemCount()).toEqual(0);
  expect(leaf.dflt()).toBeNull();
  expect(leaf.isOption()).toEqual(true);
  expect(leaf.isConfig()).toEqual(false);

  expect(leaf.header('Here are the options:')).toEqual(leaf);
  expect(leaf.header()).toEqual('Here are the options:');

  expect(leaf.hasOption('option1')).toEqual(false);
  expect(leaf.item('option1', 'This is Option 1', true)).toEqual(leaf);
  expect(leaf.hasOption('option1')).toEqual(true);
  expect(leaf.itemCount()).toEqual(1);
  expect(leaf.dflt()).toEqual('option1');
  expect(leaf.value()).toEqual('option1');

  expect(leaf.item('option2', 'This is Option 2')).toEqual(leaf);
  expect(leaf.hasOption('option2')).toEqual(true);
  expect(leaf.itemCount()).toEqual(2);
  expect(leaf.dflt()).toEqual('option1');
  expect(leaf.value()).toEqual('option1');
  expect(leaf.dflt('option2')).toEqual(leaf);
  expect(leaf.dflt()).toEqual('option2');

  expect(leaf.value()).toEqual('option1');
  expect(leaf.item('option2')).toEqual('This is Option 2');
  expect(leaf.value('option2')).toEqual(leaf);
  expect(leaf.value()).toEqual('option2');

  expect(() => { leaf.ensureOption('option3'); }).toThrow();

  expect(leaf.isInput()).toEqual(false);

});

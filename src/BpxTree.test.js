import BpxTree from './BpxTree';

it('1: BpxTree initial state', () => {
  const name = 'BehavePlusExplorer';
  const desc = 'BehavePlus Explorer in Javascript and React';
  const branch = new BpxTree(name).desc(desc);
  expect(branch.name()).toEqual(name);
  expect(branch.desc()).toEqual(desc);
  expect(branch.fullName()).toEqual(name);
  expect(branch.label()).toEqual(name);
  expect(branch.parent()).toEqual(null);
  expect(branch.connect()).toEqual(branch);

  expect(branch.label('BehavePlus Explorer')).toEqual(branch);
  expect(branch.label()).toEqual('BehavePlus Explorer');
});

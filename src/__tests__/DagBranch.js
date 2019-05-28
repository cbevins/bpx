import DagBranch from '../DagBranch';

it('creates a new DagBranch named "mainBranch"', () => {
  const name = 'mainBranch';
  const branch = new DagBranch(null, name);
  expect(branch.name()).toEqual(name);
  expect(branch.desc()).toEqual('');
  expect(branch.fullName()).toEqual(name);
  expect(branch.label()).toEqual(name);
  expect(branch.parent()).toEqual(null);
  expect(branch.connect()).toEqual(branch);

  expect(branch.desc('A new branch')).toEqual(branch);
  expect(branch.desc()).toEqual('A new branch');

  expect(branch.label('A new label')).toEqual(branch);
  expect(branch.label()).toEqual('A new label');

  const branch2 = new DagBranch(branch, 'subBranch');
  expect(branch2.parent()).toEqual(branch);
  expect(branch2.fullName()).toEqual('mainBranch.subBranch');
});

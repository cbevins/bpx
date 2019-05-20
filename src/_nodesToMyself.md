# React - Jest Tests and Coverage

To force all tests to be run and all files included in coverage reports:
- Open the file C:/cbevins/dev/www/bpx/node_modules/react-scripts/scripts/test.js
- Change function isInGitRepository() to always return FALSE at line 45

# Script Invocation Sequences

The package.json 'scripts' all invoke the file <code>bpx/node_modules/.bin/react-scripts.cmd</code> with one of the args 'build', 'eject', 'start', or 'test'.

In turn, the <code>react-scripts.cmd</code>, from within the <code>ELSE</code> block, invokes <code>bpx/node_modules/react-scripts/bin/react-scripts.js</code>

The <code>react-scripts.js</code> has a <code>switch</code> block for each arg.
For 'test', it invokes <code>bpx/node_modules/react-scripts/scripts/test.js</code>

To force all tests to be run and all files included in the coverage report:
- Edit <code>C:/cbevins/dev/www/bpx/node_modules/react-scripts/scripts/test.js</code> function isInGitRepository() to always return FALSE around line 45.
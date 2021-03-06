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

# Wind

Configurators:
- configs.fuel.waf is 'input' or 'estimated'
- configs.wind.speed is 'at10m', 'at20ft', or 'atMidflame'

Each FuelBed ('primary' and 'secondary') has its own:
- estimatedWaf based on its own fuel depth

# To Do
- All DagLeaf* declarations should be made in BASE BpxTree* classes
  without any connect() implementation.

- The implemented BpxTree* classes
  - inherit from one of the BASE classes and
  - has a connect() implementation.

- This isolates tree implementation, especially relating to leaf bindings and inputs, from the (re-usable) structure.

# Analysis

- Always produce a table of batch run results (1 result per run)

- Always produce a pageable record view report (1 page per run)

- If 1 multi-valued input leafs
  - Offer table/graph from menu of all selected leafs v the range leaf
    - Ros over TL1h
    - FLI over TL1h
    - Flame over TL1h

- If 2 multi-valued input leafs:
  - Offer 2-way table/graph of all selected by range var a/b and b/a
    - Ros over tl1h at each ws20
    - Ros over ws20 at each tl1h

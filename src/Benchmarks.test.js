import Dag from './Dag';
import { BenchmarkFm010In, BenchmarkFm010Out } from './BenchmarkFm010';
import { BenchmarkFm124In, BenchmarkFm124Out } from './BenchmarkFm124';

function approx(desc, actual, expected, prec = 12) {
  if (typeof expected === 'number') {
    let result = actual.toPrecision(prec) === expected.toPrecision(prec);
    if ( ! result ) {
      console.log(`*** ${desc}`);
    }
    return result;
  }
  return actual === expected;
}

let tests = [];
function getTests(treeItem, outItem) {
  if ( outItem !== null ) {
    Object.keys(outItem).forEach((child) => {
      if (typeof outItem[child] === 'object') {
        getTests(treeItem[child], outItem[child]);
      } else {
        //console.log(treeItem[child].fullName());
        tests.push({
          leaf: treeItem[child],
          expected: outItem[child],
        });
      }
    });
  }
}

function setInputs(treeItem, inpItem) {
  Object.keys(inpItem).forEach((child) => {
    if (typeof inpItem[child] === 'object') {
      setInputs(treeItem[child], inpItem[child]);
    } else {
      treeItem[child].value(inpItem[child]);
    }
  });
}

test('1: FM 124 Benchmark', () => {
  const name = 'fm124';
  const dag = new Dag(name);
  const { tree } = dag;
  expect(tree.name()).toEqual(name);

  setInputs(tree, BenchmarkFm124In);
  tests = [];
  getTests(tree, BenchmarkFm124Out);

  const selected = [];
  tests.forEach((t) => {
    selected.push(t.leaf);
  });
  dag.setSelected(selected);

  tests.forEach((t) => {
    let desc = `${t.leaf.label()}: expected='${t.expected}', actual='${t.leaf.value()}'`;
    expect(approx(desc, t.leaf.value(), t.expected)).toEqual(true);
  });
});

test('2: FM 010 Benchmark', () => {
  const name = 'fm010';
  const dag = new Dag(name);
  const { tree } = dag;
  expect(tree.name()).toEqual(name);

  setInputs(tree, BenchmarkFm010In);
  tests = [];
  getTests(tree, BenchmarkFm010Out);

  const selected = [];
  tests.forEach((t) => {
    selected.push(t.leaf);
  });
  dag.setSelected(selected);

  tests.forEach((t) => {
    let desc = `${t.leaf.label()}: expected='${t.expected}', actual='${t.leaf.value()}'`;
    expect(approx(desc, t.leaf.value(), t.expected)).toEqual(true);
  });
});

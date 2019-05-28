import Dag from './Dag';
import {
  BenchmarkFm010In,
  BenchmarkFm010FuelOut,
  BenchmarkFm010FireOut,
  BenchmarkFm010EllipseOut,
} from './BenchmarkFm010';
import {
  BenchmarkFm124In,
  BenchmarkFm124FuelOut,
  BenchmarkFm124FireOut,
  BenchmarkFm124EllipseOut,
} from './BenchmarkFm124';

function approx(desc, actual, expected, prec = 7) {
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

function runTest(runLabel, testIn, testOut, precision) {
  const name = 'benchmark';
  const dag = new Dag(name);
  const { tree } = dag;
  expect(tree.name()).toEqual(name);

  setInputs(tree, testIn);
  tests = [];
  getTests(tree, testOut);

  const selected = [];
  tests.forEach((t) => {
    selected.push(t.leaf);
  });
  dag.setSelected(selected);

  tests.forEach((t) => {
    let desc = `${runLabel} ${t.leaf.label()}:\nexpected='${t.expected}'\n  actual='${t.leaf.value()}'`;
    expect(approx(desc, t.leaf.value(), t.expected, precision)).toEqual(true);
  });
}

test('1: Benchmark FM 124', () => {
//  runTest('FM 124 Fuel', BenchmarkFm124In, BenchmarkFm124FuelOut, 12);
//  runTest('FM 124 Fire', BenchmarkFm124In, BenchmarkFm124FireOut, 7);
  runTest('FM 124 Ellipse', BenchmarkFm124In, BenchmarkFm124EllipseOut, 6);
})

test('2: Benchmark FM 10', () => {
//  runTest('FM 10 Fuel', BenchmarkFm010In, BenchmarkFm010FuelOut, 12);
//  runTest('FM 10 Fire', BenchmarkFm010In, BenchmarkFm010FireOut, 8);
  runTest('FM 10 Ellipse', BenchmarkFm010In, BenchmarkFm010EllipseOut, 7);
})

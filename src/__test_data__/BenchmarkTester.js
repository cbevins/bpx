import Dag from '../Dag';

export default class BenchmarkTester {
  constructor(desc, defaultPrecision=12) {
    this.desc = desc;
    this.tests = [];
    this.defaultPrecision=defaultPrecision;
  }

  approx(testPair) {
    const actual = testPair.leaf.value();
    const expected = testPair.expected;
    const prec = testPair.precision;
    let result = true;
    if (typeof expected === 'number') {
      result = actual.toPrecision(prec) === expected.toPrecision(prec);
      if ( ! result ) {
        console.log(`*** ${this.desc} ${testPair.leaf.label()}:\nexpected='${expected}'\n  actual='${actual}' at precision=${prec}`);
      }
    } else {
      result = actual === expected;
      if ( ! result ) {
        console.log(`*** ${this.desc} ${testPair.leaf.label()}:\nexpected='${expected}'\n  actual='${actual}'`);
      }
    }
    return result;
  }

  getTests(treeItem, outItem) {
    if ( outItem !== null ) {
      if ( Array.isArray(outItem) ) {
        this.tests.push({
          leaf: treeItem,
          expected: outItem[0],
          precision: outItem[1],
        });
      } else if (typeof outItem === 'object') {
        Object.keys(outItem).forEach((child) => {
          this.getTests(treeItem[child], outItem[child]);
        });
      } else {
        this.tests.push({
          leaf: treeItem,
          expected: outItem,
          precision: this.defaultPrecision,
        });
      }
    }
  }

  setInputs(treeItem, inpItem) {
    Object.keys(inpItem).forEach((child) => {
      if (typeof inpItem[child] === 'object') {
        this.setInputs(treeItem[child], inpItem[child]);
      } else {
        treeItem[child].value(inpItem[child]);
      }
    });
  }

  test(dag, dagInputTree, expectedInputTree,
      dagTree, outputTree ) {
    this.setInputs(dagInputTree, expectedInputTree);
    this.tests = [];
    this.getTests(dagTree, outputTree);

    const selected = [];
    this.tests.forEach((t) => {
      selected.push(t.leaf);
    });
    dag.clearSelected();
    dag.setSelected(selected);

    this.tests.forEach((t) => {
      expect(this.approx(t)).toEqual(true);
    });
  }
}

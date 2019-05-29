import Dag from '../Dag';

export default class BenchmarkTester {
  constructor(desc, defaultPrecision=12) {
    this.desc = desc;
    this.leafTests = [];
    this.defaultPrecision=defaultPrecision;
  }

  approx(leafTest) {
    const actual = leafTest.leaf.value();
    const expected = leafTest.expected;
    const prec = leafTest.precision;
    let result = true;
    if (typeof expected === 'number') {
      result = actual.toPrecision(prec) === expected.toPrecision(prec);
      if ( ! result ) {
        console.log(`*** ${this.desc} ${leafTest.leaf.label()}:\nexpected='${expected}'\n  actual='${actual}' at precision=${prec}`);
      }
    } else {
      result = actual === expected;
      if ( ! result ) {
        console.log(`*** ${this.desc} ${leafTest.leaf.label()}:\nexpected='${expected}'\n  actual='${actual}'`);
      }
    }
    return result;
  }

  getTests(treeItem, outItem) {
    if ( outItem !== null ) {
      if ( Array.isArray(outItem) ) {
        this.leafTests.push({
          leaf: treeItem,
          expected: outItem[0],
          precision: outItem[1],
        });
      } else if (typeof outItem === 'object') {
        Object.keys(outItem).forEach((child) => {
          this.getTests(treeItem[child], outItem[child]);
        });
      } else {
        this.leafTests.push({
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
        //console.log('Input for: '+child);
        treeItem[child].value(inpItem[child]);
      }
    });
  }

  test(dag, dagInputTree, expectedInputTree,
      dagTree, outputTree ) {
    this.setInputs(dagInputTree, expectedInputTree);
    this.leafTests = [];
    this.getTests(dagTree, outputTree);

    const selectedLeafs = [];
    this.leafTests.forEach((leafTest) => {
      selectedLeafs.push(leafTest.leaf);
    });
    dag.clearSelected();
    dag.setSelected(selectedLeafs);

    this.leafTests.forEach((leafTest) => {
      expect(this.approx(leafTest)).toEqual(true);
    });
  }
}

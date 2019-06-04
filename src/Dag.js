/**
 * @file Defines the DAG (directed acyclic graph)
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagLeaf from './DagLeaf';
import BpxTree from './BpxTree';

export default class Dag {
  constructor(name, dagTree=undefined) {
    this.name = name;
    this.tree = (typeof dagTree === 'undefined' ) ? new BpxTree(name) : dagTree;
    this.leafs = [];
    this.requiredLeafs = [];
    this.requiredConfigLeafs = [];
    this.requiredInputLeafs = [];
    this.selectedLeafs = [];
    this.storedLeafs = [];
    this.autoConfig = true;
    this.autoUpdate = true;
    this.batch = {
      stack: [], // topologically ordered stack of required input, derived, and bound DagLeafs
      bound: 0, // number of bound DagLeaf calls
      config: 0, // number of Config DagLeaf  calls
      derived: 0, // number of calculated DagLeaf calls
      fixed: 0, // number of fixed leaf calls
      input: 0, // number of input DagLeaf calls
      results: 0, // number of results stored
      stored: 0, // number of items stored (results * stored)
      runLimit: 1000, // maximum number of results (iterations)
      storeLimit: 10000, // maximum number of stored items
      elapsed: 0, // elapsed milliseconds
      debug: false,
    };
    this.build();
  }

  build() {
    this.leafs = [];
    this.connectItems(this.tree);
    this.constructLeafsArray(this.tree);
    this.leafs.forEach((leaf) => {
      if (leaf.label() === null || leaf.label === '' ) {
        leaf.label(leaf.fullName());
      }
    });
    this.reconfigure();
  }

  rebuild() {
    this.leafs.forEach((leaf) => {
      leaf.own.configs = [];
    });
    this.build();
  }

  clearSelected() {
    this.leafs.forEach((leaf) => {
      leaf.setSelected(false);
    });
    if (this.autoConfig) {
      this.reconfigure(); // will also autoUpdate if enabled
    } else if (this.autoUpdate) {
      this.update();
    }
  }

  connectItems(item) {
    Object.keys(item).forEach((child) => {
      item[child].connect(this.tree);
      if (!(item[child] instanceof DagLeaf)) {
        this.connectItems(item[child]);
      }
    });
  }

  constructLeafsArray(tree) {
    Object.keys(tree).forEach((item) => {
      if (tree[item] instanceof DagLeaf) {
        this.leafs.push(tree[item]);
      } else {
        this.constructLeafsArray(tree[item]);
      }
    });
  }

  // NOTE that argsObj is an object, not any array
  static ensureDefined(funcName, argsObj) {
    Object.keys(argsObj).forEach((argName) => {
      if (typeof argsObj[argName] === 'undefined') {
        throw new Error(`'${funcName}()' arg '${argName}' is undefined`);
      }
    });
  }

  static debug(msg) {
    /* eslint-disable no-console */
    console.log(msg);
  }

  getName() {
    return this.name;
  }

  // Returns array of references to required Leafs.
  getRequiredLeafs() {
    return this.requiredLeafs;
  }

  // Returns array of references to required LeafConfigs.
  getRequiredConfigLeafs() {
    return this.requiredConfigLeafs;
  }

  // Returns array of references to required input Leafs.
  getRequiredInputLeafs() {
    return this.requiredInputLeafs;
  }

  // Returns array of references to selected Leafs.
  getSelectedLeafs() {
    return this.selectedLeafs;
  }

  reconfigure() {
    this.reconfigure1Leafs();
    this.reconfigure2LeafEdges();
    this.reconfigure3LeafCosts();
    this.reconfigure4SelectedLeafsArray();
    this.reconfigure5LeafRequired();
    this.reconfigure6RequiredLeafsArray();
    this.reconfigure7RequiredConfigLeafsArray();
    this.reconfigure8RequiredInputLeafsArray();
    this.reconfigure9ClearResults();
    this.storedLeafs = [...this.requiredInputLeafs, ...this.selectedLeafs];
    if (this.autoUpdate) {
      this.update();
    }
  }

  reconfigure1Leafs() {
    this.leafs.forEach((leaf) => {
      leaf.config();
    });
  }

  reconfigure2LeafEdges() {
    this.leafs.forEach((leaf) => {
      leaf.configEdges();
    });
  }

  // Determines cost (depth) of each node and DAG topolological order
  // Must be called whenever the configuration changes
  reconfigure3LeafCosts() {
    // Determine the topological cost of each leaf
    this.leafs.forEach((leaf) => {
      this.reconfigure3LeafCostFor(leaf);
    });
    // Order the leaf array by decreasing cost
    this.leafs.sort((a, b) => b.cost() - a.cost());
    // Store toplogical order with the Variants
    for (let idx = 0; idx < this.leafs.length; idx += 1) {
      this.leafs[idx].order(idx);
    }
  }

  // Determines cost of a single DagLeaf
  reconfigure3LeafCostFor(leaf) {
    let cost = leaf.cost();
    if (cost === 0) {
      // if (this.name === 'dumpCosts') {
      //   console.log(leaf.fullName());
      // }
      // During topological sorting, if multiple nodes have the same cost,
      // it is better that any input nodes are processed last.
      // So give non-input nodes twice the cost as input nodes.
      cost = (leaf.isInput()) ? 1 : 2;
      leaf.users().forEach((userLeaf) => {
        cost += this.reconfigure3LeafCostFor(userLeaf);
      });
      leaf.cost(cost);
    }
    return cost;
  }

  reconfigure4SelectedLeafsArray() {
    this.selectedLeafs = [];
    this.leafs.forEach((leaf) => {
      if (leaf.isSelected()) {
        this.selectedLeafs.push(leaf);
      }
    });
  }

  reconfigure5LeafRequired() {
    this.selectedLeafs.forEach((leaf) => {
      leaf.configRequired();
    });
  }

  // Updates the array of required leafs in topological order
  reconfigure6RequiredLeafsArray() {
    this.requiredLeafs = [];
    this.leafs.forEach((leaf) => {
      if (leaf.isRequired()) {
        this.requiredLeafs.push(leaf);
      }
    });
  }

  reconfigure7RequiredConfigLeafsArray() {
    this.requiredConfigLeafs = [];
    this.leafs.forEach((leaf) => {
      if (leaf.isRequired() && leaf.isConfig()) {
        this.requiredConfigLeafs.push(leaf);
      }
    });
  }

  reconfigure8RequiredInputLeafsArray() {
    this.requiredInputLeafs = [];
    this.leafs.forEach((leaf) => {
      if (leaf.isRequired() && leaf.isInput()) {
        this.requiredInputLeafs.push(leaf);
      }
    });
  }

  reconfigure9ClearResults() {
    this.leafs.forEach((leaf) => {
      leaf.clearResults();
    });
    this.results = [];
  }

  // Array of [leaf, [inputValues]] records
  // Does not trigger a reconfigure
  setBatchInputs(inputsArray) {
    inputsArray.forEach((input) => {
      const [leaf, valuesArray] = input;
      leaf.setInputValues(valuesArray);
    });
  }

  setSelected(leafArray, toggle = true) {
    //const leafArray = Array.isArray(leaves) ? leaves : [leaves];
    if (!Array.isArray(leafArray)) {
      throw new Error('Dag.setSelected() arg must be an array of DagLeafs');
    }
    leafArray.forEach((leaf) => {
      Dag.ensureDefined('Dag.setSelected', { leaf });
      leaf.setSelected(toggle);
    });
    if (this.autoConfig) {
      this.reconfigure(); // will also autoUpdate if enabled
    } else if (this.autoUpdate) {
      this.update();
    }
  }

  setValue(leaf, value) {
    Dag.ensureDefined('Dag.setValue', { leaf, value });
    leaf.value(value);
    if (this.autoConfig && leaf.isConfig()) {
      this.reconfigure(); // will also autoUpdate if enabled
    } else if (this.autoUpdate) {
      this.update();
    }
    return leaf;
  }

  // Array of [leaf, value] records
  setValues(inputsArray) {
    if (!Array.isArray(inputsArray)) {
      throw new Error('Dag.setValues() arg must be an array of 2-element arrays');
    }
    let configs = 0;
    inputsArray.forEach((input) => {
      if (!Array.isArray(input) || input.length !== 2) {
        throw new Error('Dag.setValues() arg must be an array of 2-element arrays');
      }
      const [leaf, value] = input;
      Dag.ensureDefined('Dag.setValues', { leaf, value });
      if (leaf.isConfig()) {
        configs += 1;
      }
      leaf.value(value);
    });
    if (this.autoConfig && configs) {
      this.reconfigure(); // will also autoUpdate if enabled
    } else if (this.autoUpdate) {
      this.update();
    }
  }

  unSelect(leafArray) {
    this.setSelected(leafArray, false);
  }

  update() {
    // this.requiredLeafs is already be in topological order!!!
    this.requiredLeafs.forEach((leaf) => {
      leaf.update();
    });
  }

  updateBatch() {
    // \TODO Use local iterators for required input
    // instead of making them properties of the Variant itself
    // (That way, can even have multiple iterators simultaenously)

    // Yoyo the stack
    let vidx = 0;
    let delta = 1;
    const args = [];
    let leaf = null;
    this.batch = {
      stack: [],
      bound: 0, // number of bound DagLeaf calls
      config: 0, // number of Config DagLeaf  calls
      derived: 0, // number of calculated DagLeaf calls
      fixed: 0, // number of fixed leaf calls
      input: 0, // number of input DagLeaf calls
      results: 0, // number of results stored
      stored: 0, // number of items stored (results * stored)
      steps: 0,
      runLimit: 1000, // maximum number of results (iterations)
      storeLimit: 10000, // maximum number of stored items
      elapsed: Date.now(), // elapsed milliseconds
      debug: false,
    };
    const { debug } = this.batch;
    let p = ''; // \TODO Remove after debugging
    let fid = null;
    let val = null;
    this.reconfigure9ClearResults();
    // Thin the stack
    this.requiredLeafs.forEach((required) => {
      if (!required.isConfig() && !required.isFixed()) {
        this.batch.stack.push(required);
      }
    });
    const last = this.batch.stack.length;
    if (debug) {
      Dag.debug(`BATCH processing ${last} DagLeafs`);
    }
    while (vidx >= 0) {
      this.batch.steps += 1;
      if (debug) {
        p = `    ${this.batch.steps}@${vidx} `;
      }
      leaf = this.batch.stack[vidx];
      if (debug) {
        fid = leaf.fullName();
        val = leaf.value();
      }
      // If progressing down the stack in topological order (towards vidx===last)
      if (delta > 0) {
        p += 'DOWN to ';
        // If INPUT, reset the Variant's current value to the first input value
        if (leaf.isInput()) {
          leaf.own.iptr = 0;
          leaf.own.value = leaf.own.inputs[leaf.own.iptr];
          if (debug) {
            this.batch.input += 1;
            Dag.debug(`${p}INPUT ${fid} idx=${leaf.own.iptr}, '${val}'`);
          }
        } else if (leaf.isConfig()) {
          // If CONFIG, nothing to do as the value is already set
          if (debug) {
            this.batch.config += 1;
            Dag.debug(`${p}CONFIG ${fid} '${val}'`);
          }
        } else if (leaf.isFixed()) {
          // If FIXED, nothing to do as the value is already set
          if (debug) {
            this.batch.fixed += 1;
            Dag.debug(`${p}FIXED ${fid} '${val}'`);
          }
        } else if (leaf.isBound()) {
          // If BOUND, update the Variant's current value to the bound Variant's current value
          leaf.update();
          if (debug) {
            this.batch.bound += 1;
            Dag.debug(`${p}BOUND ${fid} '${val}'`);
          }
        } else {
          // Otherwise, update the Variant's current value by calling a function
          leaf.update();
          if (debug) {
            this.batch.derived += 1;
            Dag.debug(`${p}DERIVED ${fid} '${val}', args=[${args.join(', ')}]`);
          }
        }
      } else if (delta < 0) {
        // Else if progressing up the stack in toplogical order (towards vidx===0)
        p += 'UP to ';
        if (leaf.isInput()) {
          // this is an input Variant; does it have more values to process?
          leaf.own.iptr += 1;
          if (leaf.own.iptr < leaf.own.inputs.length) {
            // there are more input values to process
            leaf.own.value = leaf.own.inputs[leaf.own.iptr];
            // so go back down the stack
            delta = 1;
            if (debug) {
              Dag.debug(`${p}${fid}: iterating DOWN for idx=${leaf.own.iptr} '${val}'`);
            }
          } else {
            delta = -1;
            if (debug) {
              Dag.debug(`${p}${fid}: DONE iterating`);
            }
          }
        } else {
          // All other Variant types keep going up the stack
          delta = -1;
          if (debug) {
            Dag.debug(`${p}${fid}`);
          }
        }
      } // delta < 0
      vidx += delta;
      if (vidx === last) {
        // Store selected values and go back up the stack
        this.storedLeafs.forEach((storeLeaf) => {
          storeLeaf.store();
        });
        this.batch.results += 1;
        this.batch.stored += this.storedLeafs.length;
        if (this.batch.results >= this.batch.runLimit
            || this.batch.stored >= this.batch.storeLimit) {
          break;
        }
        if (debug) {
          Dag.debug('At LAST LEAF: store results; heading back UP');
        }
        delta = -1;
        vidx += delta;
      }
    } // while
    this.batch.elapsed = Date.now() - this.batch.elapsed;
    if (debug) {
      Dag.debug(`Batch run produced ${this.batch.results} results sets`);
      Dag.debug(`  ${this.batch.derived} calculated`);
      Dag.debug(`  ${this.batch.bound} bound DagLeaf updates`);
      Dag.debug(`  ${this.batch.config} config DagLeaf updates`);
      Dag.debug(`  ${this.batch.fixed} fixed DagLeaf updates`);
      Dag.debug(`  ${this.batch.input} input DagLeaf updates`);
      Dag.debug(`  ${this.batch.elasped} elapsed milliseconds`);
    }
  }
}

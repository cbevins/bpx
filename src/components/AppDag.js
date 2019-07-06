import Dag from '../Dag';
import basicWorksheet from '../worksheet/BasicWorksheet';

export default class AppDag {
  static init(name) {
    this.dag = new Dag(name);
    //this.dag.autoUpdate = false;
    basicWorksheet(this.dag);
    this.dag.updateBatch();
    this.stateUpdater = null;
  }

  static getConfigs() {
    return this.dag.tree.configs;
  }

  static getDag() {
    return this.dag;
  }

  static getTree() {
    return this.dag.tree;
  }

  static setBatchInputs(leaf, values) {
    this.dag.setBatchInputs([[leaf, values]]);
    this.dag.updateBatch(); // added
    this.stateUpdater();
  }

  static setStateUpdater(stateUpdater) {
    this.stateUpdater = stateUpdater;
  }

  static select(leaf) {
    this.dag.setSelected([leaf]);
    this.dag.updateBatch(); // added
    this.stateUpdater();
  }

  static setConfig(leaf, value) {
    this.dag.setValue(leaf, value);
    this.dag.updateBatch(); // added
    this.stateUpdater();
  }

  static unselect(leaf) {
    this.dag.unSelect([leaf]);
    this.dag.updateBatch(); // added
    this.stateUpdater();
  }

  static updateBatch(debug=false) {
    this.dag.updateBatch(debug);
    this.stateUpdater();
  }

  static updateState() {
    this.stateUpdater();
  }
}

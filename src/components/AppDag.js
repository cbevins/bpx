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

  static setBatchInputs(leaf, values, updateProgress=undefined) {
    this.dag.setBatchInputs([[leaf, values]]);
    this.dag.updateBatch(false, updateProgress);
    this.stateUpdater();
  }

  static setStateUpdater(stateUpdater) {
    this.stateUpdater = stateUpdater;
  }

  static select(leaf, updateProgress=undefined) {
    this.dag.setSelected([leaf]);
    this.dag.updateBatch(false, updateProgress);
    this.stateUpdater();
  }

  static setConfig(leaf, value, updateProgress=undefined) {
    this.dag.setValue(leaf, value);
    this.dag.updateBatch(false, updateProgress);
    this.stateUpdater();
  }

  static unselect(leaf, updateProgress=undefined) {
    this.dag.unSelect([leaf]);
    this.dag.updateBatch(false, updateProgress);
    this.stateUpdater();
  }

  static updateBatch(debug=false, updateProgress=undefined) {
    this.dag.updateBatch(false, updateProgress);
    this.stateUpdater();
  }

  static updateState() {
    this.stateUpdater();
  }
}

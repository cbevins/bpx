import Dag from '../Dag';

export default class AppDag {
  static init(name) {
    this.dag = new Dag(name);
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
    this.stateUpdater();
  }

  static setStateUpdater(stateUpdater) {
    this.stateUpdater = stateUpdater;
  }

  static select(leaf) {
    this.dag.setSelected([leaf]);
    this.stateUpdater();
  }

  static setValue(leaf, value) {
    this.dag.setValue(leaf, value);
    this.stateUpdater();
  }

  static unselect(leaf) {
    this.dag.unSelect([leaf]);
    this.stateUpdater();
  }

  static updateBatch(debug=false) {
    this.dag.updateBatch(debug);
    this.stateUpdater();
  }
}

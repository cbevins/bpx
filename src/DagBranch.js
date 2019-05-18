/**
 * @file Defines the base DagBranch class, extended by DagLeaf and its derivatives.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

export default class DagBranch {
  /* eslint-disable no-param-reassign */
  constructor(parent, name, desc = '') {
    this.own = {
      name,
      parent,
      label: name,
      desc,
    };
    if (parent) {
      parent[name] = this;
    }
    Object.defineProperty(this, 'own', { enumerable: false });
  }
  /* eslint-enable no-param-reassign */

  // Overridden by derived Branch classes to connect their Leafs.
  // But this way, evey tree item has a default connect()
  connect() {
    return this;
  }

  desc(value = undefined) {
    if (value !== undefined) {
      this.own.desc = value;
      return this;
    }
    return this.own.desc;
  }

  fullName(sep = '.') {
    let str = this.own.name;
    let parentObj = this.own.parent;
    while (parentObj) {
      str = parentObj.own.name + sep + str;
      parentObj = parentObj.own.parent;
    }
    return str;
  }

  label(value = undefined) {
    if (value !== undefined) {
      this.own.label = value;
      return this;
    }
    return this.own.label;
  }

  name() {
    return this.own.name;
  }

  parent() {
    return this.own.parent;
  }
}

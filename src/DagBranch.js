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
      label: null,
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

  splitCamelCase(str) {
    let s = str.charAt(0).toUpperCase(0);
    for ( let idx=1; idx<str.length; idx+=1 ) {
      let char = str.charAt(idx);
      s += (char===char.toUpperCase() && char<'0' && char>'9')
        ? ' '+char : char;
    }
    return s;
  }

  camel2title(camelCase) {
    return camelCase.replace(/([A-Z])/g, (match) => ` ${match}`)
    .replace(/^./, (match) => match.toUpperCase());
  }

  ucFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  prettyName() {
    let str = this.camel2title(this.own.name);
    let parentObj = this.own.parent;
    while (parentObj) {
      // Don't prefix the tree's root name
      if ( parentObj.own.parent !== null ) {
        str = this.camel2title(parentObj.own.name) + ' ' + str;
      }
      parentObj = parentObj.own.parent;
    }
    return str;
  }
}

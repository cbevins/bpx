/**
 * @file Defines the DagLeafOption class, which is extended by
 * all the DagLeafConfig class and many derived option variants.
 * @copyright Systems for Environmentl Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagLeaf from './DagLeaf';

export default class DagLeafOption extends DagLeaf {
  constructor(branch, name) {
    super(branch, name);
    this.own.option = {
      header: '',
      items: {},
      dflt: null,
    };
  }

  dflt(itemName = undefined) {
    if (itemName !== undefined) {
      this.ensureOption(itemName, 'Option.dflt');
      this.own.option.dflt = itemName;
      return this;
    }
    return this.own.option.dflt;
  }

  ensureOption(itemName, fn) {
    if (!this.hasOption(itemName)) {
      throw new Error(`${fn}' called on '${this.name()}' with invalid option '${itemName}'`);
    }
  }

  hasOption(itemName) {
    return Object.keys(this.own.option.items).includes(itemName);
  }

  /* eslint-disable class-methods-use-this */
  isOption() {
    return true;
  }
  /* eslint-enable class-methods-use-this */

  header(header = undefined) {
    if (header !== undefined) {
      this.own.option.header = header;
      return this;
    }
    return this.own.option.header;
  }

  item(itemName, desc = undefined, asDefault = false) {
    if (desc !== undefined) {
      this.own.option.items[itemName] = desc;
      if (asDefault) {
        this.own.option.dflt = itemName;
        this.own.value = itemName;
      }
      return this;
    }
    this.ensureOption(itemName, 'Option.item');
    return this.own.option.items[itemName];
  }

  itemCount() {
    return Object.keys(this.own.option.items).length;
  }

  // itemKeys() {
  //   return Object.keys(cfg.config.own.option.items);
  // }

  value(itemName = undefined) {
    if (itemName !== undefined) {
      this.ensureOption(itemName, 'Option.value');
      this.own.value = itemName;
      this.own.args = itemName; // ?
      if (this.isInput()) {
        this.own.inputs = [itemName];
      }
      return this;
    }
    return this.own.value;
  }
}

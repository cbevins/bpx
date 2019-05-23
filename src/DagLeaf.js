/**
 * @file Defines the base DagLeaf class, which is extended by
 * DagLeafOption, DagLeafQuantity, and DagLeafText classes.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';
import { isFlowBaseAnnotation } from '@babel/types';

// A helper/convenience class used by DagLeaf
class DagLeafCfg {
  constructor(method, args = null, config = null, value = null) {
    this.config = config;
    this.value = value;
    this.method = method;
    this.args = args;
  }
}

export default class DagLeaf extends DagBranch {
  constructor(branch, name) {
    super(branch, name);
    this.own.value = null;
    this.own.configs = [];
    this.own.method = this.updateFixed;
    this.own.args = null;
    this.own.selected = false; // TRUE if selected for output
    this.own.required = 0; // Number of dependent DagLeafs
    this.own.inputs = [this.own.value];
    this.own.iptr = 0; // input index
    this.own.provider = []; // DagLeaf objects that provide inputs for *this* DagLeaf's update()
    this.own.user = []; // DagLeaf objects that use *this* DagLeaf for their update()
    this.own.cost = 0;
    this.own.order = 0;
    this.own.results = [];
  }

  addProvider(providerLeaf) {
    if (providerLeaf instanceof DagLeaf) {
      this.own.provider.push(providerLeaf);
      providerLeaf.addUser(this);
    }
    return this;
  }

  addUser(leaf) {
    if (!this.own.user.includes(leaf)) {
      this.own.user.push(leaf);
    }
    return this;
  }

  bind(leaf) {
    if (!(leaf instanceof DagLeaf)) {
      throw new Error(`Config error on '${this.fullName()}':\nbind() references an undefined or non-Leaf object\nDid you mean to use fixed()/fixedIf() on a value?\n`);
    }
    this.own.configs.push(new DagLeafCfg(this.updateBound, leaf));
    return this;
  }

  bindIf(config, configValue, leaf) {
    if (! DagLeaf.ensureLeafConfig(config) ) {
      throw new Error(
        `Config error on '${this.label()}':\nbindIf() configuration object is not a Config\n`,
      );
    }
    config.ensureOption(configValue, 'DagLeaf.calcIf()');
    if (!(leaf instanceof DagLeaf)) {
      throw new Error(
        `Config error on '${this.fullName()}':\nbind()/bindIf() references an undefined or non-Leaf object\nDid you mean to use fixed()/fixedIf() on a value?\n`,
      );
    }
    this.own.configs.push(new DagLeafCfg(this.updateBound, leaf, config, configValue));
    return this;
  }

  calc(method, ...args) {
    if (typeof method !== 'function') {
      throw new Error(`Config error on '${this.fullName()}':\ncalc() method arg is not a function\n`);
    }
    this.own.configs.push(new DagLeafCfg(method, args));
    return this;
  }

  calcIf(config, configValue, method, ...args) {
    if (typeof method !== 'function') {
      throw new Error(`Config error on '${this.label()}':\ncalcIf() method arg is not a function\n`);
    }
    if (! DagLeaf.ensureLeafConfig(config)) {
      throw new Error(`Config error on '${this.label()}':\ncalcIf() configuration object is not a Config\n`);
    }
    config.ensureOption(configValue, 'DagLeaf.calcIf()');
    this.own.configs.push(new DagLeafCfg(method, args, config, configValue));
    return this;
  }

  clearResults() {
    this.own.results = [];
  }

  /* eslint-disable no-restricted-syntax */
  config() {
    this.own.required = 0;
    this.own.provider = [];
    this.own.user = [];
    this.own.idx = 0;
    this.own.inputs = [];
    this.own.iptr = 0;
    this.own.cost = 0;
    this.own.order = 0;
    // MUST USE ForOfStatement so we can break/return out of loop
    for (const cfg of this.own.configs) {
      if (cfg.config === null || cfg.config.value() === cfg.value) {
        this.own.method = cfg.method;
        this.own.args = cfg.args;
        if (cfg.method === this.updateFixed) {
          this.updateFixed();
        }
        return true;
      }
    }
    return this;
  }
  /* eslint-enable no-restricted-syntax */

  configEdges() {
    if (this.isBound()) {
      this.addProvider(this.own.args);
    } else if (this.isCalc()) {
      this.own.args.forEach((provider) => {
        this.addProvider(provider);
      });
    } else if (this.isFixed()) {
      // No providers for fixed DagLeafs
    } else if (this.isInput()) {
      // No providers for fixed DagLeafs
    }
    // If this DagLeaf has config options, add *this* to their user list
    this.own.configs.forEach((cfg) => {
      if (cfg.config && cfg.config.itemCount() > 1) {
        cfg.config.addUser(this);
      }
    });
    return this;
  }

  configRequired() {
    this.setRequired();
    this.own.provider.forEach((leaf) => {
      leaf.configRequired();
    });
    // Set any config DagLeafs used by this as 'required'
    this.own.configs.forEach((cfg) => {
      if (cfg.config && cfg.config.itemCount() > 1) {
        cfg.config.configRequired();
      }
    });
    return this;
  }

  cost(value = undefined) {
    if (value !== undefined) {
      this.own.cost = value;
      return this;
    }
    return this.own.cost;
  }

  static ensureLeafConfig(obj) {
    return ( typeof(obj) === 'undefined'
        || typeof(obj) === 'null'
        || typeof(obj) !== 'object'
        || ! ('isConfig' in obj )
        || ! obj.isConfig() ) ? false : true;
  }

  fetch(runIdx) {
    return this.own.results[runIdx];
  }

  fixed(fixedValue) {
    if (typeof(fixedValue) === 'undefined') {
      throw new Error(`Config error on '${this.fullName()}':\nfixed() has undefined fixed value\n`);
    }
    if (fixedValue instanceof DagLeaf) {
      throw new Error(`Config error on '${this.fullName()}':\nfixed() has DagLeaf arg\nDid you mean to use bind()/bindIf()?`);
    }
    this.own.configs.push(new DagLeafCfg(this.updateFixed, fixedValue));
    this.own.value = fixedValue;
    return this;
  }

  fixedIf(config, configValue, fixedValue) {
    if (! DagLeaf.ensureLeafConfig(config)) {
      throw new Error(`Config error on '${this.label()}':\nfixedIf() configuration object is not a Config\n`);
    }
    config.ensureOption(configValue, 'DagLeaf.fixedIf()');
    if (typeof(fixedValue) === 'undefined') {
      throw new Error(`Config error on '${this.fullName()}':\nfixedIf() has undefined fixed value\n`);
    }
    if (fixedValue instanceof DagLeaf) {
      throw new Error(`Config error on '${this.fullName()}':\nfixedIf() has DagLeaf arg\nDid you mean to use bind()/bindIf()?`);
    }
    this.own.configs.push(new DagLeafCfg(this.updateFixed, fixedValue, config, configValue));
    this.own.value = fixedValue;
    return this;
  }

  input() {
    this.own.configs.push(new DagLeafCfg(this.updateInput));
    return this;
  }

  inputIf(config, configValue) {
    if (! DagLeaf.ensureLeafConfig(config)) {
      throw new Error(`Config error on '${this.label()}':\ninputIf() configuration object is not a Config\n`);
    }
    config.ensureOption(configValue, 'DagLeaf.calcIf()');
    this.own.configs.push(new DagLeafCfg(this.updateInput, null, config, configValue));
    return this;
  }

  isBound() {
    return this.own.method === this.updateBound;
  }

  isCalc() {
    return this.own.method !== this.updateBound
      && this.own.method !== this.updateFixed
      && this.own.method !== this.updateInput;
  }

  /* eslint-disable class-methods-use-this */
  isConfig() {
    return false;
  }

  isOption() {
    return false;
  }
  /* eslint-enable class-methods-use-this */

  isFixed() {
    return this.own.method === this.updateFixed;
  }

  isInput() {
    return this.own.method === this.updateInput;
  }

  isRequired() {
    return this.own.required > 0;
  }

  isSelected() {
    return this.own.selected;
  }

  order(value = undefined) {
    if (value !== undefined) {
      this.own.order = value;
      return this;
    }
    return this.own.order;
  }

  required() {
    return this.own.required;
  }

  // setCost(cost) {
  //   this.own.cost = cost;
  //   return this;
  // }

  // setDesc(desc) {
  //   this.own.desc = desc;
  //   return this;
  // }

  setInputValues(inputValuesArray) {
    this.own.inputs = inputValuesArray;
    this.own.iptr = 0;
    return this;
  }

  // setOrder(order) {
  //   this.own.order = order;
  //   return this;
  // }

  setRequired(toggle = true) {
    this.own.required = toggle ? this.own.required + 1 : 0;
    return this;
  }

  setSelected(toggle = true) {
    this.own.selected = toggle;
    return this;
  }

  store() {
    this.own.results.push(this.value());
    return this;
  }

  update(propagate = false, batch = false) {
    let result = true;
    if (this.isBound()) {
      return this.updateBound();
    } if (this.isFixed()) {
      // Fixed values were already set in config()
      // result = this.updateFixed();
    } else if (this.isInput()) {
      result = this.updateInput(batch); // May return TRUE or FALSE
    } else {
      result = this.updateCalculated();
    }
    if (propagate) {
      this.own.user.foreach((user) => {
        user.update(propagate, batch);
      });
    }
    return result;
  }

  updateBound() {
    this.own.value = this.own.args.value();
    return true;
  }

  updateCalculated() {
    const args = [];
    this.own.args.forEach((leaf) => {
      const value = (leaf instanceof DagLeaf) ? leaf.value() : leaf;
      args.push(value);
    });
    this.own.value = this.own.method.apply(this, args);
    return true;
  }

  updateFixed() {
    this.own.value = this.own.args;
    return true;
  }

  // Returns TRUE if there was another input value to iterate
  /* eslint-disable prefer-destructuring */
  updateInput(batch = false) {
    if (batch) {
      if (this.own.inputs.length < 1) {
        throw new Error(`Leaf '${this.fullName()}' has no inputs.`);
      }
      this.own.value = this.own.inputs[this.own.iptr];
      this.own.iptr += 1;
      if (this.own.iptr > this.own.inputs.length) {
        this.own.iptr = 0;
        return false; // signal end-of-iterations to the caller
      }
    } else if (this.own.inputs.length > 0) {
      this.own.value = this.own.inputs[0];
      return false;
    }
    return true;
  }
  /* eslint-disable prefer-destructuring */

  users() {
    return this.own.user;
  }

  value(val = undefined) {
    if (val !== undefined) {
      this.own.value = val;
      if (this.isInput()) {
        this.own.inputs = [val];
      }
      return this;
    }
    return this.own.value;
  }
}

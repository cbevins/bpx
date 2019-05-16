/**
 * @file Defines the base LeafConfig class, which is extended by
 * all the Config* classes.
 *
 * It is simply a LeafOption whose options are used to configure the
 * DAG connections of other Leafs.
 * @copyright Systems for Environmentl Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import LeafOption from './LeafOption';

/* eslint-disable no-useless-constructor */
class LeafConfig extends LeafOption {
  constructor(branch, name) {
    super(branch, name);
  }

  /* eslint-disable class-methods-use-this */
  isConfig() {
    return true;
  }
}

export default LeafConfig;

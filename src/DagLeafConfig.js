/**
 * @file Defines the DagLeafConfig class.
 * It is simply a DagLeafOption whose options are used to configure the
 * DAG connections of other DagLeafs.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagLeafOption from './DagLeafOption';

/* eslint-disable no-useless-constructor */
export default class DagLeafConfig extends DagLeafOption {
  constructor(branch, name) {
    super(branch, name);
  }

  /* eslint-disable class-methods-use-this */
  isConfig() {
    return true;
  }
}

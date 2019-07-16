/**
 * @file Defines the DagLeafBool class.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagLeaf from './DagLeaf';

export default class DagLeafBool extends DagLeaf {
  constructor(branch, name) {
    super(branch, name).value(false);
  }

  isBool() {
    return true;
  }
}

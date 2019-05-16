/**
 * @file Defines the base LeafBool class, which is extended by
 * many of the Leaf* classes.
 * @copyright Systems for Environmentl Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import Leaf from './Leaf';

class LeafBool extends Leaf {
  constructor(branch, name) {
    super(branch, name).value(false);
  }
}

export default LeafBool;

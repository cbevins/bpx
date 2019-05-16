/**
 * @file Defines the base LeafText class, which is extended by
 * many of the Leaf* classes.
 * @copyright Systems for Environmentl Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import Leaf from './Leaf';

class LeafText extends Leaf {
  constructor(branch, name) {
    super(branch, name).value('');
  }
}

export default LeafText;

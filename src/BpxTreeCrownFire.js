/**
 * @file Defines the BehavePlus Explorer crown fire subtree and leafs.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';
import DagLeafQuantity from './DagLeafQuantity';

import BpxLibCrownFire from './BpxLibCrownFire';

/**
 * Defines the fire ellipse's fire spread vector leafs.
*/
export default class BpxTreeCrownFire extends DagBranch {
  constructor(parent, name) {
    super(parent, name);

    new DagLeafQuantity(this, 'rActive')
      .desc('Rohermel active crown fire spread rate')
      .units('fireRos').value(0);
  }

  connect(tree) {
    // this.rActive
    //   .calc(BpxLibCrownFire.rActive,
    //     this.canopy.)

  }
}

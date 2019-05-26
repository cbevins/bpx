/**
 * @file Defines the BehavePlus Explorer time tree and leafs.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';
import DagLeafQuantity from './DagLeafQuantity';

export default class BpxTreeTime extends DagBranch {
  constructor(parent, name) {
    super(parent, name);

    const fire = new DagBranch(this, 'fire');
    new DagLeafQuantity(fire, 'sinceIgnition')
      .desc('elapsed time since fire ignition')
      .units('timeMin').value(0);
  }

  connect(/*tree*/) {
    this.fire.sinceIgnition.input();
  }
}

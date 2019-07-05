/**
 * @file Defines the BehavePlus Explorer site temperature model tree and leafs.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';
import DagLeafQuantity from './DagLeafQuantity';

export default class BpxTreeSiteTemperature extends DagBranch {
  constructor(parent, name) {
    super(parent, name);

    new DagLeafQuantity(this, 'air')
      .desc('ambient air temperature')
      .units('temperature').value(77);
  }
  connect( /* tree */ ) {
    this.air.input();
  }
}

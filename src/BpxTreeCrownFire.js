/**
 * @file Defines the BehavePlus Explorer crown fire subtree and leafs.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';
import BpxTreeCrownFireActive from './BpxTreeCrownFireActive';
import BpxTreeCrownFireFinal from './BpxTreeCrownFireFinal';
import BpxTreeCrownFireInitiation from './BpxTreeCrownFireInitiation';
import BpxTreeCrownFireSurfaceLinked from './BpxTreeCrownFireSurface';

export default class BpxTreeCrownFire extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    new BpxTreeCrownFireActive(this, 'active');
    new BpxTreeCrownFireFinal(this, 'final');
    new BpxTreeCrownFireInitiation(this, 'initiation');
    new BpxTreeCrownFireSurfaceLinked(this, 'surface');
  }
}

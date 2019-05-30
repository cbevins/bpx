import DagBranch from './DagBranch';
import BpxTreeCrownFire from './BpxTreeCrownFire';
import BpxTreeCrownFuel from './BpxTreeCrownFuel';

export default class BpxTreeCrown extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    new BpxTreeCrownFuel(this, 'fuel');
    new BpxTreeCrownFire(this, 'fire');
  }
}

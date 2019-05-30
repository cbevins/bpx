import DagBranch from './DagBranch';
import BpxTreeSurfaceFire from './BpxTreeSurfaceFire';
import BpxTreeSurfaceFuel from './BpxTreeSurfaceFuel';

export default class BpxTreeSurface extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    new BpxTreeSurfaceFuel(this, 'fuel');
    new BpxTreeSurfaceFire(this, 'fire');
  }
}

import DagBranch from './DagBranch';
import BpxTreeFireEllipse from './BpxTreeFireEllipse';
import BpxTreeFireWeighted from './BpxTreeFireWeighted';

export default class BpxTreeSurfaceFire extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    new BpxTreeFireWeighted(this, 'weighted');
    new BpxTreeFireEllipse(this, 'ellipse');
  }
}

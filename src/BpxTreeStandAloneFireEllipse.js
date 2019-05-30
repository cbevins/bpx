import DagBranch from './DagBranch';
import BpxTreeSurface from './BpxTreeSurface';
import BpxTreeConfigs from  './BpxTreeConfigs';
import BpxTreeSite from './BpxTreeSite';

export class BpxTreeStandAloneFireEllipse extends DagBranch {
  constructor(name) {
    super(null, name);
    new BpxTreeConfigs(this, 'configs');
    new BpxTreeSite(this, 'site');
    new BpxTreeSurface(this, 'surface');
    this.surface.fire.ellipse.setStandAlone();
  }
}

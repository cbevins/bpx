import DagBranch from './DagBranch';
import BpxTreeSiteCanopy from './BpxTreeSiteCanopy';
import BpxTreeSiteFire from './BpxTreeSiteFire';
import BpxTreeSiteMoisture from './BpxTreeSiteMoisture';
import BpxTreeSiteMap from './BpxTreeSiteMap';
import BpxTreeSiteSlope from './BpxTreeSiteSlope';
import BpxTreeSiteWind from './BpxTreeSiteWind';

export default class BpxTreeSite extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    new BpxTreeSiteCanopy(this, 'canopy');
    new BpxTreeSiteFire(this, 'fire');
    new BpxTreeSiteMap(this, 'map');
    new BpxTreeSiteMoisture(this, 'moisture');
    new BpxTreeSiteSlope(this, 'slope');
    new BpxTreeSiteWind(this, 'wind');
  }
}

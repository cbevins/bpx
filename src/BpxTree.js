import Branch from './DagBranch';
import BpxTreeCanopy from './BpxTreeCanopy';
import BpxTreeFuel from './BpxTreeFuel';
import BpxTreeMoisture from './BpxTreeMoisture';
import BpxTreeConfigs from  './BpxTreeConfigs';
import BpxTreeMap from './BpxTreeMap';
import BpxTreeSlope from './BpxTreeSlope';
import BpxTreeWind from './BpxTreeWind';

class BpxTreeSite extends Branch {
  constructor(parent, name) {
    super(parent, name);
    new BpxTreeMoisture(this);
    new BpxTreeMap(this);
    new BpxTreeSlope(this);
    new BpxTreeWind(this);
    new BpxTreeCanopy(this);
  }
}

class BpxTreeSurface extends Branch {
  constructor(parent, name) {
    super(parent, name);
    new BpxTreeFuel(this, 'fuel');
  }
}

export default class BpxTree extends Branch {
  constructor(name) {
    super(null, name);
    new BpxTreeConfigs(this, 'configs');
    new BpxTreeSite(this, 'site');
    new BpxTreeSurface(this, 'surface');
  }
}

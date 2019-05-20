import Branch from './DagBranch';
import BpxTreeFuel from './BpxTreeFuel';
import BpxTreeMoisture from './BpxTreeMoisture';
import BpxTreeConfigs from  './BpxTreeConfigs';
import BpxTreeMap from './BpxTreeMap';
import BpxTreeSlope from './BpxTreeSlope';
import BpxTreeWind from './BpxTreeWind';

class BpxTreeSite extends Branch {
  constructor(parent, name = 'site') {
    super(parent, name);
    new BpxTreeMoisture(this);
    new BpxTreeMap(this);
    new BpxTreeSlope(this);
    new BpxTreeWind(this);
  }
}

class BpxTreeSurface extends Branch {
  constructor(parent, name = 'surface') {
    super(parent, name);
    new BpxTreeFuel(this);
  }
}

export default class BpxTree extends Branch {
  constructor(name) {
    super(null, name);
    new BpxTreeConfigs(this);
    new BpxTreeSite(this);
    new BpxTreeSurface(this);
  }
}

import Branch from './Branch';
import BpxTreeFuel from './BpxTreeFuel';
import BpxTreeMoisture from './BpxTreeMoisture';
import { BpxConfigFuelPrimary, BpxConfigFuelSecondary,
  BpxConfigFuelMoisture, BpxConfigFuelCuredHerbFraction,
  BpxConfigFuelChaparralTotalLoad, BpxConfigSlope } from './BpxLeafConfigs';
import BpxTreeMap from './BpxTreeMap';
import BpxTreeSlope from './BpxTreeSlope';

class BpxTreeSite extends Branch {
  constructor(parent, name = 'site') {
    super(parent, name);
    new BpxTreeMoisture(this);
    new BpxTreeMap(this);
    new BpxTreeSlope(this);
    // \TODO new BpxTreeWind(this);
  }
}

class BpxTreeSurface extends Branch {
  constructor(parent, name = 'surface') {
    super(parent, name);
    new BpxTreeFuel(this);
  }
}

// Move into its own tree file
class BpxTreeConfigFuel extends Branch {
  constructor(parent, name = 'fuel') {
    super(parent, name);
    new BpxConfigFuelPrimary(this);
    new BpxConfigFuelSecondary(this);
    new BpxConfigFuelMoisture(this);
    new BpxConfigFuelCuredHerbFraction(this);
    new BpxConfigFuelChaparralTotalLoad(this);
    new BpxConfigSlope(this);
  }
}

class BpxTreeConfigSlope extends Branch {
  constructor(parent, name = 'slope') {
    super(parent, name);
    new BpxConfigSlope(this);
  }
}

class BpxTreeConfigs extends Branch {
  constructor(parent, name = 'configs') {
    super(parent, name);
    new BpxTreeConfigFuel(this);
    new BpxTreeConfigSlope(this);
    // \TODO new BpxTreeConfigFire(this);
  }
}

class BpxTree extends Branch {
  constructor(name) {
    super(null, name);
    new BpxTreeConfigs(this);
    new BpxTreeSite(this);
    new BpxTreeSurface(this);
  }
}

export default BpxTree;

import Branch from './Branch';
import BpxTreeFuel from './BpxTreeFuel';
import BpxTreeMoisture from './BpxTreeMoisture';
import { BpxConfigFuelPrimary, BpxConfigFuelSecondary,
  BpxConfigFuelMoisture, BpxConfigFuelCuredHerbFraction,
  BpxConfigFuelChaparralTotalLoad } from './BpxLeafConfigs';

class BpxTreeSite extends Branch {
  constructor(parent, name = 'site') {
    super(parent, name);
    new BpxTreeMoisture(this);
    // \TODO new BpxTreeSlope(this);
    // \TODO new BpxTreeWind(this);
  }
}

class BpxTreeSurface extends Branch {
  constructor(parent, name = 'surface') {
    super(parent, name);
    new BpxTreeFuel(this);
  }
}

class BpxTreeConfigFuel extends Branch {
  constructor(parent, name = 'fuel') {
    super(parent, name);
    new BpxConfigFuelPrimary(this);
    new BpxConfigFuelSecondary(this);
    new BpxConfigFuelMoisture(this);
    new BpxConfigFuelCuredHerbFraction(this);
    new BpxConfigFuelChaparralTotalLoad(this);
  }
}

class BpxTreeConfigs extends Branch {
  constructor(parent, name = 'configs') {
    super(parent, name);
    new BpxTreeConfigFuel(this);
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

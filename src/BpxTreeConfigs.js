import Branch from './DagBranch';
import {
  BpxConfigFuelPrimary,
  BpxConfigFuelSecondary,
  BpxConfigFuelMoisture,
  BpxConfigFuelCuredHerbFraction,
  BpxConfigFuelChaparralTotalLoad,
  BpxConfigSlope
} from './BpxLeafConfigs';

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

export default class BpxTreeConfigs extends Branch {
  constructor(parent, name = 'configs') {
    super(parent, name);
    new BpxTreeConfigFuel(this);
    new BpxTreeConfigSlope(this);
    // \TODO new BpxTreeConfigFire(this);
  }
}

import Branch from './DagBranch';
import {
  BpxConfigFuelPrimary,
  BpxConfigFuelSecondary,
  BpxConfigFuelMoisture,
  BpxConfigFuelCuredHerbFraction,
  BpxConfigFuelChaparralTotalLoad,
  BpxConfigSlopeSteepness,
  BpxConfigWindAdjFactor,
  BpxConfigWindDirection,
  BpxConfigWindSpeed
} from './BpxLeafConfigs';

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

class BpxTreeConfigSlope extends Branch {
  constructor(parent, name = 'slope') {
    super(parent, name);
    new BpxConfigSlopeSteepness(this);
  }
}

class BpxTreeConfigWind extends Branch {
  constructor(parent, name = 'wind') {
    super(parent, name);
    new BpxConfigWindDirection(this);
    new BpxConfigWindSpeed(this);
    new BpxConfigWindAdjFactor(this);
  }
}

export default class BpxTreeConfigs extends Branch {
  constructor(parent, name = 'configs') {
    super(parent, name);
    new BpxTreeConfigFuel(this);
    new BpxTreeConfigSlope(this);
    new BpxTreeConfigWind(this);
    // \TODO new BpxTreeConfigFire(this);
  }
}

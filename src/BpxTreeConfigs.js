import DagBranch from './DagBranch';
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

class BpxTreeConfigFuel extends DagBranch {
  constructor(parent, name = 'fuel') {
    super(parent, name);
    new BpxConfigFuelPrimary(this);
    new BpxConfigFuelSecondary(this);
    new BpxConfigFuelMoisture(this);
    new BpxConfigWindAdjFactor(this);
    new BpxConfigFuelCuredHerbFraction(this);
    new BpxConfigFuelChaparralTotalLoad(this);
  }
}

class BpxTreeConfigSlope extends DagBranch {
  constructor(parent, name = 'slope') {
    super(parent, name);
    new BpxConfigSlopeSteepness(this);
  }
}

class BpxTreeConfigWind extends DagBranch {
  constructor(parent, name = 'wind') {
    super(parent, name);
    new BpxConfigWindDirection(this);
    new BpxConfigWindSpeed(this);
  }
}

export default class BpxTreeConfigs extends DagBranch {
  constructor(parent, name = 'configs') {
    super(parent, name);
    new BpxTreeConfigFuel(this);
    new BpxTreeConfigSlope(this);
    new BpxTreeConfigWind(this);
    // \TODO new BpxTreeConfigFire(this);
  }
}

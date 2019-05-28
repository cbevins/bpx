/**
 * @file Composes the BehavePlus Explorer DAG tree.
 *
 * BpxTree is composed of:
 *  - 'configs' BpxTreeConfigs
 *  - 'site' BpxTreeSite
 *    - 'canopy' BpxTreeCanopy
 *    - 'map' BpxTreeMap
 *    - 'moisture' BpxTreeMoisture
 *    - 'slope' BpxTreeSlope
 *    - 'temp' BpxTreeTemp
 *    - 'time' BpxTreeTime
 *    - 'wind' BpxTreeWind
 *  - 'surface' BpxTreeSurface
 *    - 'fuel' BpxTreeFuel
 *      - 'primary' BpxTreeFuelComplex
 *      - 'secondary' BpxTreeFuelComplex
 *    - 'fire' BpxTreeSurfaceFire
 *      - 'weighted' BpxTreeFireWeighted
 *      - 'ellipse' BpxTreeFireEllipse
 *
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import Branch from './DagBranch';
import BpxTreeCanopy from './BpxTreeCanopy';
import BpxTreeFireEllipse from './BpxTreeFireEllipse';
import BpxTreeFireWeighted from './BpxTreeFireWeighted';
import BpxTreeFuel from './BpxTreeFuel';
import BpxTreeMoisture from './BpxTreeMoisture';
import BpxTreeConfigs from  './BpxTreeConfigs';
import BpxTreeMap from './BpxTreeMap';
import BpxTreeSlope from './BpxTreeSlope';
import BpxTreeTemp from './BpxTreeTemp';
import BpxTreeTime from './BpxTreeTime';
import BpxTreeWind from './BpxTreeWind';

class BpxTreeSite extends Branch {
  constructor(parent, name) {
    super(parent, name);
    new BpxTreeCanopy(this, 'canopy');
    new BpxTreeMap(this, 'map');
    new BpxTreeMoisture(this, 'moisture');
    new BpxTreeSlope(this, 'slope');
    new BpxTreeTemp(this, 'temp');
    new BpxTreeTime(this, 'time');
    new BpxTreeWind(this, 'wind');
  }
}

class BpxTreeSurfaceFire extends Branch {
  constructor(parent, name) {
    super(parent, name);
    new BpxTreeFireWeighted(this, 'weighted');
    new BpxTreeFireEllipse(this, 'ellipse');
  }
}

class BpxTreeSurface extends Branch {
  constructor(parent, name) {
    super(parent, name);
    new BpxTreeFuel(this, 'fuel');
    new BpxTreeSurfaceFire(this, 'fire');
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

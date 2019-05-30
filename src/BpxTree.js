/**
 * @file Composes the BehavePlus Explorer DAG tree.
 *
 * BpxTree is composed of:
 *  - 'configs' BpxTreeConfigs
 *  - 'site' BpxTreeSite
 *    - 'canopy' BpxTreeCanopy
 *    - 'fire' BpxTreeTemp
 *    - 'map' BpxTreeMap
 *    - 'moisture' BpxTreeMoisture
 *    - 'slope' BpxTreeSlope
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

import DagBranch from './DagBranch';
import BpxTreeCrown from './BpxTreeCrown';
import BpxTreeSurface from './BpxTreeSurface';
import BpxTreeConfigs from  './BpxTreeConfigs';
import BpxTreeSite from './BpxTreeSite';

export default class BpxTree extends DagBranch {
  constructor(name) {
    super(null, name);
    new BpxTreeConfigs(this, 'configs');
    new BpxTreeSite(this, 'site');
    new BpxTreeSurface(this, 'surface');
    new BpxTreeCrown(this, 'crown');
  }
}

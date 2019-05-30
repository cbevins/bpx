/**
 * @file Composes the BehavePlus Explorer surface fuel sub-tree.
 *
 * BpxTreeSurfaceFuel is composed of:
 * - 'primary' BpxTreeSurfaceFuelComplex
 *  - 'bed' BpxTreeSurfaceFuelBed
 *  - 'model' BpxTreeSurfaceFuelModel
 *  - 'fire' BpxTreeSurfaceFuelFire
 * - 'secondary' BpxTreeSurfaceFuelComplex
 *  - 'bed' BpxTreeSurfaceFuelBed
 *  - 'model' BpxTreeSurfaceFuelModel
 *  - 'fire' BpxTreeSurfaceFuelFire
 *
 * - Each BpxTreeSurfaceFuelBed is composed of:
 *    - 'dead' BpxTreeFuelCategoryDead
 *      - 'particle' BpxTreeFuelBedPartricles
 *        - 'class1' - 'class5' BpxTreeFuelParticles
 *          - 8 DagLeafs (dens, heat, label, load, mois, savr, seff, stot, ...)
 *    - 'live' BpxTreeFuelCategoryLive
 *      - 'particle' BpxTreeFuelParticles
 *        - 'class1' - 'class5' BpxTreeFuelParticles
 *          - 8 DagLeafs (dens, heat, label, load, mois, savr, seff, stot, ...)
 *
 * - Each BpxTreeSurfaceFuelModel is composed of:
 *    - 'behave' BpxTreeFuelModelBehave
 *    - 'chaparral' BpxTreeFuelModelChaparral
 *    - 'palmettoGallberry' BpxTreeFuelModelPalmettoGallberry
 *    - 'westernAspen' BpxTreeFuelModelWesternAspen
 *
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
*/

import DagBranch from './DagBranch';
import BpxTreeBaseFuelComplex from './BpxTreeBaseFuelComplex';
import BpxTreeSurfaceFuelBed from './BpxTreeSurfaceFuelBed';
import BpxTreeSurfaceFuelFire from './BpxTreeSurfaceFuelFire';
import BpxTreeSurfaceFuelModel from './BpxTreeSurfaceFuelModel';

export class BpxTreeSurfaceFuelComplex extends BpxTreeBaseFuelComplex {
  constructor(parent, name) {
    super(parent, name);
    new BpxTreeSurfaceFuelBed(this, 'bed');
    new BpxTreeSurfaceFuelFire(this, 'fire');
    new BpxTreeSurfaceFuelModel(this, 'model');
  }
  connect(tree) {
    BpxTreeBaseFuelComplex.prototype.baseConnect.call(this, tree);
  }
}

export default class BpxTreeSurfaceFuel extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    new BpxTreeSurfaceFuelComplex(this, 'primary');
    new BpxTreeSurfaceFuelComplex(this, 'secondary');
  }
}

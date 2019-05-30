/**
 * @file Composes the BehavePlus Explorer crown fuel sub-tree.
 *
 * BpxTreeCrownFuel is composed of:
 * - 'canopy' BpxTreeCrownFuelComplex
 *  - 'bed' BpxTreeCrownFuelBed
 *  - 'model' BpxTreeCrownFuelModel
 *  - 'fire' BpxTreeCrownFuelFire
 *
 * - Each BpxTreeCrownFuelBed is composed of:
 *    - 'dead' BpxTreeFuelCategoryDead
 *      - 'particle' BpxTreeFuelBedPartricles
 *        - 'class1' - 'class5' BpxTreeFuelParticles
 *          - 8 DagLeafs (dens, heat, label, load, mois, savr, seff, stot, ...)
 *    - 'live' BpxTreeFuelCategoryLive
 *      - 'particle' BpxTreeFuelParticles
 *        - 'class1' - 'class5' BpxTreeFuelParticles
 *          - 8 DagLeafs (dens, heat, label, load, mois, savr, seff, stot, ...)
 *
 * - Each BpxTreeCrownFuelModel is composed of:
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
import BpxTreeCrownFuelBed from './BpxTreeCrownFuelBed';
import BpxTreeCrownFuelFire from './BpxTreeCrownFuelFire';
import BpxTreeCrownFuelModel from './BpxTreeCrownFuelModel';

export class BpxTreeCrownFuelComplex extends BpxTreeBaseFuelComplex {
  constructor(parent, name) {
    super(parent, name);
    new BpxTreeCrownFuelBed(this, 'bed');
    new BpxTreeCrownFuelFire(this, 'fire');
    new BpxTreeCrownFuelModel(this, 'model');
  }
  connect(tree) {
    BpxTreeBaseFuelComplex.prototype.baseConnect.call(this, tree);
  }
}

export default class BpxTreeCrownFuel extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    new BpxTreeCrownFuelComplex(this, 'canopy');
  }
}

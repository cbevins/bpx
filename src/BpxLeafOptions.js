/**
 * @file Defines all BehavePlus Explorer DagLeafOption variants.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagLeafOption from './DagLeafOption';
import BpxLibFuelCatalog from './BpxLibFuelCatalog';

export class BpxLeafFuelAspenType extends DagLeafOption {
  constructor(branch, name) {
    super(branch, name)
      .desc('western aspen fuel type')
      .header('western aspen fuel type')
      .item('aspenShrub', 'Aspen/shrub')
      .item('aspenTallForb', 'Aspen/tall forb')
      .item('aspenLowForb', 'Aspen/low forb')
      .item('mixedShrub', 'Mixed/shrub')
      .item('mixedForb', 'Mixed/forb');
  }
}

export class BpxLeafFuelDomain extends DagLeafOption {
  constructor(branch) {
    super(branch, 'domain')
      .desc('fuel model domain')
      .header('fuel model domain')
      .item('behave', 'behave', true)
      .item('chaparral', 'chaparral')
      .item('palmettoGallberry', 'palmettoGallbery')
      .item('westernAspen', 'westernAspen');
  }
}

export class BpxLeafFuelChaparralType extends DagLeafOption {
  constructor(branch, name) {
    super(branch, name)
      .desc('chaparral fuel type')
      .header('chaparral fuel type')
      .item('chamise', 'chamise', true)
      .item('mixedBrush', 'mixed brush');
  }
}

export class BpxLeafFuelCatalogKey extends DagLeafOption {
  constructor(branch, name) {
    super(branch, name)
      .desc('fuel model catalog key')
      .header('Fuel Model Catalog Key');

    BpxLibFuelCatalog.list().forEach(([key, label]) => {
      this.item(key, `${key}: ${label}`, key==='10');
    })
  }
}

/**
 * @file Defines all BehavePlus Explorer Option variants.
 * @copyright Systems for Environmentl Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import LeafOption from './LeafOption';

export class BpxLeafFuelAspenType extends LeafOption {
  constructor(branch, name = 'aspenType') {
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

export class BpxLeafFuelDomain extends LeafOption {
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

export class BpxLeafFuelChaparralType extends LeafOption {
  constructor(branch, name = 'chaparralType') {
    super(branch, name)
      .desc('chaparral fuel type')
      .header('chaparral fuel type')
      .item('chamise', 'chamise', true)
      .item('mixedBrush', 'mixed brush');
  }
}

/**
 * @file Defines all BehavePlus Explorer classes that extend DagLeafConfig.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagLeafConfig from './DagLeafConfig';

export class BpxConfigFuelChaparralTotalLoad extends DagLeafConfig {
  constructor(branch) {
    super(branch, 'chaparralTotalLoad')
      .header('Chaparral total fuel load is')
      .item('input', 'provided as input', true)
      .item('estimated', 'estimated from Chaparral depth');
  }
}

export class BpxConfigFuelCuredHerbFraction extends DagLeafConfig {
  constructor(branch) {
    super(branch, 'curedHerbFraction')
      .header('Behave fuel model cured herb fraction is')
      .item('input', 'provided as input', true)
      .item('estimated', 'estimated from live fuel moisture');
  }
}

export class BpxConfigFuelMoisture extends DagLeafConfig {
  constructor(branch) {
    super(branch, 'moisture')
      .header('Fuel moistures are specified by entering')
      .item('individual', 'the 3 dead and 2 live fuel moistures', true)
      .item('liveCategory', 'the 3 dead moistures and a singe live category moisture')
      .item('category', 'the dead and live category moistures only')
      .item('catalog', 'a fuel moisture catalog key');
  }
}

export class BpxConfigFuelPrimary extends DagLeafConfig {
  constructor(branch) {
    super(branch, 'primary')
      .header('Primary fuels are specified by entering')
      .item('catalog', 'a fuel model catalog key', true)
      .item('behave', 'standard BehavePlus fuel parameters')
      .item('chaparral', 'chaparral dynamic fuel parameters')
      .item('palmettoGallberry', 'palmetto-gallberry dynamic fuel parameters')
      .item('westernAspen', 'western aspen dynamic fuel models');
  }
}

export class BpxConfigFuelSecondary extends DagLeafConfig {
  constructor(branch) {
    super(branch, 'secondary')
      .header('Secondary fuels are specified by entering')
      .item('catalog', 'a fuel model catalog key')
      .item('behave', 'standard BehavePlus fuel parameters')
      .item('chaparral', 'chaparral dynamic fuel parameters')
      .item('palmettoGallberry', 'palmetto-gallberry dynamic fuel parameters')
      .item('westernAspen', 'western aspen dynamic fuel models')
      .item('none', 'there are no secondary fuels', true);
  }
}

export class BpxConfigSlope extends DagLeafConfig {
  constructor(branch) {
    super(branch, 'steepness')
      .header('Slope steepness is')
      .item('ratio', 'entered as ratio of vertical rise to horizontal reach', true)
      .item('degrees', 'entered as degrees of angle above the hoprizontal plane')   .item('map', 'chaparral dynamic fuel parameters')
      .item('map', 'estimated from map measurements');
  }
}

/**
 * @file Defines the BehavePlus Explorer Fuel Model sub-tree.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';

import BpxLibFuelCatalog from './BpxLibFuelCatalog';

import { BpxLeafFuelDomain, BpxLeafFuelCatalogKey } from './BpxLeafOptions';
import BpxTreeFuelModelBehave from './BpxTreeFuelModelBehave';
import BpxTreeFuelModelChaparral from './BpxTreeFuelModelChaparral';
import BpxTreeFuelModelPalmettoGallberry from './BpxTreeFuelModelPalmettoGallberry';
import BpxTreeFuelModelWesternAspen from './BpxTreeFuelModelWesternAspen';

export default class BpxTreeSurfaceFuelModel extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    // DagBranches
    new BpxTreeFuelModelBehave(this, 'behave');
    new BpxTreeFuelModelChaparral(this, 'chaparral');
    new BpxTreeFuelModelPalmettoGallberry(this, 'palmettoGallberry');
    new BpxTreeFuelModelWesternAspen(this, 'westernAspen');

    // Leaves
    new BpxLeafFuelDomain(this, 'domain');

    // Hack to determine if primary or secondary
    const prefix = parent.fullName().includes('primary')
      ? 'Primary Fuel, ' : 'Secondary Fuel, ';

    new BpxLeafFuelCatalogKey(this, 'key')
      .desc('fuel model catalog key')
      .value('10')
      //.label(prefix+'Catalog Key');
  }

  connect(tree) {
    const cfgFuel = tree.configs.fuel.primary;
    const cfgCuredHerb = tree.configs.fuel.curedHerbFraction;
    const cfgTotalLoad = tree.configs.fuel.chaparralTotalLoad;
    const liveHerbMois = tree.site.moisture.live.herb;

    this.key.input();
    this.domain
      .calcIf(cfgFuel, 'catalog', BpxLibFuelCatalog.domain, this.key)
      .fixedIf(cfgFuel, this.behave.domain.value(), this.behave.domain.value())
      .fixedIf(cfgFuel, this.chaparral.domain.value(), this.chaparral.domain.value())
      .fixedIf(cfgFuel, this.palmettoGallberry.domain.value(),
        this.palmettoGallberry.domain.value())
      .fixedIf(cfgFuel, this.westernAspen.domain.value(), this.westernAspen.domain.value())
      .fixed('none');

    this.behave.subconnect(cfgFuel, cfgCuredHerb, liveHerbMois, this.key);
    this.chaparral.subconnect(cfgFuel, cfgTotalLoad, this.key);
    this.palmettoGallberry.subconnect(cfgFuel, this.key);
    this.westernAspen.subconnect(cfgFuel, this.key);
  }
}

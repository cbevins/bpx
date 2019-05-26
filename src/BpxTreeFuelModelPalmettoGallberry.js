/**
 * @file Defines the BehavePlus Hough & Albini palmetto-gallberry fuel model tree and leafs.
 * @copyright Systems for Environmentl Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';
import BpxLibFuelPalmettoGallberry from './BpxLibFuelPalmettoGallberry';
import BpxLibFuelCatalog from './BpxLibFuelCatalog';
import DagLeafQuantity from './DagLeafQuantity';
import { BpxLeafFuelDomain } from './BpxLeafOptions';

/* eslint-disable no-new */
export default class BpxTreeFuelModelPalmettoGallberry extends DagBranch {
  constructor(parent, name) {
    super(parent, name);

    new BpxLeafFuelDomain(this)
      .value(BpxLibFuelPalmettoGallberry.domain());

    // Input when fuel modeling
    const parms = new DagBranch(this, 'parms');
    new DagLeafQuantity(parms, 'age')
      .desc('pametto-gallberry age of rough (years since last burn')
      .units('fuelAge').value(0);
    new DagLeafQuantity(parms, 'basalArea')
      .desc('pametto-gallberry basal area of overstory stand')
      .units('basalArea').value(0);
    new DagLeafQuantity(parms, 'cover')
      .desc('pametto-gallberry coverage')
      .units('fraction').value(0);
    new DagLeafQuantity(parms, 'height')
      .desc('pametto-gallberry height of understory')
      .units('fuelDepth').value(0);

    // Always derived
    const derived = new DagBranch(this, 'derived');
    new DagLeafQuantity(derived, 'depth')
      .desc('palmetto-gallberry fuel bed depth')
      .units('fuelDepth').value(0.01);

    new DagLeafQuantity(derived, 'deadFineLoad')
      .desc('chaparral dead fine (0 - 0.25 inch diameter) fuel oven-dry load')
      .units('fuelLoad').value(0);
    new DagLeafQuantity(derived, 'deadSmallLoad')
      .desc('chaparral dead small (0.25 to 1 inch diameter) fuel oven-dry load')
      .units('fuelLoad').value(0);
    new DagLeafQuantity(derived, 'deadFoliageLoad')
      .desc('chaparral dead foliage oven-dry load')
      .units('fuelLoad').value(0);
    new DagLeafQuantity(derived, 'deadLitterLoad')
      .desc('chaparral dead litter oven-dry load')
      .units('fuelLoad').value(0);

    new DagLeafQuantity(derived, 'liveFineLoad')
      .desc('chaparral live fine (0 - 0.25 inch diameter) fuel oven-dry load')
      .units('fuelLoad').value(0);
    new DagLeafQuantity(derived, 'liveSmallLoad')
      .desc('chaparral live small (0.25 to 1 inch diameter) fuel oven-dry load')
      .units('fuelLoad').value(0);
    new DagLeafQuantity(derived, 'liveFoliageLoad')
      .desc('chaparral live foliage oven-dry load')
      .units('fuelLoad').value(0);
  }

  // Called from parent BpxTreeFuelModel.connect()
  subconnect(cfgFuel, modelKey) {
    const { parms } = this;
    const { derived } = this;

    const domain = BpxLibFuelPalmettoGallberry.domain();
    this.domain.fixed(domain);

    parms.age
      .calcIf(cfgFuel, 'catalog', BpxLibFuelCatalog.pgAge, modelKey)
      .inputIf(cfgFuel, domain)
      .fixed(0);

    parms.basalArea
      .calcIf(cfgFuel, 'catalog', BpxLibFuelCatalog.pgBasalArea, modelKey)
      .inputIf(cfgFuel, domain)
      .fixed(0);

    parms.cover
      .calcIf(cfgFuel, 'catalog', BpxLibFuelCatalog.pgCover, modelKey)
      .inputIf(cfgFuel, domain)
      .fixed(0);

    parms.height
      .calcIf(cfgFuel, 'catalog', BpxLibFuelCatalog.pgHeight, modelKey)
      .inputIf(cfgFuel, domain)
      .fixed(0.01);

    derived.depth
      .calc(BpxLibFuelPalmettoGallberry.fuelDepth, parms.height);

    derived.deadFineLoad
      .calc(BpxLibFuelPalmettoGallberry.deadFineLoad, parms.age, parms.height);

    derived.deadSmallLoad
      .calc(BpxLibFuelPalmettoGallberry.deadSmallLoad, parms.age, parms.cover);

    derived.deadFoliageLoad
      .calc(BpxLibFuelPalmettoGallberry.deadFoliageLoad, parms.age, parms.cover);

    derived.deadLitterLoad
      .calc(BpxLibFuelPalmettoGallberry.deadLitterLoad, parms.age, parms.basalArea);

    derived.liveFineLoad
      .calc(BpxLibFuelPalmettoGallberry.liveFineLoad, parms.age, parms.height);

    derived.liveSmallLoad
      .calc(BpxLibFuelPalmettoGallberry.liveSmallLoad, parms.age, parms.height);

    derived.liveFoliageLoad
      .calc(BpxLibFuelPalmettoGallberry.liveFoliageLoad, parms.age, parms.cover, parms.height);
  }
}

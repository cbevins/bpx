/**
 * @file Defines the BehavePlus Brown & SImmerman western aspen fuel model tree and leafs.
 * @copyright Systems for Environmentl Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';
import BpxLibFuelWesternAspen from './BpxLibFuelWesternAspen';
import BpxLibFuelCatalog from './BpxLibFuelCatalog';
import DagLeafQuantity from './DagLeafQuantity';
import { BpxLeafFuelDomain, BpxLeafFuelAspenType } from './BpxLeafOptions';

/* eslint-disable no-new */
export default class BpxTreeFuelModelWesternAspen extends DagBranch {
  constructor(parent, name) {
    super(parent, name);

    new BpxLeafFuelDomain(this)
      .value(BpxLibFuelWesternAspen.domain());

    // Input when fuel modeling
    const parms = new DagBranch(this, 'parms');
    new BpxLeafFuelAspenType(parms);

    new DagLeafQuantity(parms, 'curingLevel')
      .desc('Aspen curing level')
      .units('fraction').value(0);

    // Derived from model inputs
    const derived = new DagBranch(this, 'derived');
    new DagLeafQuantity(derived, 'depth')
      .desc('aspen fuel depth')
      .units('fuelDepth').value(0.01);

    new DagLeafQuantity(derived, 'deadFineLoad')
      .desc('western aspen dead 1-h time-lag fuel oven-dry load')
      .units('fuelLoad').value(0);
    new DagLeafQuantity(derived, 'deadSmallLoad')
      .desc('western aspen dead 10-h time-lag fuel oven-dry load')
      .units('fuelLoad').value(0);

    new DagLeafQuantity(derived, 'deadFineSavr')
      .desc('western aspen dead 1-h time-lag fuel surface area-to-volume ratio')
      .units('fuelLoad').value(0);

    new DagLeafQuantity(derived, 'liveHerbLoad')
      .desc('western aspen live herb fuel oven-dry load')
      .units('fuelLoad').value(0);

    new DagLeafQuantity(derived, 'liveStemLoad')
      .desc('western aspen live woody fuel oven-dry load')
      .units('fuelLoad').value(0);

    new DagLeafQuantity(derived, 'liveStemSavr')
      .desc('western aspen live woody fuel surface area-to-volume ratio')
      .units('fuelLoad').value(0);
  }

  subconnect(cfgFuel, modelKey) {
    const { parms } = this;
    const { derived } = this;

    const domain = BpxLibFuelWesternAspen.domain();
    this.domain.fixed(domain);

    // Western aspen dynamic fuel model requires 2 parameters
    // to generate a complete fuel bed description
    parms.curingLevel
      .calcIf(cfgFuel, 'catalog', BpxLibFuelCatalog.westernAspenCuringLevel, modelKey)
      .inputIf(cfgFuel, domain)
      .fixed(0);

    parms.aspenType
      .calcIf(cfgFuel, 'catalog', BpxLibFuelCatalog.westernAspenFuelType, modelKey)
      .inputIf(cfgFuel, domain)
      .fixed(BpxLibFuelWesternAspen.aspenTypes()[0]);

    // Western aspen dynamic fuel model generates 7 derived properties
    // (all other fuel bed properties are fixed)
    derived.depth
      .calc(BpxLibFuelWesternAspen.depth, parms.aspenType);

    derived.deadFineLoad
      .calc(BpxLibFuelWesternAspen.deadFineLoad, parms.aspenType, parms.curingLevel);

    derived.deadFineSavr
      .calc(BpxLibFuelWesternAspen.deadFineSavr, parms.aspenType, parms.curingLevel);

    derived.deadSmallLoad
      .calc(BpxLibFuelWesternAspen.deadSmallLoad, parms.aspenType);

    derived.liveHerbLoad
      .calc(BpxLibFuelWesternAspen.liveHerbLoad, parms.aspenType, parms.curingLevel);

    derived.liveStemLoad
      .calc(BpxLibFuelWesternAspen.liveStemLoad, parms.aspenType, parms.curingLevel);

    derived.liveStemSavr
      .calc(BpxLibFuelWesternAspen.liveStemSavr, parms.aspenType, parms.curingLevel);
  }
}

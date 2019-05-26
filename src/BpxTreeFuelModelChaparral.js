/**
 * @file Defines the BehavePlus Rothermel & Philpot chaparral fuel model tree and leafs.
 * @copyright Systems for Environmentl Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';
import BpxLibFuelChaparral from './BpxLibFuelChaparral';
import BpxLibFuelCatalog from './BpxLibFuelCatalog';
import DagLeafQuantity from './DagLeafQuantity';
import { BpxLeafFuelDomain, BpxLeafFuelChaparralType } from './BpxLeafOptions';

/* eslint-disable no-new */
export default class BpxTreeFuelModelChaparral extends DagBranch {
  constructor(parent, name) {
    super(parent, name);

    new BpxLeafFuelDomain(this)
      .value(BpxLibFuelChaparral.domain());

    // Input when fuel modeling
    const parms = new DagBranch(this, 'parms');
    new BpxLeafFuelChaparralType(parms, 'chaparralType');

    new DagLeafQuantity(parms, 'deadFuelFraction')
      .desc('chaparral dead fuel fraction')
      .units('fraction').value(0);
    new DagLeafQuantity(parms, 'depth')
      .desc('chaparral fuel depth')
      .units('fuelDepth').value(0.01);
    new DagLeafQuantity(parms, 'totalLoad')
      .desc('chaparral fuel total oven-dry load')
      .units('fuelLoad').value(0);

    // Derived from model inputs
    const derived = new DagBranch(this, 'derived');
    new DagLeafQuantity(derived, 'age')
    .desc('chaparral age (years since last burned)')
    .units('fuelAge').value(0);
    new DagLeafQuantity(derived, 'averageMortality')
      .desc('chaparral estimated dead fuel fraction under average mortality')
      .units('fraction').value(0);
    new DagLeafQuantity(derived, 'severeMortality')
      .desc('chaparral estimated dead fuel fraction under severe mortality')
      .units('fraction').value(0);
    new DagLeafQuantity(derived, 'depth')
      .desc('chaparral fuel depth as estimated from age and type')
      .units('fuelDepth').value(0.01);
    new DagLeafQuantity(derived, 'totalLoad')
      .desc('chaparral fuel total oven-dry load as estimated from age and type')
      .units('fuelLoad').value(0);

    new DagLeafQuantity(derived, 'deadLoad')
      .desc('chaparral dead fuel category oven-dry load')
      .units('fuelLoad').value(0);
    new DagLeafQuantity(derived, 'deadFineLoad')
      .desc('chaparral dead fine (0 - 0.25 inch diameter) fuel oven-dry load')
      .units('fuelLoad').value(0);
    new DagLeafQuantity(derived, 'deadSmallLoad')
      .desc('chaparral dead small (0.25 to 0.5 inch diameter) fuel oven-dry load')
      .units('fuelLoad').value(0);
    new DagLeafQuantity(derived, 'deadMediumLoad')
      .desc('chaparral dead medium (0.5 to 1 inch diameter) fuel oven-dry load')
      .units('fuelLoad').value(0);
    new DagLeafQuantity(derived, 'deadLargeLoad')
      .desc('chaparral dead large (1 to 3 inch diameter) fuel oven-dry load')
      .units('fuelLoad').value(0);


    new DagLeafQuantity(derived, 'liveLoad')
      .desc('chaparral live fuel category oven-dry load')
      .units('fuelLoad').value(0);
    new DagLeafQuantity(derived, 'liveFineLoad')
      .desc('chaparral live fine (0 to 0.25 inch diameter) fuel oven-dry load')
      .units('fuelLoad').value(0);
    new DagLeafQuantity(derived, 'liveSmallLoad')
      .desc('chaparral live small (0.25 to 0.5 inch diameter) fuel oven-dry load')
      .units('fuelLoad').value(0);
    new DagLeafQuantity(derived, 'liveMediumLoad')
      .desc('chaparral live medium (0.5 to 1 inch diameter) fuel oven-dry load')
      .units('fuelLoad').value(0);
    new DagLeafQuantity(derived, 'liveLargeLoad')
      .desc('chaparral live large (1 to 3 inch diameter) fuel oven-dry load')
      . units('fuelLoad').value(0);
    new DagLeafQuantity(derived, 'liveLeafLoad')
      .desc('chaparral live leaf oven-dry load')
      . units('fuelLoad').value(0);
  }

  // Called from parent BpxTreeFuelModel.connect()
  subconnect(cfgFuel, cfgTotalLoad, modelKey) {
    const { parms } = this;
    const { derived } = this;

    const domain = BpxLibFuelChaparral.domain();
    this.domain.fixed(domain);

    parms.chaparralType
      .calcIf(cfgFuel, 'catalog', BpxLibFuelCatalog.chaparralFuelType, modelKey)
      .inputIf(cfgFuel, domain)
      .fixed(BpxLibFuelChaparral.chaparralTypes()[0]);

    parms.deadFuelFraction
      .calcIf(cfgFuel, 'catalog', BpxLibFuelCatalog.chaparralDeadFraction, modelKey)
      .inputIf(cfgFuel, domain)
      .fixed(0);

    parms.depth
      .calcIf(cfgFuel, 'catalog', BpxLibFuelCatalog.chaparralDepth, modelKey)
      .inputIf(cfgFuel, domain)
      .fixed(0.01);

    parms.totalLoad
      .calcIf(cfgFuel, 'catalog', BpxLibFuelCatalog.chaparralTotalLoad, modelKey)
      .bindIf(cfgTotalLoad, 'estimated', derived.totalLoad)
      .inputIf(cfgFuel, domain)
      .fixed(0);

    derived.age
      .calc(BpxLibFuelChaparral.age, parms.depth, parms.chaparralType);

    derived.totalLoad
      .calc(BpxLibFuelChaparral.totalLoad, derived.age, parms.chaparralType);

    derived.depth
      .calc(BpxLibFuelChaparral.fuelDepth, derived.age, parms.chaparralType);

    derived.averageMortality
      .calc(BpxLibFuelChaparral.deadFractionAverageMortality, derived.age);

    derived.severeMortality
      .calc(BpxLibFuelChaparral.deadFractionSevereMortality, derived.age);

    derived.deadLoad
      .calc(BpxLibFuelChaparral.deadLoad, parms.totalLoad, parms.deadFuelFraction);

    derived.deadFineLoad
      .calc(BpxLibFuelChaparral.deadClass1Load, parms.totalLoad, parms.deadFuelFraction);

    derived.deadSmallLoad
      .calc(BpxLibFuelChaparral.deadClass2Load, parms.totalLoad, parms.deadFuelFraction);

    derived.deadMediumLoad
      .calc(BpxLibFuelChaparral.deadClass3Load, parms.totalLoad, parms.deadFuelFraction);

    derived.deadLargeLoad
      .calc(BpxLibFuelChaparral.deadClass4Load, parms.totalLoad, parms.deadFuelFraction);

    derived.liveLoad
      .calc(BpxLibFuelChaparral.liveLoad, parms.totalLoad, parms.deadFuelFraction);

    derived.liveFineLoad
      .calc(BpxLibFuelChaparral.liveClass1Load, parms.totalLoad, parms.deadFuelFraction);

    derived.liveSmallLoad
      .calc(BpxLibFuelChaparral.liveClass2Load, parms.totalLoad, parms.deadFuelFraction);

    derived.liveMediumLoad
      .calc(BpxLibFuelChaparral.liveClass3Load, parms.totalLoad, parms.deadFuelFraction);

    derived.liveLargeLoad
      .calc(BpxLibFuelChaparral.liveClass4Load, parms.totalLoad, parms.deadFuelFraction);

    derived.liveLeafLoad
      .calc(BpxLibFuelChaparral.liveClass5Load, parms.totalLoad, parms.deadFuelFraction);
  }
}

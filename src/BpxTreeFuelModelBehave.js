/**
 * @file Defines the BehavePlus Explorer standard (Behave) fuel model tree and leafs.
 * @copyright Systems for Environmentl Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import Branch from './Branch';
import BpxLibFuelBehave from './BpxLibFuelBehave';
import BpxLibFuelCatalog from './BpxLibFuelCatalog';
import LeafQuantity from './LeafLeafQuantity';
import { BpxLeafFuelDomain } from './BpxLeafOptions';

/* eslint-disable no-new */
class BpxTreeFuelModelBehave extends Branch {
  constructor(parent, name = 'behave') {
    super(parent, name);

    new BpxLeafFuelDomain(this).value(BpxLibFuelBehave.domain());

    // Always input
    const parms = new Branch(this, 'parms');
    new LeafQuantity(parms, 'curedHerbFraction')
      .desc('standard fuel model herb cured fraction')
      .units('fraction').value(0);

    // Input when fuel modeling
    new LeafQuantity(parms, 'depth')
      .desc('standard fuel model depth')
      .units('fuelDepth').value(0.01);
    new LeafQuantity(parms, 'deadMext')
      .desc('standard fuel model dead fuel moisture content of extinction')
      .units('fuelMois').value(.01);
    new LeafQuantity(parms, 'totalHerbLoad')
      .desc('standard fuel model total (dead and live) herb oven-dry load')
      .units('fuelLoad').value(0);
    new LeafQuantity(parms, 'dead1Load')
      .desc('standard fuel model dead 1-h time-lag dead-and-down oven-dry load')
      .units('fuelLoad').value(0);
    new LeafQuantity(parms, 'dead10Load')
      .desc('standard fuel model dead 10-h time-lag dead-and-down oven-dry load')
      .units('fuelLoad').value(0);
    new LeafQuantity(parms, 'dead100Load')
      .desc('standard fuel model dead 100-h time-lag dead-and-down oven-dry load')
      .units('fuelLoad').value(0);
    new LeafQuantity(parms, 'liveStemLoad')
      .desc('standard fuel model live stem oven-dry load')
      .units('fuelLoad').value(0);
    new LeafQuantity(parms, 'dead1Savr')
      .desc('standard fuel model dead 1-h time-lag fuel surface area-to-volume ratio')
      .units('fuelSavr').value(1);
    new LeafQuantity(parms, 'liveHerbSavr')
      .desc('standard fuel model live herbaceous fuel surface area-to-volume ratio')
      .units('fuelSavr').value(1);
    new LeafQuantity(parms, 'liveStemSavr')
      .desc('standard fuel model live stem wood fuel surface area-to-volume ratio')
      .units('fuelSavr').value(1);
    new LeafQuantity(parms, 'deadHeat')
      .desc('standard fuel model dead fuel low heat of combustion')
      .units('fuelHeat').value(8000);
    new LeafQuantity(parms, 'liveHeat')
      .desc('standard fuel model live fuel low heat of combustion')
      .units('fuelHeat').value(8000);

      // Always derived
    const derived = new Branch(this, 'derived');
    new LeafQuantity(derived, 'deadHerbLoad')
      .desc('standard fuel model dead herb oven-dry load')
      .units('fuelLoad').value(0);
    new LeafQuantity(derived, 'liveHerbLoad')
      .desc('standard fuel model live herb oven-dry load')
      .units('fuelLoad').value(0);
  }

  // Called from [primary|secondary|crown].connect()
  subconnect(cfgFuel, cfgCuredHerb, moistureLiveHerb, modelKey) {
    // Dag.ensureDefined('BpxTreeFuelModelBehave.subconnect',
    //   {cfgCuredHerb, cfgFuel, moistureLiveHerb, modelKey});

    const { parms } = this;
    const behaveDomain = BpxLibFuelBehave.domain();
    this.domain.fixed(behaveDomain);

    parms.curedHerbFraction
      .calcIf(cfgCuredHerb, 'estimated', BpxLibFuelBehave.curedHerbFraction, moistureLiveHerb)
      .input();

    parms.totalHerbLoad
      .calcIf(cfgFuel, 'catalog', BpxLibFuelCatalog.behaveTotalHerbLoad, modelKey)
      .inputIf(cfgFuel, behaveDomain)
      .fixed(0);

    parms.depth
      .calcIf(cfgFuel, 'catalog', BpxLibFuelCatalog.behaveDepth, modelKey)
      .inputIf(cfgFuel, behaveDomain)
      .fixed(0.01);

    parms.deadHeat
      .calcIf(cfgFuel, 'catalog', BpxLibFuelCatalog.behaveDeadHeat, modelKey)
      .inputIf(cfgFuel, behaveDomain)
      .fixed(8000);

    parms.deadMext
      .calcIf(cfgFuel, 'catalog', BpxLibFuelCatalog.behaveDeadMext, modelKey)
      .inputIf(cfgFuel, behaveDomain)
      .fixed(0.25);

    parms.dead1Load
      .calcIf(cfgFuel, 'catalog', BpxLibFuelCatalog.behaveDead1Load, modelKey)
      .inputIf(cfgFuel, behaveDomain)
      .fixed(0);

    parms.dead1Savr
      .calcIf(cfgFuel, 'catalog', BpxLibFuelCatalog.behaveDead1Savr, modelKey)
      .inputIf(cfgFuel, behaveDomain)
      .fixed(0);

    parms.dead10Load
      .calcIf(cfgFuel, 'catalog', BpxLibFuelCatalog.behaveDead10Load, modelKey)
      .inputIf(cfgFuel, behaveDomain)
      .fixed(0);

    parms.dead100Load
      .calcIf(cfgFuel, 'catalog', BpxLibFuelCatalog.behaveDead100Load, modelKey)
      .inputIf(cfgFuel, behaveDomain)
      .fixed(0);

    parms.liveHeat
      .calcIf(cfgFuel, 'catalog', BpxLibFuelCatalog.behaveLiveHeat, modelKey)
      .inputIf(cfgFuel, behaveDomain)
      .fixed(8000);

    parms.liveHerbSavr
      .calcIf(cfgFuel, 'catalog', BpxLibFuelCatalog.behaveLiveHerbSavr, modelKey)
      .inputIf(cfgFuel, behaveDomain)
      .fixed(1);

    parms.liveStemLoad
      .calcIf(cfgFuel, 'catalog', BpxLibFuelCatalog.behaveLiveStemLoad, modelKey)
      .inputIf(cfgFuel, behaveDomain)
      .fixed(0);

    parms.liveStemSavr
      .calcIf(cfgFuel, 'catalog', BpxLibFuelCatalog.behaveLiveStemSavr, modelKey)
      .inputIf(cfgFuel, behaveDomain)
      .fixed(1);

    const { derived } = this;

    derived.deadHerbLoad
      .calc(BpxLibFuelBehave.deadHerbLoad, parms.totalHerbLoad, parms.curedHerbFraction);

    derived.liveHerbLoad
      .calc(BpxLibFuelBehave.liveHerbLoad, parms.totalHerbLoad, parms.curedHerbFraction);
  }
}

export default BpxTreeFuelModelBehave;

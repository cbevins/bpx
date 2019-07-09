/**
 * @file Defines the BehavePlus Explorer crown fuel model sub-tree.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';
import DagLeafText from './DagLeafText';

import BpxLibFuelBehave from './BpxLibFuelBehave';
import { BpxLeafFuelDomain } from './BpxLeafOptions';
import BpxTreeFuelModelBehave from './BpxTreeFuelModelBehave';
import BpxTreeFuelModelChaparral from './BpxTreeFuelModelChaparral';
import BpxTreeFuelModelPalmettoGallberry from './BpxTreeFuelModelPalmettoGallberry';
import BpxTreeFuelModelWesternAspen from './BpxTreeFuelModelWesternAspen';

export default class BpxTreeCrownFuelModel extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    // DagBranches
    new BpxTreeFuelModelBehave(this, 'behave');
    new BpxTreeFuelModelChaparral(this, 'chaparral');
    new BpxTreeFuelModelPalmettoGallberry(this, 'palmettoGallberry');
    new BpxTreeFuelModelWesternAspen(this, 'westernAspen');
    // Leaves
    new BpxLeafFuelDomain(this, 'domain');
    new DagLeafText(this, 'key')
      .desc('fuel model catalog key')
      .value('10');
  }

  connect(tree) {
    const behaveDomain = BpxLibFuelBehave.domain();
    this.domain.fixed(behaveDomain);
    this.key.fixed('10');
    const { parms, derived } = this.behave;
    parms.curedHerbFraction.fixed(0);
    parms.totalHerbLoad.fixed(0);
    parms.depth.fixed(1);
    parms.deadHeat.fixed(8000);
    parms.deadMext.fixed(0.25);
    parms.dead1Load.fixed(0.138);
    parms.dead1Savr.fixed(2000);
    parms.dead10Load.fixed(0.092);
    parms.dead100Load.fixed(0.23);
    parms.liveHeat.fixed(8000);
    parms.liveHerbSavr.fixed(1500);
    parms.liveStemLoad.fixed(0.092);
    parms.liveStemSavr.fixed(1500);
    derived.deadHerbLoad.fixed(0);
    derived.liveHerbLoad.fixed(0);

    const cfgFuel = tree.configs.fuel.primary;
    const cfgTotalLoad = tree.configs.fuel.chaparralTotalLoad;
    this.chaparral.subconnect(cfgFuel, cfgTotalLoad, this.key);
    this.palmettoGallberry.subconnect(cfgFuel, this.key);
    this.westernAspen.subconnect(cfgFuel, this.key);
    }
}

/*
 * @fule Defines the BehavePlus Explorer Fuel Particle sub-tree.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';
import DagLeafQuantity from './DagLeafQuantity';
import DagLeafText from './DagLeafText';

import BpxLibFuelParticle from './BpxLibFuelParticle';

export default class BpxTreeFuelParticle extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    // 8 input DagLeafs
    new DagLeafQuantity(this, 'dens')
      .desc('fuel particle density')
      .units('fuelDens').value(32);
    new DagLeafQuantity(this, 'heat')
      .desc('fuel particle low heat of combustion')
      .units('fuelHeat').value(8000);
    new DagLeafText(this, 'label')
      .desc('brief fuel particle description')
      .units('fuelLabel').value('unspecified');
    new DagLeafQuantity(this, 'load')
      .desc('fuel particle oven-dry fuel load')
      .units('fuelLoad').value(0);
    new DagLeafQuantity(this, 'mois')
      .desc('fuel particle moisture content')
      .units('fuelMois').value(5);
    new DagLeafQuantity(this, 'savr')
      .desc('fuel paryicle surface area-to-volume ratio')
      .units('fuelSavr').value(1);
    new DagLeafQuantity(this, 'seff')
      .desc('fuel particle effective (silica-free) mineral content')
      .units('fuelSeff').value(0.01);
    new DagLeafQuantity(this, 'stot')
      .desc('fuel particle total mineral content')
      .units('fuelStot').value(0.0555);

    // 12 Derived DagLeafs
    new DagLeafQuantity(this, 'area')
      .desc('fuel particle surface area')
      .units('fuelArea').value(0);
    new DagLeafQuantity(this, 'awtg')
      .desc('fuel particle surface area weighting factor')
      .units('fraction').value(0);
    new DagLeafQuantity(this, 'diam')
      .desc('fuel particle equivalent cylindrical diameter')
      .units('fuelDiam').value(0);
    new DagLeafQuantity(this, 'efhn')
      .desc('fuel particle effective heating number; fraction of fuel involved in ignition')
      .units('fraction').value(0);
    new DagLeafQuantity(this, 'efld')
      .desc('effective fuel load; load of fuel involved in ingition')
      .units('fuelLoad').value(0);
    new DagLeafQuantity(this, 'efwl')
      .desc('effective fuel water load; amount of water within the effective fuel load')
      .units('fuelLoad').value(0);
    new DagLeafQuantity(this, 'pprc')
      .desc('fuel particle packing ratio contribution')
      .units('fuelDepth').value(0);
    new DagLeafQuantity(this, 'qign')
      .desc('fuel particle heat of pre-ignition')
      .units('fuelHeat').value(0);
    new DagLeafQuantity(this, 'size')
      .desc('fuel particle size class [0..6]')
      .units('index').value(6);
    new DagLeafQuantity(this, 'swtg')
      .desc('fuel particle size class surface area weighting factor')
      .units('fraction').value(0);
    new DagLeafQuantity(this, 'volm')
      .desc('fuel particle equivalent cylindrical volume')
      .units('fuelVolm').value(0);
    new DagLeafQuantity(this, 'wnet')
      .desc('fuel particle net (mineral-free) oven-dry load')
      .units('fuelLoad').value(0);
  }

  connect(/* tree */) {
    // No outside DagLeaf references are required.
    this.area.calc(BpxLibFuelParticle.area, this.load, this.savr, this.dens);
    this.diam.calc(BpxLibFuelParticle.diam, this.savr);
    this.efhn.calc(BpxLibFuelParticle.efhn, this.savr);
    this.efwl.calc(BpxLibFuelParticle.efwl, this.efld, this.mois);
    this.pprc.calc(BpxLibFuelParticle.pprc, this.load, this.dens);
    this.qign.calc(BpxLibFuelParticle.qign, this.mois, this.efhn);
    this.size.calc(BpxLibFuelParticle.size, this.savr);
    this.volm.calc(BpxLibFuelParticle.volm, this.load, this.dens);
    this.wnet.calc(BpxLibFuelParticle.wnet, this.load, this.stot);
  }
}

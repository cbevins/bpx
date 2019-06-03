/*
 * @file Defines the BehavePlus Explorer Fuel Category {Live | Dead} sub-tree.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';
import DagLeafQuantity from './DagLeafQuantity';

import BpxLibFuelBed from './BpxLibFuelBed';
import BpxLibFuelParticle from './BpxLibFuelParticle';
import BpxLibMath from './BpxLibMath';

import BpxTreeFuelParticle from './BpxTreeFuelParticle';

export class BpxTreeFuelParticles extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    new BpxTreeFuelParticle(this, 'class1');
    new BpxTreeFuelParticle(this, 'class2');
    new BpxTreeFuelParticle(this, 'class3');
    new BpxTreeFuelParticle(this, 'class4');
    new BpxTreeFuelParticle(this, 'class5');
  }
}

export class BpxTreeFuelCategory extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    // DagBranches
    new BpxTreeFuelParticles(this, 'particle');
    // DagLeafs
    new DagLeafQuantity(this, 'area')
      .desc('life category fuel surface area')
      .units('fuelArea').value(0);
    new DagLeafQuantity(this, 'awtg')
      .desc('life category surface area weighting factor')
      .units('fraction');
    new DagLeafQuantity(this, 'mineralDamping')
      .desc('life category mineral damping coefficient')
      .units('fraction').value(0);
    new DagLeafQuantity(this, 'moistureDamping')
      .desc('life category moisture damping coefficient')
      .units('fraction').value(0);
    new DagLeafQuantity(this, 'heat')
      .desc('life category weighted low heat of combustion')
      .units('fuelHeat').value(0);
    new DagLeafQuantity(this, 'load')
      .desc('life category total fuel load')
      .units('fuelLoad').value(0);
    new DagLeafQuantity(this, 'efld')
      .desc('life category total effective fuel load')
      .units('fuelLoad').value(0);
    new DagLeafQuantity(this, 'efwl')
      .desc('life category effective fuel water load')
      .units('fuelLoad').value(0);
    new DagLeafQuantity(this, 'mext')
      .desc('life category moisture content of extinction')
      .units('fuelMois').value(5);
    new DagLeafQuantity(this, 'mois')
      .desc('life category weighted fuel moisture content')
      .units('fuelMois').value(5);
    new DagLeafQuantity(this, 'efmc')
      .desc('life category effective fuel moisture content')
      .units('fuelMois').value(5);
    new DagLeafQuantity(this, 'pprc')
      .desc('life category contribution to fuel bed packing ratio')
      .units('fuelDepth').value(0);
    new DagLeafQuantity(this, 'qign')
      .desc('life category heat of pre-ignition')
      .units('fuelHeat').value(0);
    new DagLeafQuantity(this, 'rxi')
      .desc('life category reaction intensity')
      .units('fireRxi').value(0);
    new DagLeafQuantity(this, 'rxiDry')
      .desc('life category oven-dry reaction intensity')
      .units('fireRxi').value(0);
    new DagLeafQuantity(this,'savr')
      .desc('life category weighted surface area-to-volume ratio')
      .units('fuelSavr').value(1);
    new DagLeafQuantity(this, 'seff')
      .desc('life category weighted effective (silica-free) mineral content')
      .units('fuelSeff').value(0.01);
    new DagLeafQuantity(this, 'swtg') // Actually an Array of weights
      .desc('life category surface area weighting factors by size class')
      .units('index'); //.value([0,0,0,0,0,0]);
    new DagLeafQuantity(this, 'wnet')
      .desc('life category weighted effective (mineral-free) fuel load')
      .units('fuelLoad').value(0);
  }

  connect(/* tree */) {
    // No outside DagLeaf references are required.
    const particles = Object.values(this.particle);
    const [c1, c2, c3, c4, c5] = particles;
    const efld = (this.name() === 'dead')
      ? BpxLibFuelParticle.efld : BpxLibFuelParticle.efll;

    // Fuel particle derived properties
    particles.forEach((c) => {
      //c.awtg.calc(BpxLibMath.div, c.area, this.area);
      c.awtg.calc(BpxLibFuelParticle.awtg, c.area, this.area);
      c.efld.calc(efld, c.savr, c.load); // NOTE calls 'efld' for dead, 'efll' for live
      c.swtg.calc(BpxLibFuelParticle.swtg, c.size, this.swtg);
    });

    // Life category properties summed over all life particles
    ['area', 'efld', 'efwl', 'load', 'pprc'].forEach((prop) => {
      this[prop].calc(BpxLibMath.sum, c1[prop], c2[prop], c3[prop], c4[prop], c5[prop]);
    });

    // Weighted life category properties
    ['heat', 'mois', 'qign', 'savr', 'seff'].forEach((prop) => {
      this[prop].calc(BpxLibMath.sumProd,
        c1.awtg, c2.awtg, c3.awtg, c4.awtg, c5.awtg,
        c1[prop], c2[prop], c3[prop], c4[prop], c5[prop]);
    });
    this.swtg.calc(BpxLibFuelBed.swtg,
      c1.area, c1.size, c2.area, c2.size, c3.area, c3.size,
      c4.area, c4.size, c5.area, c5.size);
    this.wnet.calc(BpxLibMath.sumProd,
      c1.swtg, c2.swtg, c3.swtg, c4.swtg, c5.swtg,
      c1.wnet, c2.wnet, c3.wnet, c4.wnet, c5.wnet );

    this.efmc.calc(BpxLibMath.div, this.efwl, this.efld);
    this.mineralDamping.calc(BpxLibFuelBed.etas, this.seff);
    this.moistureDamping.calc(BpxLibFuelBed.etam, this.mois, this.mext);
  }
}

export class BpxTreeFuelCategoryDead extends BpxTreeFuelCategory {
  // Use the parent's connect() only!!
}

export class BpxTreeFuelCategoryLive extends BpxTreeFuelCategory {
  constructor(parent, name) {
    super(parent, name);
    // Live extinction moisture factor is unique to the LIVE fuel category
    new DagLeafQuantity(this, 'mxtk')
      .desc('live fuel category moisture of extinction centent factor')
      .units('factor').value(1);
  }
  // Use the parent's connect() only
}

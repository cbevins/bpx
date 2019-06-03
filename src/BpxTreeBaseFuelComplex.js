/**
 * @file Composes the BehavePlus Explorer fuel sub-tree.
 *
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';
import BpxLibFuelBed from './BpxLibFuelBed';

export default class BpxTreeBaseFuelComplex extends DagBranch {
  /**
   * FuelComplex provides connections between 4 possible FuelModel domains
   * and a resulting single FuelBed. There are two design possibilities:
   *  - Each FuelModel domain encapsulates its own FuelBed description, which
   *  simplifies connect() here but requires 4 x 74 = 296 additional leafs,
   *  - Each FuelModel domain simply produces its own derived parameters,
   * and connect() here deals with complexity of assignment to the single FuelBed.
   */
  baseConnect(tree) {
    // External leaf references
    const { tl1h, tl10h, tl100h } = tree.site.moisture.dead;
    const { herb, stem } = tree.site.moisture.live;

    // Convenience vars
    const pdead = this.bed.dead.particle;
    const plive = this.bed.live.particle;
    const b = this.model.behave;
    const c = this.model.chaparral;
    const p = this.model.palmettoGallberry;
    const w = this.model.westernAspen;

    const { pick } = BpxLibFuelBed;
    const { domain } = this.model;

    this.bed.depth.calc(pick, domain,
      b.parms.depth, c.parms.depth, p.derived.depth, w.derived.depth);

    this.bed.dead.mext.calc(pick, domain, b.parms.deadMext, 0.3, 0.4, 0.25);

    // Load for 5 dead and 5 live classes
    pdead.class1.load.calc(pick, this.model.domain,
      b.parms.dead1Load, c.derived.deadFineLoad, p.derived.deadFineLoad, w.derived.deadFineLoad);

    pdead.class2.load.calc(pick, this.model.domain,
      b.parms.dead10Load, c.derived.deadSmallLoad,
      p.derived.deadSmallLoad, w.derived.deadSmallLoad);

    pdead.class3.load.calc(pick, domain,
      b.parms.dead100Load, c.derived.deadMediumLoad, p.derived.deadFoliageLoad, 0);

    pdead.class4.load.calc(pick, domain,
      b.derived.deadHerbLoad, c.derived.deadLargeLoad, p.derived.deadLitterLoad, 0);

    pdead.class5.load.fixed(0);

    plive.class1.load.calc(pick, domain,
      b.derived.liveHerbLoad, c.derived.liveFineLoad,
      p.derived.liveFineLoad, w.derived.liveHerbLoad);

    plive.class2.load.calc(pick, domain,
      b.parms.liveStemLoad, c.derived.liveSmallLoad,
      p.derived.liveSmallLoad, w.derived.liveStemLoad);

    plive.class3.load.calc(pick, domain,
      0, c.derived.liveMediumLoad, p.derived.liveFoliageLoad, 0);

    plive.class4.load.calc(pick, domain,
      0, c.derived.liveLargeLoad, 0, 0);

    plive.class5.load.calc(pick, domain,
      0, c.derived.liveLeafLoad, 0, 0);

    // Savr for 5 dead and 5 live classes
    pdead.class1.savr.calc(pick, domain, b.parms.dead1Savr, 640, 350, w.derived.deadFineSavr);
    pdead.class2.savr.calc(pick, domain, 109, 127, 140, 109);
    pdead.class3.savr.calc(pick, domain, 30, 61, 2000, 1);
    pdead.class4.savr.calc(pick, domain, b.parms.liveHerbSavr, 27, 2000, 1);
    pdead.class5.savr.fixed(1);
    plive.class1.savr.calc(pick, domain, b.parms.liveHerbSavr, 640, 350, 2800);
    plive.class2.savr.calc(pick, domain, b.parms.liveStemSavr, 127, 140, w.derived.liveStemSavr);
    plive.class3.savr.calc(pick, domain, 1, 61, 1, 1);
    plive.class4.savr.calc(pick, domain, 1, 27, 1, 1);
    plive.class5.savr.calc(pick, domain, 1, 2200, 1, 1);

    // Heat for 5 dead and 5 live classes
    pdead.class1.heat.calc(pick, domain, b.parms.deadHeat, 8000, 8300, 8000);
    pdead.class2.heat.calc(pick, domain, b.parms.deadHeat, 8000, 8300, 8000);
    pdead.class3.heat.calc(pick, domain, b.parms.deadHeat, 8000, 8300, 8000);
    pdead.class4.heat.calc(pick, domain, b.parms.deadHeat, 8000, 8300, 8000);
    pdead.class5.heat.fixed(8000);
    plive.class1.heat.calc(pick, domain, b.parms.liveHeat, 10500, 8300, 8000);
    plive.class2.heat.calc(pick, domain, b.parms.liveHeat, 9550, 8300, 8000);
    plive.class3.heat.calc(pick, domain, b.parms.liveHeat, 9550, 8300, 8000);
    plive.class4.heat.calc(pick, domain, b.parms.liveHeat, 9550, 8300, 8000);
    plive.class5.heat.calc(pick, domain, b.parms.liveHeat, 10500, 8300, 8000);

    // Dens for 5 dead and 5 live classes
    pdead.class1.dens.calc(pick, domain, 32, 46, 30, 32);
    pdead.class2.dens.calc(pick, domain, 32, 46, 30, 32);
    pdead.class3.dens.calc(pick, domain, 32, 46, 30, 32);
    pdead.class4.dens.calc(pick, domain, 32, 46, 30, 32);
    pdead.class5.dens.fixed(32);
    plive.class1.dens.calc(pick, domain, 32, 46, 46, 32);
    plive.class2.dens.calc(pick, domain, 32, 46, 46, 32);
    plive.class3.dens.calc(pick, domain, 32, 46, 46, 32);
    plive.class4.dens.calc(pick, domain, 32, 46, 46, 32);
    plive.class5.dens.calc(pick, domain, 32, 32, 46, 32);

    // Seff for 5 dead and 5 live classes
    pdead.class1.seff.calc(pick, domain, 0.01, 0.015, 0.010, 0.01);
    pdead.class2.seff.calc(pick, domain, 0.01, 0.015, 0.010, 0.01);
    pdead.class3.seff.calc(pick, domain, 0.01, 0.015, 0.010, 0.01);
    pdead.class4.seff.calc(pick, domain, 0.01, 0.015, 0.010, 0.01);
    pdead.class5.seff.fixed(0.01);
    plive.class1.seff.calc(pick, domain, 0.01, 0.015, 0.015, 0.01);
    plive.class2.seff.calc(pick, domain, 0.01, 0.015, 0.015, 0.01);
    plive.class3.seff.calc(pick, domain, 0.01, 0.015, 0.015, 0.01);
    plive.class4.seff.calc(pick, domain, 0.01, 0.015, 0.015, 0.01);
    plive.class5.seff.calc(pick, domain, 0.01, 0.035, 0.015, 0.01);

    // Stot for 5 dead and 5 live classes
    pdead.class1.stot.calc(pick, domain, 0.0555, 0.055, 0.03, 0.055);
    pdead.class2.stot.calc(pick, domain, 0.0555, 0.055, 0.03, 0.055);
    pdead.class3.stot.calc(pick, domain, 0.0555, 0.055, 0.03, 0.055);
    pdead.class4.stot.calc(pick, domain, 0.0555, 0.055, 0.03, 0.055);
    pdead.class5.stot.fixed(0.0555);
    plive.class1.stot.calc(pick, domain, 0.0555, 0.055, 0.03, 0.055);
    plive.class2.stot.calc(pick, domain, 0.0555, 0.055, 0.03, 0.055);
    plive.class3.stot.calc(pick, domain, 0.0555, 0.055, 0.03, 0.055);
    plive.class4.stot.calc(pick, domain, 0.0555, 0.055, 0.03, 0.055);
    plive.class5.stot.calc(pick, domain, 0.0555, 0.055, 0.03, 0.055);

    // Mois for 5 dead and 5 live classes
    pdead.class1.mois.calc(pick, domain, tl1h, tl1h, tl1h, tl1h);
    pdead.class2.mois.calc(pick, domain, tl10h, tl10h, tl10h, tl10h);
    pdead.class3.mois.calc(pick, domain, tl100h, tl10h, tl1h, 5);
    pdead.class4.mois.calc(pick, domain, tl1h, tl100h, tl100h, 5);
    pdead.class5.mois.fixed(5);
    plive.class1.mois.calc(pick, domain, herb, stem, stem, herb);
    plive.class2.mois.calc(pick, domain, stem, stem, stem, stem);
    plive.class3.mois.calc(pick, domain, 5, stem, stem, 5);
    plive.class4.mois.calc(pick, domain, 5, stem, 5, 5);
    plive.class5.mois.calc(pick, domain, 5, herb, 5, 5);

    // Labels
    pdead.class1.label.calc(pick, domain,
      'Dead 1-h time-lag (0 to 0.25 inch diameter) branch wood',
      'Dead 1-h time-lag (0 to 0.25 inch diameter) stem wood',
      'Dead 1-h time-lag (0 to 0.25 inch diameter) stem wood',
      'Dead 1-h time-lag (0 to 0.25 inch diameter) stem wood');
    pdead.class2.label.calc(pick, domain,
      'Dead 10-h time-lag (0.25 to 1 inch diameter) branch wood',
      'Dead small 10-h time-lag (0.25 to 0.5 inch diameter) stem wood',
      'Dead 10-h time-lag (0.25 to 1 inch diameter) stem wood',
      'Dead 10-h time-lag (0.25 to 1 inch diameter) stem wood');
    pdead.class3.label.calc(pick, domain,
      'Dead 100-h time-lag (1 to 3 inch diameter) branch wood',
      'Dead medium 10-h time-lag (0.5 to 1 inch diameter) stem wood',
      'Dead foliage',
      'unused');
    pdead.class4.label.calc(pick, domain,
      'Dead herb',
      'Dead 100-h time-lag (1 to 3 inch diameter) stem wood',
      'Litter layer',
      'unused');
    pdead.class5.label.fixed('unused');
    plive.class1.label.calc(pick, domain,
      'Live herb',
      'Live fine (0 to 0.25 inch diameter) stem wood',
      'Live 0 to 0.25 inch diameter stem wood',
      'Live herb');
    plive.class2.label.calc(pick, domain,
      'Live stem wood',
      'Live small (0.25 to 0.5 inch diameter) stem wood',
      'Live 0.25 to 1 inch diameter stem wood',
      'Live woody');
    plive.class3.label.calc(pick, domain,
      'unused',
      'Live medium (0.5 to 1 inch diameter) stem wood',
      'Live foliage',
      'unused');
    plive.class4.label.calc(pick, domain,
      'unused',
      'Live large (1 to 3 inch diameter) stem wood',
      'unused',
      'unused');
    plive.class5.label.calc(pick, domain,
      'unused',
      'Live leaves',
      'unused',
      'unused');
  }
}

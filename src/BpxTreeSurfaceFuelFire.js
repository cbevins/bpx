import BpxTreeBaseFuelFire from './BpxTreeBaseFuelFire';
import BpxLibFuelBed from './BpxLibFuelBed';

/**
 * Implements the Bpx surface fuel's fire spread subtree where
 * - fuel bed leaf references come from a sibling 'bed'
 * - canopy, slope, and wind leaf references all come from tree.site
 *
 * NOTE: Because the crown fire fuel bed assumes
 * - a fixed wind adjustment factor (0.4),
 * - slope steepness of zero, and
 * - wind heading is upslope
 * there are two derived classes;
 * - BpxTreeFuelFire for surface fuels, and
 * - BpxTreeCrownFireFuelFire for crown fire.
 *
 * Each of the derived classes implements a connect() method, which:
 * - first calls the TreFuelFire.baseConnect() method for the heavy lifting,
 * - then connects the waf, slope, and fire heading.
 */
export default class BpxTreeSurfaceFuelFire extends BpxTreeBaseFuelFire {
  connect(tree) {
    BpxTreeBaseFuelFire.prototype.baseConnect.call(this, tree);
    // Required external references
    // Requires 3 fuel bed leafs: reactionIntensity, ros0, openWaf
    const bed = this.own.parent.bed;
    // Requires 3 configurations:
    //const cfgEws = tree.configs.fire.ewsLimit;
    //const cfgSpd = tree.configs.wind.speed;
    const cfgWaf = tree.configs.fuel.waf;
    // Requires 2 canopy leafs: sheltersFuel, shelteredWaf
    const canopy = tree.site.canopy;
    // Requires 1 slope.steepness leaf: ratio
    const slope = tree.site.slope;
    // Requires 3 wind.speed leafs: at20ft, atMidflame, waf
    // and 1 wind.direction leaf: headingFromUpslope
    const wind = tree.site.wind;

    // WAF is either from the site's input WAF
    // or calculated from canopy inputs and fuel depth
    this.wind.waf
      .bindIf(cfgWaf, 'input', wind.speed.waf)
      .calc(BpxLibFuelBed.waf,
        canopy.sheltersFuel,
        canopy.shelteredWaf,
        bed.openWaf);

    this.slope.ratio
      .bind(slope.steepness.ratio);

    this.wind.headingFromUpslope
      .bind(wind.direction.headingFromUpslope);
  }
}

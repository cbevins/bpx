import BpxTreeBaseFuelFire from './BpxTreeBaseFuelFire';
/**
 * Implements the Bpx crown fuel's fire spread subtree where
 * - fuel bed leaf references come from a sibling 'bed'
 * - canopy, slope, and wind leaf references all come from tree.site
 *
 * NOTE: Because the crown fire fuel bed assumes:
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
export default class BpxTreeCrownFuelFire extends BpxTreeBaseFuelFire {
  constructor(parent, name) {
    super(parent, name);
  }

  connect(tree) {
    BpxTreeBaseFuelFire.prototype.baseConnect.call(this, tree);
    this.wind.waf.fixed(0.4);
    this.slope.ratio.fixed(0);
    this.wind.headingFromUpslope.fixed(0);
  }
}

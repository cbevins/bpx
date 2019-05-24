/**
 * @file Class of static math functions used by other BehavePlus Explorer files.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins <cbevins@montana.com>
 * @version 0.1.0
 */

 import BpxLibMath from './BpxLibMath';

export default class BpxLibCanopy {

  // Canopy volumetric fill ratio; the volume under the canopy top that
  // is filled with tree crowns (division by 3 assumes conical crown shapes).
  static crownFill(cover, cratio) {
    return BpxLibMath.fraction(cratio) * BpxLibMath.fraction(cover) / 3;
  }

  // Crown length
  static crownLength(baseHt, ht) {
    return Math.max( 0, ht - baseHt);
  }

  // Crown length from crown ratio and canopy height
  static crownLengthFromRatio(crownRatio, ht) {
    return crownRatio * ht;
  }

  // Crown ratio
  static crownRatio(length, ht) {
    return Math.min(1., BpxLibMath.div(length, ht));
  }

  // Canopy fuel load
  static fuelLoad(bulk, length) {
    return Math.max( 0, bulk * length);
  }

  // Canopy heat per unit area
  static hpua(load, heat) {
    return Math.max(0, load * heat);
  }

  // Canopy shelters fuel
  static sheltersFuel(cover, ht, fill) {
    return cover >= 0.01 && fill >= 0.05 && ht >= 6;
  }

  // Canopy induced midflame windspeed adjustment factor
  static waf(cover, ht, fill) {
    let waf = 1;
    if (BpxLibCanopy.sheltersFuel(cover, ht, fill)) {
      waf = 0.555 / (Math.sqrt(fill * ht) *
        Math.log( (20.0 + 0.36 * ht) / (0.13 * ht) ) );
    }
    return BpxLibMath.fraction(waf);
  }
}

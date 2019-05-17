import BpxLibMath from './BpxLibMath';

export class BpxLibCrown {

  // Crown length
  static crownLength(baseHt, ht) {
    return Math.max( 0, ht - baseHt);
  }

  // Crown length from crown ratio and canopy height
  static crownLengthFromRatio(crownRatio, ht) {
    return crownRatio * ht;
  }

  // Crown ratio
  static crownRatio(baseHt, ht) {
    return BpxLibMath.div( Math.max(0, ht - baseHt), ht);
  }

  // Canopy volumetric fill ratio; the volume under the canopy top that
  // is filled with tree crowns (division by 3 assumes conical crown shapes).
  static fillRatio(cover, cratio) {
    return BpxLibMath.fraction(cratio) * BpxLibMath.fraction(cover) / 3;
  }

  // Canopy heat per unit area
  static hpua(load, heat) {
    return Math.max(0, load * heat);
  }

  // Canopy fuel load
  static fuelLoad(bulk, ht, baseHt) {
    return Math.max( 0, bulk * (ht - baseHt));
  }

  // Canopy shelters fuel
  static isSheltered(cover, ht, fill) {
    return cover >= 0.01 && fill >= 0.05 && ht >= 6;
  }
}

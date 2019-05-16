/**
 * @file Class of static BehavePlus Explorer fuel bed equations
 * as described by Rothermel (1972) and implemented by BehavePlus V6.
 * @copyright Systems for Environmentl Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */
import BpxLibMath from './BpxLibMath';

class BpxLibFuelBed {
  static beta(deadPprc, livePprc, depth) {
    return BpxLibMath.div((deadPprc + livePprc), depth);
  }

  /**
   * Calculate the fuel bed optimum packing ratio (fraction).
   *
   * See Rothermel (1972) eq 37 (p 19, 26) and eq 69 (p32).
   *
   * @param float bedSavr Fuel bed surface area-to-volume ratio (ft-1).
   * @return float The fuel bed optimum packing ratio (fraction).
   */
  static beto(savr) {
    return (savr <= 0.0) ? 0.0 : 3.348 / (savr ** 0.8189);
  }

  /**
   * Calculate the dead or live life category moisture damping coefficient.
   *
   * @param mois Life fuel category moisture content (ratio).
   * @param mext Life fuel category moisture content of extinction (ratio).
   * @return The life fuel category moisture damping coefficient (fraction).
   */
  static etam(mois, mext) {
    const r = BpxLibMath.div(mois, mext);
    return BpxLibMath.fraction(1.0 - 2.59 * r + 5.11 * r * r - 3.52 * r * r * r);
  }

  /**
   * Calculate the dead or live category mineral damping coefficient.
   *
   * @param float lifeCategoryEffectiveMineralContent
   * @return float Dead or live fuel category mineral damping coefficient.
   */
  static etas(seff) {
    const etas = (seff <= 0.0) ? 1.0 : (0.174 / (seff ** 0.19));
    return BpxLibMath.fraction(etas);
  }

  /**
   * Effective wind speed limit
   * @param {number} rxi Reaction intensity
   * @returns {number} The effective wind speed limit (ft+1 mon-1)
   */
  static ewsLimit(rxi) {
    return 0.9 * rxi;
  }

  /**
   *
   * @param float qig Fuel bed heat of pre-ignition (btu+1 lb-1)
   * @param float bulk Fuel bed bulk density (lb+1 ft-3)
   * @return float Fuel bed heat sink (btu+1 ft-3)
   */
  static heatSink(qig, bulk) {
    return qig * bulk;
  }

  /**
   * Calculate the fire heat per unit area.
   *
   * @param real rxi Fire reaction intensity (btu+1 ft-2 min-1).
   * @param real taur The fire/flame residence time (min+1).
   * @return The heat per unit area (btu+1 ft-2).
   */
  static hpua(rxi, taur) {
    return rxi * taur;
  }

  /**
   * Calculate the 'live' fuel category moisture content of extinction.
   *
   * @param real mextk The 'live' fuel category moisture content of extinction factor (ratio).
   * @param real dfmc The 'dead' fuel category fine moisture content (ratio).
   * @param real dmext The 'dead' category moisture content of extinction (ratio).
   * @return real The 'live' fuel category  moisture content of extinction (ratio).
   */
  static mext(mextk, dfmc, dmext) {
    const dry = 1.0 - BpxLibMath.div(dfmc, dmext);
    const lmext = mextk * dry - 0.226;
    return Math.max(lmext, dmext);
  }

  /**
   * Calculate the 'live' fuel category moisture content of extinction factor.
   *
   * This factor is constant for a fuel bed, and represents the ratio
   * of dead-to-live fuel mass that must be raised to ignition.  It
   * is the method described by Rothermel (1972) on page 35 that was
   * subsequently refined in BEHAVE and BehavePlus to use the
   * effective fuel load and effective heating number to determine
   * the ratio of fine dead to fine live fuels.
   *
   * See Rothermel (1972) eq 88 on page 35.
   *
   * @param float defl The 'dead' fuel catagory total fine fuel load (lb+1 ft-2).
   * @param float lefl The 'live' fuel catagory total fine fuel load (lb+1 ft-2).
   *
   * @return float The 'live' fuel category moisture content of extinction factor.
   */
  static mxtk(defl, lefl) {
    return 2.9 * BpxLibMath.div(defl, lefl);
  }

  /**
   * Upper limit of the effective wind speed coefficient `phi`
   * @param {number} ewsLimit The effective wind speed limit (ft+1 min-1)
   * @returns {number} The upper limit of the effective wind speed coefficient (dl).
   */
  static phiLimit(ewsLimit, wndb, wndk) {
    return (ewsLimit <= 0.0) ? 0.0 : wndk * (ewsLimit ** wndb);
  }

  /**
   *
   * Calculate the no-wind propagating flux ratio (ratio).
   *
   * The propagating flux is the numerator of the Rothermel (1972) spread
   * rate equation 1 and has units of heat per unit area per unit time.
   *
   * See Rothermel (1972) eq 42 (p 20, 26) and eq 76 (p32).
   *
   * @param float savr The fuel bed characteristic surface area-to-volume ratio (ft-1).
   * @param float beta The fuel bed packing ratio (ratio).
   * @return float The fuel bed no-wind propagating flux ratio (ratio).
   */
  static pflx(savr, beta) {
    return (savr <= 0.0) ? 0.0
      : Math.exp((0.792 + 0.681 * Math.sqrt(savr)) * (beta + 0.1))
        / (192.0 + 0.2595 * savr);
  }

  static pick(domain, behave, chaparral, palmetto, waspen) {
    if (domain === 'behave') {
      return behave;
    } if (domain === 'chaparral') {
      return chaparral;
    } if (domain === 'palmettoGallberry') {
      return palmetto;
    } if (domain === 'westernAspen') {
      return waspen;
    }
    throw new Error(`Unknown domain '${domain}'`);
  }

  /**
   * Calculate the no-wind no-slope fire spread rate.
   *
   * @param real rxi The total fire reaction intensity (btu+1 ft-2 min-1).
   * @param real pflx The fuel bed propagating flux ratio (ratio).
   * @param real sink The fuel bed heat sink (btu+1 ft-3).
   * @return The no-wind no-slope fire spread rate (ft+1 min-1).
   */
  static ros0(rxi, pflx, sink) {
    return (sink <= 0.0) ? 0.0 : pflx * rxi / sink;
  }

  static rosLimit(ros0, phil) {
    return ros0 * (1.0 + phil);
  }

  /**
   * Calculate the life fuel category reaction intensity without moisture damping.
   *
   * @param float rxvo Fuel bed optimum reaction velocity (min-1).
   * @param float wnet Life fuel category net ovendry fuel load (lb+1 ft-2).
   * @param float heat Life fuel category heat of combustion (btu+1 lb-1).
   * @param float etas Life fuel category mineral damping coefficient (fraction).
   * @return float The life fuel category reaction intensity (btu+1 ft-2 min-1)
   *      without moisture damping.
   */
  static rxiDry(rxvo, wnet, heat, etas) {
    return rxvo * wnet * heat * etas;
  }

  /**
   * Calculate the fuel bed reaction velocity exponent 'A".
   *
   * This is an arbitrary variable 'A'  used to derive the
   * fuel bed optimum reaction velocity.
   * See Rothermel (1972) eq 39 (p19, 26) and 67 (p 31).
   *
   * @param float savr Fuel bed surface area-to-volume ratio (ft-1).
   * @return float Fuel bed reaction velocity exponent 'A' (ratio).
   */
  static rxva(savr) {
    return (savr <= 0.0) ? 0.0 : 133.0 / (savr ** 0.7913);
  }

  /**
   * Calculate the fuel bed maximum reaction velocity (min-1).
   *
   * See Rothermel (1972) eq 36 (p 19, 26) and 68 (p 32).
   *
   * @param float bedSavr Fuel bed surface area-to-volume ratio (ft-1).
   * @return float Fuel bed maximum reaction velocity (min-1).
   */
  static rxvm(sv15) {
    return (sv15 <= 0.0) ? 0.0 : sv15 / (495.0 + 0.0594 * sv15);
  }

  /**
   * Calculate the fuel bed optimum reaction velocity (min-1).
   *
   * See Rothermel (1972) eq 38 (p 19, 26) and eq 67 (p 31).
   *
   * @param float betr Fuel bed packing ratio ratio (ratio).
   * @param float rxvm Fuel bed maximum reaction velocity (min-1).
   * @param float rxve Fuel bed reaction velocity exponent 'A' (ratio).
   * @return float Fuel bed optimum reaction velocity (min-1).
   */
  static rxvo(betr, rxvm, rxve) {
    return (betr <= 0.0 || betr === 1.0) ? 0.0
      : rxvm * (betr ** rxve) * Math.exp(rxve * (1.0 - betr));
  }

  // Accumulate fuel particle surface area by size class
  // for fuel particles with size class idx
  static scArea(idx, s1, a1, s2, a2, s3, a3, s4, a4, s5, a5) {
    let area = 0;
    area += (idx === s1) ? a1 : 0;
    area += (idx === s2) ? a2 : 0;
    area += (idx === s3) ? a3 : 0;
    area += (idx === s4) ? a4 : 0;
    area += (idx === s5) ? a5 : 0;
    return area;
  }

  /**
   * Calculate the fuel bed slope coeffient `phiS` slope factor.
   *
   * This factor is an intermediate parameter that is constant for a fuel bed,
   * and used to determine the fire spread slope coefficient `phiS`.
   *
   * See Rothermel (1972) eq 51 (p 24, 26) and eq 80 (p 33).
   *
   * @param float packingRatio Fuel bed packing ratio (ratio).
   * @return float Factor used to derive the slope coefficient `phiS' (ratio).
   */
  static slopeK(beta) {
    return (beta <= 0.0) ? 0.0 : 5.275 * (beta ** -0.3);
  }

  /**
   * Calculate the often-used intermediate parameter of the fuel bed's
   * characteristics surface area-to-volume ratio raised to the 1.5 power.
   *
   * @param float savr Fuel bed characteristic surface area-to-volume ratio (ft-1).
   * @return float Fuel bed parameter (ratio).
   */
  static savr15(savr) {
    return savr ** 1.5;
  }

  // Returns an array of 6 size class area weighting factors
  static swtg(a1, s1, a2, s2, a3, s3, a4, s4, a5 = 0, s5 = 0) {
    const a = [a1, a2, a3, a4, a5];
    const s = [s1, s2, s3, s4, s5];
    let tarea = 0.0;
    const scar = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    for (let idx = 0; idx < 5; idx += 1) {
      scar[s[idx]] += a[idx];
      tarea += a[idx];
    }
    const scwt = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    if (tarea > 0.0) {
      for (let idx = 0; idx < 6; idx += 1) {
        scwt[idx] = scar[idx] / tarea;
      }
    }
    return scwt;
  }

  /**
   * Calculate the fuel bed flame residence time.
   *
   * \TODO find reference
   *
   * @param float savr Fuel bed surface area-to-volume ratio (ft-1).
   * @return float Fuel bed flame residence time (min+1).
   */
  static taur(savr) {
    return (savr <= 0.0) ? 0.0 : (384.0 / savr);
  }

  /**
   * Calculate the fuel bed wind coefficient `phiW` correlation factor `B`.
   *
   * This factor is an intermediate parameter that is constant for a fuel bed,
   * and is used to derive the fire spread wind coefficient `phiW`.
   *
   * See Rothermel (1972) eq 49 (p 23, 26) and eq 83 (p 33).
   *
   * @param float savr Fuel bed characteristic surface area-to-volume ratio (ft-1).
   * @return float Wind coefficient `phiW` correlation parameter `B` (ratio).
   */
  static windB(savr) {
    return 0.02526 * (savr ** 0.54);
  }

  /**
   * Calculate the fuel bed wind coefficient `phiW` correlation factor `C`.
   *
   * This factor is an intermediate parameter that is constant for a fuel bed,
   * and is used to derive the fire spread wind coefficient `phiW`.
   *
   * See Rothermel (1972) eq 48 (p 23, 26) and eq 82 (p 33).
   *
   * @param float savr Fuel bed characteristic surface area-to-volume ratio (ft-1).
   * @return float Wind coefficient `phiW` correlation parameter `C` (ratio).
   */
  static windC(savr) {
    return 7.47 * Math.exp(-0.133 * (savr ** 0.55));
  }

  /**
   * Calculate the fuel bed wind coefficient `phiW` correlation factor `E`.
   *
   * This factor is an intermediate parameter that is constant for a fuel bed,
   * and is used to derive the fire spread wind coefficient `phiW`.
   *
   * See Rothermel (1972) eq 50 (p 23, 26) and eq 82 (p 33).
   *
   * @param float savr Fuel bed characteristic surface area-to-volume ratio (ft-1).
   * @return float Wind coefficient `phiW` correlation parameter `E` (ratio).
   */
  static windE(savr) {
    return 0.715 * Math.exp(-0.000359 * savr);
  }

  /**
   * Calculate the fuel bed wind coeffient `phiW` wind factor.
   *
   * This factor is an intermediate parameter that is constant for a fuel bed,
   * and used to determine the fire spread wind coefficient `phiW`.
   *
   * See Rothermel (1972) eq 47 (p 23, 26) and eq 79 (p 33).
   *
   * @param float betr Fuel bed packing ratio (ratio).
   * @param float wnde The fuel bed wind coefficient `phiW` correlation factor `E`.
   * @param float wndc The fuel bed wind coefficient `phiW` correlation factor `C`.
   * @return float Factor used to derive the wind coefficient `phiW' (ratio).
   */
  static windK(betr, wnde, wndc) {
    return (betr <= 0.0) ? 0.0 : wndc * (betr ** -wnde);
  }

  /**
   * Calculate the fuel bed wind coeffient `phiW` inverse K wind factor.
   *
   * This factor is an intermediate parameter that is constant for a fuel bed,
   * and used to determine the fire spread wind coefficient `phiW`.
   *
   * It is the inverse of the wind factor 'K', and is used to re-derive
   * effective wind speeds within the BEHAVE fire spread computations.
   *
   * See Rothermel (1972) eq 47 (p 23, 26) and eq 79 (p 33).
   *
   * @param float betr Fuel bed packing ratio ratio (ratio).
   * @param float wnde The fuel bed wind coefficient `phiW` correlation factor `E`.
   * @param float wndc The fuel bed wind coefficient `phiW` correlation factor `C`.
   * @return float Factor used to derive the wind coefficient `phiW' (ratio).
   */
  static windI(betr, wnde, wndc) {
    return (betr <= 0.0 || wndc <= 0.0) ? 0.0 : (betr ** wnde) / wndc;
  }
}

export default BpxLibFuelBed;

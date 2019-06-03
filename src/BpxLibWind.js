/**
 * @file Class of static wind functions used by other BehavePlus Explorer files.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

export default class BpxLibWind {
  static at10m(ws20ft) {
    return 1.13 * ws20ft;
  }

  static at20ft(ws10m) {
    return ws10m / 1.13;
  }

  static at20ftFromMidflame(wsmid, mwaf) {
    return (mwaf > 0.0) ? ( wsmid / mwaf ) : wsmid
  }

  static atMidflame(ws20ft, mwaf) {
    return mwaf * ws20ft;
  }

  // static mwafEst(cpyCover, cpyHt, cpyFill, fdepth) {
  //   let mwaf = 1.0;
  //   // The following line was modified by Pat Andrews, 11/9/07
  //   // if ( canopyCover < SMIDGEN || f < 0.05 )
  //   if (cpyCover < 0.01 || cpyFill < 0.05 || cpyHt < 6.0) {
  //     // Open or unsheltered canopy
  //     if ( fdepth > 0.01 ) {
  //       mwaf = 1.83 / Math.log((20.0 + 0.36 * fdepth ) / ( 0.13 * fdepth ) );
  //     }
  //   } else {
  //     // Sheltered canopy
  //     mwaf = 0.555 / (Math.sqrt( cpyFill * cpyHt ) *
  //       Math.log( ( 20.0 + 0.36 * cpyHt ) / (0.13 * cpyHt ) ) );
  //   }
  //   // Constrain the result
  //   return BpxLibMath.fraction( mwaf );
  // }

  // static mwafFromWindSpeeds(wsmid, ws20ft) {
  //   return ( ws20ft <= 0.0) ? 1.0 : (wsmid / ws20ft);
  // }
}

/**
 * @file BehavePlus Explorer Fire Ellipse Equations
 *
 * @author Collin D. Bevins <cbevins@montana.com>
 * @copyright 2019 Systems for Environmental Management
*/

import BpxLibCompass from './BpxLibCompass';

export default class BpxLibFireEllipse {
  /**
   * Calculate the fire ellipse area given its major axis length and
   *	length-to-width ratio as per Rothermel (1991) equation 11 on page 16
    * (which ignores backing distance).
    *
    * @param len Total fire ellipse length (arbitrary distance unbits-of-measure).
    * @param lwr Fire ellipse length-to-width ratio (ratio).
    * @return Fire ellipse area (in same distance unitsof-measure as length squared).
    */
  static area(len, lwr) {
      return Math.PI * len * len / ( 4 * lwr );
  }

  /**
   * Calculate the fire ellipse eccentricity.
   *
   * @param float lwr Fire ellipse length-to-width ratio.
   * @return float The fire ellipse eccentricity (ratio).
   */
  static eccentricity(lwr) {
    const x = lwr * lwr - 1;
    return (x <= 0 || lwr <= 0 ) ? 0 : (Math.sqrt(x) / lwr);
  }

  /*!	\brief Caluclate the fireline intensity at some azimuth.
   */
  static fliAtAzimuth(fliHead, rosHead, rosAz) {
    return (rosHead <= 0) ? 0 : fliHead * rosAz / rosHead;
  }

  /**
   * Calculate the fire ellipse length.
   *
   * @param float majorAxisRos Fire ellipse expansion rate along its major axis
   *  both heading and backing (arbitrary velocity units-of-measure).
   *
   * @param float elapsed Elapsed time since fire ignition
   *  (in the same time units-of-measure being used for majorAxisRos).
   *
   * @return The fire ellipse length at time (in the same distance units-of-measure
   * being used for majorAxisRos).
   */
  static length( majorAxisRos, elapsed ) {
    return majorAxisRos * elapsed;
  }

  // Map area
  static mapArea(area, mapScale) {
    return (mapScale <= 0) ? 0 : area / (mapScale * mapScale);
  }

  /**
   *  Calculate the fire ellipse perimeter from its length and width.
   *
   *	@param len Fire ellipse length (arbitrary distance units-of-measure).
    *	@param wid Fire ellipse width (arbitrary distance units-of-measure).
    *
    *	@return float The fire ellipse perimeter (in same distance units-of-measure as length).
    */
  static perimeter(len, wid) {
    const a = 0.5 * len;
    const b = 0.5 * wid;
    const xm = ( ( a + b ) <= 0 ) ? 0 : ( (a-b) / (a+b) );
    const xk = 1 + xm*xm / 4 + xm*xm*xm*xm / 64;
    return Math.PI * (a + b) * xk;
  }

  static psiFromTheta(thetaFromHead, rosF, rosH) {
    if ( rosF <= 0 || rosH <= 0 || thetaFromHead <= 0) {
      return 0;
    }
    const thetaRadians = BpxLibCompass.radians(thetaFromHead);
    const tanPsiRadians = Math.tan(thetaRadians) * rosF / rosH;
    let   psiRadians = Math.atan(tanPsiRadians);
    //psiRadians += ( psiRadians < 0) ? pi : 0;
    //psiradians += ( thetaRadians > pi) ? pi : 0;
    // Quadrant adjustment
    if (thetaRadians <= 0.5 * Math.PI) {
      // no adjustment
    } else if (thetaRadians > 0.5 * Math.PI && thetaRadians <= 1.5 * Math.PI) {
      psiRadians += Math.PI;
    } else if (thetaRadians > 1.5 * Math.PI) {
      psiRadians += 2 * Math.PI;
    }
    // Convert psi radians to degrees
    return BpxLibCompass.degrees(psiRadians);
  }

  /**
   *  Calculate the fire spread rate (ft+1 min-1) at the ellipse back
   *  given the fire spread rate at ellipse head and fire ellipse length-to-width ratio.
   *
   *  NOTE this differs from FireSpread::spreadRateAtBack() which takes the
   *  length-to-width ratio as the second parameter, rather than ellipse eccentricity.
   *
   * @param spreadRateAtHead Fire spread rate at ellipse head (ft+1 min-1).
   * @param eccentricity Fire ellipse eccentricity (ratio).
   *
   * @return float The fire spread rate at the ellipse back (ft+1 min-1).
   */
  static rosBack(rosHead, eccent) {
    return rosHead * (1-eccent) / (1+eccent);
  }

  /**
   * Calculate the fire spread rate at 'beta' degrees from the fire ignition point-to-head vector.
   *
   * This calculates the fire spread rate at `beta` degrees from its *point of ignition*,
   * which *is not* the fire rate at `psi` degrees from the center of the ellipse.
   *
   * NOTE this differs from FireSPread::spreadRateATBeta(), which takes the ellipse
   * length-to-width ratio as its second argument.
   *
   * @param betaHead Fire spread vector of interest (degrees clockwise from heading direction).
   * @param rosHead Fire spread rate at the head (ft+1 min-1).
   * @param eccent Fire ellipse eccentricity (ratio).
   *
   * @return float The fire spread rate along the specified vector (ft+1 min-1).
   */
  static rosBeta(betaHead, rosHead, eccent) {
    let rosBeta = rosHead;
    // Calculate the fire spread rate in this azimuth
    // if it deviates more than a tenth degree from the maximum azimuth
    if (Math.abs( betaHead ) > 0) {
      const rad = BpxLibCompass.radians( betaHead )
      rosBeta = rosHead * (1-eccent) / (1 - eccent * Math.cos( rad ) );
    }
    return rosBeta;
  }

  /**
   * Calculate the fire ellipse expansion rate at the flank.
   *
   * NOTE this differs from FireSPread::spreadRateAtBack(), which takes two arguments,
   * the spread rate at head and the ellipse length-to-width ratio.
   *
   * @param rosMinor Fire ellipse expansion rate at its widest point
   * (in arbitrary velocity units-of-measure).
   *
   * @return The fire ellipse spread rate at the flank
   *	(in the same arbitrary velocity units-of-measure as minorAxisExpansionRate).
   */
  static rosFlank( rosMinor ) {
    return 0.5 * rosMinor;
  }

  /**
   * Calculate the fire ellipse distance or rate at `F`.
   *
   * @param rosMajor Fire ellipse major axis spread rate or length
   *  (in arbitrary distance or velcoity units-of-measure).
   * @return Fire ellipse `F` used to determine spread rates at arbitrary psi.
   */
  static rosF( rosMajor ) {
    return 0.5 * rosMajor;
  }

  /**
   * Calculate the fire ellipse distance or rate at `G`.
   *
   * @param rosMajor Fire ellipse major axis spread rate or length
   *  (in arbitrary distance or velcoity units-of-measure).
   *
   * @param rosBack Portion of the total major axis rate or distance
   *  attributable to the backing ratoe or distance (in the same atbitrary
   *  distance or velcoity units-of-measure as majorAxisRateOrDistance).
   *
   * @return Fire ellipse `G` used to determine spread rates at arbitrary psi.
   */
  static rosG( rosMajor, rosBack ) {
    return ( 0.5 * rosMajor ) - rosBack;
  }

  /**
   * Calculate the fire ellipse distance or rate at `H`.
   *
   * @param rosMinor Fire ellipse minor axis spread rate or length
   *  (in arbitrary distance or velcoity units-of-measure).
   *
   * @return Fire ellipse `H` used to determine spread rates at arbitrary psi.
   */
  static rosH( rosMinor ) {
    return 0.5 * rosMinor;
  }

  /**
   * Calculate the fire ellipse expansion rate along its major axis.
   *
   * @param rosHead Fire spread rate at the head of the ellipse
   *  (in arbitrary velocity units-of-measure).
   *
   * @param rosBack Fire spread rate at the back of the ellipse
   *  (in the same velocity units-of-measure as spreadRateAtHead).
   *
   * @return The fire ellipse expansion rate along its major axis
   *  (in the same velocity units-of-measure as spreadRateAtHead).
   */
  static rosMajor( rosHead, rosBack ) {
    return rosHead + rosBack;
  }

  /**
   * Calculate the fire ellipse expansion rate along its minor axis.
   *
   * @param majorAxisRos Fire ellipse expansion rate along its major axis
   * (in arbitrary velocity units-of-measure).
   *
   * @param lwr The fire ellipse length-to-width ratio.
   *
   * @return The fire ellipse expansion rate along its mino axis
   *	(in the same arbitrary velocity units-of-measure as majorAxisExpansionRate).
    */
  static rosMinor( rosMajor, lwr ) {
    return ( lwr <= 0 ) ? 0 : rosMajor / lwr;
  }

  /**
   * Calculate the fire spread rate at 'psi' degrees from the fire ellipse center-to-head vector.
   *
   * This calculates the fire spread rate at `psi` degrees from its *ellipse center* to the ellipse head,
   * which *is not* the fire rate at `beta` degrees from the point of ignition.
   *
   * @param psiHead The fire spread vector of interest (degrees clockwise from heading direction).
   * @param rosF Fire ellipse expansion rate (ft+1 min-1) at ellipse point F.
   * @param rosG Fire ellipse expansion rate (ft+1 min-1) at ellipse point G.
   * @param rosH Fire ellipse expansion rate (ft+1 min-1) at ellipse point H.
   *
   *  @return The fire spread rate along the specified vector (ft+1 min-1).
   */
  static rosPsi( psiHead, rosF, rosG, rosH ) {
    let rosPsi = 0;
    if ( rosF * rosG * rosH > 0 ) {
      const radians  = BpxLibCompass.radians( psiHead );
      const cos_psi  = Math.cos( radians );
      const cos2_psi = cos_psi * cos_psi;
      const sin2_psi = 1 - cos2_psi;
      const term1    = rosG * cos_psi;
      const term2    = rosF * rosF * cos2_psi;
      const term3    = rosH * rosH * sin2_psi;
      rosPsi = term1 + Math.sqrt( term2 + term3 );
    }
    return rosPsi;
  }

  static thetaFromBeta( betaHead, rosF, rosG, rosH ) {
    if ( rosF <= 0 || rosH <= 0 ) {
      return 0;
    }
    const betaRadians = BpxLibCompass.radians( betaHead );
    const cosBeta  = Math.cos( betaRadians );
    const cos2Beta = cosBeta * cosBeta;
    const sin2Beta = 1 - cos2Beta;
    const f2 = rosF * rosF;
    const g2 = rosG * rosG;
    const h2 = rosH * rosH;
    const term = Math.sqrt( h2 * cos2Beta + ( f2 - g2 ) * sin2Beta );
    const num  = rosH * cosBeta * term - ( rosF * rosG * sin2Beta );
    const denom = h2 * cos2Beta + f2 * sin2Beta;
    const cosThetaRadians = num / denom;
    let   thetaRadians = Math.acos( cosThetaRadians );
    // Quadrant adjustment
    if ( betaRadians < Math.PI ) {
      // nothing to adjust
    } else if ( betaRadians >= Math.PI ) {
      thetaRadians = 2 * Math.PI - thetaRadians;
    }
    // Convert theta radians to degrees
    let thetaHead = BpxLibCompass.degrees( thetaRadians );
    if ( betaHead > 180 ) {
      thetaHead = 360 - thetaHead;
    }
    return thetaHead;
  }

  /**
   * Calculate the fire ellipse width.
   *
   * @param float minorAxisRos Fire ellipse expansion rate along its minor axis
   *  (arbitrary velocity units-of-measure).
   *
   * @param float elapsed Elapsed time since fire ignition
   *  (in the same time units-of-measure being used for minorAxisRos).
   *
   * @return The fire ellipse width at time (in the same distance units-of-measure
   * being used for minorAxisRos).
   */
  static width( minorAxisRos, elapsed ) {
    return minorAxisRos * elapsed;
  }

  // //--------------------------------------------------------------------------
  // /**	\brief Updates beta wrt head from theta.
  //  *
  //  * Calculate the degrees from the fire ignition point given the degrees
  //  * from the ellipse center and some ellipse paramaters.
  //  *
  //  * @param theta Azimuth from the ellipse center wrt the fire head
  //  * @param rosF spread rate at F
  //  * @param rosG spread rate at G
  //  * @param rosH spread rate at H
  //  * @returns The azimuth from the fire ignition point.
  //  */
  // static betaFromTheta( theta, rosF, rosG, rosH) {
  //   const thetaRadians = BpxLibCompass.radians(theta);
  //   const num = rosH * Math.sin( thetaRadians);
  //   const denom = rosG + rosF* Math.cos(thetaRadians);
  //   let betaRadians = ( denom <= 0 ) ? 0 : Math.atan( num / denom );
  //   // Quandrant adjustment
  //   const boundary1 = 150;
  //   const boundary2 = 210;
  //   if (theta <= boundary1) {
  //     // no adjustment required
  //   } else if (theta > boundary1 && theta <= boundary2) {
  //     betaRadians += Math.PI
  //   } else if (theta > boundary2) {
  //     betaRadians += 2.0 * Math.PI;
  //   }
  //   // Convert beta radians to degrees
  //   return BpxLibCompass.degrees(betaRadians);
  // }

  // static thetaFromPsi( psiHead, rosF, rosH ) {
  //   if ( rosF <= 0 ) {
  //     return 0.0
  //   }
  //   const tanThetaRadians = Math.tan( psiHead ) * rosH / rosF;
  //   let thetaRadians = Math.atan( tanThetaRadians );
  //   // Quadrant adjustment
  //   if ( psiRadians <= 0.5 * Math.PI ) {
  //     // no adjustment
  //   } else if ( psiRadians > 0.5 * Math.PI && psiRadians <= 1.5 * Math.PI ) {
  //     thetaRadians += Math.PI;
  //   } else if ( psiRadians > 1.5 * Math.PI ) {
  //     thetaRadians += 2 * Math.PI;
  //   }
  //   //thetaRadians += ( thetaRadians < 0. || psiradians > pi ) ? pi : 0.;
  //   // Convert theta radians to degrees
  //   thetaDegrees = BpxLibCompass.degrees( thetaRadians );
  //   return thetaRadians;
  // }
}

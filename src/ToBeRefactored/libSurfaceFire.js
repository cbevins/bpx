/**
 * Fuel Particle Methods
 *
 * Library of algorithms implementing the Rothermel (1972) mathematical model
 * of surface fire spread rate and direction of maximum spread from upslope.
 *
 * It also includes a few of the fundamental Byram and Thomas equations for
 * fireline intensity, flame length, and scorch height.  All equations
 * relating to fire elliptical growth are in Algortihms\FireEllipse.
 *
 * All algorithms in this class are implemented as static methods.
 *
 * All methods return a single property.  The result is stored locally before
 * it is returned to aid debugging the return value.
 *
 * @author Collin D. Bevins <cbevins@montana.com>
 * @copyright 2018 Systems for Environmental Management
 * @license MIT
 * @version GIT: Id In development.
 * @package Sem\Fyr
**/

var compass = require('./libCompass')
var fuelBed = require('./libFuelBed')

var self = module.exports = {
  /**
   * Calculate the distance given the velocity and elapsed time.
   *
   * @param rate Velocity
   * @param time Elapsed time
   * @return Distance traveled
  */
  dist: function (rate, time) {
    return rate * time
  },

  /**
   * Calculate the `effective wind speed` of a combined slope-plus-wind spread rate coefficient.
   *
   * The `effective` wind speed is the theoretical wind speed that yields the same
   * spread rate coefficient as the combined slope-plus-wind spread rate coefficient.
   *
   * @param phiew The sum of the slope and wind coefficients.
   * @param windB Fuel bed wind factor B.
   * @param windI Fuel bed wind factor I.
   * @return The effective wind speed for the slope-plus-wind coefficient (ft+1 min-1).
  */
  ews: function ( phiew, windB, windI ) {
    var ews = 0.0
    if ( phiew > 0.0 && windB > 0.0 && windI > 0.0) {
      var a = phiew * windI
      var b = 1.0 / windB
      ews = Math.pow(a, b)
    }
    return ews
  },

  /**
   * Calculate the effective wind speed (ft+1 min-1) from the length-to-width ratio.
   *
   * This uses Anderson's (1983) equation.
   *
   * @param lwr The fire ellipse length-to-width ratio (ratio).
   * @return The effective wind speed (ft+1 min-1).
  */
  ewsFromLwr: function ( lwr ) {
    return 88.0 * ( 4.0 * (lwr - 1.0) )
  },

  /**
   * Calculate the maximum effective wind speed limit
   * as per Rothermel (1972) equation 86 on page 33.
   *
   * @param rxi Fire reaction intensity (btu+1 ft-2 min-1).
   * @return The maximum effective wind speed limit (ft+1 min-1).
  */
  ewsl: function ( rxi ) {
    return 0.9 * rxi
  },

  /**
   * Calculate the fire heading direction (degrees clockwise from north).
   *
   * @param upAzNo Upslope direction (degrees clockwise from north).
   * @param hdgAzUp Fire heading direction (degrees clockwise from the upslope direction).
   * @return The fire heading direction (degrees clockwise from north).
  */
  hdgAzNo: function ( upAzNo, hdgAzUp ) {
    return compass.constrain( upAzNo + hdgAzUp )
  },

  /**
   * Calculate the fireline intensity (btu+1 ft-1 s-1) from spread rate,
   * reaction intensity, and residence time.
   *
   * @param ros The fire spread rate (ft+1 min-1).
   * @param rxi The reaction intensity (btu+1 ft-2 min-1).
   * @param taur The flame residence time (min+1)
   * @return The fireline intensity (btu+1 ft-1 s-1).
  */
  fli: function ( ros, rxi, taur ) {
    return ros * rxi * taur / 60.0
  },

  /**
   * Calculate the fireline intensity (btu+1 ft-1 s-1) from flame length.
   *
   * @param fl The flame length (ft+1).
   * @return The fireline intensity (btu+1 ft-1 s-1).
  */
  fliFromFl: function ( fl ) {
    return ( fl <= 0.0) ? 0.0 : Math.pow((fl / 0.45), (1.0 / 0.46))
  },

  /**
   *  Calculate Byram's (1959) flame length (ft+1) given a fireline intensity.
   *
   * @param fli Fireline intensity (btu+1 ft-1 s-1).
   * @return Byram's (1959) flame length (ft+1).
  */
  fl: function ( fli ) {
    return ( fli <= 0.0) ? 0.0 : (0.45 * Math.pow(fli, 0.46))
  },

  /**
   * Calculate the fire ellipse length-to-width ratio from the
   * effective wind speed (ft+1 min-1).
   *
   * This uses Anderson's (1983) equation.
   *
   * @param ews The effective wind speed (ft+1 min-1).
   * @return The fire ellipse length-to-width ratio (ratio).
  */
  lwr: function ( ews ) {
    // Wind speed MUST be in miles per hour
    return 1.0 + 0.25 * ( ews / 88.0 )
  },

  /**
   * Calculate the wind-slope coefficient (phiEw = phiW + phiS)
   * from the individual slope (phiS) and wind (phiW) coefficients.
   *
   * There are 3 ways to calculate the wind-slope coefficient `phiEw`:
   * - from `phiS` and `phiW`: windSlopeCoefficientCombined(phiS,phiW)
   * - from `ros0` and `rosHead`: windSlopeCoefficientInferred(ros0,rosHead)
   * - from `effWind`, `windB`, and `windK`: windSlopeCoefficientFromEffectivfeWindSpeed()
   *
   * @param phiw Rothermel (1972) wind coefficient `phiW` (ratio)
   * @param phis Rothermel (1972) slope coefficient `phiS` (ratio)
   * @return Rothermel's (1972) wind-slope coefficient `phiEw` (ratio).
  */
  phiew: function ( phiw, phis ) {
    return phiw + phis
  },

  /**
   * Calculate the wind-slope coefficient (phiEw = phiW + phiS)
   * from the no-wind, no-slope spread rate and an actual spread rate.
   *
   * There are 3 ways to calculate the wind-slope coefficient `phiEw`:
   * - from `phiS` and `phiW`: windSlopeCoefficientCombined(phiS,phiW)
   * - from `ros0` and `rosHead`: windSlopeCoefficientInferred(ros0,rosHead)
   * - from `effWind`, `windB`, and `windK`: windSlopeCoefficientFromEffectivfeWindSpeed()
   *
   * @param ros0 No-wind, no-slope spread rate (ft+1 min-1).
   * @param rosh The actual spread rate (ft+1 min-1) at the fire head
   *    (possibly under cross-slope wind conditions).
   * @return Rothermel's (1972) wind-slope coefficient `phiEw` (ratio).
   */
  phiewInferred: function ( ros0, rosh ) {
    return (ros0 <= 0.0) ? 0.0 : ((rosh / ros0) - 1.0)
  },

  /**
   * Calculate the wind-slope coefficient (phiEw = phiW + phiS)
   * from the effective wind speed.
   *
   * There are 3 ways to calculate the wind-slope coefficient `phiEw`:
   * - from `phiS` and `phiW`: see windSlopeCoefficientCombined(phiS,phiW)
   * - from `ros0` and `rosHead`: see windSlopeCoefficientInferred(ros0,rosHead)
   * - from `effWind`, `windB`, and `windK`: see windSlopeCoefficientFromEffectivfeWindSpeed()
   *
   * @param ews The theoretical wind speed that produces
   *  the same spread rate coefficient as the current slope-wind combination.
   * @param windB
   * @param windK
   *  @return Rothermel's (1972) wind-slope coefficient `phiEw` (ratio).
  */
  phiewFromEws: function ( ews, windB, windK ) {
    return (ews <= 0.0) ? 0.0 : (windK * Math.pow(ews, windB))
  },

  /** Calculate the fire spread rate slope coefficient (ratio).
   *
   * This returns Rothermel's (1972) `phiS' as per equation 51 (p 24, 26).
   *
   * @param slpRatio Slope steepness ratio (vertical rise / horizontal reach).
   * @param slpK Fuel Bed slope factor.
   * @return The fire spread rate slope coefficient (ratio).
   */
  phis: function ( slpRatio, slpK ) {
    return slpK * slpRatio * slpRatio
  },

  rosArithmetic: function ( c1, r1, r2 ) {
    return ( c1 * r1 ) + ( (1.0-c1) * r2 )
  },

  rosExpectedMOCK: function ( c1, r1, r2 ) {
    return 0.5 * ( self.rosArithmetic(c1, r1, r2 ) + self.rosHarmonic( c1, r1, r2 ) )
  },

  rosHarmonic: function ( c1, r1, r2 ) {
    return 1. / ( ( c1 / r1 ) + ( (1.0-c1) / r2 ) )
  },

  /** Calculate the fire spread rate wind coefficient (ratio).
   *
   * This returns Rothermel's (1972) `phiW' as per equation 47 (p 23, 26).
   *
   * @param mwsp Wind speed at midflame height (ft+1 min-1).
   * @param wndb Fuel Bed wind factor `B`.
   * @param wndk Fuel Bed wind factor `K`.
   * @return The fire spread rate wind coefficient (ratio).
  */
  phiw: function ( mwsp, wndb, wndk ) {
    return ( mwsp <= 0.0) ? 0.0 : wndk * Math.pow( mwsp, wndb )
  },

  /**
   * Calculate the maximum fire spread rate under slope & wind conditions.
   *
   * @param ros0 No-wind, no-slope spread rate (ft+1 min-1).
   * @param phiew Rothermel's (1972) `phiEw` wind-slope coefficient (ratio).
   *  @return The maximum fire spread rate (ft+1 min-1).
  */
 rosMax: function ( ros0, phiew ) {
  return ros0 * (1.0 + phiew)
},

/**
 * Calculate the maximum fire spread rate under cross-slope wind conditions.
 *
 * If the wind is blowing up-slope (or, if there is no slope, or if there is no wind),
 * then spreadRateMaximumUpSlopeWind() == spreadRateMaximumCrossSlopeWind().
 *
 * @param ros0 No-wind, no-slope spread rate (ft+1 min-1).
 * @param spreadDirVectorRate Additional spread reate (ft+1 min-1)
 *    along the cross-slope vector of maximum spread.
 * @return The maximum fire spread rate (ft+1 min-1).
*/
rosMaxCrossSlopeWind: function ( ros0, spreadDirVectorRate ) {
  return ros0 + spreadDirVectorRate
},

/**
 * Calculate the maximum spread rate after applying the effective wind speed limit.
 *
 * If the effective wind speed does not exceed the limit,
 * then spreadRateMaximumCrossSlopeWind() == spreadRateMaximumEffectiveWindSpeedLimitApplied().
 *
 * @param ros0 The no-wind, no-slope spread rate (ft+1 min-1).
 * @param phiEwLimited Rothermel's (1972) `phiEw` wind-slope coefficient (ratio)
 * AFTER applying the effective wind speed limit.
*/
rosMaxEwslApplied: function ( ros0, phiEwLimited ) {
  return ros0 * (1.0 + phiEwLimited)
},

/**
 * Calculate the maximum spread rate after applying the effective wind speed upper limit.
 *
 * If the spread rate exceeds the effective wind speed
 * AND the effective wind speed exceeds 1 mph, then the
 * spread rate is reduced back to the effective wind speed.
 *
 * @param rosMax The fire maximum spread rate (ft+1 min-1)
 * @param ews The effective wind speed (ft+1 min-1).
 * @return The maximum spread rate (ft+1 min-1) after applying any effective wind speed limit.
*/
rosMaxRoslApplied: function ( rosMax, ews ) {
  return (rosMax > ews && ews > 88.0) ? ews : rosMax
},

  /**
   * Calculate the scorch height (ft+1) estimated from Byram's fireline
   * intensity, wind speed, and air temperature.
   *
   * @param fli Byram's fireline intensity (btu+1 ft-1 s-1).
   * @param wspd Wind speed (mi+1 h-1).
   * @param airt (oF).
   * @return The scorch height (ft+1).
  */
  scorchHt: function ( fli, wspd, airt ) {
    var mph = wspd / 88.0
    return ( fli <= 0.0) ? 0.0
      : (63.0 / (140.0 - airt)) *
      Math.pow(fli, 1.166667) /
      Math.sqrt(fli + (mph * mph * mph))
  },

  /**
   * Calculate the scorch height (ft+1) estimated from flame length,
   * wind speed, and air temperature.
   *
   * @param fl Flame length (ft+1).
   * @param wspd Wind speed (mi+1 h-1).
   * @param airt (oF).
   * @return The scorch height (ft+1)
   */
  scorchHtFromFl: function ( fl, wspd, airt ) {
    var fli = self.fliFromFl( fl )
    return self.scorchHt( fli, wspd, airt )
  },

  /**
   * Calculate the direction of maximum spread as degrees clockwise from up-slope.
   *
   * @param xComp Vector x-component returned by spreadDirectionXComponent()
   * @param yComp Vector y-component as returned by spreadDirectionYComponent().
   * @param rosv Spread rate in the vector of maximum spread (ft+1 min-1).
   * @return The direction of maximum fire spread (degrees from upslope)
  */
  spreadDirAzUp: function ( xComp, yComp, rosv ) {
    var pi = Math.PI
    var al = (rosv <= 0.0) ? 0.0 : (Math.asin(Math.abs(yComp) / rosv))
    var rad = 0.0
    if (xComp >= 0.0) {
      rad = (yComp >= 0.0) ? (al) : (pi + pi - al)
    } else {
      rad = (yComp >= 0.0) ? (pi - al) : (pi + al)
    }
    var deg = rad * 180.0 / pi
    return deg
  },

  /**
   * Calculate the slope contribution to the spread rate.
   *
   * @param ros0 No-wind, no-wlope fire spread rate
   * @param phis Slope coefficient
   * @return The slope contribution to the fire spread rate
  */
  spreadDirSlopeRate: function ( ros0, phis ) {
    return ros0 * phis
  },

  /**
   * Calculate the wind contribution to the spread rate.
   *
   * @param ros0 No-wind, no-wlope fire spread rate
   * @param phiw Wind coefficient
   * @return The wind contribution to the fire spread rate
   */
  spreadDirWindRate: function ( ros0, phiw ) {
    return ros0 * phiw
  },

  /**
   * Calculate the additional spread rate (ft+1 min-1) in the direction of maximum
   * spread under cross-slope wind condtions.
   *
   * @param xComp Vector x-component returned by spreadDirXComp()
   * @param yComp Vector y-component as returned by spreadDirYComp().
   */
  spreadDirVectorRate: function ( xComp, yComp ) {
    return  Math.sqrt(xComp * xComp + yComp * yComp)
  },

  /**
   * Calculate the x-component of the spread rate vector under cross-slope wind conditions.
   *
   * @param windRate
   * @param slopeRate
   * @param windHdgAzUp Wind heading in degrees clockwise from the up-slope direction.
   */
  spreadDirXComp: function ( windRate, slopeRate, windHdgAzUp ) {
    var rad = windHdgAzUp * Math.PI / 180.0
    return slopeRate + windRate * Math.cos( rad )
  },

  /**
   * Calculate the y-component of the spread rate vector under cross-slope wind conditions.
   *
   * @param windRate
   * @param windHdgAzUp Wind heading in degrees clockwise from the up-slope direction.
  */
  spreadDirYComp: function ( windRate, windHdgAzUp ) {
    var rad = windHdgAzUp * Math.PI / 180.0
    var s = Math.sin( rad )
    var y = windRate * s
    return y
    //return windRate * Math.sin( rad )
  },

  /**
   * Calculates the midflame wind speed required to attain a target fire spread rate.
   *
   * @param rosTarget Target fire spread rate (ft+1 min-1)
   * @param ros0 The fuel bed no-wind, no-slope fire spread rate (ft+1 min-1)
   * @param windB The fuel bed wind factor B
   * @param windK The fuel bed wind factor K
   * @param phiS The fuel bed slope coefficient (phi slope)
   * @return The midflame wind speed (ft+1 min-1) required to attain the target fire spread rate.
  */
  wspdAtRos: function (rosTarget, ros0, windB, windK, phiS) {
    if ( ros0 <= 0.0 || windK <= 0.0 ) return 0.0
    var numerator = (rosTarget / ros0) - 1.0 - phiS
    var term = numerator / windK
    return Math.pow(term, (1.0 / windB))  // midflame wind speed ft/min
  },

  /**
   * Calculates the midflame wind speed required to attain a target fire spread rate.
   *
   * @param rosTarget Target fire spread rate (ft+1 min-1)
   * @param ros0 The fuel bed no-wind, no-slope fire spread rate (ft+1 min-1)
   * @param beta The fuel bed packing ratio
   * @param bedSavr The fuel bed characteristic surface area-to-volume ratio (ft-1)
   * @param slopeRatio The fuel bed slope (ratio)
   * @return The midflame wind speed (ft+1 min-1) required to attain the target fire spread rate.
  */
  wspdAtRos2: function (rosTarget, ros0, beta, bedSavr, slopeRatio) {
    var windB = fuelBed.wndb(bedSavr)
    var windC = fuelBed.wndc(bedSavr)
    var windE = fuelBed.wnde(bedSavr)
    var betaOpt = fuelBed.beto(bedSavr)
    var betaRatio = beta / betaOpt
    var windK = fuelBed.wndk(betaRatio, windE, windC)
    var slopeK = fuelBed.slpk(beta)
    var phiS = self.phis(slopeRatio, slopeK)
    return self.wspdAtRos(rosTarget, ros0, windB, windK, phiS)
  }
}

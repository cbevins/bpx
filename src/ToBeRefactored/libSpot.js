"use strict"

const math = require('./libMath')
/**
 * Spotting distance calculations.
 *
 * @author Collin D. Bevins <cbevins@montana.com>
 * @copyright 2018 Systems for Environmental Management
 * @license MIT
 * @version GIT: $Id$ In development.
 * @package Sem\Bp7
 */
var self = module.exports = {
  // Spot distance terrain location parameters
  location: {
    mw: { factor: 0.0, label: 'Midslope, Windward'},
    vb: { factor: 1.0, label: 'Valley Bottom'},
    ml: { factor: 2.0, label: 'Midslope, Leeward'},
    rt: { factor: 3.0, label: 'Ridge Top'}
  },

  // Torching tree spot distance flame height and duration parameters
  torch: {
    'Engelmann Spruce': {
      ht:  [15.7, 0.451] ,
      dur: [12.6, -.256] },
    'Douglas-fir': {
      ht:  [15.7, .451],
      dur: [10.7, -.278] },
    'Subalpine Fir': {
      ht: [15.7, .451],
      dur: [10.7, -.278]},
    'Western Hemlock': {
      ht: [15.7, .451],
      dur: [6.3, -.249]},
    'Ponderosa Pine': {
      ht: [12.9, .453],
      dur: [ 12.6, -.256]},
    'Lodgepole Pine': {
      ht: [12.9, .453],
      dur: [12.6, -.256]},
    'Western White Pine': {
      ht: [12.9, .453],
      dur: [10.7, -.278]},
    'Grand Fir': {
      ht: [16.5, .515],
      dur: [10.7, -.278] },
    'Balsam Fir': {
      ht: [16.5, .515],
      dur: [10.7, -.278]},
    'Slash Pine': {
      ht: [2.71, 1.00],
      dur: [11.9, -.389]},
    'Longleaf Pine': {
      ht: [2.71, 1.00],
      dur: [11.9, -.389]},
    'Pond Pine': {
      ht: [2.71, 1.00],
      dur: [7.91, -.344]},
    'Shortleaf Pine': {
      ht: [2.71, 1.00],
      dur: [7.91, -.344]},
    'Loblolly Pine': {
      ht: [2.71, 1.00],
      dur: [13.5, -.544]},
    'Western Larch (Guess)': {
      ht: [12.9, .453],
      dur: [6.3, -.249]},
    'Western Red Cedar (Guess)': {
      ht: [15.7, .515],
      dur: [12.6, -.256]}
  },

 /**
   * \brief Calculates critical down-wind cover height (ft+1)
   * for a burning pile
   *
   * \param fbHt Maximum firebrand height (ft+1)
   * \param covHt Down-wind mean cover height (ft+1)
   * \param openCanopy TRUE if down-wind canopy is open
   * \return Critical down-wind cover height (ft+1)
   */
  burningPileCritCoverHt: function (fbHt, covHt, openCanopy) {
    return self.critCovHt(fbHt, covHt, openCanopy)
  },

 /**
   * \brief Calculates maximum spotting distance (mi+1)
   *  from a burning pile over flat terrain
   *
   * \param fbHt Maximum firebrand height (ft+1)
   * \param critCovHt Down-wind critical cover height (ft+1)
   * \param u20 WInd speed at 20-ft (mi+1 h-1)
   */
  burningPileFlatTerrain: function(fbHt, critCovHt, u20) {
    return self.distanceFlatTerrain(fbHt, critCovHt, u20)
  },

  /**
   * \brief Calculates maximum firebrand height (ft+1)
   * from a burning pile
   *
   * \param flameHt Flame height (ft+1) from the burning pile
   * \return Maximum firebrand height (ft+1) from a burning pile
   */
  burningPileFirebrandHt: function (flameHt) {
    return Math.max(0.0, 12.2 * flameHt)
  },

  /**
  * \brief Calculates cover height used in flat terrain spotting distance calculations.
  *
  * \param fbHt Maximum firebrand height (ft+1)
  * \param covHt Down-wind mean cover height (ft+1)
  * \param openCanopy TRUE if down-wind canopy is open
  * \return Minimum value of cover ht (ft+1) used in calculation of flat terrain spotting distance.
  */
  critCovHt: function (fbHt, covHt, openCanopy) {
    // Adjust down-wind canopy height based upon down-wind canopy cover
    // Added in BP6 by Issue #028FAH - Downwind Canopy Open/Closed
    var appliedCovHt = ( openCanopy ) ? 0.5 * covHt : covHt
    var criticalHt = ( fbHt <= 0.0 ) ? 0.0
      : ( 2.2 * Math.pow( fbHt, 0.337 ) - 4.0 )
    return Math.max( appliedCovHt, criticalHt )
  },

  /**
  *  \brief Calculates maximum spotting distance over flat terrain.
  *
  *  \param fbHt Maximum firebrand height (ft+1)
  *  \param critCovHt Downwind tree/vegetation cover height (ft)
  *  \param u20 Wind speed at 20 ft (mi+1 h-1)
  *
  *  \return Maximum spotting distance (mi+1) over flat terrain
  */
  distanceFlatTerrain: function(fbHt, critCovHt, u20) {
    return ( critCovHt <= 0.0 ) ? 0.0 :
      0.000718 * u20 * Math.sqrt( critCovHt )
        * ( 0.362 + Math.sqrt( fbHt / critCovHt ) / 2.0
        * Math.log( fbHt / critCovHt ) )
  },

  /*
   * \brief Calculates maximum spotting distance adjusted for mountain terrain.
   *
   * \param flatDist Maximum spotting distance over flat terrain (mi).
   * \param loc location property name ('mw', 'vb', 'ml', 'rt')
   * \param rvDist Horizontal distance from ridge top to valley bottom (mi).
   * \param rvElev Vertical distance from ridge top to valley bottom (ft).
   *
   * \return Maximum spotting distance (mi+1) over mountainous terrain
  */
  distanceMountainTerrain: function (flatDist, loc, rvDist, rvElev) {
    var mtnDist = flatDist
    if ( rvElev > 0.0 && rvDist > 0.0 ) {
      var a1 = flatDist / rvDist
      var b1 = rvElev / ( 10.0 * Math.PI ) / 1000.0
      var x = a1
      var factor = self.location[loc].factor
      for ( let i=0; i<6; i++ ) {
        x = a1 - b1 * ( Math.cos( Math.PI * x - factor * Math.PI / 2.0 )
          - cos( factor * Math.PI / 2.0 ) )
      }
      mtnDist = x * ridgeToValleyDist
    }
    return mtnDist
  },

  /**
   * \brief Calculates critical down-wind cover height (ft+1)
   * for a surface fire.
   *
   * \param fbHt Maximum firebrand height (ft+1)
   * \param covHt Down-wind mean cover height (ft+1)
   * \param openCanopy TRUE if down-wind canopy is open
   * \return Critical down-wind cover height (ft+1)
   */
  surfaceFireCritCoverHt: function (fbHt, covHt, openCanopy) {
    return self.critCovHt(fbHt, covHt, openCanopy)
  },

  surfaceFireFirebrandDrift: function (fbHt, u20) {
    return ( fbHt <= 0.0 ) ? 0.0 : 0.000278 * u20 * Math.pow(fbHt, 0.643)
  },

  /**
   * \brief Calculates maximum firebrand height (ft+1) from a surface fire
   *
   * \param flameLength Surface fire maximum flame length (ft+1)
   * \param u20 Wind speed at 20-ft (mi+1 h-1)
   *
   * \return Maximum firebrand height (ft+1)
   */
  surfaceFireFirebrandHt: function (flameLength, u20) {
    // Determine maximum firebrand height
    if ( u20 > 0.0 && flameLength > 0.0 ) {
      // f is functionfFirebran relating thermal energy to windspeed.
      var f = 322.0 * Math.pow( ( 0.474 * u20 ), -1.01 )

      // Byram's fireline intensity is derived back from flame length.
      var byrams = Math.pow( ( flameLength / 0.45 ), ( 1.0 / 0.46 ) )

      // Initial firebrand height (ft).
      var prod = f * byrams
      return ( prod <= 0.0 ) ? 0.0 : ( 1.055 * Math.sqrt( prod ) )
    }
    return 0.0
  },

  /**
   * \brief Calculates maximum surface fire spotting distance over flat terrain.
   *
   * \param fbHt Maximum firebrand height (ft+1)
   * \param fbDrift Firebrand drift (ft+1)
   * \param critCovHt Downwind tree/vegetation cover height (ft)
   * \param u20 Wind speed at 20 ft (mi+1 h-1)
   *
   * \return Maximum spotting distance (mi+1) over flat terrain
  */
  surfaceFireFlatTerrain: function(fbHt, fbDrift, critCovHt, u20) {
    return self.distanceFlatTerrain(fbHt, critCovHt, u20) + fbDrift
  },

  /**
   * Torching trees firebrand ht (ft+1)
   *
   * \param treeHt Tree height (ft+1) of the torching trees
   * \param flameHt Flame height (ft+1) of the toching trees
   * \param flameDur Flame duration (min+1) of the toching trees
   *
   * \return Maximum firebrand height (ft+1)
   */
  torchingTreesFirebrandHt: function (treeHt, flameHt, flameDur) {
    const parms = [
      { a: 4.24, b: 0.332 },
      { a: 3.64, b: 0.391 },
      { a: 2.78, b: 0.418 },
      { a: 4.70, b: 0.000 }
    ]
    var ratio = ( flameHt <= 0.0 ) ? 0.0 : treeHt / flameHt
    var idx = 3
    if ( flameRatio >= 1.0 ) {
      idx = 0
    } else if ( flameRatio >= 0.5 ) {
      idx = 1
    } else if ( flameDur < 3.5 ) {
      idx = 2
    }
    return parms[idx].a * Math.pow( flameDur, parms[idx].b )
      * flameHt + (0.5 * treeHt)
  },

  /**
   * \brief Calculates steady state flame duration (min+1) of the toching trees
   *
   * \param species Species label of the torching trees
   * \param dbh Dbh of the torching trees (in+1)
   * \param trees Number of torching trees
   *
   * \return Flame duration (min+1) of torching trees
   */
  torchingTreesFlameDur: function (species, dbh, trees) {
    spot.flameDur = self.torch[species].dur[0]
      * Math.pow( dbh, self.torch[species].dur[1] )
      * Math.pow( trees, -0.2 )
  },

  /**
   * \brief Calculates steady state flame height (ft+1) of the toching trees
   *
   * \param species Species label of the torching trees
   * \param dbh Dbh (in+1) of the torching trees
   * \param trees Number of torching trees
   */
  torchingTreesFlameHt: function (species, dbh, trees) {
    return self.torch[species].ht[0]
      * Math.pow( dbh, self.torch[species].ht[1] )
      * Math.pow( trees, 0.4 )
  },


  /**
   * \brief Calculates maximum torching trees spotting distance over flat terrain.
   *
   * \param fbHt Maximum firebrand height (ft+1)
   * \param critCovHt Downwind tree/vegetation cover height (ft)
   * \param u20 Wind speed at 20 ft (mi+1 h-1)
   *
   * \return Maximum spotting distance (mi+1) over flat terrain
  */
  torchingTreesFlatTerrain: function(fbHt, critCovHt, u20) {
    return self.distanceFlatTerrain(fbHt, critCovHt, u20)
  },
}

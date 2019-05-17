"use strict";

var lib = {
  az: require('./libCompass'),
  chp: require('./libFuelChp'),
  cpy: require('./libCanopy'),
  fbed: require('./libFuelBed'),
  fcat: require('./libFuelCatalog'),
  fpart: require('./libFuelParticle'),
  math: require('./libMath'),
  mois: require('./libMoistureScenario'),
  pgb: require('./libFuelPgb'),
  std: require('./libFuelStd'),
  surf: require('./libSurfaceFire'),
  was: require('./libFuelWas'),
  wind: require('./libWind'),
}
const vt = require('./vt').vt

const Cfg = require('./dag').Cfg
const Dag = require('./dag').Dag
const dagBound = require('./dag').dagBound
const dagFixed = require('./dag').dagFixed
const dagInput = require('./dag').dagInput
const fullId = require('./dag').fullId
const fullLabel = require('./dag').fullLabel
const isCfg = require('./dag').isCfg
const isDag = require('./dag').isDag
const isOpt = require('./dag').isOpt
const isVar = require('./dag').isVar
const Vapply = require('./dag').Vapply
const Vbound = require('./dag').Vbound
const Vcfg = require('./dag').Vcfg
const Vfixed = require('./dag').Vfixed
const Vinput = require('./dag').Vinput

//------------------------------------------------------------------------------
// Compose the DAG
//------------------------------------------------------------------------------

function composeBp() {
  var bp = new Dag( null, 'bp', 'BehavePlus7' )
    var fuelCat = new Dag( bp, 'fc', 'Fuel Catalog' )
    var moisCat = new Dag( bp, 'mc', 'Moisture Catalog' )
    var funcLib = new Dag( bp, 'fn', 'Function Library' )
    var vtype = new Dag( bp, 'vt', 'Variant Types' )
    var ws = new Dag( bp, 'ws', 'Worksheets' )
  return bp
}

// Adds an array of ALL variants to the worksheet
function addConfigs ( node, nodeArray ) {
  if ( isCfg( node ) ) {
    nodeArray.push( node )
  }
  for ( let propName in node ) {
    if ( propName !== 'own' ) {
      addConfigs( node[propName], nodeArray )
    }
  }
}

// Adds an array of ALL variants to the worksheet
function addVariants ( node, nodeArray ) {
  if ( isVar( node ) ) {
    nodeArray.push( node )
  }
  for ( let propName in node ) {
    if ( propName !== 'own' ) {
      addVariants( node[propName], nodeArray )
    }
  }
}

function sum( a, b, c ) {
  var s = 0
  if ( a !== undefined ) s += a
  if ( b !== undefined ) s += b
  if ( c !== undefined ) s += c
  return s
}

function worksheet2( parent ) {
  var w2 = new Dag( parent, 'w2', 'Worksheet 2' )
    var core = new Dag( w2, 'core', 'Internals' )
    var nodes = new Dag( w2, 'nodes', 'Variants' )
      var cfg = new Dag( nodes, 'cf', 'Configuration' )
        var cfge = new Cfg( cfg, 'cfge', 'The DAg will be', [
          [ 'full', 'full', true ],
          [ 'partial', 'partial' ]])
      Vfixed( nodes, 'k1', vt.int, '', 10 )
      Vinput( nodes, 'i1', vt.int, '', [ 1, 2 ] )
      Vinput( nodes, 'i2', vt.int, '', [ 2, 3 ] )
      Vinput( nodes, 'i3', vt.int, '', [ 4, 5 ] )
      Vinput( nodes, 'i4', vt.int, '', [ 6, 7 ] )
      Vbound( nodes, 'a', vt.int, 'a', nodes.i1 )
      Vapply( nodes, 'b', vt.int, 'b', sum, [ nodes.a ] )
      Vapply( nodes, 'c', vt.int, 'c', sum, [ nodes.b, nodes.i2 ] )
      Vapply( nodes, 'd', vt.int, 'd', sum, [ nodes.a, nodes.c, nodes.k1 ] )
      Vcfg( nodes, 'e', vt.int, 'e', cfge, [
        [ 'partial', dagBound, nodes.i3 ],  // if cfge==='partial', then get 'e' value from i3
        [ 'dflt', sum, [ nodes.d ]]] )      // if cfge==='full', derive 'e' value from 'd'
      Vapply( nodes, 'f', vt.int, '', sum, [ nodes.i4, nodes.e ] )
      Vapply( nodes, 'g', vt.int, '', sum, [ nodes.f ] )
  return finish( w2 )
}

function finish( worksheet ) {
  worksheet.core.variants = []  // References to ALL Variants
  addVariants( worksheet.nodes, worksheet.core.variants )
  worksheet.core.configs = []   // References to ALL Configs
  addConfigs( worksheet.nodes, worksheet.core.configs )
  worksheet.core.inputs = []    // References to all active INPUTS (i.e., inputs with dependents)
  worksheet.core.results = []   //
  worksheet.core.selected = []  // References to all SELECTED Variants
  worksheet.core.stored = []    // References to all stored (INPUT or SELECTED) Variants
  worksheet.core.runlimit = 10000
  return worksheet
}

function worksheet1( parent ) {
  var w1 = new Dag( parent, 'w1', 'Worksheet 1' )
    var core = new Dag( w1, 'core', 'Internals' )
    var nodes = new Dag( w1, 'nodes', 'Variants' )
      var cfg = new Dag( nodes, 'cf', 'Configuration' )
        var cfgFuel = new Dag( cfg, 'fuel', 'Fuel' )
        var cfgMois = new Dag( cfg, 'mois', 'Moisture' )
        var cfgSlope = new Dag( cfg, 'slp', 'Slope' )
        var cfgWind = new Dag( cfg, 'wind', 'Wind' )
        var cfgFire = new Dag( cfg, 'fire', 'Fire' )
        var cfgCrown = new Dag( cfg, 'crown', 'Crown' )
        var cfgContain = new Dag( cfg, 'contain', 'Contain' )
        var cfgScorch = new Dag( cfg, 'scorch', 'Scorch' )
        var cfgCanopy = new Dag( cfg, 'cpy', 'Scorch' )
        var cfgChap = new Dag( cfg, 'chap', 'Scorch' )
      var wk = new Dag( nodes, 'k', 'Constant' )
      var air = new Dag( nodes, 'air', 'Air' )
      var cpy = new Dag( nodes, 'cpy', 'Canopy' )
      var doc = new Dag( nodes, 'doc', 'Documentation' )
      var map = new Dag( nodes, 'map', 'Map' )
      var mois = new Dag( nodes, 'mois', 'Moisture' )
        var moisDead = new Dag( mois, 'dead', 'Dead' )
        var moisLive = new Dag( mois, 'live', 'Live' )
      var slp = new Dag( nodes, 'slp', 'Slope' )
        var slpStp = new Dag( slp, 'stp', 'Steepness' )
        var slpDir = new Dag( slp, 'dir', 'Direction' )
      var wnd = new Dag( nodes, 'wnd', 'Wind' )
        var wndDir = new Dag( wnd, 'dir', 'Direction' )
          var wndDirSrc = new Dag( wndDir, 'src', 'Source' )
          var wndDirHdg = new Dag( wndDir, 'hdg', 'Heading' )
        var wndSpd = new Dag( wnd, 'spd', 'Speed' )
      var surf = new Dag( nodes, 'surf', 'Surface' )
        var sfuel = new Dag( surf, 'fuel', 'Fuel' )
          var sf1 = new Dag( sfuel, 'sf1', 'Primary' )
            var sf1m = new Dag( sf1, 'modl', 'Model' )
              var sf1Std = new Dag( sf1m, 'std', 'Standard' )
              var sf1Chp = new Dag( sf1m, 'chp', 'Chaparral' )
              var sf1Pgb = new Dag( sf1m, 'pgb', 'Palmetto-Gallberry' )
              var sf1Was = new Dag( sf1m, 'was', 'Western Aspen' )
            var sf1b = new Dag( sf1, 'bed', 'Bed' )
              var sf1bd = new Dag( sf1b, 'dead', 'Dead Category' )
                var sf1bdp = new Dag( sf1bd, 'part', 'Particle' )
                  var sf1bdp1 = new Dag( sf1bdp, 'p1', '1' )
                  var sf1bdp2 = new Dag( sf1bdp, 'p2', '2' )
                  var sf1bdp3 = new Dag( sf1bdp, 'p3', '3' )
                  var sf1bdp4 = new Dag( sf1bdp, 'p4', '4' )
              var sf1bl = new Dag( sf1b, 'live', 'Live Category' )
                var sf1blp = new Dag( sf1bl, 'part', 'Particle' )
                  var sf1blp1 = new Dag( sf1blp, 'p1', '1' )
                  var sf1blp2 = new Dag( sf1blp, 'p2', '2' )
                  var sf1blp3 = new Dag( sf1blp, 'p3', '3' )
                  var sf1blp4 = new Dag( sf1blp, 'p4', '4' )
                  var sf1blp5 = new Dag( sf1blp, 'p5', '5' )
              var sf1bc = new Dag( sf1b, 'char', 'Characteristic' )
            var sf1f = new Dag( sf1, 'fire', 'Fire' )
              var sf1fd = new Dag( sf1f, 'dir', 'Direction' )

          var sf2 = new Dag( sfuel, 'sf2', 'Secondary' )
            var sf2m = new Dag( sf2, 'modl', 'Model' )
              var sf2Std = new Dag( sf2m, 'std', 'Standard' )
              var sf2Chp = new Dag( sf2m, 'chp', 'Chaparral' )
              var sf2Pgb = new Dag( sf2m, 'pgb', 'Palmetto-Gallberry' )
              var sf2Was = new Dag( sf2m, 'was', 'Western Aspen' )
            var sf2b = new Dag( sf2, 'bed', 'Bed' )
              var sf2bd = new Dag( sf2b, 'dead', 'Dead Category' )
                var sf2bdp = new Dag( sf2bd, 'part', 'Particle' )
                  var sf2bdp1 = new Dag( sf2bdp, 'p1', '1' )
                  var sf2bdp2 = new Dag( sf2bdp, 'p2', '2' )
                  var sf2bdp3 = new Dag( sf2bdp, 'p3', '3' )
                  var sf2bdp4 = new Dag( sf2bdp, 'p4', '4' )
              var sf2bl = new Dag( sf2b, 'live', 'Live Category' )
                var sf2blp = new Dag( sf2bl, 'part', 'Particle' )
                  var sf2blp1 = new Dag( sf2blp, 'p1', '1' )
                  var sf2blp2 = new Dag( sf2blp, 'p2', '2' )
                  var sf2blp3 = new Dag( sf2blp, 'p3', '3' )
                  var sf2blp4 = new Dag( sf2blp, 'p4', '4' )
                  var sf2blp5 = new Dag( sf2blp, 'p5', '5' )
              var sf2bc = new Dag( sf2b, 'char', 'Characteristic' )
            var sf2f = new Dag( sf2, 'fire', 'Fire' )
              var sf2fd = new Dag( sf2f, 'dir', 'Direction' )

        var sfire = new Dag( surf, 'fire', 'Fire' )
          var sfw = new Dag( sfire, 'wt', 'Weighted' )
            var sfwr = new Dag( sfw, 'ros', 'Spread Rate' )
          var sfe = new Dag( sfire, 'el', 'Ellipse' )
          var sfes = new Dag( sfe, 'size', 'Size' )
          var sfeh = new Dag( sfe, 'head', 'Head' )
          var sfeb =  new Dag( sfe, 'back', 'Back' )
          var sfef = new Dag( sfe, 'flnk', 'Flank' )
          var sfeBeta = new Dag( sfe, 'beta', 'Vector From Ignition Point' )
          var sfePsi = new Dag( sfe, 'psi', 'Vector From Fire Front' )
    // var mort = new Dag( nodes, 'mort', 'Mortality' )
    // var spot = new Dag( nodes, 'spot', 'Spot' )
    // var cont = new Dag( nodes, 'cont', 'Contain' )
    // var crwn = new Dag( nodes, 'crwn', 'Crown' )
    // var ignt = new Dag( nodes, 'ignt', 'Ignition Probability' )

  //----------------------------------------------------------------------------
  // Constants
  //----------------------------------------------------------------------------

  Vfixed( wk, 'noArea', vt.fuel.area, 'No', 0.0 )
  Vfixed( wk, 'noDepth', vt.fuel.depth, 'No', 0.01 )
  Vfixed( wk, 'noDesc', vt.fuel.desc, 'No', 'Unused' )
  Vfixed( wk, 'noDens', vt.fuel.dens, 'No', 32.0 )
  Vfixed( wk, 'noHeat', vt.fuel.heat, 'No', 8000.0 )
  Vfixed( wk, 'noLoad', vt.fuel.load, 'No', 0.0 )
  Vfixed( wk, 'noMois', vt.fuel.mois, 'No', 9.0 )
  Vfixed( wk, 'noSavr', vt.fuel.savr, 'No', 1.0 )
  Vfixed( wk, 'noSeff', vt.fuel.savr, 'No', 0.01 )
  Vfixed( wk, 'noSize', vt.fuel.size, 'No', 5 )
  Vfixed( wk, 'noStot', vt.fuel.stot, 'No', 0.055 )

  //------------------------------------------------------------------------------
  // Level 5 Configurations
  //------------------------------------------------------------------------------

  // bp6 #1 Surface > Input Options > Fuel
  // [key, std, exp, harm, arith, pg, wa, ch]
  // bp7 #1, used by fb
  var cfgFuel1 = new Cfg( cfgFuel, 'fuel1', 'Primary fuel is entered as', [
    [ 'cat', 'a fuel model key', true ],
    [ 'std', 'standard fuel model parameters' ],
    [ 'chp', 'dynamic chaparral fuel parameters' ],
    [ 'pgb', 'dynamic palmetto-gallbery fuel parameters' ],
    [ 'was', 'dynamic western aspen fuel parameters' ]])

  // bp7 #2, used by fb
  var cfgFuel2 = new Cfg( cfgFuel, 'fuel2', 'Secondary fuel is entered as', [
    [ 'none', 'none' ],
    [ 'cat', 'a fuel model key', true ],
    [ 'std', 'standard fuel model parameters' ],
    [ 'chp', 'dynamic chaparral fuel parameters' ],
    [ 'pgb', 'dynamic palmetto-gallbery fuel parameters' ],
    [ 'was', 'dynamic western aspen fuel parameters' ]])

  // bp6 #2 - Surface > Input Options > Moisture > Herb Curing [est, inp]
  // bp7 #4
  var cfgHcf = new Cfg( cfgFuel, 'hcf', 'Herb cured fraction is', [
    [ 'est', 'estimated from live herbaceous fuel moisture content', true],  // bp6 #2a
    [ 'inp', 'specified via input' ]])  // bp6 #2b

  // bp6 #3 - Surface > Input Options > Moisture > Fuel Moisture
  // [ind, cat, mixed, scen]
  // bp7 #5

  var cfgMois = new Cfg( cfgMois, 'mois', 'Moisture Content is ', [
    [ 'life', 'input for dead and live category', true ],
    [ 'mixed', 'input for dead category, live herb, and live stem'],
    [ 'indiv', 'input for each dead and live fuel class'],
    [ 'scen', 'specified by a moisture scenario key']
  ] )

  // bp6 #4 Surface > Input Options > Wind Speed > Entered at
  // [mid, 20-wafInp, 20-wafEst, 10-wafInp, 10-wafEst]
  // bp7 #7
  var cfgWindSpeed = new Cfg( cfgWind, 'speed', 'Speed is input for', [
    [ 'at10', '10-m height', true ],
    [ 'at20', '20-ft height' ],
    [ 'mid', 'midflame height' ] ])

    // bp7 #8
  var cfgWindWaf = new Cfg( cfgWind, 'waf', 'The midflame wind speed adjustment factor is', [
    [ 'est', 'estimated from canopy and fuel parameters', true ],
    [ 'inp', 'specified via input' ]])

  // bp6 #5 Surface > Input Options > Wind Speed > Wind is
  // [always upslope, specified]
  // bp6 #10 Surface > Input Options > Directions > Wind & Fire Dir
  // [wrt upslope, wrt north]
  // bp7 #9
  var cfgWindDir = new Cfg( cfgWind, 'dir', 'Wind direction is', [
      // bp6 #5b && #10b, specified directions wrt north
    [ 'srcNo', 'the direction FROM which the wind is blowing (degrees from NORTH)', true ],
      // bp6 #5b && #10a, specified directions wrt upslope
    [ 'hdgUp', 'the direcion TOWARDS which the wind is blowing (degrees from UPSLOPE)'],
      // bp6 #5a always upslope
    [ 'upSlp', 'assumed to be blowing upslope' ]])


  // bp7 #3
  var cfgFireWtd = new Cfg( cfgFire, 'wtd', 'Maximum fire spread rate is based on', [
    [ 'arithmetic', 'arithmetic mean spread rate' ],
    [ 'expected', 'expected value spread rate' ],
    [ 'harmonic', 'harmonic mean spread rate', true ]])

  // bp6 #6 Surface > Input Options > Wind Speed > Impose max wind speed limit?
  // bp7 #10
  var cfgFireEwsl = new Cfg( cfgFire, 'ewsl', 'The effective wind speed limit is', [
    [ 'yes', 'applied', true ],
    [ 'no', 'NOT applied' ]])

  // bp6 #7 Surface > Input Options > Slope > Slope is [percent, degrees]
  // bp6 #8 Surface > Input Options > Slope > Slope is [input, map]
  // bp7 #11
  var cfgSlope = new Cfg( cfgSlope, 'stp', 'Slope steepness is', [
    [ 'map', 'estimated from map measurements', true ],  // #8b, map
    [ 'deg', 'input as degrees' ],  // #7b, input degrees
    [ 'rat', 'input as ratio of rise/reach' ]])  // #7a, input percent

  // bp6 #9 Surface > Input Options > Directions > Spread is [head, back, flank, psi, beta]
  // BP7 implements all options at any time

  // bp6 #10 Surface > Input Options > Directions > Wind & Spread are: (see above)

  // bp6 #11 Surface > Input Options > Chaparral > Total load is [specified, est]
  // bp7 # 12
  var cfgChapLoad = new Cfg( cfgChap, 'load', 'Chaparral total fuel load is', [
    [ 'inp', 'specified via input', true ],  // bp6 #11a
    [ 'est', 'estimated from fuel height and dead fraction' ]])   // bp6 #11b

  // bp6 #12 - Crown > Input Options > Use [roth, s&r]
  // bp7 #13 - May not be necessary: S&R is applied only if passive ouputs requested
  var cfgCrownMethod = new Cfg( cfgCrown, 'method', 'Crown fire is estimated via', [
    [ 'roth', 'Rothermel' ],
    [ 'sr', 'Scott and Reinhardt (wind must blow upslope)', true ]])

  // bp6 #13 - Crown > Input Options > FLI [fl, fli]
  // bp7 #14 - stand alone only
  var cfgCrownFli = new Cfg( cfgCrown, 'fli', 'Crown fire intensity is entered as', [
    [ 'fl', 'flame length', true ],
    [ 'fli', 'fireline intensity' ]])

  // bp6 # 14 - Contain > Input Options > resources [single, multiple]
  // bp7 #15
  var cfgContainRes = new Cfg( cfgContain, 'res', 'Contain module allows', [
    [ 'single', 'a single firefighting resource' ],
    [ 'multiple', 'multiple firefighting resources', true ]])

  // #15 - Scorch > Input Options > FLI [fl, fli]
  // bp7 #16 - stand alone only
  new Cfg( cfgScorch, 'fli', 'Scorch height fire intensity is entered as', [
  [ 'fl', 'flame length', true ],
  [ 'fli', 'fireline intensity' ]])

  new Cfg( cfgCanopy, 'cratio', 'The canopy crown ratio is', [
    [ 'est', 'estimated from canopy ht and crown base ht', true ],
    [ 'inp', 'specified as input' ]])

  //----------------------------------------------------------------------------
  // Air
  //----------------------------------------------------------------------------

  Vinput( air, 'tmp', vt.air.tmp )

  //----------------------------------------------------------------------------
  // Canopy
  //----------------------------------------------------------------------------

  Vinput( cpy, 'bh', vt.cpy.bh )
  Vinput( cpy, 'bd', vt.cpy.bd )
  Vinput( cpy, 'cr', vt.cpy.cr )
  Vinput( cpy, 'cv', vt.cpy.cv )
  Vapply( cpy, 'fl', vt.cpy.fl, '', lib.cpy.fl, [ cpy.cv, cpy.cr ] )
  Vinput( cpy, 'ht', vt.cpy.ht )
  Vapply( cpy, 'sf', vt.cpy.sf, '', lib.cpy.sh, [ cpy.cv, cpy.ht, cpy.fl ] )

  //----------------------------------------------------------------------------
  // Documentation
  //----------------------------------------------------------------------------

  Vinput( doc, 'title', vt.doc.tl )
  Vinput( doc, 'user', vt.doc.un )

  //----------------------------------------------------------------------------
  // Map
  //----------------------------------------------------------------------------

  Vinput( map, 'scl', vt.map.scl )
  Vinput( map, 'cint', vt.map.cint )
  Vinput( map, 'dist', vt.map.dist )
  Vinput( map, 'cont', vt.map.cont )

  //----------------------------------------------------------------------------
  // Moisture Content
  //----------------------------------------------------------------------------

  // Moisture scenario key is either input when cfgMois==='scen', or its unused
  Vinput( mois, 'key', vt.mois.key )

  // Dead category moisture is either input when cfgMois==='life' || 'mixed', or its unused
  Vinput( moisDead, 'cat', vt.fuel.mois )

  Vcfg( moisDead, 'tl1', vt.fuel.mois, '1-h', cfgMois, [
    [ 'scen', lib.mois.tl1, [ mois.key ]],
    [ 'indiv', dagInput ],
    [ 'dflt', dagBound, moisDead.cat ]]) // 'life' or 'mixed'

  Vcfg( moisDead, 'tl10', vt.fuel.mois, '10-h', cfgMois, [
    [ 'scen', lib.mois.tl10, [ mois.key ]],
    [ 'indiv', dagInput ],
    [ 'dflt', dagBound, moisDead.cat ]]) // 'life' or 'mixed'

  Vcfg( moisDead, 'tl100', vt.fuel.mois, '100-h', cfgMois, [
    [ 'scen', lib.mois.tl100, [ mois.key ]],
    [ 'indiv', dagInput ],
    [ 'dflt', dagBound, moisDead.cat ]]) // 'life' or 'mixed'

  // Live category moisture is either input when cfgMois==='life', or its unused
  Vinput( moisLive, 'cat', vt.fuel.mois )

  Vcfg( moisLive, 'herb', vt.fuel.mois, 'Herbaceous', cfgMois, [
    [ 'scen', lib.mois.herb, [ mois.key ]],
    [ 'life', dagBound, mois.live.cat ],
    [ 'dflt', dagInput ]])  // cfgMois==='indiv' || 'mixed'

  Vcfg( moisLive, 'stem', vt.fuel.mois, 'Stem Wood', cfgMois, [
    [ 'scen', lib.mois.stem, [ mois.key ]],
    [ 'life', dagBound, mois.live.cat ],
    [ 'dflt', dagInput ]])  // cfgMois==='indiv' || 'mixed'

  //----------------------------------------------------------------------------
  // Slope Steepness and Direction
  //----------------------------------------------------------------------------

  Vcfg( slpStp, 'rat', vt.slp.rat, '', cfgSlope, [
    [ 'deg', lib.az.slpRat, [ slpStp.deg ]],
    [ 'map', lib.az.slpRatMap, [ map.scl, map.cint, map.cont, map.dist ]],
    [ 'dflt', dagInput]] ) // cfgSlope==='rat'

  Vcfg( slpStp, 'deg', vt.slp.deg, '', cfgSlope, [
    [ 'deg', dagInput ],
    [ 'dflt', lib.az.slpDeg, [ slpStp.rat ]]] ) // cfgSlope==='rat' || 'map'

    // Because of circular dependency between slp.rat and slp.deg, must define this again
  Vcfg( slpStp, 'rat', vt.slp.rat, '', cfgSlope, [
    [ 'deg', lib.az.slpRat, [ slpStp.deg ]],
    [ 'map', lib.az.slpRatMap, [ map.scl, map.cint, map.cont, map.dist ]],
    [ 'dflt', dagInput]] ) // cfgSlope==='rat'

  Vinput( slpDir, 'asp', vt.slp.asp )

  Vapply( slpDir, 'up', vt.slp.up, '', lib.az.opp, [slpDir.asp] )

  //----------------------------------------------------------------------------
  // Wind Speed and Direction
  //----------------------------------------------------------------------------


  Vinput( wndDirSrc, 'no', vt.wind.srcNo )

  Vapply( wndDirHdg, 'no', vt.wind.hdgNo, '', lib.az.opp, [ wnd.dir.src.no] )

  Vcfg( wndDirHdg, 'up', vt.wind.hdgUp, '', cfgWindDir, [
    [ 'hdgUp', dagInput ],
    [ 'upSlp', dagFixed, 0.0 ],
    [ 'dflt', lib.az.diff, [ wnd.dir.hdg.no, slpDir.up] ]])  // cfgWndDir==='srcNo'

  Vapply( wndDirSrc, 'up', vt.wind.srcUp, '', lib.az.opp, [ wnd.dir.hdg.up ] )


  // Because of co-dependency, have to re-declare on of the vars
  Vcfg( wndSpd, 'at10', vt.wind.spd, '10-m', cfgWindSpeed, [
    [ 'at10', dagInput ],
    [ 'dflt', lib.wind.at10m, [ wndSpd.at20 ]]])  // cfgWindSpeed==='at20' || 'mid'

  Vcfg( wndSpd, 'at20', vt.wind.spd, '20-ft', cfgWindSpeed, [
    [ 'at10', lib.wind.at20ft, [ wndSpd.at10 ]],
    [ 'dflt', dagInput ]]) // cfgWindSpeed==='at20' || 'mid'

  Vcfg( wndSpd, 'at10', vt.wind.spd, '10-m', cfgWindSpeed, [
    [ 'at10', dagInput ],
    [ 'dflt', lib.wind.at10m, [ wndSpd.at20 ]]])  // cfgWindSpeed==='at20' || 'mid'

  //----------------------------------------------------------------------------
  // Surface Fuel & Fire
  //----------------------------------------------------------------------------

  Vinput( sf1m, 'key', vt.fuel.key )

  Vcfg( sf1m, 'cover', vt.fuel.fmcv, '', cfgFuel2, [
    [ 'none', dagFixed, 1.0 ],
    [ 'dflt', dagInput ]] )

  Vcfg( sf1m, 'type', vt.fuel.type, '', cfgFuel1, [
    [ 'std', dagFixed, 'std' ],
    [ 'chp', dagFixed, 'chp' ],
    [ 'pgb', dagFixed, 'pgb' ],
    [ 'was', dagFixed, 'was' ],
    [ 'dflt', lib.fcat.type, [ sf1m.key ]]]) // cfgFuel1==='cat'

  //----------------------------------------------------------------------------
  // Standard Fuels
  //----------------------------------------------------------------------------

  // Following are provided by catalog or input

  Vcfg( sf1Std, 'dep', vt.fuel.depth, '', cfgFuel1, [
    [ 'cat', lib.fcat.std.depth, [ sf1m.key ]],
    [ 'std', dagInput ],
    [ 'dflt', dagFixed, 0.01]] )  // cfgFuel1==='chp' || 'pgb' || 'was'

  Vcfg( sf1Std, 'dmxt', vt.fuel.mext, 'Dead', cfgFuel1, [
    [ 'cat', lib.fcat.std.mext, [ sf1m.key ]],
    [ 'std', dagInput ],
    [ 'dflt', dagFixed, 0.01]] )  // cfgFuel1==='chp' || 'pgb' || 'was'

  Vcfg( sf1Std, 'd1ld', vt.fuel.load, 'Dead 1-h', cfgFuel1, [
    [ 'cat', lib.fcat.std.d1ld, [ sf1m.key ]],
    [ 'std', dagInput ],
    [ 'dflt', dagFixed, 0.0]] )  // cfgFuel1==='chp' || 'pgb' || 'was'

  Vcfg( sf1Std, 'd10ld', vt.fuel.load, 'Dead 10-h', cfgFuel1, [
    [ 'cat', lib.fcat.std.d10ld, [ sf1m.key ]],
    [ 'std', dagInput ],
    [ 'dflt', dagFixed, 0.0]] )  // cfgFuel1==='chp' || 'pgb' || 'was'

  Vcfg( sf1Std, 'd100ld', vt.fuel.load, 'Dead 100-h', cfgFuel1, [
    [ 'cat', lib.fcat.std.d100ld, [ sf1m.key ]],
    [ 'std', dagInput ],
    [ 'dflt', dagFixed, 0.0]] )  // cfgFuel1==='chp' || 'pgb' || 'was'

  Vcfg( sf1Std, 'hld', vt.fuel.load, 'Total Herbaceous', cfgFuel1, [
    [ 'cat', lib.fcat.std.hld, [ sf1m.key ]],
    [ 'std', dagInput ],
    [ 'dflt', dagFixed, 0.0]] )  // cfgFuel1==='chp' || 'pgb' || 'was'

  Vcfg( sf1Std, 'sld', vt.fuel.load, 'Live Stem Wood', cfgFuel1, [
    [ 'cat', lib.fcat.std.sld, [ sf1m.key ]],
    [ 'std', dagInput ],
    [ 'dflt', dagFixed, 0.0]] )  // cfgFuel1==='chp' || 'pgb' || 'was'

  Vcfg( sf1Std, 'd1sv', vt.fuel.savr, 'Dead 1-h', cfgFuel1, [
    [ 'cat', lib.fcat.std.d1sv, [ sf1m.key ]],
    [ 'std', dagInput ],
    [ 'dflt', dagFixed, 1.0]] )  // cfgFuel1==='chp' || 'pgb' || 'was'

  Vcfg( sf1Std, 'hsv', vt.fuel.savr, 'Herbaceous', cfgFuel1, [
    [ 'cat', lib.fcat.std.hsv, [ sf1m.key ]],
    [ 'std', dagInput ],
    [ 'dflt', dagFixed, 1.0]] )  // cfgFuel1==='chp' || 'pgb' || 'was'

  Vcfg( sf1Std, 'ssv', vt.fuel.savr, 'Stem Wood', cfgFuel1, [
    [ 'cat', lib.fcat.std.ssv, [ sf1m.key ]],
    [ 'std', dagInput ],
    [ 'dflt', dagFixed, 1.0]] )  // cfgFuel1==='chp' || 'pgb' || 'was'

  Vcfg( sf1Std, 'dht', vt.fuel.heat, 'Dead', cfgFuel1, [
    [ 'cat', lib.fcat.std.dht, [ sf1m.key ]],
    [ 'std', dagInput ],
    [ 'dflt', dagFixed, 8000.0]] )  // cfgFuel1==='chp' || 'pgb' || 'was'

  Vcfg( sf1Std, 'lht', vt.fuel.heat, 'Live', cfgFuel1, [
    [ 'cat', lib.fcat.std.lht, [ sf1m.key ]],
    [ 'std', dagInput ],
    [ 'dflt', dagFixed, 8000.0]] )  // cfgFuel1==='chp' || 'pgb' || 'was'

  // Following are derived
  Vcfg( sf1Std, 'hcf', vt.fuel.hcf, '', cfgHcf, [
    [ 'est', lib.std.hcf, [ mois.live.herb ] ],
    [ 'dflt', dagInput ]]) // cfgHcf==='inp'

  Vapply( sf1Std, 'dhld', vt.fuel.load, 'Dead Herb',
    lib.std.dhld, [ sf1Std.hcf, sf1Std.hld ] )

  Vapply( sf1Std, 'lhld', vt.fuel.load, 'Live Herb',
    lib.std.lhld, [ sf1Std.hcf, sf1Std.hld ] )

  Vapply( sf1Std, 'dld', vt.fuel.load, 'Dead',
    lib.std.dld, [ sf1Std.d1ld, sf1Std.d10ld, sf1Std.d100ld, sf1Std.dhld ] )

  Vapply( sf1Std, 'lld', vt.fuel.load, 'Live',
    lib.std.lld, [ sf1Std.lhld, sf1Std.sld ] )

  // Following are constant
  Vfixed( sf1Std, 'd2sv', vt.fuel.savr, 'Dead 10-h', 109.0 )
  Vfixed( sf1Std, 'd3sv', vt.fuel.savr, 'Dead 100-h', 30.0 )
  Vfixed( sf1Std, 'dens', vt.fuel.dens, 'All Particle', 32.0 )
  Vfixed( sf1Std, 'seff', vt.fuel.seff, 'All Particle', 0.01 )
  Vfixed( sf1Std, 'stot', vt.fuel.stot, 'All Particle', 0.0555 )

  //----------------------------------------------------------------------------
  // Chaparral Fuels
  // The fuel catalog stores depth, total load, and dead fraction
  //----------------------------------------------------------------------------

  // Following are provided by catalog or input

  Vcfg( sf1Chp, 'dep', vt.fuel.depth, '', cfgFuel1, [
    [ 'cat', lib.fcat.chp.depth, [ sf1m.key ]],
    [ 'chp', dagInput ],
    [ 'dflt', dagFixed, 0.01]] )  // cfgFuel1==='std' || 'pgb' || 'was'

  Vcfg( sf1Chp, 'df', vt.fuel.chdf, '', cfgFuel1, [
    [ 'cat', lib.fcat.chp.df, [ sf1m.key ]],
    [ 'chp', dagInput ],
    [ 'dflt', dagFixed, 0.0]] )  // cfgFuel1==='std' || 'pgb' || 'was'

  Vcfg( sf1Chp, 'ld', vt.fuel.load, 'Total', cfgFuel1, [
    [ 'cat', lib.fcat.chp.ld, [ sf1m.key ]],
    [ 'chp', dagInput ],
    [ 'dflt', dagFixed, 0.0]] )  // cfgFuel1==='chp' || 'pgb' || 'was'

  Vinput( sf1Chp, 'ty', vt.fuel.chty, '', 'chamise' )

  // Following are derived
  Vapply( sf1Chp, 'age', vt.fuel.chag, '',
    lib.chp.age, [ sf1Chp.dep, sf1Chp.ty ] )

  Vapply( sf1Chp, 'eld', vt.fuel.load, 'Estimated Total',
    lib.chp.ld, [ sf1Chp.age, sf1Chp.ty ] )

  Vcfg( sf1Chp, 'ald', vt.fuel.load, 'Applied Total', cfgChapLoad, [
    [ 'est', dagBound, sf1Chp.eld ],
    [ 'dflt', dagBound, sf1Chp.ld ]])  // cfgChapLoad==='inp'

  Vapply( sf1Chp, 'dld', vt.fuel.load, 'Dead',
    lib.chp.dld, [ sf1Chp.ald, sf1Chp.df ] )
  Vapply( sf1Chp, 'd1ld', vt.fuel.load, 'Dead 0.01 - 0.25',
    lib.chp.d1ld, [ sf1Chp.ald, sf1Chp.df ] )
  Vapply( sf1Chp, 'd2ld', vt.fuel.load, 'Dead 0.25 - 0.50',
    lib.chp.d2ld, [ sf1Chp.ald, sf1Chp.df ] )
  Vapply( sf1Chp, 'd3ld', vt.fuel.load, 'Dead 0.50 - 1.0',
    lib.chp.d3ld, [ sf1Chp.ald, sf1Chp.df ] )
  Vapply( sf1Chp, 'd4ld', vt.fuel.load, 'Dead 1.0 - 3.0',
    lib.chp.d4ld, [ sf1Chp.ald, sf1Chp.df ] )

  Vapply( sf1Chp, 'lld', vt.fuel.load, 'Live',
    lib.chp.lld, [ sf1Chp.ald, sf1Chp.df ] )
  Vapply( sf1Chp, 'l1ld', vt.fuel.load, 'Live 0.01 - 0.25',
    lib.chp.l1ld, [ sf1Chp.ald, sf1Chp.df ] )
  Vapply( sf1Chp, 'l2ld', vt.fuel.load, 'Live 0.25 - 0.50',
    lib.chp.l2ld, [ sf1Chp.ald, sf1Chp.df ] )
  Vapply( sf1Chp, 'l3ld', vt.fuel.load, 'Live 0.50 - 1.0',
    lib.chp.l3ld, [ sf1Chp.ald, sf1Chp.df ] )
  Vapply( sf1Chp, 'l4ld', vt.fuel.load, 'Live 1.0 - 3.0',
    lib.chp.l4ld, [ sf1Chp.ald, sf1Chp.df ] )
  Vapply( sf1Chp, 'l5ld', vt.fuel.load, 'Live Leaves',
    lib.chp.l5ld, [ sf1Chp.ald, sf1Chp.df ] )

  // This will be a function that returns 0.65 for chamise and 0.74 for mixed chaparral
  // var sf1Chp.lmxt = Vapply( sf1Chp, 'lmxt', vt.fuel.mext, 'Live',
  //   lib.chp.lmxt, [ sf1] )

  // The following are constant
  Vfixed( sf1Chp, 'dmxt', vt.fuel.mext, 'Dead', 0.30 )
  Vfixed( sf1Chp, 'p1sv', vt.fuel.savr, '0.01 - 0.25', 640.0 )
  Vfixed( sf1Chp, 'p2sv', vt.fuel.savr, '0.25 - 0.50', 127.0 )
  Vfixed( sf1Chp, 'p3sv', vt.fuel.savr, '0.50 - 1.0', 61.0 )
  Vfixed( sf1Chp, 'p4sv', vt.fuel.savr, '1.0 - 3.0', 27.0 )
  Vfixed( sf1Chp, 'p5sv', vt.fuel.savr, 'Live Leaves', 2200.0 )
  Vfixed( sf1Chp, 'stot', vt.fuel.stot, 'All Particles', 0.055 )
  Vfixed( sf1Chp, 'seff', vt.fuel.seff, 'All Stemwood', 0.015 )
  Vfixed( sf1Chp, 'p5se', vt.fuel.seff, 'Live Leaves', 0.035 )
  Vfixed( sf1Chp, 'dens', vt.fuel.dens, 'All Stemwood', 46.0 )
  Vfixed( sf1Chp, 'p5dn', vt.fuel.dens, 'Live Leaves', 32.0 )
  Vfixed( sf1Chp, 'dht',  vt.fuel.heat, 'All Dead', 8000.0 )
  Vfixed( sf1Chp, 'llht', vt.fuel.heat, 'Live Leaf and Live 0-0.25', 10500.0 )
  Vfixed( sf1Chp, 'lsht', vt.fuel.heat, 'Live Stemwood 0.25-3.0', 9500.0 )

  //----------------------------------------------------------------------------
  // Palmetto-Gallberry Fuels
  // The fuel catalog stores age, basal area, cover, and height
  //----------------------------------------------------------------------------

  // The following are provided by the catalog or input
  Vcfg( sf1Pgb, 'age', vt.fuel.pgag, '', cfgFuel1, [
    [ 'cat', lib.fcat.pgb.age, [ sf1m.key ]],
    [ 'pgb', dagInput ],
    [ 'dflt', dagFixed, 0.0]] )  // cfgFuel1==='chp' || 'std' || 'was'

  Vcfg( sf1Pgb, 'ba', vt.fuel.pgba, '', cfgFuel1, [
    [ 'cat', lib.fcat.pgb.ba, [ sf1m.key ]],
    [ 'pgb', dagInput ],
    [ 'dflt', dagFixed, 0.0]] )  // cfgFuel1==='chp' || 'std' || 'was'

  Vcfg( sf1Pgb, 'cv', vt.fuel.pgcv, '', cfgFuel1, [
    [ 'cat', lib.fcat.pgb.cv, [ sf1m.key ]],
    [ 'pgb', dagInput ],
    [ 'dflt', dagFixed, 0.0]] )  // cfgFuel1==='chp' || 'std' || 'was'

  Vcfg( sf1Pgb, 'ht', vt.fuel.pght, '', cfgFuel1, [
    [ 'cat', lib.fcat.pgb.ht, [ sf1m.key ]],
    [ 'pgb', dagInput ],
    [ 'dflt', dagFixed, 0.0]] )  // cfgFuel1==='chp' || 'std' || 'was'

  // The following are derived
  Vapply( sf1Pgb, 'dep', vt.fuel.depth, '',
    lib.pgb.depth, [ sf1Pgb.ht ] )

  Vapply( sf1Pgb, 'd1ld', vt.fuel.load, 'Dead Foliage',
    lib.pgb.d1ld, [ sf1Pgb.age, sf1Pgb.cv ] )
  Vapply( sf1Pgb, 'd2ld', vt.fuel.load, 'Dead 0-0.25"',
    lib.pgb.d2ld, [ sf1Pgb.age, sf1Pgb.ht ] )
  Vapply( sf1Pgb, 'd3ld', vt.fuel.load, 'Dead 0.25-1.0"',
    lib.pgb.d3ld, [ sf1Pgb.age, sf1Pgb.cv ] )
  Vapply( sf1Pgb, 'd4ld', vt.fuel.load, 'Litter"',
    lib.pgb.d4ld, [ sf1Pgb.age, sf1Pgb.ba ] )

  Vapply( sf1Pgb, 'l1ld', vt.fuel.load, 'Live Foliage',
    lib.pgb.l1ld, [ sf1Pgb.age, sf1Pgb.cv, sf1Pgb.ht ] )
  Vapply( sf1Pgb, 'l2ld', vt.fuel.load, 'Live 0-0.25"',
    lib.pgb.l2ld, [ sf1Pgb.age, sf1Pgb.ht ] )
  Vapply( sf1Pgb, 'l3ld', vt.fuel.load, 'Live 0.25-1.0"',
    lib.pgb.l3ld, [ sf1Pgb.age, sf1Pgb.ht ] )

  // The following are constant
  Vfixed( sf1Pgb, 'dmxt', vt.fuel.mext, 'Dead', 0.40 )
  Vfixed( sf1Pgb, 'heat', vt.fuel.heat, 'All Fuels', 8300.0 )
  Vfixed( sf1Pgb, 'dden', vt.fuel.dens, 'All Dead', 30.0 )
  Vfixed( sf1Pgb, 'lden', vt.fuel.dens, 'All Live', 46.0 )
  Vfixed( sf1Pgb, 'stot', vt.fuel.stot, 'All Fuel', 0.030 )
  Vfixed( sf1Pgb, 'dsef', vt.fuel.seff, 'All Dead', 0.010 )
  Vfixed( sf1Pgb, 'lsef', vt.fuel.seff, 'All Live', 0.015 )
  Vfixed( sf1Pgb, 'lfsv', vt.fuel.savr, 'Foliage', 2000.0 )
  Vfixed( sf1Pgb, 's1sv', vt.fuel.savr, '0-0.25" Stems', 350.0 )
  Vfixed( sf1Pgb, 's2sv', vt.fuel.savr, '0.25-1.0" Stems', 140.0 )
  Vfixed( sf1Pgb, 'ltsv', vt.fuel.savr, 'Litter', 2000.0 )

  //----------------------------------------------------------------------------
  // Western Aspen
  // The fuel catalog stores type and curing level
  //----------------------------------------------------------------------------

  // The following are provided by catalog or input
  Vcfg( sf1Was, 'ty', vt.fuel.waty, '', cfgFuel1, [
    [ 'cat', lib.fcat.was.ty, [ sf1m.key ]],
    [ 'was', dagInput ],
    [ 'dflt', dagFixed, 'aspen/shrub' ]] )  // cfgFuel1==='chp' || 'std' || 'pgb'

  Vcfg( sf1Was, 'cl', vt.fuel.wacl, '', cfgFuel1, [
    [ 'cat', lib.fcat.was.cl, [ sf1m.key ]],
    [ 'was', dagInput ],
    [ 'dflt', dagFixed, 0.0 ]] )  // cfgFuel1==='chp' || 'std' || 'pgb'

  // The following are derived
  Vapply( sf1Was, 'dep', vt.fuel.depth, '',
    lib.was.depth, [ sf1Was.ty ] )
  Vapply( sf1Was, 'd1ld', vt.fuel.load, 'Dead 1-h',
    lib.was.d1ld, [ sf1Was.ty, sf1Was.cl ] )
  Vapply( sf1Was, 'd2ld', vt.fuel.load, 'Dead 10-h',
    lib.was.d2ld, [ sf1Was.ty ] )

  Vapply( sf1Was, 'l1ld', vt.fuel.load, 'Live Herb',
    lib.was.l1ld, [ sf1Was.ty, sf1Was.cl ] )
  Vapply( sf1Was, 'l2ld', vt.fuel.load, 'Live Woody',
    lib.was.l2ld, [ sf1Was.ty, sf1Was.cl ] )

  Vapply( sf1Was, 'd1sv', vt.fuel.savr, 'Dead 1-h',
    lib.was.d1sv, [ sf1Was.ty, sf1Was.cl ] )
  Vapply( sf1Was, 'l2sv', vt.fuel.savr, 'Live Woody',
    lib.was.l2sv, [ sf1Was.ty, sf1Was.cl ] )
  Vapply( sf1Was, 'dld', vt.fuel.load, 'Dead',
    lib.was.dld, [ sf1Was.d1ld, sf1Was.d2ld ] )
  Vapply( sf1Was, 'lld', vt.fuel.load, 'Live',
    lib.was.lld, [ sf1Was.l1ld, sf1Was.l2ld ] )

  // The following are constant
  Vfixed( sf1Was, 'dmxt', vt.fuel.mext, 'Dead', 0.25 )
  Vfixed( sf1Was, 'd2sv', vt.fuel.savr, 'Dead 10-h', 109.0 )
  Vfixed( sf1Was, 'l1sv', vt.fuel.savr, 'Live Herb', 2800.0 )
  Vfixed( sf1Was, 'dens', vt.fuel.dens, 'All Particles', 32.0 )
  Vfixed( sf1Was, 'heat', vt.fuel.heat, 'All Particles', 8000.0 )
  Vfixed( sf1Was, 'stot', vt.fuel.stot, 'All Particles', 0.055 )
  Vfixed( sf1Was, 'seff', vt.fuel.seff, 'All Particles', 0.010 )

  //----------------------------------------------------------------------------
  // Fuel Bed and Particles
  //----------------------------------------------------------------------------

  // Chap 0.0-0.25", Pgb Foliage, Std 1-h, Was 1-h
  Vapply( sf1bdp1, 'load', vt.fuel.load, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.d1ld, sf1Pgb.d1ld, sf1Std.d1ld, sf1Was.d1ld ] )
  Vapply( sf1bdp1, 'savr', vt.fuel.savr, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.p1sv, sf1Pgb.lfsv, sf1Std.d1sv, sf1Was.d1sv ] )
  Vapply( sf1bdp1, 'heat', vt.fuel.heat, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.dht, sf1Pgb.heat, sf1Std.dht, sf1Was.heat ] )
  Vapply( sf1bdp1, 'dens', vt.fuel.dens, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.dens, sf1Pgb.dden, sf1Std.dens, sf1Was.dens ] )
  Vapply( sf1bdp1, 'stot', vt.fuel.stot, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.stot, sf1Pgb.stot, sf1Std.stot, sf1Was.stot ] )
  Vapply( sf1bdp1, 'seff', vt.fuel.seff, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.seff, sf1Pgb.dsef, sf1Std.seff, sf1Was.seff ] )
  Vapply( sf1bdp1, 'mois', vt.fuel.mois, '',
    lib.fpart.pick, [ sf1m.type, mois.dead.tl1, mois.dead.tl100, mois.dead.tl1, mois.dead.tl1 ] )

  // Chap 0.25-0.5", Pgb 0.0-0.25", Std 10-h, Was 10-h
  Vapply( sf1bdp2, 'load', vt.fuel.load, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.d2ld, sf1Pgb.d2ld, sf1Std.d10ld, sf1Was.d2ld ] )
  Vapply( sf1bdp2, 'savr', vt.fuel.savr, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.p2sv, sf1Pgb.s1sv, sf1Std.d2sv, sf1Was.d1sv ] )
  Vapply( sf1bdp2, 'heat', vt.fuel.heat, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.dht, sf1Pgb.heat, sf1Std.dht, sf1Was.heat ] )
  Vapply( sf1bdp2, 'dens', vt.fuel.dens, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.dens, sf1Pgb.dden, sf1Std.dens, sf1Was.dens ] )
  Vapply( sf1bdp2, 'stot', vt.fuel.stot, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.stot, sf1Pgb.stot, sf1Std.stot, sf1Was.stot ] )
  Vapply( sf1bdp2, 'seff', vt.fuel.seff, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.seff, sf1Pgb.dsef, sf1Std.seff, sf1Was.seff ] )
  Vapply( sf1bdp2, 'mois', vt.fuel.mois, '',
    lib.fpart.pick, [ sf1m.type, mois.dead.tl10, mois.dead.tl100, mois.dead.tl10, mois.dead.tl10 ] )

  // Chap 0.5-1.0", Pgb 0.25-1.0", Std 100-h
  Vapply( sf1bdp3, 'load', vt.fuel.load, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.d3ld, sf1Pgb.d3ld, sf1Std.d100ld, wk.noLoad ] )
  Vapply( sf1bdp3, 'savr', vt.fuel.savr, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.p3sv, sf1Pgb.s2sv, sf1Std.d3sv, wk.noSavr ] )
  Vapply( sf1bdp3, 'heat', vt.fuel.heat, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.dht, sf1Pgb.heat, sf1Std.dht, wk.noHeat ] )
  Vapply( sf1bdp3, 'dens', vt.fuel.dens, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.dens, sf1Pgb.dden, sf1Std.dens, wk.noDens ] )
  Vapply( sf1bdp3, 'stot', vt.fuel.stot, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.stot, sf1Pgb.stot, sf1Std.stot, wk.noStot ] )
  Vapply( sf1bdp3, 'seff', vt.fuel.seff, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.seff, sf1Pgb.dsef, sf1Std.seff, wk.noSeff ] )
  Vapply( sf1bdp3, 'mois', vt.fuel.mois, '',
    lib.fpart.pick, [ sf1m.type, mois.dead.tl10, mois.dead.tl100, mois.dead.tl100, wk.noMois ] )

  // Chap 1-3", Pgb Litter, Std Cured Herb
  Vapply( sf1bdp4, 'load', vt.fuel.load, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.d4ld, sf1Pgb.d4ld, sf1Std.dhld, wk.noLoad ] )
  Vapply( sf1bdp4, 'savr', vt.fuel.savr, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.p4sv, sf1Pgb.ltsv, sf1Std.hsv, wk.noSavr ] )
  Vapply( sf1bdp4, 'heat', vt.fuel.heat, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.dht, sf1Pgb.heat, sf1Std.dht, wk.noHeat ] )
  Vapply( sf1bdp4, 'dens', vt.fuel.dens, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.dens, sf1Pgb.dden, sf1Std.dens, wk.noDens ] )
  Vapply( sf1bdp4, 'stot', vt.fuel.stot, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.stot, sf1Pgb.stot, sf1Std.stot, wk.noStot ] )
  Vapply( sf1bdp4, 'seff', vt.fuel.seff, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.seff, sf1Pgb.dsef, sf1Std.seff, wk.noSeff ] )
  Vapply( sf1bdp4, 'mois', vt.fuel.mois, '',
    lib.fpart.pick, [ sf1m.type, mois.dead.tl100, mois.dead.tl100, mois.dead.tl1, wk.noMois ] )

  // The following Fuel Particle Nodes are derived
  var dead = [ sf1bdp1, sf1bdp2, sf1bdp3, sf1bdp4 ]
  for( let idx=0; idx<4; idx++ ) {
    let p = dead[idx]
    Vapply( p, 'area', vt.fuel.area, '', lib.fpart.area, [ p.load, p.savr, p.dens ] )
    Vapply( p, 'diam', vt.fuel.diam, '', lib.fpart.diam, [ p.savr ] )
    Vapply( p, 'efhn', vt.fuel.efhn, '', lib.fpart.efhn, [ p.savr ] )
    Vapply( p, 'efld', vt.fuel.efld, '', lib.fpart.efld, [ p.savr, p.load ] )
    Vapply( p, 'efwl', vt.fuel.efwl, '', lib.fpart.efwl, [ p.efld, p.mois ] )
    Vapply( p, 'pprc', vt.fuel.pprc, '', lib.fpart.pprc, [ p.load, p.dens ] )
    Vapply( p, 'qign', vt.fuel.qign, '', lib.fpart.qign, [ p.mois, p.efhn] )
    Vapply( p, 'size', vt.fuel.size, '', lib.fpart.size, [ p.savr ] )
    Vapply( p, 'volm', vt.fuel.volm, '', lib.fpart.volm, [ p.load, p.dens ] )
    Vapply( p, 'wnet', vt.fuel.wnet, '', lib.fpart.wnet, [ p.load, p.stot ] )
  }

  // CHP 0.0-0.25", PGB Foliage, STD Herb, WAS Herb
  Vapply( sf1blp1, 'load', vt.fuel.load, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.l1ld, sf1Pgb.l1ld, sf1Std.lhld, sf1Was.l1ld ] )
  Vapply( sf1blp1, 'savr', vt.fuel.savr, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.p1sv, sf1Pgb.lfsv, sf1Std.hsv, sf1Was.l1sv ] )
  Vapply( sf1blp1, 'heat', vt.fuel.heat, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.llht, sf1Pgb.heat, sf1Std.lht, sf1Was.heat ] )
  Vapply( sf1blp1, 'dens', vt.fuel.dens, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.dens, sf1Pgb.lden, sf1Std.dens, sf1Was.dens ] )
  Vapply( sf1blp1, 'stot', vt.fuel.stot, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.stot, sf1Pgb.stot, sf1Std.stot, sf1Was.stot ] )
  Vapply( sf1blp1, 'seff', vt.fuel.seff, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.seff, sf1Pgb.lsef, sf1Std.seff, sf1Was.seff ] )
  Vapply( sf1blp1, 'mois', vt.fuel.mois, '',
    lib.fpart.pick, [ sf1m.type, mois.live.stem, mois.live.herb, mois.live.herb, mois.live.herb ] )

  // CHP 0.25-0.50", PGB 0.0-0.25", STD Stem, WAS Stem
  Vapply( sf1blp2, 'load', vt.fuel.load, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.l2ld, sf1Pgb.l2ld, sf1Std.sld, sf1Was.l2ld ] )
  Vapply( sf1blp2, 'savr', vt.fuel.savr, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.p2sv, sf1Pgb.s1sv, sf1Std.ssv, sf1Was.l2sv ] )
  Vapply( sf1blp2, 'heat', vt.fuel.heat, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.lsht, sf1Pgb.heat, sf1Std.lht, sf1Was.heat ] )
  Vapply( sf1blp2, 'dens', vt.fuel.dens, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.dens, sf1Pgb.lden, sf1Std.dens, sf1Was.dens ] )
  Vapply( sf1blp2, 'stot', vt.fuel.stot, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.stot, sf1Pgb.stot, sf1Std.stot, sf1Was.stot ] )
  Vapply( sf1blp2, 'seff', vt.fuel.seff, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.seff, sf1Pgb.lsef, sf1Std.seff, sf1Was.seff ] )
  Vapply( sf1blp2, 'mois', vt.fuel.mois, '',
    lib.fpart.pick, [ sf1m.type, mois.live.stem, mois.live.stem, mois.live.stem, mois.live.stem ] )

  // CHP 0.50-1.0", PGB 0.25-1.0"
  Vapply( sf1blp3, 'load', vt.fuel.load, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.l3ld, sf1Pgb.l3ld, wk.noLoad, wk.noLoad ] )
  Vapply( sf1blp3, 'savr', vt.fuel.savr, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.p3sv, sf1Pgb.s2sv, wk.noSavr, wk.noSavr ] )
  Vapply( sf1blp3, 'heat', vt.fuel.heat, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.lsht, sf1Pgb.heat, wk.noHeat, wk.noHeat ] )
  Vapply( sf1blp3, 'dens', vt.fuel.dens, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.dens, sf1Pgb.lden, wk.noDens, wk.noDens ] )
  Vapply( sf1blp3, 'stot', vt.fuel.stot, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.stot, sf1Pgb.stot, wk.noStot, wk.noStot ] )
  Vapply( sf1blp3, 'seff', vt.fuel.seff, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.seff, sf1Pgb.lsef, wk.noSeff, wk.noSeff ] )
  Vapply( sf1blp3, 'mois', vt.fuel.mois, '',
    lib.fpart.pick, [ sf1m.type, mois.live.stem, mois.live.stem, wk.noMois, wk.noMois ] )

  // CHP 1.0-3.0"
  Vapply( sf1blp4, 'load', vt.fuel.load, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.l4ld, wk.noLoad, wk.noLoad, wk.noLoad ] )
  Vapply( sf1blp4, 'savr', vt.fuel.savr, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.p4sv, wk.noSavr, wk.noSavr, wk.noSavr ] )
  Vapply( sf1blp4, 'heat', vt.fuel.heat, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.lsht, wk.noHeat, wk.noHeat, wk.noHeat ] )
  Vapply( sf1blp4, 'dens', vt.fuel.dens, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.dens, wk.noDens, wk.noDens, wk.noDens ] )
  Vapply( sf1blp4, 'stot', vt.fuel.stot, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.stot, wk.noStot, wk.noStot, wk.noStot ] )
  Vapply( sf1blp4, 'seff', vt.fuel.seff, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.seff, wk.noSeff, wk.noSeff, wk.noSeff ] )
  Vapply( sf1blp4, 'mois', vt.fuel.mois, '',
    lib.fpart.pick, [ sf1m.type, mois.live.stem, wk.noMois, wk.noMois, wk.noMois ] )

  // CHP Leaves
  var sf1blp5Load = Vapply( sf1blp5, 'load', vt.fuel.load, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.l5ld, wk.noLoad, wk.noLoad, wk.noLoad ] )
  var sf1blp5Savr = Vapply( sf1blp5, 'savr', vt.fuel.savr, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.p5sv, wk.noSavr, wk.noSavr, wk.noSavr ] )
  Vapply( sf1blp5, 'heat', vt.fuel.heat, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.llht, wk.noHeat, wk.noHeat, wk.noHeat ] )
  Vapply( sf1blp5, 'dens', vt.fuel.dens, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.p5dn, wk.noDens, wk.noDens, wk.noDens ] )
  Vapply( sf1blp5, 'stot', vt.fuel.stot, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.stot, wk.noStot, wk.noStot, wk.noStot ] )
  Vapply( sf1blp5, 'seff', vt.fuel.seff, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.p5se, wk.noSeff, wk.noSeff, wk.noSeff ] )
  Vapply( sf1blp5, 'mois', vt.fuel.mois, '',
    lib.fpart.pick, [ sf1m.type, mois.live.herb, wk.noMois, wk.noMois, wk.noMois ] )

  // Live Fuel Particle derived properties
  var live = [ sf1blp1, sf1blp2, sf1blp3, sf1blp4, sf1blp5 ]
  for( let idx=0; idx<5; idx++ ) {
    let p = live[idx]
    Vapply( p, 'area', vt.fuel.area, '', lib.fpart.area, [ p.load, p.savr, p.dens ] )
    Vapply( p, 'diam', vt.fuel.diam, '', lib.fpart.diam, [ p.savr ] )
    Vapply( p, 'efhn', vt.fuel.efhn, '', lib.fpart.efhn, [ p.savr ] )
    Vapply( p, 'efld', vt.fuel.efld, '', lib.fpart.efll, [ p.savr, p.load ] )
    Vapply( p, 'efwl', vt.fuel.efwl, '', lib.fpart.efwl, [ p.efld, p.mois ] )
    Vapply( p, 'pprc', vt.fuel.pprc, '', lib.fpart.pprc, [ p.load, p.dens ] )
    Vapply( p, 'qign', vt.fuel.qign, '', lib.fpart.qign, [ p.mois, p.efhn] )
    Vapply( p, 'size', vt.fuel.size, '', lib.fpart.size, [ p.savr ] )
    Vapply( p, 'volm', vt.fuel.volm, '', lib.fpart.volm, [ p.load, p.dens ] )
    Vapply( p, 'wnet', vt.fuel.wnet, '', lib.fpart.wnet, [ p.load, p.stot ] )
  }

  // Life category and total fue bed surface area
  Vapply( sf1bd, 'area', vt.fuel.area, 'Total',
    lib.math.sum, [ sf1bdp1.area, sf1bdp2.area, sf1bdp3.area, sf1bdp4.area ])

  Vapply( sf1bl, 'area', 'Total', vt.fuel.area, lib.math.sum,
    [ sf1blp1.area, sf1blp2.area, sf1blp3.area, sf1blp4.area, sf1blp5.area ])

  Vapply( sf1bc, 'area', vt.fuel.area, 'Total',
    lib.math.sum, [ sf1bd.area, sf1bl.area ])

  // Life category and total fuel bed Load
  Vapply( sf1bd, 'load', vt.fuel.load, 'Total',
    lib.math.sum, [ sf1bdp1.load, sf1bdp2.load, sf1bdp3.load, sf1bdp4.load ] )

  Vapply( sf1bl, 'load', 'Total', vt.fuel.load, lib.math.sum,
  [ sf1blp1.load, sf1blp2.load, sf1blp3.load, sf1blp4.load, sf1blp5.load ] )

  Vapply( sf1bc, 'load', vt.fuel.load, 'Total',
    lib.math.sum, [ sf1bd.load, sf1bl.load ] )

  // Accumulate lifee category surface area by size class
  Vapply( sf1bd, 'swtg', vt.fuel.area, 'Size Class', lib.fbed.swtg, [
    sf1bdp1.area, sf1bdp1.size,
    sf1bdp2.area, sf1bdp2.size,
    sf1bdp3.area, sf1bdp3.size,
    sf1bdp4.area, sf1bdp4.size,
    wk.noArea, wk.noSize ])

  Vapply( sf1bl, 'swtg', vt.fuel.area, 'Size Class', lib.fbed.swtg, [
    sf1blp1.area, sf1blp1.size,
    sf1blp2.area, sf1blp2.size,
    sf1blp3.area, sf1blp3.size,
    sf1blp4.area, sf1blp4.size,
    sf1blp5.area, sf1blp5.size])

  // Particle weighting factors
  for( let idx=0; idx<4; idx++ ) {
    let p = dead[idx]
    Vapply( p, 'awtg', vt.fuel.awtg, '', lib.fpart.awtg, [ p.area, sf1bd.area ] )
    Vapply( p, 'swtg', vt.fuel.swtg, '', lib.fpart.swtg, [ p.size, sf1bd.swtg ] )
  }
  for( let idx=0; idx<5; idx++ ) {
    let p = live[idx]
    Vapply( p, 'awtg', vt.fuel.awtg, '', lib.fpart.awtg, [ p.area, sf1bl.area ] )
    Vapply( p, 'swtg', vt.fuel.swtg, '', lib.fpart.swtg, [ p.size, sf1bl.swtg ] )
  }

  // Life category effective (fine) fuel load, water load, and  moisture content
  Vapply( sf1bd, 'efld', vt.fuel.load, '',
    lib.math.sum, [ sf1bdp1.efld, sf1bdp2.efld, sf1bdp3.efld, sf1bdp4.efld ] )

  Vapply( sf1bl, 'efld', 'Total', vt.fuel.efld, lib.math.sum,
    [ sf1blp1.efld, sf1blp2.efld, sf1blp3.efld, sf1blp4.efld, sf1blp5.efld ] )

  Vapply( sf1bd, 'efwl', vt.fuel.efwl, '',
    lib.math.sum, [ sf1bdp1.efwl, sf1bdp2.efwl, sf1bdp3.efwl, sf1bdp4.efwl ] )

  Vapply( sf1bl, 'efwl', 'Total', vt.fuel.efwl, lib.math.sum,
    [ sf1blp1.efwl, sf1blp2.efwl, sf1blp3.efwl, sf1blp4.efwl, sf1blp5.efwl ] )

  Vapply( sf1bd, 'efmc', vt.fuel.efmc, '',
    lib.math.div2, [ sf1bd.efwl, sf1bd.efld ] )

  Vapply( sf1bl, 'efmc', vt.fuel.mois, '',
    lib.math.div2, [ sf1bl.efwl, sf1bl.efld ] )

  // Life category weighting factors
  Vapply( sf1bd, 'awtg', vt.fuel.awtg, '',
    lib.math.div2, [ sf1bd.area, sf1bc.area ] )

  Vapply( sf1bl, 'awtg', vt.fuel.awtg, '',
    lib.math.div2, [ sf1bl.area, sf1bc.area ] )

  // Life category weighted heat, mois, qign, savr, seff, wnet properties
  Vapply( sf1bd, 'heat', vt.fuel.heat, 'Weighted', lib.math.sumProd, [
    sf1bdp1.awtg, sf1bdp2.awtg, sf1bdp3.awtg, sf1bdp4.awtg,
    sf1bdp1.heat, sf1bdp2.heat, sf1bdp3.heat, sf1bdp4.heat ] )

  Vapply( sf1bl, 'heat', vt.fuel.heat, 'Weighted', lib.math.sumProd, [
    sf1blp1.awtg, sf1blp2.awtg, sf1blp3.awtg, sf1blp4.awtg, sf1blp5.awtg,
    sf1blp1.heat, sf1blp2.heat, sf1blp3.heat, sf1blp4.heat, sf1blp5.heat ] )

  Vapply( sf1bd, 'mois', vt.fuel.mois, 'Weighted', lib.math.sumProd, [
    sf1bdp1.awtg, sf1bdp2.awtg, sf1bdp3.awtg, sf1bdp4.awtg,
    sf1bdp1.mois, sf1bdp2.mois, sf1bdp3.mois, sf1bdp4.mois ] )

  Vapply( sf1bl, 'mois', vt.fuel.mois, 'Weighted', lib.math.sumProd, [
    sf1blp1.awtg, sf1blp2.awtg, sf1blp3.awtg, sf1blp4.awtg, sf1blp5.awtg,
    sf1blp1.mois, sf1blp2.mois, sf1blp3.mois, sf1blp4.mois, sf1blp5.mois ] )

  Vapply( sf1bd, 'qign', vt.fuel.qign, 'Weighted', lib.math.sumProd, [
    sf1bdp1.awtg, sf1bdp2.awtg, sf1bdp3.awtg, sf1bdp4.awtg,
    sf1bdp1.qign, sf1bdp2.qign, sf1bdp3.qign, sf1bdp4.qign ] )

  Vapply( sf1bl, 'qign', vt.fuel.qign, 'Weighted', lib.math.sumProd, [
    sf1blp1.awtg, sf1blp2.awtg, sf1blp3.awtg, sf1blp4.awtg, sf1blp5.awtg,
    sf1blp1.qign, sf1blp2.qign, sf1blp3.qign, sf1blp4.qign, sf1blp5.qign ] )

  Vapply( sf1bd, 'savr', vt.fuel.savr, 'Weighted', lib.math.sumProd, [
    sf1bdp1.awtg, sf1bdp2.awtg, sf1bdp3.awtg, sf1bdp4.awtg,
    sf1bdp1.savr, sf1bdp2.savr, sf1bdp3.savr, sf1bdp4.savr ] )

  Vapply( sf1bl, 'savr', vt.fuel.savr, 'Weighted', lib.math.sumProd, [
    sf1blp1.awtg, sf1blp2.awtg, sf1blp3.awtg, sf1blp4.awtg, sf1blp5.awtg,
    sf1blp1.savr, sf1blp2.savr, sf1blp3.savr, sf1blp4.savr, sf1blp5.savr ] )

  Vapply( sf1bd, 'seff', vt.fuel.seff, 'Weighted', lib.math.sumProd, [
    sf1bdp1.awtg, sf1bdp2.awtg, sf1bdp3.awtg, sf1bdp4.awtg,
    sf1bdp1.seff, sf1bdp2.seff, sf1bdp3.seff, sf1bdp4.seff ] )

  Vapply( sf1bl, 'seff', vt.fuel.seff, 'Weighted', lib.math.sumProd, [
    sf1blp1.awtg, sf1blp2.awtg, sf1blp3.awtg, sf1blp4.awtg, sf1blp5.awtg,
    sf1blp1.seff, sf1blp2.seff, sf1blp3.seff, sf1blp4.seff, sf1blp5.seff ] )

  Vapply( sf1bd, 'wnet', vt.fuel.wnet, 'Weighted', lib.math.sumProd, [
    sf1bdp1.swtg, sf1bdp2.swtg, sf1bdp3.swtg, sf1bdp4.swtg,
    sf1bdp1.wnet, sf1bdp2.wnet, sf1bdp3.wnet, sf1bdp4.wnet ] )

  Vapply( sf1bl, 'wnet', vt.fuel.wnet, 'Weighted', lib.math.sumProd, [
    sf1blp1.swtg, sf1blp2.swtg, sf1blp3.swtg, sf1blp4.swtg, sf1blp5.swtg,
    sf1blp1.wnet, sf1blp2.wnet, sf1blp3.wnet, sf1blp4.wnet, sf1blp5.wnet ] )

  // Life category extinction moisture
  Vapply( sf1bd, 'mext', vt.fuel.mext, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.dmxt, sf1Pgb.dmxt, sf1Std.dmxt, sf1Was.dmxt ] )

  Vapply( sf1bl, 'mxtk', vt.fuel.mxtk, '',
    lib.fbed.mxtk, [ sf1bd.efld, sf1bl.efld ] )

  Vapply( sf1bl, 'mext', vt.fuel.mext, '',
    lib.fbed.mext, [ sf1bl.mxtk, sf1bd.efmc, sf1bd.mext ] )

  // Life category damping coefficients
  Vapply( sf1bd, 'etam', vt.fuel.etam, '',
    lib.fbed.etam, [ sf1bd.mois, sf1bd.mext ] )

  Vapply( sf1bl, 'etam', vt.fuel.etam, '',
    lib.fbed.etam, [ sf1bl.mois, sf1bl.mext ] )

  Vapply( sf1bd, 'etas', vt.fuel.etas, '',
    lib.fbed.etas, [ sf1bd.seff ] )

  Vapply( sf1bl, 'etas', vt.fuel.etas, '',
    lib.fbed.etas, [ sf1bl.seff ] )

  // Fuel bed properties
  Vapply( sf1bc, 'depth', vt.fuel.depth, '',
    lib.fpart.pick, [ sf1m.type, sf1Chp.dep, sf1Pgb.dep, sf1Std.dep, sf1Was.dep ] )

  Vapply( sf1bc, 'bulk', vt.fuel.bulk, '',
    lib.math.div2, [ sf1bc.load, sf1bc.depth ] )

  Vapply( sf1bc, 'savr', vt.fuel.savr, 'Characteristic',
    lib.math.sumProd, [ sf1bd.awtg, sf1bl.awtg, sf1bd.savr, sf1bl.savr ] )

  Vapply( sf1bc, 'sv15', vt.fuel.sv15, '',
    lib.fbed.sv15, [ sf1bc.savr ] )

  Vapply( sf1bc, 'taur', vt.fuel.taur, '',
    lib.fbed.taur, [ sf1bc.savr ] )

  Vapply( sf1bc, 'beta', vt.fuel.beta, '', lib.fbed.beta, [
    sf1bdp1.pprc, sf1bdp2.pprc, sf1bdp3.pprc, sf1bdp4.pprc,
    sf1blp1.pprc, sf1blp2.pprc, sf1blp3.pprc, sf1blp4.pprc, sf1blp5.pprc, sf1bc.depth ] )

  Vapply( sf1bc, 'beto', vt.fuel.beto, '',
    lib.fbed.beto, [ sf1bc.savr ] )

  Vapply( sf1bc, 'betr', vt.fuel.betr, '',
  lib.math.div2, [ sf1bc.beta, sf1bc.beto ] )

  Vapply( sf1bc, 'pflx', vt.fuel.pflx, '',
    lib.fbed.pflx, [ sf1bc.savr, sf1bc.beta ] )

  Vapply( sf1bc, 'qign', vt.fuel.qign, '',
    lib.math.sumProd, [ sf1bd.awtg, sf1bl.awtg, sf1bd.qign, sf1bl.qign ] )

  Vapply( sf1bc, 'sink', vt.fuel.sink, '',
    lib.fbed.sink, [ sf1bc.qign, sf1bc.bulk ] )

  // Fuel bed reaction velocity
  Vapply( sf1bc, 'rxva', vt.fuel.rxva, '',
    lib.fbed.rxva, [ sf1bc.savr ] )

  Vapply( sf1bc, 'rxvm', vt.fuel.rxvm, '',
    lib.fbed.rxvm, [ sf1bc.sv15 ] )

  Vapply( sf1bc, 'rxvo', vt.fuel.rxvo, '',
    lib.fbed.rxvo, [ sf1bc.betr, sf1bc.rxvm, sf1bc.rxva ] )

  // Life category and total fuel bed reaction intensity
  Vapply( sf1bd, 'rxid', vt.fuel.rxid, '', lib.fbed.rxid, [
    sf1bc.rxvo, sf1bd.wnet, sf1bd.heat, sf1bd.etas ] )

  Vapply( sf1bd, 'rxi', vt.fire.rxi, '',
    lib.math.mul2, [ sf1bd.etam, sf1bd.rxid ] )

  Vapply( sf1bl, 'rxid', vt.fuel.rxid, '',
    lib.fbed.rxid, [ sf1bc.rxvo, sf1bl.wnet, sf1bl.heat, sf1bl.etas ] )

  Vapply( sf1bl, 'rxi', vt.fire.rxi, '',
    lib.math.mul2, [ sf1bl.etam, sf1bl.rxid ] )

  Vapply( sf1bc, 'rxi',  vt.fire.rxi, 'Total',
    lib.math.sum2, [ sf1bd.rxi, sf1bl.rxi ] )

  // Fuel bed fire spread rate and heat
  Vapply( sf1bc, 'ros0', vt.fuel.ros0, '',
    lib.fbed.ros0, [ sf1bc.rxi, sf1bc.pflx, sf1bc.sink ] )

  Vapply( sf1bc, 'hpua', vt.fire.hpua, '',
    lib.math.mul2, [ sf1bc.rxi, sf1bc.taur ] )

  // Fuel bed wind-slope factors
  Vapply( sf1bc, 'slpf', vt.fuel.slpf, '',
    lib.fbed.slpf, [ sf1bc.beta ] )

  Vapply( sf1bc, 'wndb', vt.fuel.wndb, '',
    lib.fbed.wndb, [ sf1bc.savr ] )

  Vapply( sf1bc, 'wndc', vt.fuel.wndc, '',
    lib.fbed.wndc, [ sf1bc.savr ] )

  Vapply( sf1bc, 'wnde', vt.fuel.wnde, '',
    lib.fbed.wnde, [ sf1bc.savr ] )

  Vapply( sf1bc, 'wndk', vt.fuel.wndk, '',
    lib.fbed.wndk, [ sf1bc.betr, sf1bc.wnde, sf1bc.wndc ] )

  Vapply( sf1bc, 'wndi', vt.fuel.wndi, '',
    lib.fbed.wndi, [ sf1bc.betr, sf1bc.wnde, sf1bc.wndc ] )

  // Fuel bed effective wind, wind coefficient, and spread rate limits
  Vapply( sf1bc, 'ewsl', vt.fuel.ewsl, '',
    lib.fbed.ewsl, [ sf1bc.rxi ] )

  Vapply( sf1bc, 'phil', vt.fuel.phil, '',
    lib.fbed.phil, [ sf1bc.ewsl, sf1bc.wndb, sf1bc.wndk ] )

  Vapply( sf1bc, 'rosl', vt.fuel.rosl, '',
    lib.fbed.rosl, [ sf1bc.ros0, sf1bc.phil ] )

  // Therse could be fuel bed or fire properties....

  // Fuel bed midflame wind speed
  Vcfg( sf1bc, 'mwaf', vt.fuel.mwaf, '', cfgWindWaf, [
    [ 'inp', dagInput ],
    [ 'dflt', lib.wind.mwafEst, [ cpy.cv, cpy.ht, cpy.fl, sf1bc.depth ]]] ) // 'est'

  Vcfg( sf1bc, 'mwsp', vt.fuel.mwsp, '', cfgWindSpeed, [
    [ 'mid', dagInput ],
    [ 'dflt', lib.wind.atMid, [ wnd.spd.at20, sf1bc.mwaf ] ]])  // 'at10' || 'at20'

  Vapply( sf1f, 'phis', vt.fire.phis, '',
    lib.surf.phis, [ slpStp.rat, sf1bc.slpf ] )

  Vapply( sf1f, 'phiw', vt.fire.phiw, '',
    lib.surf.phiw, [ sf1bc.mwsp, sf1bc.wndb, sf1bc.wndk ] )

  // Fire spread direction

  Vapply( sf1fd, 'slpros', vt.fire.ros, 'Slope Rate',
    lib.surf.spreadDirSlopeRate, [ sf1bc.ros0, sf1f.phis ] )

  Vapply( sf1fd, 'wndros', vt.fire.ros, 'Wind Rate',
    lib.surf.spreadDirWindRate, [ sf1bc.ros0, sf1f.phiw ] )

  Vapply( sf1fd, 'x', vt.fire.comp, 'X',
    lib.surf.spreadDirXComp, [ sf1fd.wndros, sf1fd.slpros, wnd.dir.hdg.up ] )

  Vapply( sf1fd, 'y', vt.fire.comp, 'Y',
    lib.surf.spreadDirYComp, [ sf1fd.wndros, wnd.dir.hdg.up ] )

  Vapply( sf1fd, 'vecros', vt.fire.ros, 'Vector Rate',
    lib.surf.spreadDirVectorRate, [ sf1fd.x, sf1fd.y ] )

  Vapply( sf1fd, 'hdup', vt.fire.hdup, '',
    lib.surf.spreadDirAzUp, [ sf1fd.x, sf1fd.y, sf1fd.vecros ] )

  Vapply( sf1fd, 'hdno', vt.fire.hdno, '',
    lib.az.sum, [ slpDir.up, sf1fd.hdup ] )

  // Step 1 - EWS, WSC, and ROS under Upslope Wind Condition

  // Calculate wind-slope coefficient (phiEw') using method 1
  Vapply( sf1f, 'phiew1', vt.fire.phiew, 'Step 1',
    lib.math.sum2, [ sf1f.phis, sf1f.phiw ] )

  // Calculate effective wind speed using method 1 from the wind-slope coefficient
  Vapply( sf1f, 'ews1', vt.fuel.ewsp, 'Step 1',
    lib.surf.ews, [ sf1f.phiew1, sf1bc.wndb, sf1bc.wndi ] )

  // Calculate maximum fire spread rate using method 1
  Vapply( sf1f, 'ros1', vt.fire.ros, 'Step 1',
    lib.surf.rosMax, [ sf1bc.ros0, sf1f.phiew1 ] )

  // Step 2 - EWS, WSC, and ROS under *Cross-slope Wind Condition* without Limits

  // Calculate maximum fire spread rate using method 2
  Vapply( sf1f, 'ros2', vt.fire.ros, 'Step 2',
    lib.surf.rosMaxCrossSlopeWind, [ sf1bc.ros0, sf1fd.vecros ] )

  // Calculate wind-slope coefficient (phiEw') using method 2
  Vapply( sf1f, 'phiew2', vt.fire.phiew, 'Step 2',
    lib.surf.phiewInferred, [ sf1bc.ros0, sf1f.ros2 ] )

  // Calculate effective wind speed using method 1 from the wind-slope coefficient
  Vapply( sf1f, 'ews2', vt.fuel.ewsp, 'Step 2',
    lib.surf.ews, [ sf1f.phiew2, sf1bc.wndb, sf1bc.wndi ] )

  // Step 3A - EWS, WSC, and ROS under Cross-slope Wind Condition
  //           with Only the Effective Wind Speed Limit Applied

  // Is the effective wind speed limit exceeded?
  Vapply( sf1f, 'ewsx', vt.fire.ewsx, '',
    lib.math.gt, [ sf1f.ews2, sf1bc.ewsl ] )

  // Effective wind speed 3A is the minimum of EWS from Step 2 and the EWS limit
  Vapply( sf1f, 'ews3a', vt.fuel.ewsp, 'Step 3a',
    Math.min, [ sf1f.ews2, sf1bc.ewsl ] )

  // Wind-slope coefficient 3A is the mimimum of WSC from Step 2 and the WSC limit
  Vapply( sf1f, 'phiew3a', vt.fire.phiew, 'Step 3a',
    Math.min, [ sf1f.phiew2, sf1bc.phil ] )

  // Maximum spread rate 3A is the minimum of ROS from Step 2 and the Max ROS limit
  Vapply( sf1f, 'ros3a', vt.fire.ros, 'Step 3a',
    Math.min, [ sf1f.ros2, sf1bc.rosl ] )

  // Step 3B - EWS, WSC, and ROS under Cross-slope Wind Condition
  //           with Only the Rate of Spread Limit Applied
  // because Pat sez fire spread rate cannot exceed the effective wind speed

  // Maximum fire spread rate is ROS and EWS from Step 2 with ros limit applied
  Vapply( sf1f, 'ros3b', vt.fire.ros, 'Step 3b',
    lib.surf.rosMaxRoslApplied, [ sf1f.ros2, sf1f.ews2 ] )

  // ROS limit is exceeded if ROS from Step 2 is greater than ROS from Step 3b
  Vapply( sf1f, 'rosx', vt.fire.rosx, '',
    lib.math.gt, [ sf1f.ros2, sf1f.ros3b ] )

  // Wind-slope coefficient must be recalculated using method 2
  Vapply( sf1f, 'phiew3b', vt.fire.phiew, 'Step 3b',
    lib.surf.phiewInferred, [ sf1bc.ros0, sf1f.ros3b ] )

  // The effective wind speed must be recalculated using method 1
  Vapply( sf1f, 'ews3b', vt.fuel.ewsp, 'Step 3b',
    lib.surf.ews, [ sf1f.phiew3b, sf1bc.wndb, sf1bc.wndi ] )

  // Step 4 - Cross-slope Wind Condition with BOTH the Effective Wnd Speed
  //          AND the Spread Rate Limits Applied

  // Apply the ROS limits to the EWS-limited spread rate
  Vapply( sf1f, 'ros4', vt.fire.ros, 'Step 4',
    lib.surf.rosMaxRoslApplied, [ sf1f.ros3a, sf1f.ews3a ] )

  // Wind-slope coefficient must be recalculated using method 2
  Vapply( sf1f, 'phiew4', vt.fire.phiew, 'Step 4',
    lib.surf.phiewInferred, [ sf1bc.ros0, sf1f.ros4 ] )

  // The effective wind speed must be recalculated using method 1
  Vapply( sf1f, 'ews4', vt.fuel.ewsp, 'Step 4',
    lib.surf.ews, [ sf1f.phiew4, sf1bc.wndb, sf1bc.wndi ] )

  // Step 5 - Final ROS, EWS, and WSC values based on client preferences

  Vcfg( sf1f, 'ros', vt.fire.ros, '', cfgFireEwsl, [
    [ 'yes', dagBound, sf1f.ros4 ],
    [ 'dflt', dagBound, sf1f.ros3b ]]) // cfgFireEwsl==='no'

  Vcfg( sf1f, 'phiew', vt.fire.phiew, '', cfgFireEwsl, [
    [ 'yes', dagBound, sf1f.phiew4 ],
    [ 'dflt', dagBound, sf1f.phiew3b ]]) // cfgFireEwsl==='no'

  Vcfg( sf1f, 'ewsp', vt.fuel.ewsp, '', cfgFireEwsl, [
    [ 'yes', dagBound, sf1f.ews4 ],
    [ 'dflt', dagBound, sf1f.ews3b ]]) // cfgFireEwsl==='no'

  Vapply( sf1f, 'fli', vt.fire.fli, '',
    lib.surf.fli, [ sf1f.ros, sf1bc.rxi, sf1bc.taur ] )

  Vapply( sf1f, 'fl', vt.fire.fl, '',
    lib.surf.fl, [ sf1f.fli ] )

  Vapply( sf1f, 'elwr', vt.fire.elwr, '',
    lib.surf.lwr, [ sf1f.ewsp ] )

  Vapply( sf1f, 'scht', vt.fire.scht, '',
    lib.surf.scorchHt, [ sf1f.fli, sf1bc.mwsp, air.tmp ] )


  //----------------------------------------------------------------------------
  // Surface Fuel & Fire
  //----------------------------------------------------------------------------

  Vinput( sf2m, 'key', vt.fuel.key )

  Vcfg( sf2m, 'type', vt.fuel.type, '', cfgFuel2, [
    [ 'none', dagFixed, 'none' ],
    [ 'std', dagFixed, 'std' ],
    [ 'chp', dagFixed, 'chp' ],
    [ 'pgb', dagFixed, 'pgb' ],
    [ 'was', dagFixed, 'was' ],
    [ 'dflt', lib.fcat.type, [ sf2m.key ]]]) // cfgFuel2==='cat'

  //----------------------------------------------------------------------------
  // Standard Fuels
  //----------------------------------------------------------------------------

  // Following are provided by catalog or input

  Vcfg( sf2Std, 'dep', vt.fuel.depth, '', cfgFuel2, [
    [ 'cat', lib.fcat.std.depth, [ sf2m.key ]],
    [ 'std', dagInput ],
    [ 'dflt', dagFixed, 0.01]] )  // cfgFuel2==='chp' || 'pgb' || 'was' || 'none'

  Vcfg( sf2Std, 'dmxt', vt.fuel.mext, 'Dead', cfgFuel2, [
    [ 'cat', lib.fcat.std.mext, [ sf2m.key ]],
    [ 'std', dagInput ],
    [ 'dflt', dagFixed, 0.01]] )  // cfgFuel2==='chp' || 'pgb' || 'was' || 'none'

  Vcfg( sf2Std, 'd1ld', vt.fuel.load, 'Dead 1-h', cfgFuel2, [
    [ 'cat', lib.fcat.std.d1ld, [ sf2m.key ]],
    [ 'std', dagInput ],
    [ 'dflt', dagFixed, 0.0]] )  // cfgFuel2==='chp' || 'pgb' || 'was' || 'none'

  Vcfg( sf2Std, 'd10ld', vt.fuel.load, 'Dead 10-h', cfgFuel2, [
    [ 'cat', lib.fcat.std.d10ld, [ sf2m.key ]],
    [ 'std', dagInput ],
    [ 'dflt', dagFixed, 0.0]] )  // cfgFuel2==='chp' || 'pgb' || 'was' || 'none'

  Vcfg( sf2Std, 'd100ld', vt.fuel.load, 'Dead 100-h', cfgFuel2, [
    [ 'cat', lib.fcat.std.d100ld, [ sf2m.key ]],
    [ 'std', dagInput ],
    [ 'dflt', dagFixed, 0.0]] )  // cfgFuel2==='chp' || 'pgb' || 'was' || 'none'

  Vcfg( sf2Std, 'hld', vt.fuel.load, 'Total Herbaceous', cfgFuel2, [
    [ 'cat', lib.fcat.std.hld, [ sf2m.key ]],
    [ 'std', dagInput ],
    [ 'dflt', dagFixed, 0.0]] )  // cfgFuel2==='chp' || 'pgb' || 'was' || 'none'

  Vcfg( sf2Std, 'sld', vt.fuel.load, 'Live Stem Wood', cfgFuel2, [
    [ 'cat', lib.fcat.std.sld, [ sf2m.key ]],
    [ 'std', dagInput ],
    [ 'dflt', dagFixed, 0.0]] )  // cfgFuel2==='chp' || 'pgb' || 'was' || 'none'

  Vcfg( sf2Std, 'd1sv', vt.fuel.savr, 'Dead 1-h', cfgFuel2, [
    [ 'cat', lib.fcat.std.d1sv, [ sf2m.key ]],
    [ 'std', dagInput ],
    [ 'dflt', dagFixed, 1.0]] )  // cfgFuel2==='chp' || 'pgb' || 'was' || 'none'

  Vcfg( sf2Std, 'hsv', vt.fuel.savr, 'Herbaceous', cfgFuel2, [
    [ 'cat', lib.fcat.std.hsv, [ sf2m.key ]],
    [ 'std', dagInput ],
    [ 'dflt', dagFixed, 1.0]] )  // cfgFuel2==='chp' || 'pgb' || 'was' || 'none'

  Vcfg( sf2Std, 'ssv', vt.fuel.savr, 'Stem Wood', cfgFuel2, [
    [ 'cat', lib.fcat.std.ssv, [ sf2m.key ]],
    [ 'std', dagInput ],
    [ 'dflt', dagFixed, 1.0]] )  // cfgFuel2==='chp' || 'pgb' || 'was' || 'none'

  Vcfg( sf2Std, 'dht', vt.fuel.heat, 'Dead', cfgFuel2, [
    [ 'cat', lib.fcat.std.dht, [ sf2m.key ]],
    [ 'std', dagInput ],
    [ 'dflt', dagFixed, 8000.0]] )  // cfgFuel2==='chp' || 'pgb' || 'was' || 'none'

  Vcfg( sf2Std, 'lht', vt.fuel.heat, 'Live', cfgFuel2, [
    [ 'cat', lib.fcat.std.lht, [ sf2m.key ]],
    [ 'std', dagInput ],
    [ 'dflt', dagFixed, 8000.0]] )  // cfgFuel2==='chp' || 'pgb' || 'was' || 'none'

  // Following are derived
  Vcfg( sf2Std, 'hcf', vt.fuel.hcf, '', cfgHcf, [
    [ 'est', lib.std.hcf, [ mois.live.herb ] ],
    [ 'dflt', dagInput ]]) // cfgHcf==='inp'

  Vapply( sf2Std, 'dhld', vt.fuel.load, 'Dead Herb',
    lib.std.dhld, [ sf2Std.hcf, sf2Std.hld ] )

  Vapply( sf2Std, 'lhld', vt.fuel.load, 'Live Herb',
    lib.std.lhld, [ sf2Std.hcf, sf2Std.hld ] )

  Vapply( sf2Std, 'dld', vt.fuel.load, 'Dead',
    lib.std.dld, [ sf2Std.d1ld, sf2Std.d10ld, sf2Std.d100ld, sf2Std.dhld ] )

  Vapply( sf2Std, 'lld', vt.fuel.load, 'Live',
    lib.std.lld, [ sf2Std.lhld, sf2Std.sld ] )

  // Following are constant
  Vfixed( sf2Std, 'd2sv', vt.fuel.savr, 'Dead 10-h', 109.0 )
  Vfixed( sf2Std, 'd3sv', vt.fuel.savr, 'Dead 100-h', 30.0 )
  Vfixed( sf2Std, 'dens', vt.fuel.dens, 'All Particle', 32.0 )
  Vfixed( sf2Std, 'seff', vt.fuel.seff, 'All Particle', 0.01 )
  Vfixed( sf2Std, 'stot', vt.fuel.stot, 'All Particle', 0.0555 )

  //----------------------------------------------------------------------------
  // Chaparral Fuels
  // The fuel catalog stores depth, total load, and dead fraction
  //----------------------------------------------------------------------------

  // Following are provided by catalog or input

  Vcfg( sf2Chp, 'dep', vt.fuel.depth, '', cfgFuel2, [
    [ 'cat', lib.fcat.chp.depth, [ sf2m.key ]],
    [ 'chp', dagInput ],
    [ 'dflt', dagFixed, 0.01]] )  // cfgFuel2==='std' || 'pgb' || 'was' || 'none'

  Vcfg( sf2Chp, 'df', vt.fuel.chdf, '', cfgFuel2, [
    [ 'cat', lib.fcat.chp.df, [ sf2m.key ]],
    [ 'chp', dagInput ],
    [ 'dflt', dagFixed, 0.0]] )  // cfgFuel2==='std' || 'pgb' || 'was' || 'none'

  Vcfg( sf2Chp, 'ld', vt.fuel.load, 'Total', cfgFuel2, [
    [ 'cat', lib.fcat.chp.ld, [ sf2m.key ]],
    [ 'chp', dagInput ],
    [ 'dflt', dagFixed, 0.0]] )  // cfgFuel2==='chp' || 'pgb' || 'was' || 'none'

  Vinput( sf2Chp, 'ty', vt.fuel.chty, '', 'chamise' )

  // Following are derived
  Vapply( sf2Chp, 'age', vt.fuel.chag, '',
    lib.chp.age, [ sf2Chp.dep, sf2Chp.ty ] )

  Vapply( sf2Chp, 'eld', vt.fuel.load, 'Estimated Total',
    lib.chp.ld, [ sf2Chp.age, sf2Chp.ty ] )

  Vcfg( sf2Chp, 'ald', vt.fuel.load, 'Applied Total', cfgChapLoad, [
    [ 'est', dagBound, sf2Chp.eld ],
    [ 'dflt', dagBound, sf2Chp.ld ]])  // cfgChapLoad==='inp'

  Vapply( sf2Chp, 'dld', vt.fuel.load, 'Dead',
    lib.chp.dld, [ sf2Chp.ald, sf2Chp.df ] )
  Vapply( sf2Chp, 'd1ld', vt.fuel.load, 'Dead 0.01 - 0.25',
    lib.chp.d1ld, [ sf2Chp.ald, sf2Chp.df ] )
  Vapply( sf2Chp, 'd2ld', vt.fuel.load, 'Dead 0.25 - 0.50',
    lib.chp.d2ld, [ sf2Chp.ald, sf2Chp.df ] )
  Vapply( sf2Chp, 'd3ld', vt.fuel.load, 'Dead 0.50 - 1.0',
    lib.chp.d3ld, [ sf2Chp.ald, sf2Chp.df ] )
  Vapply( sf2Chp, 'd4ld', vt.fuel.load, 'Dead 1.0 - 3.0',
    lib.chp.d4ld, [ sf2Chp.ald, sf2Chp.df ] )

  Vapply( sf2Chp, 'lld', vt.fuel.load, 'Live',
    lib.chp.lld, [ sf2Chp.ald, sf2Chp.df ] )
  Vapply( sf2Chp, 'l1ld', vt.fuel.load, 'Live 0.01 - 0.25',
    lib.chp.l1ld, [ sf2Chp.ald, sf2Chp.df ] )
  Vapply( sf2Chp, 'l2ld', vt.fuel.load, 'Live 0.25 - 0.50',
    lib.chp.l2ld, [ sf2Chp.ald, sf2Chp.df ] )
  Vapply( sf2Chp, 'l3ld', vt.fuel.load, 'Live 0.50 - 1.0',
    lib.chp.l3ld, [ sf2Chp.ald, sf2Chp.df ] )
  Vapply( sf2Chp, 'l4ld', vt.fuel.load, 'Live 1.0 - 3.0',
    lib.chp.l4ld, [ sf2Chp.ald, sf2Chp.df ] )
  Vapply( sf2Chp, 'l5ld', vt.fuel.load, 'Live Leaves',
    lib.chp.l5ld, [ sf2Chp.ald, sf2Chp.df ] )

  // This will be a function that returns 0.65 for chamise and 0.74 for mixed chaparral
  // var sf2Chp.lmxt = Vapply( sf2Chp, 'lmxt', vt.fuel.mext, 'Live',
  //   lib.chp.lmxt, [ sf2] )

  // The following are constant
  Vfixed( sf2Chp, 'dmxt', vt.fuel.mext, 'Dead', 0.30 )
  Vfixed( sf2Chp, 'p1sv', vt.fuel.savr, '0.01 - 0.25', 640.0 )
  Vfixed( sf2Chp, 'p2sv', vt.fuel.savr, '0.25 - 0.50', 127.0 )
  Vfixed( sf2Chp, 'p3sv', vt.fuel.savr, '0.50 - 1.0', 61.0 )
  Vfixed( sf2Chp, 'p4sv', vt.fuel.savr, '1.0 - 3.0', 27.0 )
  Vfixed( sf2Chp, 'p5sv', vt.fuel.savr, 'Live Leaves', 2200.0 )
  Vfixed( sf2Chp, 'stot', vt.fuel.stot, 'All Particles', 0.055 )
  Vfixed( sf2Chp, 'seff', vt.fuel.seff, 'All Stemwood', 0.015 )
  Vfixed( sf2Chp, 'p5se', vt.fuel.seff, 'Live Leaves', 0.035 )
  Vfixed( sf2Chp, 'dens', vt.fuel.dens, 'All Stemwood', 46.0 )
  Vfixed( sf2Chp, 'p5dn', vt.fuel.dens, 'Live Leaves', 32.0 )
  Vfixed( sf2Chp, 'dht',  vt.fuel.heat, 'All Dead', 8000.0 )
  Vfixed( sf2Chp, 'llht', vt.fuel.heat, 'Live Leaf and Live 0-0.25', 10500.0 )
  Vfixed( sf2Chp, 'lsht', vt.fuel.heat, 'Live Stemwood 0.25-3.0', 9500.0 )

  //----------------------------------------------------------------------------
  // Palmetto-Gallberry Fuels
  // The fuel catalog stores age, basal area, cover, and height
  //----------------------------------------------------------------------------

  // The following are provided by the catalog or input
  Vcfg( sf2Pgb, 'age', vt.fuel.pgag, '', cfgFuel2, [
    [ 'cat', lib.fcat.pgb.age, [ sf2m.key ]],
    [ 'pgb', dagInput ],
    [ 'dflt', dagFixed, 0.0]] )  // cfgFuel2==='chp' || 'std' || 'was' || 'none'

  Vcfg( sf2Pgb, 'ba', vt.fuel.pgba, '', cfgFuel2, [
    [ 'cat', lib.fcat.pgb.ba, [ sf2m.key ]],
    [ 'pgb', dagInput ],
    [ 'dflt', dagFixed, 0.0]] )  // cfgFuel2==='chp' || 'std' || 'was' || 'none'

  Vcfg( sf2Pgb, 'cv', vt.fuel.pgcv, '', cfgFuel2, [
    [ 'cat', lib.fcat.pgb.cv, [ sf2m.key ]],
    [ 'pgb', dagInput ],
    [ 'dflt', dagFixed, 0.0]] )  // cfgFuel2==='chp' || 'std' || 'was' || 'none'

  Vcfg( sf2Pgb, 'ht', vt.fuel.pght, '', cfgFuel2, [
    [ 'cat', lib.fcat.pgb.ht, [ sf2m.key ]],
    [ 'pgb', dagInput ],
    [ 'dflt', dagFixed, 0.0]] )  // cfgFuel2==='chp' || 'std' || 'was' || 'none'

  // The following are derived
  Vapply( sf2Pgb, 'dep', vt.fuel.depth, '',
    lib.pgb.depth, [ sf2Pgb.ht ] )

  Vapply( sf2Pgb, 'd1ld', vt.fuel.load, 'Dead Foliage',
    lib.pgb.d1ld, [ sf2Pgb.age, sf2Pgb.cv ] )
  Vapply( sf2Pgb, 'd2ld', vt.fuel.load, 'Dead 0-0.25"',
    lib.pgb.d2ld, [ sf2Pgb.age, sf2Pgb.ht ] )
  Vapply( sf2Pgb, 'd3ld', vt.fuel.load, 'Dead 0.25-1.0"',
    lib.pgb.d3ld, [ sf2Pgb.age, sf2Pgb.cv ] )
  Vapply( sf2Pgb, 'd4ld', vt.fuel.load, 'Litter"',
    lib.pgb.d4ld, [ sf2Pgb.age, sf2Pgb.ba ] )

  Vapply( sf2Pgb, 'l1ld', vt.fuel.load, 'Live Foliage',
    lib.pgb.l1ld, [ sf2Pgb.age, sf2Pgb.cv, sf2Pgb.ht ] )
  Vapply( sf2Pgb, 'l2ld', vt.fuel.load, 'Live 0-0.25"',
    lib.pgb.l2ld, [ sf2Pgb.age, sf2Pgb.ht ] )
  Vapply( sf2Pgb, 'l3ld', vt.fuel.load, 'Live 0.25-1.0"',
    lib.pgb.l3ld, [ sf2Pgb.age, sf2Pgb.ht ] )

  // The following are constant
  Vfixed( sf2Pgb, 'dmxt', vt.fuel.mext, 'Dead', 0.40 )
  Vfixed( sf2Pgb, 'heat', vt.fuel.heat, 'All Fuels', 8300.0 )
  Vfixed( sf2Pgb, 'dden', vt.fuel.dens, 'All Dead', 30.0 )
  Vfixed( sf2Pgb, 'lden', vt.fuel.dens, 'All Live', 46.0 )
  Vfixed( sf2Pgb, 'stot', vt.fuel.stot, 'All Fuel', 0.030 )
  Vfixed( sf2Pgb, 'dsef', vt.fuel.seff, 'All Dead', 0.010 )
  Vfixed( sf2Pgb, 'lsef', vt.fuel.seff, 'All Live', 0.015 )
  Vfixed( sf2Pgb, 'lfsv', vt.fuel.savr, 'Foliage', 2000.0 )
  Vfixed( sf2Pgb, 's1sv', vt.fuel.savr, '0-0.25" Stems', 350.0 )
  Vfixed( sf2Pgb, 's2sv', vt.fuel.savr, '0.25-1.0" Stems', 140.0 )
  Vfixed( sf2Pgb, 'ltsv', vt.fuel.savr, 'Litter', 2000.0 )

  //----------------------------------------------------------------------------
  // Western Aspen
  // The fuel catalog stores type and curing level
  //----------------------------------------------------------------------------

  // The following are provided by catalog or input
  Vcfg( sf2Was, 'ty', vt.fuel.waty, '', cfgFuel2, [
    [ 'cat', lib.fcat.was.ty, [ sf2m.key ]],
    [ 'was', dagInput ],
    [ 'dflt', dagFixed, 'aspen/shrub' ]] )  // cfgFuel2==='chp' || 'std' || 'pgb' || 'none'

  Vcfg( sf2Was, 'cl', vt.fuel.wacl, '', cfgFuel2, [
    [ 'cat', lib.fcat.was.cl, [ sf2m.key ]],
    [ 'was', dagInput ],
    [ 'dflt', dagFixed, 0.0 ]] )  // cfgFuel2==='chp' || 'std' || 'pgb' || 'none'

  // The following are derived
  Vapply( sf2Was, 'dep', vt.fuel.depth, '',
    lib.was.depth, [ sf2Was.ty ] )
  Vapply( sf2Was, 'd1ld', vt.fuel.load, 'Dead 1-h',
    lib.was.d1ld, [ sf2Was.ty, sf2Was.cl ] )
  Vapply( sf2Was, 'd2ld', vt.fuel.load, 'Dead 10-h',
    lib.was.d2ld, [ sf2Was.ty ] )

  Vapply( sf2Was, 'l1ld', vt.fuel.load, 'Live Herb',
    lib.was.l1ld, [ sf2Was.ty, sf2Was.cl ] )
  Vapply( sf2Was, 'l2ld', vt.fuel.load, 'Live Woody',
    lib.was.l2ld, [ sf2Was.ty, sf2Was.cl ] )

  Vapply( sf2Was, 'd1sv', vt.fuel.savr, 'Dead 1-h',
    lib.was.d1sv, [ sf2Was.ty, sf2Was.cl ] )
  Vapply( sf2Was, 'l2sv', vt.fuel.savr, 'Live Woody',
    lib.was.l2sv, [ sf2Was.ty, sf2Was.cl ] )
  Vapply( sf2Was, 'dld', vt.fuel.load, 'Dead',
    lib.was.dld, [ sf2Was.d1ld, sf2Was.d2ld ] )
  Vapply( sf2Was, 'lld', vt.fuel.load, 'Live',
    lib.was.lld, [ sf2Was.l1ld, sf2Was.l2ld ] )

  // The following are constant
  Vfixed( sf2Was, 'dmxt', vt.fuel.mext, 'Dead', 0.25 )
  Vfixed( sf2Was, 'd2sv', vt.fuel.savr, 'Dead 10-h', 109.0 )
  Vfixed( sf2Was, 'l1sv', vt.fuel.savr, 'Live Herb', 2800.0 )
  Vfixed( sf2Was, 'dens', vt.fuel.dens, 'All Particles', 32.0 )
  Vfixed( sf2Was, 'heat', vt.fuel.heat, 'All Particles', 8000.0 )
  Vfixed( sf2Was, 'stot', vt.fuel.stot, 'All Particles', 0.055 )
  Vfixed( sf2Was, 'seff', vt.fuel.seff, 'All Particles', 0.010 )

  //----------------------------------------------------------------------------
  // Fuel Bed and Particles
  //----------------------------------------------------------------------------

  // Chap 0.0-0.25", Pgb Foliage, Std 1-h, Was 1-h
  Vapply( sf2bdp1, 'load', vt.fuel.load, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.d1ld, sf2Pgb.d1ld, sf2Std.d1ld, sf2Was.d1ld ] )
  Vapply( sf2bdp1, 'savr', vt.fuel.savr, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.p1sv, sf2Pgb.lfsv, sf2Std.d1sv, sf2Was.d1sv ] )
  Vapply( sf2bdp1, 'heat', vt.fuel.heat, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.dht, sf2Pgb.heat, sf2Std.dht, sf2Was.heat ] )
  Vapply( sf2bdp1, 'dens', vt.fuel.dens, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.dens, sf2Pgb.dden, sf2Std.dens, sf2Was.dens ] )
  Vapply( sf2bdp1, 'stot', vt.fuel.stot, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.stot, sf2Pgb.stot, sf2Std.stot, sf2Was.stot ] )
  Vapply( sf2bdp1, 'seff', vt.fuel.seff, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.seff, sf2Pgb.dsef, sf2Std.seff, sf2Was.seff ] )
  Vapply( sf2bdp1, 'mois', vt.fuel.mois, '',
    lib.fpart.pick, [ sf2m.type, mois.dead.tl1, mois.dead.tl100, mois.dead.tl1, mois.dead.tl1 ] )

  // Chap 0.25-0.5", Pgb 0.0-0.25", Std 10-h, Was 10-h
  Vapply( sf2bdp2, 'load', vt.fuel.load, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.d2ld, sf2Pgb.d2ld, sf2Std.d10ld, sf2Was.d2ld ] )
  Vapply( sf2bdp2, 'savr', vt.fuel.savr, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.p2sv, sf2Pgb.s1sv, sf2Std.d2sv, sf2Was.d1sv ] )
  Vapply( sf2bdp2, 'heat', vt.fuel.heat, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.dht, sf2Pgb.heat, sf2Std.dht, sf2Was.heat ] )
  Vapply( sf2bdp2, 'dens', vt.fuel.dens, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.dens, sf2Pgb.dden, sf2Std.dens, sf2Was.dens ] )
  Vapply( sf2bdp2, 'stot', vt.fuel.stot, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.stot, sf2Pgb.stot, sf2Std.stot, sf2Was.stot ] )
  Vapply( sf2bdp2, 'seff', vt.fuel.seff, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.seff, sf2Pgb.dsef, sf2Std.seff, sf2Was.seff ] )
  Vapply( sf2bdp2, 'mois', vt.fuel.mois, '',
    lib.fpart.pick, [ sf2m.type, mois.dead.tl10, mois.dead.tl100, mois.dead.tl10, mois.dead.tl10 ] )

  // Chap 0.5-1.0", Pgb 0.25-1.0", Std 100-h
  Vapply( sf2bdp3, 'load', vt.fuel.load, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.d3ld, sf2Pgb.d3ld, sf2Std.d100ld, wk.noLoad ] )
  Vapply( sf2bdp3, 'savr', vt.fuel.savr, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.p3sv, sf2Pgb.s2sv, sf2Std.d3sv, wk.noSavr ] )
  Vapply( sf2bdp3, 'heat', vt.fuel.heat, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.dht, sf2Pgb.heat, sf2Std.dht, wk.noHeat ] )
  Vapply( sf2bdp3, 'dens', vt.fuel.dens, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.dens, sf2Pgb.dden, sf2Std.dens, wk.noDens ] )
  Vapply( sf2bdp3, 'stot', vt.fuel.stot, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.stot, sf2Pgb.stot, sf2Std.stot, wk.noStot ] )
  Vapply( sf2bdp3, 'seff', vt.fuel.seff, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.seff, sf2Pgb.dsef, sf2Std.seff, wk.noSeff ] )
  Vapply( sf2bdp3, 'mois', vt.fuel.mois, '',
    lib.fpart.pick, [ sf2m.type, mois.dead.tl10, mois.dead.tl100, mois.dead.tl100, wk.noMois ] )

  // Chap 1-3", Pgb Litter, Std Cured Herb
  Vapply( sf2bdp4, 'load', vt.fuel.load, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.d4ld, sf2Pgb.d4ld, sf2Std.dhld, wk.noLoad ] )
  Vapply( sf2bdp4, 'savr', vt.fuel.savr, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.p4sv, sf2Pgb.ltsv, sf2Std.hsv, wk.noSavr ] )
  Vapply( sf2bdp4, 'heat', vt.fuel.heat, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.dht, sf2Pgb.heat, sf2Std.dht, wk.noHeat ] )
  Vapply( sf2bdp4, 'dens', vt.fuel.dens, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.dens, sf2Pgb.dden, sf2Std.dens, wk.noDens ] )
  Vapply( sf2bdp4, 'stot', vt.fuel.stot, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.stot, sf2Pgb.stot, sf2Std.stot, wk.noStot ] )
  Vapply( sf2bdp4, 'seff', vt.fuel.seff, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.seff, sf2Pgb.dsef, sf2Std.seff, wk.noSeff ] )
  Vapply( sf2bdp4, 'mois', vt.fuel.mois, '',
    lib.fpart.pick, [ sf2m.type, mois.dead.tl100, mois.dead.tl100, mois.dead.tl1, wk.noMois ] )

  // The following Fuel Particle Nodes are derived
  var dead = [ sf2bdp1, sf2bdp2, sf2bdp3, sf2bdp4 ]
  for( let idx=0; idx<4; idx++ ) {
    let p = dead[idx]
    Vapply( p, 'area', vt.fuel.area, '', lib.fpart.area, [ p.load, p.savr, p.dens ] )
    Vapply( p, 'diam', vt.fuel.diam, '', lib.fpart.diam, [ p.savr ] )
    Vapply( p, 'efhn', vt.fuel.efhn, '', lib.fpart.efhn, [ p.savr ] )
    Vapply( p, 'efld', vt.fuel.efld, '', lib.fpart.efld, [ p.savr, p.load ] )
    Vapply( p, 'efwl', vt.fuel.efwl, '', lib.fpart.efwl, [ p.efld, p.mois ] )
    Vapply( p, 'pprc', vt.fuel.pprc, '', lib.fpart.pprc, [ p.load, p.dens ] )
    Vapply( p, 'qign', vt.fuel.qign, '', lib.fpart.qign, [ p.mois, p.efhn] )
    Vapply( p, 'size', vt.fuel.size, '', lib.fpart.size, [ p.savr ] )
    Vapply( p, 'volm', vt.fuel.volm, '', lib.fpart.volm, [ p.load, p.dens ] )
    Vapply( p, 'wnet', vt.fuel.wnet, '', lib.fpart.wnet, [ p.load, p.stot ] )
  }

  // CHP 0.0-0.25", PGB Foliage, STD Herb, WAS Herb
  Vapply( sf2blp1, 'load', vt.fuel.load, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.l1ld, sf2Pgb.l1ld, sf2Std.lhld, sf2Was.l1ld ] )
  Vapply( sf2blp1, 'savr', vt.fuel.savr, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.p1sv, sf2Pgb.lfsv, sf2Std.hsv, sf2Was.l1sv ] )
  Vapply( sf2blp1, 'heat', vt.fuel.heat, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.llht, sf2Pgb.heat, sf2Std.lht, sf2Was.heat ] )
  Vapply( sf2blp1, 'dens', vt.fuel.dens, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.dens, sf2Pgb.lden, sf2Std.dens, sf2Was.dens ] )
  Vapply( sf2blp1, 'stot', vt.fuel.stot, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.stot, sf2Pgb.stot, sf2Std.stot, sf2Was.stot ] )
  Vapply( sf2blp1, 'seff', vt.fuel.seff, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.seff, sf2Pgb.lsef, sf2Std.seff, sf2Was.seff ] )
  Vapply( sf2blp1, 'mois', vt.fuel.mois, '',
    lib.fpart.pick, [ sf2m.type, mois.live.stem, mois.live.herb, mois.live.herb, mois.live.herb ] )

  // CHP 0.25-0.50", PGB 0.0-0.25", STD Stem, WAS Stem
  Vapply( sf2blp2, 'load', vt.fuel.load, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.l2ld, sf2Pgb.l2ld, sf2Std.sld, sf2Was.l2ld ] )
  Vapply( sf2blp2, 'savr', vt.fuel.savr, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.p2sv, sf2Pgb.s1sv, sf2Std.ssv, sf2Was.l2sv ] )
  Vapply( sf2blp2, 'heat', vt.fuel.heat, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.lsht, sf2Pgb.heat, sf2Std.lht, sf2Was.heat ] )
  Vapply( sf2blp2, 'dens', vt.fuel.dens, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.dens, sf2Pgb.lden, sf2Std.dens, sf2Was.dens ] )
  Vapply( sf2blp2, 'stot', vt.fuel.stot, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.stot, sf2Pgb.stot, sf2Std.stot, sf2Was.stot ] )
  Vapply( sf2blp2, 'seff', vt.fuel.seff, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.seff, sf2Pgb.lsef, sf2Std.seff, sf2Was.seff ] )
  Vapply( sf2blp2, 'mois', vt.fuel.mois, '',
    lib.fpart.pick, [ sf2m.type, mois.live.stem, mois.live.stem, mois.live.stem, mois.live.stem ] )

  // CHP 0.50-1.0", PGB 0.25-1.0"
  Vapply( sf2blp3, 'load', vt.fuel.load, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.l3ld, sf2Pgb.l3ld, wk.noLoad, wk.noLoad ] )
  Vapply( sf2blp3, 'savr', vt.fuel.savr, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.p3sv, sf2Pgb.s2sv, wk.noSavr, wk.noSavr ] )
  Vapply( sf2blp3, 'heat', vt.fuel.heat, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.lsht, sf2Pgb.heat, wk.noHeat, wk.noHeat ] )
  Vapply( sf2blp3, 'dens', vt.fuel.dens, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.dens, sf2Pgb.lden, wk.noDens, wk.noDens ] )
  Vapply( sf2blp3, 'stot', vt.fuel.stot, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.stot, sf2Pgb.stot, wk.noStot, wk.noStot ] )
  Vapply( sf2blp3, 'seff', vt.fuel.seff, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.seff, sf2Pgb.lsef, wk.noSeff, wk.noSeff ] )
  Vapply( sf2blp3, 'mois', vt.fuel.mois, '',
    lib.fpart.pick, [ sf2m.type, mois.live.stem, mois.live.stem, wk.noMois, wk.noMois ] )

  // CHP 1.0-3.0"
  Vapply( sf2blp4, 'load', vt.fuel.load, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.l4ld, wk.noLoad, wk.noLoad, wk.noLoad ] )
  Vapply( sf2blp4, 'savr', vt.fuel.savr, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.p4sv, wk.noSavr, wk.noSavr, wk.noSavr ] )
  Vapply( sf2blp4, 'heat', vt.fuel.heat, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.lsht, wk.noHeat, wk.noHeat, wk.noHeat ] )
  Vapply( sf2blp4, 'dens', vt.fuel.dens, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.dens, wk.noDens, wk.noDens, wk.noDens ] )
  Vapply( sf2blp4, 'stot', vt.fuel.stot, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.stot, wk.noStot, wk.noStot, wk.noStot ] )
  Vapply( sf2blp4, 'seff', vt.fuel.seff, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.seff, wk.noSeff, wk.noSeff, wk.noSeff ] )
  Vapply( sf2blp4, 'mois', vt.fuel.mois, '',
    lib.fpart.pick, [ sf2m.type, mois.live.stem, wk.noMois, wk.noMois, wk.noMois ] )

  // CHP Leaves
  var sf2blp5Load = Vapply( sf2blp5, 'load', vt.fuel.load, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.l5ld, wk.noLoad, wk.noLoad, wk.noLoad ] )
  var sf2blp5Savr = Vapply( sf2blp5, 'savr', vt.fuel.savr, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.p5sv, wk.noSavr, wk.noSavr, wk.noSavr ] )
  Vapply( sf2blp5, 'heat', vt.fuel.heat, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.llht, wk.noHeat, wk.noHeat, wk.noHeat ] )
  Vapply( sf2blp5, 'dens', vt.fuel.dens, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.p5dn, wk.noDens, wk.noDens, wk.noDens ] )
  Vapply( sf2blp5, 'stot', vt.fuel.stot, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.stot, wk.noStot, wk.noStot, wk.noStot ] )
  Vapply( sf2blp5, 'seff', vt.fuel.seff, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.p5se, wk.noSeff, wk.noSeff, wk.noSeff ] )
  Vapply( sf2blp5, 'mois', vt.fuel.mois, '',
    lib.fpart.pick, [ sf2m.type, mois.live.herb, wk.noMois, wk.noMois, wk.noMois ] )

  // Live Fuel Particle derived properties
  var live = [ sf2blp1, sf2blp2, sf2blp3, sf2blp4, sf2blp5 ]
  for( let idx=0; idx<5; idx++ ) {
    let p = live[idx]
    Vapply( p, 'area', vt.fuel.area, '', lib.fpart.area, [ p.load, p.savr, p.dens ] )
    Vapply( p, 'diam', vt.fuel.diam, '', lib.fpart.diam, [ p.savr ] )
    Vapply( p, 'efhn', vt.fuel.efhn, '', lib.fpart.efhn, [ p.savr ] )
    Vapply( p, 'efld', vt.fuel.efld, '', lib.fpart.efll, [ p.savr, p.load ] )
    Vapply( p, 'efwl', vt.fuel.efwl, '', lib.fpart.efwl, [ p.efld, p.mois ] )
    Vapply( p, 'pprc', vt.fuel.pprc, '', lib.fpart.pprc, [ p.load, p.dens ] )
    Vapply( p, 'qign', vt.fuel.qign, '', lib.fpart.qign, [ p.mois, p.efhn] )
    Vapply( p, 'size', vt.fuel.size, '', lib.fpart.size, [ p.savr ] )
    Vapply( p, 'volm', vt.fuel.volm, '', lib.fpart.volm, [ p.load, p.dens ] )
    Vapply( p, 'wnet', vt.fuel.wnet, '', lib.fpart.wnet, [ p.load, p.stot ] )
  }

  // Life category and total fue bed surface area
  Vapply( sf2bd, 'area', vt.fuel.area, 'Total',
    lib.math.sum, [ sf2bdp1.area, sf2bdp2.area, sf2bdp3.area, sf2bdp4.area ])

  Vapply( sf2bl, 'area', 'Total', vt.fuel.area, lib.math.sum,
    [ sf2blp1.area, sf2blp2.area, sf2blp3.area, sf2blp4.area, sf2blp5.area ])

  Vapply( sf2bc, 'area', vt.fuel.area, 'Total',
    lib.math.sum, [ sf2bd.area, sf2bl.area ])

  // Life category and total fuel bed Load
  Vapply( sf2bd, 'load', vt.fuel.load, 'Total',
    lib.math.sum, [ sf2bdp1.load, sf2bdp2.load, sf2bdp3.load, sf2bdp4.load ] )

  Vapply( sf2bl, 'load', 'Total', vt.fuel.load, lib.math.sum,
  [ sf2blp1.load, sf2blp2.load, sf2blp3.load, sf2blp4.load, sf2blp5.load ] )

  Vapply( sf2bc, 'load', vt.fuel.load, 'Total',
    lib.math.sum, [ sf2bd.load, sf2bl.load ] )

  // Accumulate lifee category surface area by size class
  Vapply( sf2bd, 'swtg', vt.fuel.area, 'Size Class', lib.fbed.swtg, [
    sf2bdp1.area, sf2bdp1.size,
    sf2bdp2.area, sf2bdp2.size,
    sf2bdp3.area, sf2bdp3.size,
    sf2bdp4.area, sf2bdp4.size,
    wk.noArea, wk.noSize ])

  Vapply( sf2bl, 'swtg', vt.fuel.area, 'Size Class', lib.fbed.swtg, [
    sf2blp1.area, sf2blp1.size,
    sf2blp2.area, sf2blp2.size,
    sf2blp3.area, sf2blp3.size,
    sf2blp4.area, sf2blp4.size,
    sf2blp5.area, sf2blp5.size])

  // Particle weighting factors
  for( let idx=0; idx<4; idx++ ) {
    let p = dead[idx]
    Vapply( p, 'awtg', vt.fuel.awtg, '', lib.fpart.awtg, [ p.area, sf2bd.area ] )
    Vapply( p, 'swtg', vt.fuel.swtg, '', lib.fpart.swtg, [ p.size, sf2bd.swtg ] )
  }
  for( let idx=0; idx<5; idx++ ) {
    let p = live[idx]
    Vapply( p, 'awtg', vt.fuel.awtg, '', lib.fpart.awtg, [ p.area, sf2bl.area ] )
    Vapply( p, 'swtg', vt.fuel.swtg, '', lib.fpart.swtg, [ p.size, sf2bl.swtg ] )
  }

  // Life category effective (fine) fuel load, water load, and  moisture content
  Vapply( sf2bd, 'efld', vt.fuel.load, '',
    lib.math.sum, [ sf2bdp1.efld, sf2bdp2.efld, sf2bdp3.efld, sf2bdp4.efld ] )

  Vapply( sf2bl, 'efld', 'Total', vt.fuel.efld, lib.math.sum,
    [ sf2blp1.efld, sf2blp2.efld, sf2blp3.efld, sf2blp4.efld, sf2blp5.efld ] )

  Vapply( sf2bd, 'efwl', vt.fuel.efwl, '',
    lib.math.sum, [ sf2bdp1.efwl, sf2bdp2.efwl, sf2bdp3.efwl, sf2bdp4.efwl ] )

  Vapply( sf2bl, 'efwl', 'Total', vt.fuel.efwl, lib.math.sum,
    [ sf2blp1.efwl, sf2blp2.efwl, sf2blp3.efwl, sf2blp4.efwl, sf2blp5.efwl ] )

  Vapply( sf2bd, 'efmc', vt.fuel.efmc, '',
    lib.math.div2, [ sf2bd.efwl, sf2bd.efld ] )

  Vapply( sf2bl, 'efmc', vt.fuel.mois, '',
    lib.math.div2, [ sf2bl.efwl, sf2bl.efld ] )

  // Life category weighting factors
  Vapply( sf2bd, 'awtg', vt.fuel.awtg, '',
    lib.math.div2, [ sf2bd.area, sf2bc.area ] )

  Vapply( sf2bl, 'awtg', vt.fuel.awtg, '',
    lib.math.div2, [ sf2bl.area, sf2bc.area ] )

  // Life category weighted heat, mois, qign, savr, seff, wnet properties
  Vapply( sf2bd, 'heat', vt.fuel.heat, 'Weighted', lib.math.sumProd, [
    sf2bdp1.awtg, sf2bdp2.awtg, sf2bdp3.awtg, sf2bdp4.awtg,
    sf2bdp1.heat, sf2bdp2.heat, sf2bdp3.heat, sf2bdp4.heat ] )

  Vapply( sf2bl, 'heat', vt.fuel.heat, 'Weighted', lib.math.sumProd, [
    sf2blp1.awtg, sf2blp2.awtg, sf2blp3.awtg, sf2blp4.awtg, sf2blp5.awtg,
    sf2blp1.heat, sf2blp2.heat, sf2blp3.heat, sf2blp4.heat, sf2blp5.heat ] )

  Vapply( sf2bd, 'mois', vt.fuel.mois, 'Weighted', lib.math.sumProd, [
    sf2bdp1.awtg, sf2bdp2.awtg, sf2bdp3.awtg, sf2bdp4.awtg,
    sf2bdp1.mois, sf2bdp2.mois, sf2bdp3.mois, sf2bdp4.mois ] )

  Vapply( sf2bl, 'mois', vt.fuel.mois, 'Weighted', lib.math.sumProd, [
    sf2blp1.awtg, sf2blp2.awtg, sf2blp3.awtg, sf2blp4.awtg, sf2blp5.awtg,
    sf2blp1.mois, sf2blp2.mois, sf2blp3.mois, sf2blp4.mois, sf2blp5.mois ] )

  Vapply( sf2bd, 'qign', vt.fuel.qign, 'Weighted', lib.math.sumProd, [
    sf2bdp1.awtg, sf2bdp2.awtg, sf2bdp3.awtg, sf2bdp4.awtg,
    sf2bdp1.qign, sf2bdp2.qign, sf2bdp3.qign, sf2bdp4.qign ] )

  Vapply( sf2bl, 'qign', vt.fuel.qign, 'Weighted', lib.math.sumProd, [
    sf2blp1.awtg, sf2blp2.awtg, sf2blp3.awtg, sf2blp4.awtg, sf2blp5.awtg,
    sf2blp1.qign, sf2blp2.qign, sf2blp3.qign, sf2blp4.qign, sf2blp5.qign ] )

  Vapply( sf2bd, 'savr', vt.fuel.savr, 'Weighted', lib.math.sumProd, [
    sf2bdp1.awtg, sf2bdp2.awtg, sf2bdp3.awtg, sf2bdp4.awtg,
    sf2bdp1.savr, sf2bdp2.savr, sf2bdp3.savr, sf2bdp4.savr ] )

  Vapply( sf2bl, 'savr', vt.fuel.savr, 'Weighted', lib.math.sumProd, [
    sf2blp1.awtg, sf2blp2.awtg, sf2blp3.awtg, sf2blp4.awtg, sf2blp5.awtg,
    sf2blp1.savr, sf2blp2.savr, sf2blp3.savr, sf2blp4.savr, sf2blp5.savr ] )

  Vapply( sf2bd, 'seff', vt.fuel.seff, 'Weighted', lib.math.sumProd, [
    sf2bdp1.awtg, sf2bdp2.awtg, sf2bdp3.awtg, sf2bdp4.awtg,
    sf2bdp1.seff, sf2bdp2.seff, sf2bdp3.seff, sf2bdp4.seff ] )

  Vapply( sf2bl, 'seff', vt.fuel.seff, 'Weighted', lib.math.sumProd, [
    sf2blp1.awtg, sf2blp2.awtg, sf2blp3.awtg, sf2blp4.awtg, sf2blp5.awtg,
    sf2blp1.seff, sf2blp2.seff, sf2blp3.seff, sf2blp4.seff, sf2blp5.seff ] )

  Vapply( sf2bd, 'wnet', vt.fuel.wnet, 'Weighted', lib.math.sumProd, [
    sf2bdp1.swtg, sf2bdp2.swtg, sf2bdp3.swtg, sf2bdp4.swtg,
    sf2bdp1.wnet, sf2bdp2.wnet, sf2bdp3.wnet, sf2bdp4.wnet ] )

  Vapply( sf2bl, 'wnet', vt.fuel.wnet, 'Weighted', lib.math.sumProd, [
    sf2blp1.swtg, sf2blp2.swtg, sf2blp3.swtg, sf2blp4.swtg, sf2blp5.swtg,
    sf2blp1.wnet, sf2blp2.wnet, sf2blp3.wnet, sf2blp4.wnet, sf2blp5.wnet ] )

  // Life category extinction moisture
  Vapply( sf2bd, 'mext', vt.fuel.mext, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.dmxt, sf2Pgb.dmxt, sf2Std.dmxt, sf2Was.dmxt ] )

  Vapply( sf2bl, 'mxtk', vt.fuel.mxtk, '',
    lib.fbed.mxtk, [ sf2bd.efld, sf2bl.efld ] )

  Vapply( sf2bl, 'mext', vt.fuel.mext, '',
    lib.fbed.mext, [ sf2bl.mxtk, sf2bd.efmc, sf2bd.mext ] )

  // Life category damping coefficients
  Vapply( sf2bd, 'etam', vt.fuel.etam, '',
    lib.fbed.etam, [ sf2bd.mois, sf2bd.mext ] )

  Vapply( sf2bl, 'etam', vt.fuel.etam, '',
    lib.fbed.etam, [ sf2bl.mois, sf2bl.mext ] )

  Vapply( sf2bd, 'etas', vt.fuel.etas, '',
    lib.fbed.etas, [ sf2bd.seff ] )

  Vapply( sf2bl, 'etas', vt.fuel.etas, '',
    lib.fbed.etas, [ sf2bl.seff ] )

  // Fuel bed properties
  Vapply( sf2bc, 'depth', vt.fuel.depth, '',
    lib.fpart.pick, [ sf2m.type, sf2Chp.dep, sf2Pgb.dep, sf2Std.dep, sf2Was.dep ] )

  Vapply( sf2bc, 'bulk', vt.fuel.bulk, '',
    lib.math.div2, [ sf2bc.load, sf2bc.depth ] )

  Vapply( sf2bc, 'savr', vt.fuel.savr, 'Characteristic',
    lib.math.sumProd, [ sf2bd.awtg, sf2bl.awtg, sf2bd.savr, sf2bl.savr ] )

  Vapply( sf2bc, 'sv15', vt.fuel.sv15, '',
    lib.fbed.sv15, [ sf2bc.savr ] )

  Vapply( sf2bc, 'taur', vt.fuel.taur, '',
    lib.fbed.taur, [ sf2bc.savr ] )

  Vapply( sf2bc, 'beta', vt.fuel.beta, '', lib.fbed.beta, [
    sf2bdp1.pprc, sf2bdp2.pprc, sf2bdp3.pprc, sf2bdp4.pprc,
    sf2blp1.pprc, sf2blp2.pprc, sf2blp3.pprc, sf2blp4.pprc, sf2blp5.pprc, sf2bc.depth ] )

  Vapply( sf2bc, 'beto', vt.fuel.beto, '',
    lib.fbed.beto, [ sf2bc.savr ] )

  Vapply( sf2bc, 'betr', vt.fuel.betr, '',
  lib.math.div2, [ sf2bc.beta, sf2bc.beto ] )

  Vapply( sf2bc, 'pflx', vt.fuel.pflx, '',
    lib.fbed.pflx, [ sf2bc.savr, sf2bc.beta ] )

  Vapply( sf2bc, 'qign', vt.fuel.qign, '',
    lib.math.sumProd, [ sf2bd.awtg, sf2bl.awtg, sf2bd.qign, sf2bl.qign ] )

  Vapply( sf2bc, 'sink', vt.fuel.sink, '',
    lib.fbed.sink, [ sf2bc.qign, sf2bc.bulk ] )

  // Fuel bed reaction velocity
  Vapply( sf2bc, 'rxva', vt.fuel.rxva, '',
    lib.fbed.rxva, [ sf2bc.savr ] )

  Vapply( sf2bc, 'rxvm', vt.fuel.rxvm, '',
    lib.fbed.rxvm, [ sf2bc.sv15 ] )

  Vapply( sf2bc, 'rxvo', vt.fuel.rxvo, '',
    lib.fbed.rxvo, [ sf2bc.betr, sf2bc.rxvm, sf2bc.rxva ] )

  // Life category and total fuel bed reaction intensity
  Vapply( sf2bd, 'rxid', vt.fuel.rxid, '', lib.fbed.rxid, [
    sf2bc.rxvo, sf2bd.wnet, sf2bd.heat, sf2bd.etas ] )

  Vapply( sf2bd, 'rxi', vt.fire.rxi, '',
    lib.math.mul2, [ sf2bd.etam, sf2bd.rxid ] )

  Vapply( sf2bl, 'rxid', vt.fuel.rxid, '',
    lib.fbed.rxid, [ sf2bc.rxvo, sf2bl.wnet, sf2bl.heat, sf2bl.etas ] )

  Vapply( sf2bl, 'rxi', vt.fire.rxi, '',
    lib.math.mul2, [ sf2bl.etam, sf2bl.rxid ] )

  Vapply( sf2bc, 'rxi',  vt.fire.rxi, 'Total',
    lib.math.sum2, [ sf2bd.rxi, sf2bl.rxi ] )

  // Fuel bed fire spread rate and heat
  Vapply( sf2bc, 'ros0', vt.fuel.ros0, '',
    lib.fbed.ros0, [ sf2bc.rxi, sf2bc.pflx, sf2bc.sink ] )

  Vapply( sf2bc, 'hpua', vt.fire.hpua, '',
    lib.math.mul2, [ sf2bc.rxi, sf2bc.taur ] )

  // Fuel bed wind-slope factors
  Vapply( sf2bc, 'slpf', vt.fuel.slpf, '',
    lib.fbed.slpf, [ sf2bc.beta ] )

  Vapply( sf2bc, 'wndb', vt.fuel.wndb, '',
    lib.fbed.wndb, [ sf2bc.savr ] )

  Vapply( sf2bc, 'wndc', vt.fuel.wndc, '',
    lib.fbed.wndc, [ sf2bc.savr ] )

  Vapply( sf2bc, 'wnde', vt.fuel.wnde, '',
    lib.fbed.wnde, [ sf2bc.savr ] )

  Vapply( sf2bc, 'wndk', vt.fuel.wndk, '',
    lib.fbed.wndk, [ sf2bc.betr, sf2bc.wnde, sf2bc.wndc ] )

  Vapply( sf2bc, 'wndi', vt.fuel.wndi, '',
    lib.fbed.wndi, [ sf2bc.betr, sf2bc.wnde, sf2bc.wndc ] )

  // Fuel bed effective wind, wind coefficient, and spread rate lLimits
  Vapply( sf2bc, 'ewsl', vt.fuel.ewsl, '',
    lib.fbed.ewsl, [ sf2bc.rxi ] )

  Vapply( sf2bc, 'phil', vt.fuel.phil, '',
    lib.fbed.phil, [ sf2bc.ewsl, sf2bc.wndb, sf2bc.wndk ] )

  Vapply( sf2bc, 'rosl', vt.fuel.rosl, '',
    lib.fbed.rosl, [ sf2bc.ros0, sf2bc.phil ] )

  // Therse could be fuel bed or fire properties....

  // Fuel bed midflame wind speed
  Vbound( sf2bc, 'mwaf', vt.fuel.mwaf, '', sf1bc.mwaf )

  Vbound( sf2bc, 'mwsp', vt.fuel.mwsp, '', sf1bc.mwsp )

  Vapply( sf2f, 'phis', vt.fire.phis, '',
    lib.surf.phis, [ slpStp.rat, sf2bc.slpf ] )

  Vapply( sf2f, 'phiw', vt.fire.phiw, '',
    lib.surf.phiw, [ sf2bc.mwsp, sf2bc.wndb, sf2bc.wndk ] )

  // Fire spread direction

  Vapply( sf2fd, 'slpros', vt.fire.ros, 'Slope Rate',
    lib.surf.spreadDirSlopeRate, [ sf2bc.ros0, sf2f.phis ] )

  Vapply( sf2fd, 'wndros', vt.fire.ros, 'Wind Rate',
    lib.surf.spreadDirWindRate, [ sf2bc.ros0, sf2f.phiw ] )

  Vapply( sf2fd, 'x', vt.fire.comp, 'X',
    lib.surf.spreadDirXComp, [ sf2fd.wndros, sf2fd.slpros, wnd.dir.hdg.up ] )

  Vapply( sf2fd, 'y', vt.fire.comp, 'Y',
    lib.surf.spreadDirYComp, [ sf2fd.wndros, wnd.dir.hdg.up ] )

  Vapply( sf2fd, 'vecros', vt.fire.ros, 'Vector Rate',
    lib.surf.spreadDirVectorRate, [ sf2fd.x, sf2fd.y ] )

  Vapply( sf2fd, 'hdup', vt.fire.hdup, '',
    lib.surf.spreadDirAzUp, [ sf2fd.x, sf2fd.y, sf2fd.vecros ] )

  Vapply( sf2fd, 'hdno', vt.fire.hdno, '',
    lib.az.sum, [ slpDir.up, sf2fd.hdup ] )

  // Step 1 - EWS, WSC, and ROS under Upslope Wind Condition

  // Calculate wind-slope coefficient (phiEw') using method 1
  Vapply( sf2f, 'phiew1', vt.fire.phiew, 'Step 1',
    lib.math.sum2, [ sf2f.phis, sf2f.phiw ] )

  // Calculate effective wind speed using method 1 from the wind-slope coefficient
  Vapply( sf2f, 'ews1', vt.fuel.ewsp, 'Step 1',
    lib.surf.ews, [ sf2f.phiew1, sf2bc.wndb, sf2bc.wndi ] )

  // Calculate maximum fire spread rate using method 1
  Vapply( sf2f, 'ros1', vt.fire.ros, 'Step 1',
    lib.surf.rosMax, [ sf2bc.ros0, sf2f.phiew1 ] )

  // Step 2 - EWS, WSC, and ROS under *Cross-slope Wind Condition* without Limits

  // Calculate maximum fire spread rate using method 2
  Vapply( sf2f, 'ros2', vt.fire.ros, 'Step 2',
    lib.surf.rosMaxCrossSlopeWind, [ sf2bc.ros0, sf2fd.vecros ] )

  // Calculate wind-slope coefficient (phiEw') using method 2
  Vapply( sf2f, 'phiew2', vt.fire.phiew, 'Step 2',
    lib.surf.phiewInferred, [ sf2bc.ros0, sf2f.ros2 ] )

  // Calculate effective wind speed using method 1 from the wind-slope coefficient
  Vapply( sf2f, 'ews2', vt.fuel.ewsp, 'Step 2',
    lib.surf.ews, [ sf2f.phiew2, sf2bc.wndb, sf2bc.wndi ] )

  // Step 3A - EWS, WSC, and ROS under Cross-slope Wind Condition
  //           with Only the Effective Wind Speed Limit Applied

  // Is the effective wind speed limit exceeded?
  Vapply( sf2f, 'ewsx', vt.fire.ewsx, '',
    lib.math.gt, [ sf2f.ews2, sf2bc.ewsl ] )

  // Effective wind speed 3A is the minimum of EWS from Step 2 and the EWS limit
  Vapply( sf2f, 'ews3a', vt.fuel.ewsp, 'Step 3a',
    Math.min, [ sf2f.ews2, sf2bc.ewsl ] )

  // Wind-slope coefficient 3A is the mimimum of WSC from Step 2 and the WSC limit
  Vapply( sf2f, 'phiew3a', vt.fire.phiew, 'Step 3a',
    Math.min, [ sf2f.phiew2, sf2bc.phil ] )

  // Maximum spread rate 3A is the minimum of ROS from Step 2 and the Max ROS limit
  Vapply( sf2f, 'ros3a', vt.fire.ros, 'Step 3a',
    Math.min, [ sf2f.ros2, sf2bc.rosl ] )

  // Step 3B - EWS, WSC, and ROS under Cross-slope Wind Condition
  //           with Only the Rate of Spread Limit Applied
  // because Pat sez fire spread rate cannot exceed the effective wind speed

  // Maximum fire spread rate is ROS and EWS from Step 2 with ros limit applied
  Vapply( sf2f, 'ros3b', vt.fire.ros, 'Step 3b',
    lib.surf.rosMaxRoslApplied, [ sf2f.ros2, sf2f.ews2 ] )

  // ROS limit is exceeded if ROS from Step 2 is greater than ROS from Step 3b
  Vapply( sf2f, 'rosx', vt.fire.rosx, '',
    lib.math.gt, [ sf2f.ros2, sf2f.ros3b ] )

  // Wind-slope coefficient must be recalculated using method 2
  Vapply( sf2f, 'phiew3b', vt.fire.phiew, 'Step 3b',
    lib.surf.phiewInferred, [ sf2bc.ros0, sf2f.ros3b ] )

  // The effective wind speed must be recalculated using method 1
  Vapply( sf2f, 'ews3b', vt.fuel.ewsp, 'Step 3b',
    lib.surf.ews, [ sf2f.phiew3b, sf2bc.wndb, sf2bc.wndi ] )

  // Step 4 - Cross-slope Wind Condition with BOTH the Effective Wnd Speed
  //          AND the Spread Rate Limits Applied

  // Apply the ROS limits to the EWS-limited spread rate
  Vapply( sf2f, 'ros4', vt.fire.ros, 'Step 4',
    lib.surf.rosMaxRoslApplied, [ sf2f.ros3a, sf2f.ews3a ] )

  // Wind-slope coefficient must be recalculated using method 2
  Vapply( sf2f, 'phiew4', vt.fire.phiew, 'Step 4',
    lib.surf.phiewInferred, [ sf2bc.ros0, sf2f.ros4 ] )

  // The effective wind speed must be recalculated using method 1
  Vapply( sf2f, 'ews4', vt.fuel.ewsp, 'Step 4',
    lib.surf.ews, [ sf2f.phiew4, sf2bc.wndb, sf2bc.wndi ] )

  // Step 5 - Final ROS, EWS, and WSC values based on client preferences

  Vcfg( sf2f, 'ros', vt.fire.ros, '', cfgFireEwsl, [
    [ 'yes', dagBound, sf2f.ros4 ],
    [ 'dflt', dagBound, sf2f.ros3b ]]) // cfgFireEwsl==='no'

  Vcfg( sf2f, 'phiew', vt.fire.phiew, '', cfgFireEwsl, [
    [ 'yes', dagBound, sf2f.phiew4 ],
    [ 'dflt', dagBound, sf2f.phiew3b ]]) // cfgFireEwsl==='no'

  Vcfg( sf2f, 'ewsp', vt.fuel.ewsp, '', cfgFireEwsl, [
    [ 'yes', dagBound, sf2f.ews4 ],
    [ 'dflt', dagBound, sf2f.ews3b ]]) // cfgFireEwsl==='no'

  Vapply( sf2f, 'fli', vt.fire.fli, '',
    lib.surf.fli, [ sf2f.ros, sf2bc.rxi, sf2bc.taur ] )

  Vapply( sf2f, 'fl', vt.fire.fl, '',
    lib.surf.fl, [ sf2f.fli ] )

  Vapply( sf2f, 'elwr', vt.fire.elwr, '',
    lib.surf.lwr, [ sf2f.ewsp ] )

  Vapply( sf2f, 'scht', vt.fire.scht, '',
    lib.surf.scorchHt, [ sf2f.fli, sf2bc.mwsp, air.tmp ] )

  //--------------------------------------------------------------------------
  // Weighted
  //--------------------------------------------------------------------------

  // These are always bound to the Primary Surface Fuel and Fire
  Vbound( sfw, 'mwaf', vt.fuel.mwaf, 'Weighted', sf1bc.mwaf )
  Vbound( sfw, 'mwsp', vt.fuel.mwsp, 'Weighted', sf1bc.mwsp )
  Vbound( sfw, 'ewsp', vt.fuel.ewsp, 'Weighted', sf1f.ewsp )
  Vbound( sfw, 'elwr', vt.fire.elwr, 'Weighted', sf1f.elwr )
  Vbound( sfw, 'hdup', vt.fire.hdup, 'Weighted', sf1fd.hdup )
  Vbound( sfw, 'hdno', vt.fire.hdno, 'Weighted', sf1fd.hdno )

  // ALways derive arithmetic, expected, and harmonic means,
  // then assign a final 'applied' ros based on cfgFireWtd
  Vcfg( sfwr, 'arith', vt.fire.ros, 'Arithmetic Mean', cfgFuel2, [
    [ 'none', dagBound, sf1f.ros ],
    [ 'dflt', lib.surf.rosArithmetic, [ sf1m.cover, sf1f.ros, sf2f.ros ]]] )

  Vcfg( sfwr, 'expect', vt.fire.ros, 'Expected Value', cfgFuel2, [
    [ 'none', dagBound, sf1f.ros ],
    [ 'dflt', lib.surf.rosExpectedMOCK, [ sf1m.cover, sf1f.ros, sf2f.ros ]]] )

  Vcfg( sfwr, 'harmon', vt.fire.ros, 'Harmonic Mean', cfgFuel2, [
    [ 'none', dagBound, sf1f.ros ],
    [ 'dflt', lib.surf.rosHarmonic, [ sf1m.cover, sf1f.ros, sf2f.ros ]]] )

  Vcfg( sfw, 'ros', vt.fire.ros, 'Applied', cfgFireWtd, [
    [ 'expected', dagBound, sfwr.expect ],
    [ 'harmonic', dagBound, sfwr.harmon ],
    [ 'dflt', dagBound, sfwr.arith ]])  // cfgFireWtd==='arithmetic'

  // These are always assigned the maximum value
  Vcfg( sfw, 'rxi', vt.fire.rxi, 'Applied', cfgFuel2, [
    [ 'none', dagBound, sf1bc.rxi ],
    [ 'dflt', lib.math.max, [ sf1bc.rxi, sf2bc.rxi ]]] )

  Vcfg( sfw, 'hpua', vt.fire.hpua, 'Applied', cfgFuel2, [
    [ 'none', dagBound, sf1bc.hpua ],
    [ 'dflt', lib.math.max, [ sf1bc.hpua, sf2bc.hpua ]]] )

  Vcfg( sfw, 'fli', vt.fire.fli, 'Applied', cfgFuel2, [
      [ 'none', dagBound, sf1f.fli ],
      [ 'dflt', lib.math.max, [ sf1f.fli, sf2f.fli ]]] )

  Vcfg( sfw, 'fl', vt.fire.fl, 'Applied', cfgFuel2, [
      [ 'none', dagBound, sf1f.fl ],
      [ 'dflt', lib.math.max, [ sf1f.fl, sf2f.fl ]]] )

  Vcfg( sfw, 'depth', vt.fuel.depth, 'Applied', cfgFuel2, [
      [ 'none', dagBound, sf1bc.depth ],
      [ 'dflt', lib.math.max, [ sf1bc.depth, sf2bc.depth ]]] )

  // This is always assigned the minimum value
  Vcfg( sfw, 'ewsl', vt.fuel.ewsl, 'Applied', cfgFuel2, [
    [ 'none', dagBound, sf1bc.ewsl ],
    [ 'dflt', lib.math.min, [ sf1bc.ewsl, sf2bc.ewsl ]]] )

  Vcfg( sfw, 'ewsx', vt.fire.ewsx, 'Applied', cfgFuel2, [
    [ 'none', dagBound, sf1f.ewsx ],
    [ 'dflt', lib.math.or, [ sf1f.ewsx, sf2f.ewsx ]]] )


  // new Var( sfes, 'area', vt.fire.earea )
  // new Var( sfes, 'per', vt.fire.eper )
  // new Var( sfes, 'leng', vt.fire.eleng )
  // new Var( sfes, 'wid', vt.fire.ewid )
  // new Var( sfes, 'marea', vt.fire.marea )
  // new Var( sfes, 'mper', vt.fire.mper )
  // new Var( sfes, 'mlen', vt.fire.mlen )
  // new Var( sfes, 'mwid', vt.fire.mwid )

  // Level 7
  // new Var( sfeh, 'ros', vt.fire.ros )
  // new Var( sfeh, 'dist', vt.fire.dist )
  // new Var( sfeh, 'fl', vt.fire.fl )
  // new Var( sfeh, 'fli', vt.fire.fli )
  // new Var( sfeh, 'mdist', vt.fire.mdist )
  // new Var( sfeh, 'scht', vt.fire.scht )

  // Level 7
  // new Var( sfeb, 'ros', vt.fire.ros )
  // new Var( sfeb, 'dist', vt.fire.dist )
  // new Var( sfeb, 'fl', vt.fire.fl )
  // new Var( sfeb, 'fli', vt.fire.fli )
  // new Var( sfeb, 'mdist', vt.fire.mdist )
  // new Var( sfeb, 'scht', vt.fire.scht )

  // Level 7
  // new Var( sfef, 'ros', vt.fire.ros )
  // new Var( sfef, 'dist', vt.fire.dist )
  // new Var( sfef, 'fl', vt.fire.fl )
  // new Var( sfef, 'fli', vt.fire.fli )
  // new Var( sfef, 'mdist', vt.fire.mdist )
  // new Var( sfef, 'scht', vt.fire.scht )

  // Level 7
  // new Var( sfeBeta, 'vdhd', vt.fire.vdhd )
  // new Var( sfeBeta, 'vdup', vt.fire.vdup )
  // new Var( sfeBeta, 'vdno', vt.fire.vdno )
  // new Var( sfeBeta, 'ros', vt.fire.ros )
  // new Var( sfeBeta, 'dist', vt.fire.dist )
  // new Var( sfeBeta, 'fl', vt.fire.fl )
  // new Var( sfeBeta, 'fli', vt.fire.fli )
  // new Var( sfeBeta, 'mdist', vt.fire.mdist )
  // new Var( sfeBeta, 'scht', vt.fire.scht )

  // new Var( sfePsi, 'vdhd', vt.fire.vdhd )
  // new Var( sfePsi, 'vdup', vt.fire.vdup )
  // new Var( sfePsi, 'vdno', vt.fire.vdno )
  // new Var( sfePsi, 'ros', vt.fire.ros )
  // new Var( sfePsi, 'dist', vt.fire.dist )
  // new Var( sfePsi, 'fl', vt.fire.fl )
  // new Var( sfePsi, 'fli', vt.fire.fli )
  // new Var( sfePsi, 'mdist', vt.fire.mdist )
  // new Var( sfePsi, 'scht', vt.fire.scht )

  return finish( w1 )
}

module.exports = {
  composeBp: composeBp,
  worksheet1: worksheet1,
  worksheet2: worksheet2,
}
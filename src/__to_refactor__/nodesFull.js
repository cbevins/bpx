"use strict"

var lib = {
  az: require('./libCompass'),
  chp: require('./libFuelChp'),
  cpy: require('./libCanopy'),
  crown: require('./libCrownFire'),
  fbed: require('./libFuelBed'),
  fcat: require('./libFuelCatalog'),
  fell: require('./libFireEllipse'),
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

const Cfg = require('./libNode').Cfg
const Dag = require('./libNode').Dag
const dagBound = require('./libNode').dagBound
const dagFixed = require('./libNode').dagFixed
const dagInput = require('./libNode').dagInput
const fullId = require('./libNode').fullId
const fullLabel = require('./libNode').fullLabel
const isCfg = require('./libNode').isCfg
const isDag = require('./libNode').isDag
const isOpt = require('./libNode').isOpt
const isVar = require('./libNode').isVar
const Vapply = require('./libNode').Vapply
const Vbound = require('./libNode').Vbound
const Vcfg = require('./libNode').Vcfg
const Vcfg0 = require('./libNode').Vcfg0
const Vcfg1 = require('./libNode').Vcfg1
const Vfixed = require('./libNode').Vfixed
const Vinput = require('./libNode').Vinput

function checkConflicts ( worksheet ) {
  var cfg = worksheet.nodes.cfg
  if ( cfg.wind.speed.own.cv === 'mid' ) {
    var crownMwsp = worksheet.nodes.crown.fuel.sf3.bed.char.mwsp
    if ( crownMwsp.own.deps > 0 ) {
      return true
    }
  }
  return false
}

function createNodes() {
  var nodes = new Dag( null, 'nodes', 'Variants' )
    var cfg = new Dag( nodes, 'cfg', 'Configuration' )
      var cfgFuel = new Dag( cfg, 'fuel', 'Fuel' )
      var cfgMois = new Dag( cfg, 'mois', 'Moisture' )
      var cfgSlope = new Dag( cfg, 'slp', 'Slope' )
      var cfgWind = new Dag( cfg, 'wind', 'Wind' )
      var cfgFire = new Dag( cfg, 'fire', 'Fire' )
      var cfgCrown = new Dag( cfg, 'crown', 'Crown' )
      var cfgContain = new Dag( cfg, 'contain', 'Contain' )
      var cfgScorch = new Dag( cfg, 'scorch', 'Scorch' )
      var cfgSize = new Dag( cfg, 'size', 'Scorch' )
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
    var fire = new Dag( nodes, 'fire', 'Fire' )
      var ftime = new Dag( fire, 'time', 'Time' )
      var fvec = new Dag( fire, 'vec', 'Direction' )
        var fbeta = new Dag( fvec, 'beta', 'from Ignition Point' )
        var fpsi = new Dag( fvec, 'psi', 'from Fire Perimeter' )
    var vec = new Dag( nodes, 'vec', 'Vector' )
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
        var sfe = new Dag( sfire, 'el', 'Ellipse' )
        var sfes = new Dag( sfe, 'size', 'Size' )
        var sfeh = new Dag( sfe, 'head', 'Head' )
        var sfeb =  new Dag( sfe, 'back', 'Back' )
        var sfef = new Dag( sfe, 'flnk', 'Flank' )
        var sfeBeta = new Dag( sfe, 'beta', 'Direction from Ignition Point' )
        var sfePsi = new Dag( sfe, 'psi', 'Direction from Fire Perimeter' )

    var crown = new Dag( nodes, 'crown', 'Crown' )
      var cfuel = new Dag( crown, 'fuel', 'Fuel' )
        var sf3 = new Dag( cfuel, 'sf3', 'Canopy' )
          var sf3m = new Dag( sf3, 'modl', 'Model' )
            var sf3Std = new Dag( sf3m, 'std', 'Standard' )
            var sf3Chp = new Dag( sf3m, 'chp', 'Chaparral' )
            var sf3Pgb = new Dag( sf3m, 'pgb', 'Palmetto-Gallberry' )
            var sf3Was = new Dag( sf3m, 'was', 'Western Aspen' )
          var sf3b = new Dag( sf3, 'bed', 'Bed' )
            var sf3bd = new Dag( sf3b, 'dead', 'Dead Category' )
              var sf3bdp = new Dag( sf3bd, 'part', 'Particle' )
                var sf3bdp1 = new Dag( sf3bdp, 'p1', '1' )
                var sf3bdp2 = new Dag( sf3bdp, 'p2', '2' )
                var sf3bdp3 = new Dag( sf3bdp, 'p3', '3' )
                var sf3bdp4 = new Dag( sf3bdp, 'p4', '4' )
            var sf3bl = new Dag( sf3b, 'live', 'Live Category' )
              var sf3blp = new Dag( sf3bl, 'part', 'Particle' )
                var sf3blp1 = new Dag( sf3blp, 'p1', '1' )
                var sf3blp2 = new Dag( sf3blp, 'p2', '2' )
                var sf3blp3 = new Dag( sf3blp, 'p3', '3' )
                var sf3blp4 = new Dag( sf3blp, 'p4', '4' )
                var sf3blp5 = new Dag( sf3blp, 'p5', '5' )
            var sf3bc = new Dag( sf3b, 'char', 'Characteristic' )
          var sf3f = new Dag( sf3, 'fire', 'Fire' )
            var sf3fd = new Dag( sf3f, 'dir', 'Direction' )
      var cfire = new Dag( crown, 'fire', 'Fire' )
      var csurf = new Dag( crown, 'surf', 'Surface' )

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
  Vfixed( wk, 'upslopeWind', vt.wind.hdgUp, '', 0.0 )

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

  // Canopy fuel
  var cfgFuel3 = new Cfg( cfgFuel, 'fuel3', 'Crown Canopy Fuel is', [
    [ 'cat', 'fuel model 10', true ] ] )

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

  var cfgFireDir = new Cfg( cfgFire, 'dir', 'Fire direction inputs are', [
    [ 'hd', 'degrees clockwise from direction of maximum spread', true ],
    [ 'up', 'degrees clockwise from upslope'],
    [ 'no', 'degrees clockwise from north' ]])

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
  var cfgCrownFli = new Cfg( cfgCrown, 'fli', 'The Crown Module is', [
    [ 'surface', 'linked to the Surface Module', true ],
    [ 'fl', 'run stand-alone using flame length input' ],
    [ 'fli', 'run stand-alone using fireline intensity input' ]])

  // bp6 # 14 - Contain > Input Options > resources [single, multiple]
  // bp7 #15
  var cfgContainRes = new Cfg( cfgContain, 'res', 'Contain module allows', [
    [ 'single', 'a single firefighting resource' ],
    [ 'multiple', 'multiple firefighting resources', true ]])

  // This should replace Size, Scorch, and Crown fli/fl configurations
  var cfgSizeFli = new Cfg( cfgSize, 'fli', 'The Size Module is', [
    [ 'surface', 'linked to the Surface Module', true ],
    [ 'fl', 'run stand-alone using flame length input' ],
    [ 'fli', 'run stand-alone using fireline intensity input' ]])

  // #15 - Scorch > Input Options > FLI [fl, fli]
  // bp7 #16 - stand alone only
  var cfgScorchFli = new Cfg( cfgScorch, 'fli', 'The Scorch Module is', [
    [ 'surface', 'linked to the Surface Module', true ],
    [ 'fl', 'run stand-alone using flame length input' ],
    [ 'fli', 'run stand-alone using fireline intensity input' ]])

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

  Vinput( cpy, 'bd', vt.cpy.bd )
  Vinput( cpy, 'bh', vt.cpy.bh )
  Vinput( cpy, 'cv', vt.cpy.cv )
  Vinput( cpy, 'ht', vt.cpy.ht )
  Vinput( cpy, 'mc', vt.cpy.mc )

  Vfixed( cpy, 'heat', vt.fuel.heat )

  Vapply( cpy, 'cr', vt.cpy.cr, '', lib.cpy.cr, [ cpy.bh, cpy.ht ] )
  Vapply( cpy, 'fl', vt.cpy.fl, '', lib.cpy.fl, [ cpy.cv, cpy.cr ] )
  Vapply( cpy, 'ld', vt.fuel.load, '', lib.cpy.ld, [ cpy.bd, cpy.ht, cpy.bh ] )
  Vapply( cpy, 'hpua', vt.fire.hpua, '', lib.cpy.hpua, [ cpy.ld, cpy.heat ] )
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

  // Because of circular dependencies, slope ratio and degrees must first be
  // declared before their dependencies can be defined
  var slpRat = Vcfg0( slpStp, 'rat', vt.slp.rat, '', cfgSlope )
  var slpDeg = Vcfg0( slpStp, 'deg', vt.slp.deg, '', cfgSlope )

  Vcfg1( slpRat, [
    [ 'deg', lib.az.slpRat, [ slpStp.deg ]],
    [ 'map', lib.az.slpRatMap, [ map.scl, map.cint, map.cont, map.dist ]],
    [ 'dflt', dagInput]] ) // cfgSlope==='rat'

  Vcfg1( slpDeg, [
    [ 'deg', dagInput ],
    [ 'dflt', lib.az.slpDeg, [ slpStp.rat ]]] ) // cfgSlope==='rat' || 'map'

  Vinput( slpDir, 'asp', vt.slp.asp )

  Vapply( slpDir, 'up', vt.slp.up, '', lib.az.opp, [slpDir.asp] )

  //----------------------------------------------------------------------------
  // Time
  //----------------------------------------------------------------------------

  Vinput( ftime, 'etig', vt.fire.etig )

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

  // Because of circular dependencies, wind speed at 10-m and 20-ft must first be
  // declared before their dependencies can be defined
  var wndSpd10 = Vcfg0( wndSpd, 'at10', vt.wind.spd, '10-m', cfgWindSpeed )
  var wndSpd20 = Vcfg0( wndSpd, 'at20', vt.wind.spd, '20-ft', cfgWindSpeed )

  Vcfg1( wndSpd10, [
    [ 'at10', dagInput ],
    [ 'dflt', lib.wind.at10m, [ wndSpd.at20 ]]])  // cfgWindSpeed==='at20' || 'mid'

  Vcfg1( wndSpd20, [
    [ 'at10', lib.wind.at20ft, [ wndSpd.at10 ]],
    [ 'dflt', dagInput ]]) // cfgWindSpeed==='at20' || 'mid'

  //----------------------------------------------------------------------------
  // Surface Fuel & Fire
  //----------------------------------------------------------------------------

  Vinput( sf1m, 'key', vt.fuel.key )
  Vinput( sf2m, 'key', vt.fuel.key )
  Vfixed( sf3m, 'key', vt.fuel.key, '', '10' )

  Vcfg( sf1m, 'cover', vt.fuel.fmcv, '', cfgFuel2, [
    [ 'none', dagFixed, 1.0 ],
    [ 'dflt', dagInput ]] )

  Vcfg( sf1m, 'type', vt.fuel.type, '', cfgFuel1, [
    [ 'std', dagFixed, 'std' ],
    [ 'chp', dagFixed, 'chp' ],
    [ 'pgb', dagFixed, 'pgb' ],
    [ 'was', dagFixed, 'was' ],
    [ 'dflt', lib.fcat.type, [ sf1m.key ]]]) // cfgFuel==='cat'

  Vcfg( sf2m, 'type', vt.fuel.type, '', cfgFuel2, [
    [ 'none', dagFixed, 'none' ],
    [ 'std', dagFixed, 'std' ],
    [ 'chp', dagFixed, 'chp' ],
    [ 'pgb', dagFixed, 'pgb' ],
    [ 'was', dagFixed, 'was' ],
    [ 'dflt', lib.fcat.type, [ sf2m.key ]]]) // cfgFuel2==='cat'

  Vfixed( sf3m, 'type', vt.fuel.type, 'std' )

  for ( let idx=0; idx<3; idx++ ) {
    var cfgFuel = (idx===0) ? cfgFuel1: ( (idx===1) ? cfgFuel2: cfgFuel3 )
    var sfm     = (idx===0) ?  sf1m   : ( (idx===1) ? sf2m    : sf3m )
    var sfChp   = (idx===0) ? sf1Chp  : ( (idx===1) ? sf2Chp  : sf3Chp )
    var sfPgb   = (idx===0) ? sf1Pgb  : ( (idx===1) ? sf2Pgb  : sf3Pgb )
    var sfStd   = (idx===0) ? sf1Std  : ( (idx===1) ? sf2Std  : sf3Std )
    var sfWas   = (idx===0) ? sf1Was  : ( (idx===1) ? sf2Was  : sf3Was )
    var sfbdp1  = (idx===0) ? sf1bdp1 : ( (idx===1) ? sf2bdp1 : sf3bdp1 )
    var sfbdp2  = (idx===0) ? sf1bdp2 : ( (idx===1) ? sf2bdp2 : sf3bdp2 )
    var sfbdp3  = (idx===0) ? sf1bdp3 : ( (idx===1) ? sf2bdp3 : sf3bdp3 )
    var sfbdp4  = (idx===0) ? sf1bdp4 : ( (idx===1) ? sf2bdp4 : sf3bdp4 )
    var sfblp1  = (idx===0) ? sf1blp1 : ( (idx===1) ? sf2blp1 : sf3blp1 )
    var sfblp2  = (idx===0) ? sf1blp2 : ( (idx===1) ? sf2blp2 : sf3blp2 )
    var sfblp3  = (idx===0) ? sf1blp3 : ( (idx===1) ? sf2blp3 : sf3blp3 )
    var sfblp4  = (idx===0) ? sf1blp4 : ( (idx===1) ? sf2blp4 : sf3blp4 )
    var sfblp5  = (idx===0) ? sf1blp5 : ( (idx===1) ? sf2blp5 : sf3blp5 )
    var sfbd    = (idx===0) ? sf1bd   : ( (idx===1) ? sf2bd   : sf3bd )
    var sfbl    = (idx===0) ? sf1bl   : ( (idx===1) ? sf2bl   : sf3bl )
    var sfbc    = (idx===0) ? sf1bc   : ( (idx===1) ? sf2bc   : sf3bc )
    var sff     = (idx===0) ? sf1f    : ( (idx===1) ? sf2f    : sf3f )
    var sffd    = (idx===0) ? sf1fd   : ( (idx===1) ? sf2fd   : sf3fd )

    //----------------------------------------------------------------------------
    // Standard Fuels
    //----------------------------------------------------------------------------

    // Following are provided by catalog or input

    Vcfg( sfStd, 'dep', vt.fuel.depth, '', cfgFuel, [
      [ 'cat', lib.fcat.std.depth, [ sfm.key ]],
      [ 'std', dagInput ],
      [ 'dflt', dagFixed, 0.01]] )  // cfgFuel==='chp' || 'pgb' || 'was'

    Vcfg( sfStd, 'dmxt', vt.fuel.mext, 'Dead', cfgFuel, [
      [ 'cat', lib.fcat.std.mext, [ sfm.key ]],
      [ 'std', dagInput ],
      [ 'dflt', dagFixed, 0.01]] )  // cfgFuel==='chp' || 'pgb' || 'was'

    Vcfg( sfStd, 'd1ld', vt.fuel.load, 'Dead 1-h', cfgFuel, [
      [ 'cat', lib.fcat.std.d1ld, [ sfm.key ]],
      [ 'std', dagInput ],
      [ 'dflt', dagFixed, 0.0]] )  // cfgFuel==='chp' || 'pgb' || 'was'

    Vcfg( sfStd, 'd10ld', vt.fuel.load, 'Dead 10-h', cfgFuel, [
      [ 'cat', lib.fcat.std.d10ld, [ sfm.key ]],
      [ 'std', dagInput ],
      [ 'dflt', dagFixed, 0.0]] )  // cfgFuel==='chp' || 'pgb' || 'was'

    Vcfg( sfStd, 'd100ld', vt.fuel.load, 'Dead 100-h', cfgFuel, [
      [ 'cat', lib.fcat.std.d100ld, [ sfm.key ]],
      [ 'std', dagInput ],
      [ 'dflt', dagFixed, 0.0]] )  // cfgFuel==='chp' || 'pgb' || 'was'

    Vcfg( sfStd, 'hld', vt.fuel.load, 'Total Herbaceous', cfgFuel, [
      [ 'cat', lib.fcat.std.hld, [ sfm.key ]],
      [ 'std', dagInput ],
      [ 'dflt', dagFixed, 0.0]] )  // cfgFuel==='chp' || 'pgb' || 'was'

    Vcfg( sfStd, 'sld', vt.fuel.load, 'Live Stem Wood', cfgFuel, [
      [ 'cat', lib.fcat.std.sld, [ sfm.key ]],
      [ 'std', dagInput ],
      [ 'dflt', dagFixed, 0.0]] )  // cfgFuel==='chp' || 'pgb' || 'was'

    Vcfg( sfStd, 'd1sv', vt.fuel.savr, 'Dead 1-h', cfgFuel, [
      [ 'cat', lib.fcat.std.d1sv, [ sfm.key ]],
      [ 'std', dagInput ],
      [ 'dflt', dagFixed, 1.0]] )  // cfgFuel==='chp' || 'pgb' || 'was'

    Vcfg( sfStd, 'hsv', vt.fuel.savr, 'Herbaceous', cfgFuel, [
      [ 'cat', lib.fcat.std.hsv, [ sfm.key ]],
      [ 'std', dagInput ],
      [ 'dflt', dagFixed, 1.0]] )  // cfgFuel==='chp' || 'pgb' || 'was'

    Vcfg( sfStd, 'ssv', vt.fuel.savr, 'Stem Wood', cfgFuel, [
      [ 'cat', lib.fcat.std.ssv, [ sfm.key ]],
      [ 'std', dagInput ],
      [ 'dflt', dagFixed, 1.0]] )  // cfgFuel==='chp' || 'pgb' || 'was'

    Vcfg( sfStd, 'dht', vt.fuel.heat, 'Dead', cfgFuel, [
      [ 'cat', lib.fcat.std.dht, [ sfm.key ]],
      [ 'std', dagInput ],
      [ 'dflt', dagFixed, 8000.0]] )  // cfgFuel==='chp' || 'pgb' || 'was'

    Vcfg( sfStd, 'lht', vt.fuel.heat, 'Live', cfgFuel, [
      [ 'cat', lib.fcat.std.lht, [ sfm.key ]],
      [ 'std', dagInput ],
      [ 'dflt', dagFixed, 8000.0]] )  // cfgFuel==='chp' || 'pgb' || 'was'

    // Following are derived
    Vcfg( sfStd, 'hcf', vt.fuel.hcf, '', cfgHcf, [
      [ 'est', lib.std.hcf, [ mois.live.herb ] ],
      [ 'dflt', dagInput ]]) // cfgHcf==='inp'

    Vapply( sfStd, 'dhld', vt.fuel.load, 'Dead Herb',
      lib.std.dhld, [ sfStd.hcf, sfStd.hld ] )

    Vapply( sfStd, 'lhld', vt.fuel.load, 'Live Herb',
      lib.std.lhld, [ sfStd.hcf, sfStd.hld ] )

    Vapply( sfStd, 'dld', vt.fuel.load, 'Dead',
      lib.std.dld, [ sfStd.d1ld, sfStd.d10ld, sfStd.d100ld, sfStd.dhld ] )

    Vapply( sfStd, 'lld', vt.fuel.load, 'Live',
      lib.std.lld, [ sfStd.lhld, sfStd.sld ] )

    // Following are constant
    Vfixed( sfStd, 'd2sv', vt.fuel.savr, 'Dead 10-h', 109.0 )
    Vfixed( sfStd, 'd3sv', vt.fuel.savr, 'Dead 100-h', 30.0 )
    Vfixed( sfStd, 'dens', vt.fuel.dens, 'All Particle', 32.0 )
    Vfixed( sfStd, 'seff', vt.fuel.seff, 'All Particle', 0.01 )
    Vfixed( sfStd, 'stot', vt.fuel.stot, 'All Particle', 0.0555 )

    //----------------------------------------------------------------------------
    // Chaparral Fuels
    // The fuel catalog stores depth, total load, and dead fraction
    //----------------------------------------------------------------------------

    // Following are provided by catalog or input

    Vcfg( sfChp, 'dep', vt.fuel.depth, '', cfgFuel, [
      [ 'cat', lib.fcat.chp.depth, [ sfm.key ]],
      [ 'chp', dagInput ],
      [ 'dflt', dagFixed, 0.01]] )  // cfgFuel==='std' || 'pgb' || 'was'

    Vcfg( sfChp, 'df', vt.fuel.chdf, '', cfgFuel, [
      [ 'cat', lib.fcat.chp.df, [ sfm.key ]],
      [ 'chp', dagInput ],
      [ 'dflt', dagFixed, 0.0]] )  // cfgFuel==='std' || 'pgb' || 'was'

    Vcfg( sfChp, 'ld', vt.fuel.load, 'Total', cfgFuel, [
      [ 'cat', lib.fcat.chp.ld, [ sfm.key ]],
      [ 'chp', dagInput ],
      [ 'dflt', dagFixed, 0.0]] )  // cfgFuel==='chp' || 'pgb' || 'was'

    Vinput( sfChp, 'ty', vt.fuel.chty, '', 'chamise' )

    // Following are derived
    Vapply( sfChp, 'age', vt.fuel.chag, '',
      lib.chp.age, [ sfChp.dep, sfChp.ty ] )

    Vapply( sfChp, 'eld', vt.fuel.load, 'Estimated Total',
      lib.chp.ld, [ sfChp.age, sfChp.ty ] )

    Vcfg( sfChp, 'ald', vt.fuel.load, 'Applied Total', cfgChapLoad, [
      [ 'est', dagBound, sfChp.eld ],
      [ 'dflt', dagBound, sfChp.ld ]])  // cfgChapLoad==='inp'

    Vapply( sfChp, 'dld', vt.fuel.load, 'Dead',
      lib.chp.dld, [ sfChp.ald, sfChp.df ] )
    Vapply( sfChp, 'd1ld', vt.fuel.load, 'Dead 0.01 - 0.25',
      lib.chp.d1ld, [ sfChp.ald, sfChp.df ] )
    Vapply( sfChp, 'd2ld', vt.fuel.load, 'Dead 0.25 - 0.50',
      lib.chp.d2ld, [ sfChp.ald, sfChp.df ] )
    Vapply( sfChp, 'd3ld', vt.fuel.load, 'Dead 0.50 - 1.0',
      lib.chp.d3ld, [ sfChp.ald, sfChp.df ] )
    Vapply( sfChp, 'd4ld', vt.fuel.load, 'Dead 1.0 - 3.0',
      lib.chp.d4ld, [ sfChp.ald, sfChp.df ] )

    Vapply( sfChp, 'lld', vt.fuel.load, 'Live',
      lib.chp.lld, [ sfChp.ald, sfChp.df ] )
    Vapply( sfChp, 'l1ld', vt.fuel.load, 'Live 0.01 - 0.25',
      lib.chp.l1ld, [ sfChp.ald, sfChp.df ] )
    Vapply( sfChp, 'l2ld', vt.fuel.load, 'Live 0.25 - 0.50',
      lib.chp.l2ld, [ sfChp.ald, sfChp.df ] )
    Vapply( sfChp, 'l3ld', vt.fuel.load, 'Live 0.50 - 1.0',
      lib.chp.l3ld, [ sfChp.ald, sfChp.df ] )
    Vapply( sfChp, 'l4ld', vt.fuel.load, 'Live 1.0 - 3.0',
      lib.chp.l4ld, [ sfChp.ald, sfChp.df ] )
    Vapply( sfChp, 'l5ld', vt.fuel.load, 'Live Leaves',
      lib.chp.l5ld, [ sfChp.ald, sfChp.df ] )

    // This will be a function that returns 0.65 for chamise and 0.74 for mixed chaparral
    // var sfChp.lmxt = Vapply( sfChp, 'lmxt', vt.fuel.mext, 'Live',
    //   lib.chp.lmxt, [ sf] )

    // The following are constant
    Vfixed( sfChp, 'dmxt', vt.fuel.mext, 'Dead', 0.30 )
    Vfixed( sfChp, 'p1sv', vt.fuel.savr, '0.01 - 0.25', 640.0 )
    Vfixed( sfChp, 'p2sv', vt.fuel.savr, '0.25 - 0.50', 127.0 )
    Vfixed( sfChp, 'p3sv', vt.fuel.savr, '0.50 - 1.0', 61.0 )
    Vfixed( sfChp, 'p4sv', vt.fuel.savr, '1.0 - 3.0', 27.0 )
    Vfixed( sfChp, 'p5sv', vt.fuel.savr, 'Live Leaves', 2200.0 )
    Vfixed( sfChp, 'stot', vt.fuel.stot, 'All Particles', 0.055 )
    Vfixed( sfChp, 'seff', vt.fuel.seff, 'All Stemwood', 0.015 )
    Vfixed( sfChp, 'p5se', vt.fuel.seff, 'Live Leaves', 0.035 )
    Vfixed( sfChp, 'dens', vt.fuel.dens, 'All Stemwood', 46.0 )
    Vfixed( sfChp, 'p5dn', vt.fuel.dens, 'Live Leaves', 32.0 )
    Vfixed( sfChp, 'dht',  vt.fuel.heat, 'All Dead', 8000.0 )
    Vfixed( sfChp, 'llht', vt.fuel.heat, 'Live Leaf and Live 0-0.25', 10500.0 )
    Vfixed( sfChp, 'lsht', vt.fuel.heat, 'Live Stemwood 0.25-3.0', 9500.0 )

    //----------------------------------------------------------------------------
    // Palmetto-Gallberry Fuels
    // The fuel catalog stores age, basal area, cover, and height
    //----------------------------------------------------------------------------

    // The following are provided by the catalog or input
    Vcfg( sfPgb, 'age', vt.fuel.pgag, '', cfgFuel, [
      [ 'cat', lib.fcat.pgb.age, [ sfm.key ]],
      [ 'pgb', dagInput ],
      [ 'dflt', dagFixed, 0.0]] )  // cfgFuel==='chp' || 'std' || 'was'

    Vcfg( sfPgb, 'ba', vt.fuel.pgba, '', cfgFuel, [
      [ 'cat', lib.fcat.pgb.ba, [ sfm.key ]],
      [ 'pgb', dagInput ],
      [ 'dflt', dagFixed, 0.0]] )  // cfgFuel==='chp' || 'std' || 'was'

    Vcfg( sfPgb, 'cv', vt.fuel.pgcv, '', cfgFuel, [
      [ 'cat', lib.fcat.pgb.cv, [ sfm.key ]],
      [ 'pgb', dagInput ],
      [ 'dflt', dagFixed, 0.0]] )  // cfgFuel==='chp' || 'std' || 'was'

    Vcfg( sfPgb, 'ht', vt.fuel.pght, '', cfgFuel, [
      [ 'cat', lib.fcat.pgb.ht, [ sfm.key ]],
      [ 'pgb', dagInput ],
      [ 'dflt', dagFixed, 0.0]] )  // cfgFuel==='chp' || 'std' || 'was'

    // The following are derived
    Vapply( sfPgb, 'dep', vt.fuel.depth, '',
      lib.pgb.depth, [ sfPgb.ht ] )

    Vapply( sfPgb, 'd1ld', vt.fuel.load, 'Dead Foliage',
      lib.pgb.d1ld, [ sfPgb.age, sfPgb.cv ] )
    Vapply( sfPgb, 'd2ld', vt.fuel.load, 'Dead 0-0.25"',
      lib.pgb.d2ld, [ sfPgb.age, sfPgb.ht ] )
    Vapply( sfPgb, 'd3ld', vt.fuel.load, 'Dead 0.25-1.0"',
      lib.pgb.d3ld, [ sfPgb.age, sfPgb.cv ] )
    Vapply( sfPgb, 'd4ld', vt.fuel.load, 'Litter"',
      lib.pgb.d4ld, [ sfPgb.age, sfPgb.ba ] )

    Vapply( sfPgb, 'l1ld', vt.fuel.load, 'Live Foliage',
      lib.pgb.l1ld, [ sfPgb.age, sfPgb.cv, sfPgb.ht ] )
    Vapply( sfPgb, 'l2ld', vt.fuel.load, 'Live 0-0.25"',
      lib.pgb.l2ld, [ sfPgb.age, sfPgb.ht ] )
    Vapply( sfPgb, 'l3ld', vt.fuel.load, 'Live 0.25-1.0"',
      lib.pgb.l3ld, [ sfPgb.age, sfPgb.ht ] )

    // The following are constant
    Vfixed( sfPgb, 'dmxt', vt.fuel.mext, 'Dead', 0.40 )
    Vfixed( sfPgb, 'heat', vt.fuel.heat, 'All Fuels', 8300.0 )
    Vfixed( sfPgb, 'dden', vt.fuel.dens, 'All Dead', 30.0 )
    Vfixed( sfPgb, 'lden', vt.fuel.dens, 'All Live', 46.0 )
    Vfixed( sfPgb, 'stot', vt.fuel.stot, 'All Fuel', 0.030 )
    Vfixed( sfPgb, 'dsef', vt.fuel.seff, 'All Dead', 0.010 )
    Vfixed( sfPgb, 'lsef', vt.fuel.seff, 'All Live', 0.015 )
    Vfixed( sfPgb, 'lfsv', vt.fuel.savr, 'Foliage', 2000.0 )
    Vfixed( sfPgb, 's1sv', vt.fuel.savr, '0-0.25" Stems', 350.0 )
    Vfixed( sfPgb, 's2sv', vt.fuel.savr, '0.25-1.0" Stems', 140.0 )
    Vfixed( sfPgb, 'ltsv', vt.fuel.savr, 'Litter', 2000.0 )

    //----------------------------------------------------------------------------
    // Western Aspen
    // The fuel catalog stores type and curing level
    //----------------------------------------------------------------------------

    // The following are provided by catalog or input
    Vcfg( sfWas, 'ty', vt.fuel.waty, '', cfgFuel, [
      [ 'cat', lib.fcat.was.ty, [ sfm.key ]],
      [ 'was', dagInput ],
      [ 'dflt', dagFixed, 'aspen/shrub' ]] )  // cfgFuel==='chp' || 'std' || 'pgb'

    Vcfg( sfWas, 'cl', vt.fuel.wacl, '', cfgFuel, [
      [ 'cat', lib.fcat.was.cl, [ sfm.key ]],
      [ 'was', dagInput ],
      [ 'dflt', dagFixed, 0.0 ]] )  // cfgFuel==='chp' || 'std' || 'pgb'

    // The following are derived
    Vapply( sfWas, 'dep', vt.fuel.depth, '',
      lib.was.depth, [ sfWas.ty ] )
    Vapply( sfWas, 'd1ld', vt.fuel.load, 'Dead 1-h',
      lib.was.d1ld, [ sfWas.ty, sfWas.cl ] )
    Vapply( sfWas, 'd2ld', vt.fuel.load, 'Dead 10-h',
      lib.was.d2ld, [ sfWas.ty ] )

    Vapply( sfWas, 'l1ld', vt.fuel.load, 'Live Herb',
      lib.was.l1ld, [ sfWas.ty, sfWas.cl ] )
    Vapply( sfWas, 'l2ld', vt.fuel.load, 'Live Woody',
      lib.was.l2ld, [ sfWas.ty, sfWas.cl ] )

    Vapply( sfWas, 'd1sv', vt.fuel.savr, 'Dead 1-h',
      lib.was.d1sv, [ sfWas.ty, sfWas.cl ] )
    Vapply( sfWas, 'l2sv', vt.fuel.savr, 'Live Woody',
      lib.was.l2sv, [ sfWas.ty, sfWas.cl ] )
    Vapply( sfWas, 'dld', vt.fuel.load, 'Dead',
      lib.was.dld, [ sfWas.d1ld, sfWas.d2ld ] )
    Vapply( sfWas, 'lld', vt.fuel.load, 'Live',
      lib.was.lld, [ sfWas.l1ld, sfWas.l2ld ] )

    // The following are constant
    Vfixed( sfWas, 'dmxt', vt.fuel.mext, 'Dead', 0.25 )
    Vfixed( sfWas, 'd2sv', vt.fuel.savr, 'Dead 10-h', 109.0 )
    Vfixed( sfWas, 'l1sv', vt.fuel.savr, 'Live Herb', 2800.0 )
    Vfixed( sfWas, 'dens', vt.fuel.dens, 'All Particles', 32.0 )
    Vfixed( sfWas, 'heat', vt.fuel.heat, 'All Particles', 8000.0 )
    Vfixed( sfWas, 'stot', vt.fuel.stot, 'All Particles', 0.055 )
    Vfixed( sfWas, 'seff', vt.fuel.seff, 'All Particles', 0.010 )

    //----------------------------------------------------------------------------
    // Fuel Bed and Particles
    //----------------------------------------------------------------------------

    // Chap 0.0-0.25", Pgb Foliage, Std 1-h, Was 1-h
    Vapply( sfbdp1, 'load', vt.fuel.load, '',
      lib.fpart.pick, [ sfm.type, sfChp.d1ld, sfPgb.d1ld, sfStd.d1ld, sfWas.d1ld ] )
    Vapply( sfbdp1, 'savr', vt.fuel.savr, '',
      lib.fpart.pick, [ sfm.type, sfChp.p1sv, sfPgb.lfsv, sfStd.d1sv, sfWas.d1sv ] )
    Vapply( sfbdp1, 'heat', vt.fuel.heat, '',
      lib.fpart.pick, [ sfm.type, sfChp.dht, sfPgb.heat, sfStd.dht, sfWas.heat ] )
    Vapply( sfbdp1, 'dens', vt.fuel.dens, '',
      lib.fpart.pick, [ sfm.type, sfChp.dens, sfPgb.dden, sfStd.dens, sfWas.dens ] )
    Vapply( sfbdp1, 'stot', vt.fuel.stot, '',
      lib.fpart.pick, [ sfm.type, sfChp.stot, sfPgb.stot, sfStd.stot, sfWas.stot ] )
    Vapply( sfbdp1, 'seff', vt.fuel.seff, '',
      lib.fpart.pick, [ sfm.type, sfChp.seff, sfPgb.dsef, sfStd.seff, sfWas.seff ] )
    Vapply( sfbdp1, 'mois', vt.fuel.mois, '',
      lib.fpart.pick, [ sfm.type, mois.dead.tl1, mois.dead.tl100, mois.dead.tl1, mois.dead.tl1 ] )

    // Chap 0.25-0.5", Pgb 0.0-0.25", Std 10-h, Was 10-h
    Vapply( sfbdp2, 'load', vt.fuel.load, '',
      lib.fpart.pick, [ sfm.type, sfChp.d2ld, sfPgb.d2ld, sfStd.d10ld, sfWas.d2ld ] )
    Vapply( sfbdp2, 'savr', vt.fuel.savr, '',
      lib.fpart.pick, [ sfm.type, sfChp.p2sv, sfPgb.s1sv, sfStd.d2sv, sfWas.d1sv ] )
    Vapply( sfbdp2, 'heat', vt.fuel.heat, '',
      lib.fpart.pick, [ sfm.type, sfChp.dht, sfPgb.heat, sfStd.dht, sfWas.heat ] )
    Vapply( sfbdp2, 'dens', vt.fuel.dens, '',
      lib.fpart.pick, [ sfm.type, sfChp.dens, sfPgb.dden, sfStd.dens, sfWas.dens ] )
    Vapply( sfbdp2, 'stot', vt.fuel.stot, '',
      lib.fpart.pick, [ sfm.type, sfChp.stot, sfPgb.stot, sfStd.stot, sfWas.stot ] )
    Vapply( sfbdp2, 'seff', vt.fuel.seff, '',
      lib.fpart.pick, [ sfm.type, sfChp.seff, sfPgb.dsef, sfStd.seff, sfWas.seff ] )
    Vapply( sfbdp2, 'mois', vt.fuel.mois, '',
      lib.fpart.pick, [ sfm.type, mois.dead.tl10, mois.dead.tl100, mois.dead.tl10, mois.dead.tl10 ] )

    // Chap 0.5-1.0", Pgb 0.25-1.0", Std 100-h
    Vapply( sfbdp3, 'load', vt.fuel.load, '',
      lib.fpart.pick, [ sfm.type, sfChp.d3ld, sfPgb.d3ld, sfStd.d100ld, wk.noLoad ] )
    Vapply( sfbdp3, 'savr', vt.fuel.savr, '',
      lib.fpart.pick, [ sfm.type, sfChp.p3sv, sfPgb.s2sv, sfStd.d3sv, wk.noSavr ] )
    Vapply( sfbdp3, 'heat', vt.fuel.heat, '',
      lib.fpart.pick, [ sfm.type, sfChp.dht, sfPgb.heat, sfStd.dht, wk.noHeat ] )
    Vapply( sfbdp3, 'dens', vt.fuel.dens, '',
      lib.fpart.pick, [ sfm.type, sfChp.dens, sfPgb.dden, sfStd.dens, wk.noDens ] )
    Vapply( sfbdp3, 'stot', vt.fuel.stot, '',
      lib.fpart.pick, [ sfm.type, sfChp.stot, sfPgb.stot, sfStd.stot, wk.noStot ] )
    Vapply( sfbdp3, 'seff', vt.fuel.seff, '',
      lib.fpart.pick, [ sfm.type, sfChp.seff, sfPgb.dsef, sfStd.seff, wk.noSeff ] )
    Vapply( sfbdp3, 'mois', vt.fuel.mois, '',
      lib.fpart.pick, [ sfm.type, mois.dead.tl10, mois.dead.tl100, mois.dead.tl100, wk.noMois ] )

    // Chap 1-3", Pgb Litter, Std Cured Herb
    Vapply( sfbdp4, 'load', vt.fuel.load, '',
      lib.fpart.pick, [ sfm.type, sfChp.d4ld, sfPgb.d4ld, sfStd.dhld, wk.noLoad ] )
    Vapply( sfbdp4, 'savr', vt.fuel.savr, '',
      lib.fpart.pick, [ sfm.type, sfChp.p4sv, sfPgb.ltsv, sfStd.hsv, wk.noSavr ] )
    Vapply( sfbdp4, 'heat', vt.fuel.heat, '',
      lib.fpart.pick, [ sfm.type, sfChp.dht, sfPgb.heat, sfStd.dht, wk.noHeat ] )
    Vapply( sfbdp4, 'dens', vt.fuel.dens, '',
      lib.fpart.pick, [ sfm.type, sfChp.dens, sfPgb.dden, sfStd.dens, wk.noDens ] )
    Vapply( sfbdp4, 'stot', vt.fuel.stot, '',
      lib.fpart.pick, [ sfm.type, sfChp.stot, sfPgb.stot, sfStd.stot, wk.noStot ] )
    Vapply( sfbdp4, 'seff', vt.fuel.seff, '',
      lib.fpart.pick, [ sfm.type, sfChp.seff, sfPgb.dsef, sfStd.seff, wk.noSeff ] )
    Vapply( sfbdp4, 'mois', vt.fuel.mois, '',
      lib.fpart.pick, [ sfm.type, mois.dead.tl100, mois.dead.tl100, mois.dead.tl1, wk.noMois ] )

    // The following Fuel Particle Nodes are derived
    var dead = [ sfbdp1, sfbdp2, sfbdp3, sfbdp4 ]
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
    Vapply( sfblp1, 'load', vt.fuel.load, '',
      lib.fpart.pick, [ sfm.type, sfChp.l1ld, sfPgb.l1ld, sfStd.lhld, sfWas.l1ld ] )
    Vapply( sfblp1, 'savr', vt.fuel.savr, '',
      lib.fpart.pick, [ sfm.type, sfChp.p1sv, sfPgb.lfsv, sfStd.hsv, sfWas.l1sv ] )
    Vapply( sfblp1, 'heat', vt.fuel.heat, '',
      lib.fpart.pick, [ sfm.type, sfChp.llht, sfPgb.heat, sfStd.lht, sfWas.heat ] )
    Vapply( sfblp1, 'dens', vt.fuel.dens, '',
      lib.fpart.pick, [ sfm.type, sfChp.dens, sfPgb.lden, sfStd.dens, sfWas.dens ] )
    Vapply( sfblp1, 'stot', vt.fuel.stot, '',
      lib.fpart.pick, [ sfm.type, sfChp.stot, sfPgb.stot, sfStd.stot, sfWas.stot ] )
    Vapply( sfblp1, 'seff', vt.fuel.seff, '',
      lib.fpart.pick, [ sfm.type, sfChp.seff, sfPgb.lsef, sfStd.seff, sfWas.seff ] )
    Vapply( sfblp1, 'mois', vt.fuel.mois, '',
      lib.fpart.pick, [ sfm.type, mois.live.stem, mois.live.herb, mois.live.herb, mois.live.herb ] )

    // CHP 0.25-0.50", PGB 0.0-0.25", STD Stem, WAS Stem
    Vapply( sfblp2, 'load', vt.fuel.load, '',
      lib.fpart.pick, [ sfm.type, sfChp.l2ld, sfPgb.l2ld, sfStd.sld, sfWas.l2ld ] )
    Vapply( sfblp2, 'savr', vt.fuel.savr, '',
      lib.fpart.pick, [ sfm.type, sfChp.p2sv, sfPgb.s1sv, sfStd.ssv, sfWas.l2sv ] )
    Vapply( sfblp2, 'heat', vt.fuel.heat, '',
      lib.fpart.pick, [ sfm.type, sfChp.lsht, sfPgb.heat, sfStd.lht, sfWas.heat ] )
    Vapply( sfblp2, 'dens', vt.fuel.dens, '',
      lib.fpart.pick, [ sfm.type, sfChp.dens, sfPgb.lden, sfStd.dens, sfWas.dens ] )
    Vapply( sfblp2, 'stot', vt.fuel.stot, '',
      lib.fpart.pick, [ sfm.type, sfChp.stot, sfPgb.stot, sfStd.stot, sfWas.stot ] )
    Vapply( sfblp2, 'seff', vt.fuel.seff, '',
      lib.fpart.pick, [ sfm.type, sfChp.seff, sfPgb.lsef, sfStd.seff, sfWas.seff ] )
    Vapply( sfblp2, 'mois', vt.fuel.mois, '',
      lib.fpart.pick, [ sfm.type, mois.live.stem, mois.live.stem, mois.live.stem, mois.live.stem ] )

    // CHP 0.50-1.0", PGB 0.25-1.0"
    Vapply( sfblp3, 'load', vt.fuel.load, '',
      lib.fpart.pick, [ sfm.type, sfChp.l3ld, sfPgb.l3ld, wk.noLoad, wk.noLoad ] )
    Vapply( sfblp3, 'savr', vt.fuel.savr, '',
      lib.fpart.pick, [ sfm.type, sfChp.p3sv, sfPgb.s2sv, wk.noSavr, wk.noSavr ] )
    Vapply( sfblp3, 'heat', vt.fuel.heat, '',
      lib.fpart.pick, [ sfm.type, sfChp.lsht, sfPgb.heat, wk.noHeat, wk.noHeat ] )
    Vapply( sfblp3, 'dens', vt.fuel.dens, '',
      lib.fpart.pick, [ sfm.type, sfChp.dens, sfPgb.lden, wk.noDens, wk.noDens ] )
    Vapply( sfblp3, 'stot', vt.fuel.stot, '',
      lib.fpart.pick, [ sfm.type, sfChp.stot, sfPgb.stot, wk.noStot, wk.noStot ] )
    Vapply( sfblp3, 'seff', vt.fuel.seff, '',
      lib.fpart.pick, [ sfm.type, sfChp.seff, sfPgb.lsef, wk.noSeff, wk.noSeff ] )
    Vapply( sfblp3, 'mois', vt.fuel.mois, '',
      lib.fpart.pick, [ sfm.type, mois.live.stem, mois.live.stem, wk.noMois, wk.noMois ] )

    // CHP 1.0-3.0"
    Vapply( sfblp4, 'load', vt.fuel.load, '',
      lib.fpart.pick, [ sfm.type, sfChp.l4ld, wk.noLoad, wk.noLoad, wk.noLoad ] )
    Vapply( sfblp4, 'savr', vt.fuel.savr, '',
      lib.fpart.pick, [ sfm.type, sfChp.p4sv, wk.noSavr, wk.noSavr, wk.noSavr ] )
    Vapply( sfblp4, 'heat', vt.fuel.heat, '',
      lib.fpart.pick, [ sfm.type, sfChp.lsht, wk.noHeat, wk.noHeat, wk.noHeat ] )
    Vapply( sfblp4, 'dens', vt.fuel.dens, '',
      lib.fpart.pick, [ sfm.type, sfChp.dens, wk.noDens, wk.noDens, wk.noDens ] )
    Vapply( sfblp4, 'stot', vt.fuel.stot, '',
      lib.fpart.pick, [ sfm.type, sfChp.stot, wk.noStot, wk.noStot, wk.noStot ] )
    Vapply( sfblp4, 'seff', vt.fuel.seff, '',
      lib.fpart.pick, [ sfm.type, sfChp.seff, wk.noSeff, wk.noSeff, wk.noSeff ] )
    Vapply( sfblp4, 'mois', vt.fuel.mois, '',
      lib.fpart.pick, [ sfm.type, mois.live.stem, wk.noMois, wk.noMois, wk.noMois ] )

    // CHP Leaves
    var sfblp5Load = Vapply( sfblp5, 'load', vt.fuel.load, '',
      lib.fpart.pick, [ sfm.type, sfChp.l5ld, wk.noLoad, wk.noLoad, wk.noLoad ] )
    var sfblp5Savr = Vapply( sfblp5, 'savr', vt.fuel.savr, '',
      lib.fpart.pick, [ sfm.type, sfChp.p5sv, wk.noSavr, wk.noSavr, wk.noSavr ] )
    Vapply( sfblp5, 'heat', vt.fuel.heat, '',
      lib.fpart.pick, [ sfm.type, sfChp.llht, wk.noHeat, wk.noHeat, wk.noHeat ] )
    Vapply( sfblp5, 'dens', vt.fuel.dens, '',
      lib.fpart.pick, [ sfm.type, sfChp.p5dn, wk.noDens, wk.noDens, wk.noDens ] )
    Vapply( sfblp5, 'stot', vt.fuel.stot, '',
      lib.fpart.pick, [ sfm.type, sfChp.stot, wk.noStot, wk.noStot, wk.noStot ] )
    Vapply( sfblp5, 'seff', vt.fuel.seff, '',
      lib.fpart.pick, [ sfm.type, sfChp.p5se, wk.noSeff, wk.noSeff, wk.noSeff ] )
    Vapply( sfblp5, 'mois', vt.fuel.mois, '',
      lib.fpart.pick, [ sfm.type, mois.live.herb, wk.noMois, wk.noMois, wk.noMois ] )

    // Live Fuel Particle derived properties
    var live = [ sfblp1, sfblp2, sfblp3, sfblp4, sfblp5 ]
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
    Vapply( sfbd, 'area', vt.fuel.area, 'Total',
      lib.math.sum, [ sfbdp1.area, sfbdp2.area, sfbdp3.area, sfbdp4.area ])

    Vapply( sfbl, 'area', 'Total', vt.fuel.area, lib.math.sum,
      [ sfblp1.area, sfblp2.area, sfblp3.area, sfblp4.area, sfblp5.area ])

    Vapply( sfbc, 'area', vt.fuel.area, 'Total',
      lib.math.sum, [ sfbd.area, sfbl.area ])

    // Life category and total fuel bed Load
    Vapply( sfbd, 'load', vt.fuel.load, 'Total',
      lib.math.sum, [ sfbdp1.load, sfbdp2.load, sfbdp3.load, sfbdp4.load ] )

    Vapply( sfbl, 'load', 'Total', vt.fuel.load, lib.math.sum,
    [ sfblp1.load, sfblp2.load, sfblp3.load, sfblp4.load, sfblp5.load ] )

    Vapply( sfbc, 'load', vt.fuel.load, 'Total',
      lib.math.sum, [ sfbd.load, sfbl.load ] )

    // Accumulate life category surface area by size class
    Vapply( sfbd, 'swtg', vt.fuel.area, 'Size Class', lib.fbed.swtg, [
      sfbdp1.area, sfbdp1.size,
      sfbdp2.area, sfbdp2.size,
      sfbdp3.area, sfbdp3.size,
      sfbdp4.area, sfbdp4.size,
      wk.noArea, wk.noSize ])

    Vapply( sfbl, 'swtg', vt.fuel.area, 'Size Class', lib.fbed.swtg, [
      sfblp1.area, sfblp1.size,
      sfblp2.area, sfblp2.size,
      sfblp3.area, sfblp3.size,
      sfblp4.area, sfblp4.size,
      sfblp5.area, sfblp5.size])

    // Particle weighting factors
    for( let idx=0; idx<4; idx++ ) {
      let p = dead[idx]
      Vapply( p, 'awtg', vt.fuel.awtg, '', lib.fpart.awtg, [ p.area, sfbd.area ] )
      Vapply( p, 'swtg', vt.fuel.swtg, '', lib.fpart.swtg, [ p.size, sfbd.swtg ] )
    }
    for( let idx=0; idx<5; idx++ ) {
      let p = live[idx]
      Vapply( p, 'awtg', vt.fuel.awtg, '', lib.fpart.awtg, [ p.area, sfbl.area ] )
      Vapply( p, 'swtg', vt.fuel.swtg, '', lib.fpart.swtg, [ p.size, sfbl.swtg ] )
    }

    // Life category effective (fine) fuel load, water load, and  moisture content
    Vapply( sfbd, 'efld', vt.fuel.load, '',
      lib.math.sum, [ sfbdp1.efld, sfbdp2.efld, sfbdp3.efld, sfbdp4.efld ] )

    Vapply( sfbl, 'efld', 'Total', vt.fuel.efld, lib.math.sum,
      [ sfblp1.efld, sfblp2.efld, sfblp3.efld, sfblp4.efld, sfblp5.efld ] )

    Vapply( sfbd, 'efwl', vt.fuel.efwl, '',
      lib.math.sum, [ sfbdp1.efwl, sfbdp2.efwl, sfbdp3.efwl, sfbdp4.efwl ] )

    Vapply( sfbl, 'efwl', 'Total', vt.fuel.efwl, lib.math.sum,
      [ sfblp1.efwl, sfblp2.efwl, sfblp3.efwl, sfblp4.efwl, sfblp5.efwl ] )

    Vapply( sfbd, 'efmc', vt.fuel.efmc, '',
      lib.math.div2, [ sfbd.efwl, sfbd.efld ] )

    Vapply( sfbl, 'efmc', vt.fuel.mois, '',
      lib.math.div2, [ sfbl.efwl, sfbl.efld ] )

    // Life category weighting factors
    Vapply( sfbd, 'awtg', vt.fuel.awtg, '',
      lib.math.div2, [ sfbd.area, sfbc.area ] )

    Vapply( sfbl, 'awtg', vt.fuel.awtg, '',
      lib.math.div2, [ sfbl.area, sfbc.area ] )

    // Life category weighted heat, mois, qign, savr, seff, wnet properties
    Vapply( sfbd, 'heat', vt.fuel.heat, 'Weighted', lib.math.sumProd, [
      sfbdp1.awtg, sfbdp2.awtg, sfbdp3.awtg, sfbdp4.awtg,
      sfbdp1.heat, sfbdp2.heat, sfbdp3.heat, sfbdp4.heat ] )

    Vapply( sfbl, 'heat', vt.fuel.heat, 'Weighted', lib.math.sumProd, [
      sfblp1.awtg, sfblp2.awtg, sfblp3.awtg, sfblp4.awtg, sfblp5.awtg,
      sfblp1.heat, sfblp2.heat, sfblp3.heat, sfblp4.heat, sfblp5.heat ] )

    Vapply( sfbd, 'mois', vt.fuel.mois, 'Weighted', lib.math.sumProd, [
      sfbdp1.awtg, sfbdp2.awtg, sfbdp3.awtg, sfbdp4.awtg,
      sfbdp1.mois, sfbdp2.mois, sfbdp3.mois, sfbdp4.mois ] )

    Vapply( sfbl, 'mois', vt.fuel.mois, 'Weighted', lib.math.sumProd, [
      sfblp1.awtg, sfblp2.awtg, sfblp3.awtg, sfblp4.awtg, sfblp5.awtg,
      sfblp1.mois, sfblp2.mois, sfblp3.mois, sfblp4.mois, sfblp5.mois ] )

    Vapply( sfbd, 'qign', vt.fuel.qign, 'Weighted', lib.math.sumProd, [
      sfbdp1.awtg, sfbdp2.awtg, sfbdp3.awtg, sfbdp4.awtg,
      sfbdp1.qign, sfbdp2.qign, sfbdp3.qign, sfbdp4.qign ] )

    Vapply( sfbl, 'qign', vt.fuel.qign, 'Weighted', lib.math.sumProd, [
      sfblp1.awtg, sfblp2.awtg, sfblp3.awtg, sfblp4.awtg, sfblp5.awtg,
      sfblp1.qign, sfblp2.qign, sfblp3.qign, sfblp4.qign, sfblp5.qign ] )

    Vapply( sfbd, 'savr', vt.fuel.savr, 'Weighted', lib.math.sumProd, [
      sfbdp1.awtg, sfbdp2.awtg, sfbdp3.awtg, sfbdp4.awtg,
      sfbdp1.savr, sfbdp2.savr, sfbdp3.savr, sfbdp4.savr ] )

    Vapply( sfbl, 'savr', vt.fuel.savr, 'Weighted', lib.math.sumProd, [
      sfblp1.awtg, sfblp2.awtg, sfblp3.awtg, sfblp4.awtg, sfblp5.awtg,
      sfblp1.savr, sfblp2.savr, sfblp3.savr, sfblp4.savr, sfblp5.savr ] )

    Vapply( sfbd, 'seff', vt.fuel.seff, 'Weighted', lib.math.sumProd, [
      sfbdp1.awtg, sfbdp2.awtg, sfbdp3.awtg, sfbdp4.awtg,
      sfbdp1.seff, sfbdp2.seff, sfbdp3.seff, sfbdp4.seff ] )

    Vapply( sfbl, 'seff', vt.fuel.seff, 'Weighted', lib.math.sumProd, [
      sfblp1.awtg, sfblp2.awtg, sfblp3.awtg, sfblp4.awtg, sfblp5.awtg,
      sfblp1.seff, sfblp2.seff, sfblp3.seff, sfblp4.seff, sfblp5.seff ] )

    Vapply( sfbd, 'wnet', vt.fuel.wnet, 'Weighted', lib.math.sumProd, [
      sfbdp1.swtg, sfbdp2.swtg, sfbdp3.swtg, sfbdp4.swtg,
      sfbdp1.wnet, sfbdp2.wnet, sfbdp3.wnet, sfbdp4.wnet ] )

    Vapply( sfbl, 'wnet', vt.fuel.wnet, 'Weighted', lib.math.sumProd, [
      sfblp1.swtg, sfblp2.swtg, sfblp3.swtg, sfblp4.swtg, sfblp5.swtg,
      sfblp1.wnet, sfblp2.wnet, sfblp3.wnet, sfblp4.wnet, sfblp5.wnet ] )

    // Life category extinction moisture
    Vapply( sfbd, 'mext', vt.fuel.mext, '',
      lib.fpart.pick, [ sfm.type, sfChp.dmxt, sfPgb.dmxt, sfStd.dmxt, sfWas.dmxt ] )

    Vapply( sfbl, 'mxtk', vt.fuel.mxtk, '',
      lib.fbed.mxtk, [ sfbd.efld, sfbl.efld ] )

    Vapply( sfbl, 'mext', vt.fuel.mext, '',
      lib.fbed.mext, [ sfbl.mxtk, sfbd.efmc, sfbd.mext ] )

    // Life category damping coefficients
    Vapply( sfbd, 'etam', vt.fuel.etam, '',
      lib.fbed.etam, [ sfbd.mois, sfbd.mext ] )

    Vapply( sfbl, 'etam', vt.fuel.etam, '',
      lib.fbed.etam, [ sfbl.mois, sfbl.mext ] )

    Vapply( sfbd, 'etas', vt.fuel.etas, '',
      lib.fbed.etas, [ sfbd.seff ] )

    Vapply( sfbl, 'etas', vt.fuel.etas, '',
      lib.fbed.etas, [ sfbl.seff ] )

    // Fuel bed properties
    Vapply( sfbc, 'depth', vt.fuel.depth, '',
      lib.fpart.pick, [ sfm.type, sfChp.dep, sfPgb.dep, sfStd.dep, sfWas.dep ] )

    Vapply( sfbc, 'bulk', vt.fuel.bulk, '',
      lib.math.div2, [ sfbc.load, sfbc.depth ] )

    Vapply( sfbc, 'savr', vt.fuel.savr, 'Characteristic',
      lib.math.sumProd, [ sfbd.awtg, sfbl.awtg, sfbd.savr, sfbl.savr ] )

    Vapply( sfbc, 'sv15', vt.fuel.sv15, '',
      lib.fbed.sv15, [ sfbc.savr ] )

    Vapply( sfbc, 'taur', vt.fuel.taur, '',
      lib.fbed.taur, [ sfbc.savr ] )

    Vapply( sfbc, 'beta', vt.fuel.beta, '', lib.fbed.beta, [
      sfbdp1.pprc, sfbdp2.pprc, sfbdp3.pprc, sfbdp4.pprc,
      sfblp1.pprc, sfblp2.pprc, sfblp3.pprc, sfblp4.pprc, sfblp5.pprc, sfbc.depth ] )

    Vapply( sfbc, 'beto', vt.fuel.beto, '',
      lib.fbed.beto, [ sfbc.savr ] )

    Vapply( sfbc, 'betr', vt.fuel.betr, '',
    lib.math.div2, [ sfbc.beta, sfbc.beto ] )

    Vapply( sfbc, 'pflx', vt.fuel.pflx, '',
      lib.fbed.pflx, [ sfbc.savr, sfbc.beta ] )

    Vapply( sfbc, 'qign', vt.fuel.qign, '',
      lib.math.sumProd, [ sfbd.awtg, sfbl.awtg, sfbd.qign, sfbl.qign ] )

    Vapply( sfbc, 'sink', vt.fuel.sink, '',
      lib.fbed.sink, [ sfbc.qign, sfbc.bulk ] )

    // Fuel bed reaction velocity
    Vapply( sfbc, 'rxva', vt.fuel.rxva, '',
      lib.fbed.rxva, [ sfbc.savr ] )

    Vapply( sfbc, 'rxvm', vt.fuel.rxvm, '',
      lib.fbed.rxvm, [ sfbc.sv15 ] )

    Vapply( sfbc, 'rxvo', vt.fuel.rxvo, '',
      lib.fbed.rxvo, [ sfbc.betr, sfbc.rxvm, sfbc.rxva ] )

    // Life category and total fuel bed reaction intensity
    Vapply( sfbd, 'rxid', vt.fuel.rxid, '', lib.fbed.rxid, [
      sfbc.rxvo, sfbd.wnet, sfbd.heat, sfbd.etas ] )

    Vapply( sfbd, 'rxi', vt.fire.rxi, '',
      lib.math.mul2, [ sfbd.etam, sfbd.rxid ] )

    Vapply( sfbl, 'rxid', vt.fuel.rxid, '',
      lib.fbed.rxid, [ sfbc.rxvo, sfbl.wnet, sfbl.heat, sfbl.etas ] )

    Vapply( sfbl, 'rxi', vt.fire.rxi, '',
      lib.math.mul2, [ sfbl.etam, sfbl.rxid ] )

    Vapply( sfbc, 'rxi',  vt.fire.rxi, 'Total',
      lib.math.sum2, [ sfbd.rxi, sfbl.rxi ] )

    // Fuel bed fire spread rate and heat
    Vapply( sfbc, 'ros0', vt.fuel.ros0, '',
      lib.fbed.ros0, [ sfbc.rxi, sfbc.pflx, sfbc.sink ] )

    Vapply( sfbc, 'hpua', vt.fire.hpua, '',
      lib.math.mul2, [ sfbc.rxi, sfbc.taur ] )

    // Fuel bed wind-slope factors
    Vapply( sfbc, 'slpf', vt.fuel.slpf, '',
      lib.fbed.slpf, [ sfbc.beta ] )

    Vapply( sfbc, 'wndb', vt.fuel.wndb, '',
      lib.fbed.wndb, [ sfbc.savr ] )

    Vapply( sfbc, 'wndc', vt.fuel.wndc, '',
      lib.fbed.wndc, [ sfbc.savr ] )

    Vapply( sfbc, 'wnde', vt.fuel.wnde, '',
      lib.fbed.wnde, [ sfbc.savr ] )

    Vapply( sfbc, 'wndk', vt.fuel.wndk, '',
      lib.fbed.wndk, [ sfbc.betr, sfbc.wnde, sfbc.wndc ] )

    Vapply( sfbc, 'wndi', vt.fuel.wndi, '',
      lib.fbed.wndi, [ sfbc.betr, sfbc.wnde, sfbc.wndc ] )

    // Fuel bed effective wind, wind coefficient, and spread rate limits
    Vapply( sfbc, 'ewsl', vt.fuel.ewsl, '',
      lib.fbed.ewsl, [ sfbc.rxi ] )

    Vapply( sfbc, 'phil', vt.fuel.phil, '',
      lib.fbed.phil, [ sfbc.ewsl, sfbc.wndb, sfbc.wndk ] )

    Vapply( sfbc, 'rosl', vt.fuel.rosl, '',
      lib.fbed.rosl, [ sfbc.ros0, sfbc.phil ] )

    // These could be fuel bed or fire properties....

    // Fuel bed midflame wind speed
    if ( idx === 0 ) {
      Vcfg( sfbc, 'mwaf', vt.fuel.mwaf, '', cfgWindWaf, [
        [ 'inp', dagInput ],
        [ 'dflt', lib.wind.mwafEst, [ cpy.cv, cpy.ht, cpy.fl, sfbc.depth ]]] ) // 'est'

      Vcfg( sfbc, 'mwsp', vt.fuel.mwsp, '', cfgWindSpeed, [
        [ 'mid', dagInput ],
        [ 'dflt', lib.wind.atMid, [ wnd.spd.at20, sfbc.mwaf ] ]])  // 'at10' || 'at20'
    } else if ( idx === 1 ) {
      Vbound( sfbc, 'mwaf', vt.fuel.mwaf, '', sf1bc.mwaf )
      Vbound( sfbc, 'mwsp', vt.fuel.mwsp, '', sf1bc.mwsp )
    } else if ( idx === 2 ) {
      // Crown fire canopy fuel WAF is always 0.4 based on 20-ft wind speed
      Vfixed( sfbc, 'mwaf', vt.fuel.mwaf, '', 0.4 )
      Vapply( sfbc, 'mwsp', vt.fuel.mwsp, '',
        lib.wind.atMid, [ wnd.spd.at20, sfbc.mwaf ] )
    }

    if ( idx !== 2 ) {
      Vapply( sff, 'phis', vt.fire.phis, '',
        lib.surf.phis, [ slpStp.rat, sfbc.slpf ] )
    } else {
      // Crown fire canopy fuel slope is always 0
      Vfixed( sff, 'phis', vt.fire.phis, '', 0.0 )
    }

    Vapply( sff, 'phiw', vt.fire.phiw, '',
      lib.surf.phiw, [ sfbc.mwsp, sfbc.wndb, sfbc.wndk ] )

    // Fire spread direction

    Vapply( sffd, 'slpros', vt.fire.ros, 'Slope Rate',
      lib.surf.spreadDirSlopeRate, [ sfbc.ros0, sff.phis ] )

    Vapply( sffd, 'wndros', vt.fire.ros, 'Wind Rate',
      lib.surf.spreadDirWindRate, [ sfbc.ros0, sff.phiw ] )

    if ( idx !== 2 ) {
      Vapply( sffd, 'x', vt.fire.comp, 'X',
        lib.surf.spreadDirXComp, [ sffd.wndros, sffd.slpros, wnd.dir.hdg.up ] )

      Vapply( sffd, 'y', vt.fire.comp, 'Y',
        lib.surf.spreadDirYComp, [ sffd.wndros, wnd.dir.hdg.up ] )
    } else {
      // Crown fire canopy fuel always assumes wind blows up slope
      Vapply( sffd, 'x', vt.fire.comp, 'X',
        lib.surf.spreadDirXComp, [ sffd.wndros, sffd.slpros, wk.upslopeWind ] )

      Vapply( sffd, 'y', vt.fire.comp, 'Y',
        lib.surf.spreadDirYComp, [ sffd.wndros, wk.upslopeWind ] )
    }

    Vapply( sffd, 'vecros', vt.fire.ros, 'Vector Rate',
      lib.surf.spreadDirVectorRate, [ sffd.x, sffd.y ] )

    Vapply( sffd, 'hdup', vt.fire.hdup, '',
      lib.surf.spreadDirAzUp, [ sffd.x, sffd.y, sffd.vecros ] )

    Vapply( sffd, 'hdno', vt.fire.hdno, '',
      lib.az.sum, [ slpDir.up, sffd.hdup ] )

    // Step 1 - EWS, WSC, and ROS under Upslope Wind Condition

    // Calculate wind-slope coefficient (phiEw') using method 1
    Vapply( sff, 'phiew1', vt.fire.phiew, 'Step 1',
      lib.math.sum2, [ sff.phis, sff.phiw ] )

    // Calculate effective wind speed using method 1 from the wind-slope coefficient
    Vapply( sff, 'ews1', vt.fuel.ewsp, 'Step 1',
      lib.surf.ews, [ sff.phiew1, sfbc.wndb, sfbc.wndi ] )

    // Calculate maximum fire spread rate using method 1
    Vapply( sff, 'ros1', vt.fire.ros, 'Step 1',
      lib.surf.rosMax, [ sfbc.ros0, sff.phiew1 ] )

    // Step 2 - EWS, WSC, and ROS under *Cross-slope Wind Condition* without Limits

    // Calculate maximum fire spread rate using method 2
    Vapply( sff, 'ros2', vt.fire.ros, 'Step 2',
      lib.surf.rosMaxCrossSlopeWind, [ sfbc.ros0, sffd.vecros ] )

    // Calculate wind-slope coefficient (phiEw') using method 2
    Vapply( sff, 'phiew2', vt.fire.phiew, 'Step 2',
      lib.surf.phiewInferred, [ sfbc.ros0, sff.ros2 ] )

    // Calculate effective wind speed using method 1 from the wind-slope coefficient
    Vapply( sff, 'ews2', vt.fuel.ewsp, 'Step 2',
      lib.surf.ews, [ sff.phiew2, sfbc.wndb, sfbc.wndi ] )

    // Step 3A - EWS, WSC, and ROS under Cross-slope Wind Condition
    //           with Only the Effective Wind Speed Limit Applied

    // Is the effective wind speed limit exceeded?
    Vapply( sff, 'ewsx', vt.fire.ewsx, '',
      lib.math.gt, [ sff.ews2, sfbc.ewsl ] )

    // Effective wind speed 3A is the minimum of EWS from Step 2 and the EWS limit
    Vapply( sff, 'ews3a', vt.fuel.ewsp, 'Step 3a',
      Math.min, [ sff.ews2, sfbc.ewsl ] )

    // Wind-slope coefficient 3A is the mimimum of WSC from Step 2 and the WSC limit
    Vapply( sff, 'phiew3a', vt.fire.phiew, 'Step 3a',
      Math.min, [ sff.phiew2, sfbc.phil ] )

    // Maximum spread rate 3A is the minimum of ROS from Step 2 and the Max ROS limit
    Vapply( sff, 'ros3a', vt.fire.ros, 'Step 3a',
      Math.min, [ sff.ros2, sfbc.rosl ] )

    // Step 3B - EWS, WSC, and ROS under Cross-slope Wind Condition
    //           with Only the Rate of Spread Limit Applied
    // because Pat sez fire spread rate cannot exceed the effective wind speed

    // Maximum fire spread rate is ROS and EWS from Step 2 with ros limit applied
    Vapply( sff, 'ros3b', vt.fire.ros, 'Step 3b',
      lib.surf.rosMaxRoslApplied, [ sff.ros2, sff.ews2 ] )

    // ROS limit is exceeded if ROS from Step 2 is greater than ROS from Step 3b
    Vapply( sff, 'rosx', vt.fire.rosx, '',
      lib.math.gt, [ sff.ros2, sff.ros3b ] )

    // Wind-slope coefficient must be recalculated using method 2
    Vapply( sff, 'phiew3b', vt.fire.phiew, 'Step 3b',
      lib.surf.phiewInferred, [ sfbc.ros0, sff.ros3b ] )

    // The effective wind speed must be recalculated using method 1
    Vapply( sff, 'ews3b', vt.fuel.ewsp, 'Step 3b',
      lib.surf.ews, [ sff.phiew3b, sfbc.wndb, sfbc.wndi ] )

    // Step 4 - Cross-slope Wind Condition with BOTH the Effective Wnd Speed
    //          AND the Spread Rate Limits Applied

    // Apply the ROS limits to the EWS-limited spread rate
    Vapply( sff, 'ros4', vt.fire.ros, 'Step 4',
      lib.surf.rosMaxRoslApplied, [ sff.ros3a, sff.ews3a ] )

    // Wind-slope coefficient must be recalculated using method 2
    Vapply( sff, 'phiew4', vt.fire.phiew, 'Step 4',
      lib.surf.phiewInferred, [ sfbc.ros0, sff.ros4 ] )

    // The effective wind speed must be recalculated using method 1
    Vapply( sff, 'ews4', vt.fuel.ewsp, 'Step 4',
      lib.surf.ews, [ sff.phiew4, sfbc.wndb, sfbc.wndi ] )

    // Step 5 - Final ROS, EWS, and WSC values based on client preferences

    Vcfg( sff, 'ros', vt.fire.ros, '', cfgFireEwsl, [
      [ 'yes', dagBound, sff.ros4 ],
      [ 'dflt', dagBound, sff.ros3b ]]) // cfgFireEwsl==='no'

    Vcfg( sff, 'phiew', vt.fire.phiew, '', cfgFireEwsl, [
      [ 'yes', dagBound, sff.phiew4 ],
      [ 'dflt', dagBound, sff.phiew3b ]]) // cfgFireEwsl==='no'

    Vcfg( sff, 'ewsp', vt.fuel.ewsp, '', cfgFireEwsl, [
      [ 'yes', dagBound, sff.ews4 ],
      [ 'dflt', dagBound, sff.ews3b ]]) // cfgFireEwsl==='no'

    Vapply( sff, 'fli', vt.fire.fli, '',
      lib.surf.fli, [ sff.ros, sfbc.rxi, sfbc.taur ] )

    Vapply( sff, 'fl', vt.fire.fl, '',
      lib.surf.fl, [ sff.fli ] )

    Vapply( sff, 'elwr', vt.fire.elwr, '',
      lib.surf.lwr, [ sff.ewsp ] )

    Vapply( sff, 'scht', vt.fire.scht, '',
      lib.surf.scorchHt, [ sff.fli, sfbc.mwsp, air.tmp ] )

    Vapply( sff, 'dist', vt.fire.dist, '',
      lib.math.mul2, [ sff.ros, ftime.etig ] )

    Vapply( sff, 'mdist', vt.fire.mdist, '',
      lib.math.div2, [ sff.dist, map.scl ] )

  }

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
  Vcfg( sfw, 'rosa', vt.fire.ros, 'Arithmetic Mean', cfgFuel2, [
    [ 'none', dagBound, sf1f.ros ],
    [ 'dflt', lib.surf.rosArithmetic, [ sf1m.cover, sf1f.ros, sf2f.ros ]]] )

  Vcfg( sfw, 'rose', vt.fire.ros, 'Expected Value', cfgFuel2, [
    [ 'none', dagBound, sf1f.ros ],
    [ 'dflt', lib.surf.rosExpectedMOCK, [ sf1m.cover, sf1f.ros, sf2f.ros ]]] )

  Vcfg( sfw, 'rosh', vt.fire.ros, 'Harmonic Mean', cfgFuel2, [
    [ 'none', dagBound, sf1f.ros ],
    [ 'dflt', lib.surf.rosHarmonic, [ sf1m.cover, sf1f.ros, sf2f.ros ]]] )

  Vcfg( sfw, 'ros', vt.fire.ros, 'Applied', cfgFireWtd, [
    [ 'expected', dagBound, sfw.rose ],
    [ 'harmonic', dagBound, sfw.rosh ],
    [ 'dflt', dagBound, sfw.rosa ]])  // cfgFireWtd==='arithmetic'

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

  Vapply( sfw, 'dist', vt.fire.dist, '',
    lib.math.mul2, [ sfw.ros, ftime.etig ] )

  Vapply( sfw, 'mdist', vt.fire.mdist, '',
    lib.math.div2, [ sfw.dist, map.scl ] )

  //--------------------------------------------------------------------------
  // Fire Ellipse Size
  //--------------------------------------------------------------------------

  // Stand-alone OR linked inputs

  Vcfg( sfe, 'ros', vt.fire.ros, 'Head', cfgSizeFli, [
    [ 'surface', dagBound, sfw.ros ],
    [ 'dflt', dagInput ] ] )                  // cfgSizeFli==='fli' || 'fl' (standalone)

  Vcfg( sfe, 'elwr', vt.fire.elwr, '', cfgSizeFli, [
    [ 'surface', dagBound, sfw.elwr ],
    [ 'dflt', dagInput ] ] )                  // cfgSizeFli==='fli' || 'fl' (standalone)

  // Because of circular dependencies, fl and fli must first be
  // declared before their dependencies can be defined
  var sfefl = Vcfg0( sfe, 'fl', vt.fire.fl, '', cfgSizeFli )
  var sfefli = Vcfg0( sfe, 'fli', vt.fire.fli, '', cfgSizeFli )

  Vcfg( sfe, 'fli', vt.fire.fli, '', cfgSizeFli, [
    [ 'surface', dagBound, sfw.fli ],
    [ 'fl', lib.surf.fliFromFl, [ sfe.fl ] ], // prefer flame length input
    [ 'dflt', dagInput ] ] )                  // cfgSizeFli==='fli' (standalone)

  Vcfg( sfe, 'fl', vt.fire.fl, '', cfgSizeFli, [
    [ 'surface', dagBound, sfw.fl ],
    [ 'fl', lib.surf.fl, [ sfe.fli ] ],       // prefer fireline intensity input
    [ 'dflt', dagInput ] ] )                  // cfgSizeFli==='fl' (standalone)

  // Fire ellipse spread rates
  Vapply( sfe, 'ecc', vt.fire.ecc, '',
    lib.fell.ecc, [ sfe.elwr ] )

  // Fire behavior at ellipse head
  Vbound( sfeh, 'ros', vt.fire.ros, '', sfe.ros )

  Vapply( sfeh, 'dist', vt.fire.dist, '',
    lib.math.mul2, [ sfeh.ros, ftime.etig ] )

  Vapply( sfeh, 'mdist', vt.fire.mdist, '',
    lib.math.div2, [ sfeh.dist, map.scl ] )

  Vbound( sfeh, 'fli', vt.fire.fli, '', sfe.fli )

  Vbound( sfeh, 'fl', vt.fire.fl, '', sfe.fl )

  Vapply( sfeh, 'scht', vt.fire.scht, '',
    lib.surf.scorchHt, [ sfeh.fli, sf1bc.mwsp, air.tmp ] )

  // Fire behavior at ellipse back
  Vapply( sfeb, 'ros', vt.fire.ros, '',
    lib.fell.rosBack, [ sfeh.ros, sfe.ecc ] )

  Vapply( sfeb, 'dist', vt.fire.dist, '',
    lib.math.mul2, [ sfeb.ros, ftime.etig ] )

  Vapply( sfeb, 'mdist', vt.fire.mdist, '',
    lib.math.div2, [ sfeb.dist, map.scl ] )

  Vapply( sfeb, 'fli', vt.fire.fli, '',
    lib.fell.fliAtAz, [ sfeh.fli, sfeh.ros, sfeb.ros ] )

  Vapply( sfeb, 'fl', vt.fire.fl, '',
    lib.surf.fl, [ sfeb.fli ] )

  Vapply( sfeb, 'scht', vt.fire.scht, '',
    lib.surf.scorchHt, [ sfeb.fli, sf1bc.mwsp, air.tmp ] )

  // Spread rate along ellipse major (head + back) axis
  Vapply( sfe, 'rosMajor', vt.fire.ros, 'Major Axis',
    lib.fell.rosMajor, [ sfeh.ros, sfeb.ros ] )

  // Spread rate at ellipse minor axis
  Vapply( sfe, 'rosMinor', vt.fire.ros, 'Minor Axis',
    lib.fell.rosMinor, [ sfe.rosMajor, sfe.elwr ] )

  // Fire behavior at ellipse flanks
  Vapply( sfef, 'ros', vt.fire.ros, '',
    lib.fell.rosFlank, [ sfe.rosMinor ] )

  Vapply( sfef, 'dist', vt.fire.dist, '',
    lib.math.mul2, [ sfef.ros, ftime.etig ] )

  Vapply( sfef, 'mdist', vt.fire.mdist, '',
    lib.math.div2, [ sfef.dist, map.scl ] )

  Vapply( sfef, 'fli', vt.fire.fli, '',
    lib.fell.fliAtAz, [ sfeh.fli, sfeh.ros, sfef.ros ] )

  Vapply( sfef, 'fl', vt.fire.fl, '',
    lib.surf.fl, [ sfef.fli ] )

  Vapply( sfef, 'scht', vt.fire.scht, '',
    lib.surf.scorchHt, [ sfef.fli, sf1bc.mwsp, air.tmp ] )

  // Ellipse focal point spread rates
  Vapply( sfe, 'rosF', vt.fire.ros, 'F',
    lib.fell.rosF, [ sfe.rosMajor ] )

  Vapply( sfe, 'rosG', vt.fire.ros, 'G',
    lib.fell.rosG, [ sfe.rosMajor, sfeb.ros ] )

  Vapply( sfe, 'rosH', vt.fire.ros, 'H',
    lib.fell.rosH, [ sfe.rosMinor ] )

  // Fire ellipse length
  Vapply( sfes, 'len', vt.fire.dist, 'Length',
    lib.math.mul2, [ sfe.rosMajor, ftime.etig ] )

  Vapply( sfes, 'mlen', vt.fire.mdist, 'Length',
    lib.math.div2, [ sfes.len, map.scl ] )

  // Fire ellipse width
  Vapply( sfes, 'wid', vt.fire.dist, 'Width',
    lib.math.mul2, [ sfe.rosMinor, ftime.etig ] )

  Vapply( sfes, 'mwid', vt.fire.mdist, 'Width',
    lib.math.div2, [ sfes.wid, map.scl ] )

  // Fire ellipse perimeter
  Vapply( sfes, 'perim', vt.fire.eper, '',
    lib.fell.perim, [ sfes.len, sfes.wid ] )

  Vapply( sfes, 'mperim', vt.fire.mper, '',
    lib.math.div2, [ sfes.perim, map.scl ] )

  // Fire ellipse area
  Vapply( sfes, 'area', vt.fire.earea, '',
    lib.fell.area, [ sfes.len, sfe.elwr ] )

  Vapply( sfes, 'marea', vt.fire.marea, 'Length',
    lib.fell.marea, [ sfes.area, map.scl ] )

  //----------------------------------------------------------------------------
  // Fire directions
  //----------------------------------------------------------------------------

  // Because of circular dependencies, all beta & psi directions must first be
  // declared before their dependencies can be defined
  var betaAzHd = Vcfg0( fbeta, 'azhd', vt.az.hd, '', cfgFireDir )
  var betaAzUp = Vcfg0( fbeta, 'azup', vt.az.up, '', cfgFireDir )
  var betaAzNo = Vcfg0( fbeta, 'azno', vt.az.no, '', cfgFireDir )
  var psiAzHd = Vcfg0( fpsi, 'azhd', vt.az.hd, '', cfgFireDir )
  var psiAzUp = Vcfg0( fpsi, 'azup', vt.az.up, '', cfgFireDir )
  var psiAzNo = Vcfg0( fpsi, 'azno', vt.az.no, '', cfgFireDir )

  Vcfg1( betaAzHd, [
    // Beta-from-head is directly input
    [ 'hd', dagInput ],
    // Beta-from-head is the difference of beta-from-north and the fire heading-from-north
    [ 'dflt', lib.fell.dirFromHead, [ fbeta.azno, sfw.hdno ] ]] ) // 'up' || 'no'

  Vcfg1( betaAzUp, [
    // Beta-from-upslope is directly input
    [ 'up', dagInput ],
    // Beta-from-upslope is the difference of beta-from-north and the upslope-from-north
    [ 'dflt', lib.az.diff, [ fbeta.azno, slpDir.up ] ]] ) // 'hd' || 'no'

  Vcfg1( betaAzNo, [
    // Beta-from-north is the sum of the fire hdg-from-north and the beta-from-head
    [ 'hd', lib.az.sum, [ sfw.hdno, fbeta.azhd ] ],
    // Beta from north is the sum of the upslope-from-north and beta-from-upslope
    [ 'up', lib.az.sum, [ slpDir.up, fbeta.azup ]],
    // Beta-from-north is directly input
    [ 'no', dagInput ]] )

  Vcfg1( psiAzHd, [
    // Psi-from-head is directly input
    [ 'hd', dagInput ],
    // Psi-from-head is the difference of psi-from-north and the fire heading-from-north
    [ 'dflt', lib.az.diff, [ fpsi.azno, sfw.hdno ] ]] ) // 'up' || 'no'

  Vcfg1( psiAzUp, [
    // Psi-from-upslope is directly input
    [ 'up', dagInput ],
    // Psi-from-upslope is the difference of psi-from-north and the upslope-from-north
    [ 'dflt', lib.az.diff, [ fpsi.azno, slpDir.up ] ]] ) // 'hd' || 'no'

  Vcfg1( psiAzNo, [
    // Psi-from-north is the sum of the fire hdg-from-north and the psi-from-head
    [ 'hd', lib.az.sum, [ sfw.hdno, fpsi.azhd ] ],
    // Psi from north is the sum of the upslope-from-north and psi-from-upslope
    [ 'up', lib.az.sum, [ slpDir.up, fpsi.azup ]],
    // Psi-from-north is directly input
    [ 'no', dagInput ]] )

  // Beta and Psi

  Vapply( sfeBeta, 'ros', vt.fire.ros, '',
    lib.fell.rosBeta, [ sfeh.ros, sfe.ecc, fbeta.azhd ])

  Vapply( sfeBeta, 'dist', vt.fire.dist, '',
    lib.math.mul2, [ sfeBeta.ros, ftime.etig ])

  Vapply( sfeBeta, 'mdist', vt.fire.mdist, '',
    lib.math.div2, [ sfeBeta.dist, map.scl ])

  // V5 fireline intensity at vector BETA uses the IGNITION POINT spread rate
  Vapply( sfeBeta, 'fli5', vt.fire.fli, '(v5)',
    lib.fell.fliAtAz, [ sfeh.fli, sfeh.ros, sfeBeta.ros ] )

  // V5 flame length at vector BETA uses the IGNITION POINT spread rate and fireline intensity
  Vapply( sfeBeta, 'fl5', vt.fire.fl, '(v5)',
    lib.surf.fl, [ sfeBeta.fli5 ] )

  // V5 sire scorch height at vector BETA uses the IGNITION POINT spread rate and fireline intensity
  Vapply( sfeBeta, 'scht5', vt.fire.scht, '(v5)',
    lib.surf.scorchHt, [ sfeBeta.fli5, sf1bc.mwsp, air.tmp ] )

  // V6 uses the fire PERIMETER expansion rate where BETA intersects the perimeter
  // to derive fireline intensity, which takes the folllowing 4 steps

  // Step 1 - determine Theta angle from ellipse center that intersects the BETA vector at the fire perimeter
  Vapply( sfeBeta, 'theta', vt.az.hd, 'Theta',
    lib.fell.thetaFromBeta, [ fbeta.azhd, sfe.rosF, sfe.rosG, sfe.rosH ] )

  // Step 2 - determine the PSI vector that intersects the BETA vector at the fire perimeter
  Vapply( sfeBeta, 'psi', vt.az.hd, 'Psi',
    lib.fell.psiFromTheta, [ sfeBeta.theta, sfe.rosF, sfe.rosH ] )

  // Step 3 - determine the fire perimeter expansion rate at BETA-PSI vector intersection
  Vapply( sfeBeta, 'rosPsi', vt.fire.ros, 'at Psi',
    lib.fell.rosPsi, [ sfeBeta.psi, sfe.rosF,  sfe.rosG, sfe.rosH ] )

  // Step 4 - V6 fireline intensity at BETA uses the FIRE PERIMETER expansion rate at BETA
  Vapply( sfeBeta, 'fli', vt.fire.fli, '',
    lib.fell.fliAtAz, [ sfeh.fli, sfeh.ros, sfeBeta.rosPsi ] )

  // V6 flame length at vector BETA uses the FIRE PERIMETER spread rate and fireline intensity
  Vapply( sfeBeta, 'fl', vt.fire.fl, '',
    lib.surf.fl, [ sfeBeta.fli ] )

  // V6 sire scorch height at vector BETA uses the FIRE PERIMETER spread rate and fireline intensity
  Vapply( sfeBeta, 'scht', vt.fire.scht, '',
    lib.surf.scorchHt, [ sfeBeta.fli, sf1bc.mwsp, air.tmp ] )

  // Psi
  Vapply( sfePsi, 'ros', vt.fire.ros, '',
    lib.fell.rosPsi, [ fpsi.azhd, sfe.rosF, sfe.rosG, sfe.rosH ])

  Vapply( sfePsi, 'dist', vt.fire.dist, '',
    lib.math.mul2, [ sfePsi.ros, ftime.etig ])

  Vapply( sfePsi, 'mdist', vt.fire.mdist, '',
    lib.math.div2, [ sfePsi.dist, map.scl ])

  Vapply( sfePsi, 'fli', vt.fire.fli, '',
    lib.fell.fliAtAz, [ sfeh.fli, sfeh.ros, sfePsi.ros ] )

  Vapply( sfePsi, 'fl', vt.fire.fl, '',
    lib.surf.fl, [ sfePsi.fli ] )

  Vapply( sfePsi, 'scht', vt.fire.scht, '',
    lib.surf.scorchHt, [ sfePsi.fli, sf1bc.mwsp, air.tmp ] )

  //----------------------------------------------------------------------------
  // Rothermel Crown Fire
  //----------------------------------------------------------------------------

  Vapply( cfire, 'elwr', vt.fire.elwr, '',
    lib.crown.clwr, [ wndSpd20 ] )

  Vapply( cfire, 'rActive', vt.fire.ros, 'Active',
    lib.crown.rActive, [ sf3.fire.ros ] )

  Vapply( cfire, 'powerWind', vt.fire.pow, 'Wind',
    lib.crown.powerWind, [ wndSpd20, cfire.rActive ] )

  Vapply( cfire, 'dist', vt.fire.dist, 'Active',
    lib.math.mul2, [ ftime.etig, cfire.rActive ] )

  Vapply( cfire, 'mdist', vt.fire.mdist, 'Active',
    lib.math.div2, [ cfire.dist, map.scl ] )

  Vapply( cfire, 'width', vt.fire.dist, 'Active Width',
    lib.math.div2, [ cfire.dist, cfire.elwr ] )

  Vapply( cfire, 'mwidth', vt.fire.mdist, 'Active Width',
    lib.math.div2, [ cfire.mdist, cfire.elwr ] )

  Vapply( cfire, 'perim', vt.fire.eper, 'Active',
    lib.crown.perim, [ cfire.dist, cfire.elwr ] )

  Vapply( cfire, 'mperim', vt.fire.mper, 'Active',
    lib.math.div2, [ cfire.perim, map.scl ] )

  Vapply( cfire, 'area', vt.fire.earea, 'Active',
    lib.crown.area, [ cfire.dist, cfire.elwr ] )

  Vapply( cfire, 'marea', vt.fire.marea, 'Active',
    lib.fell.marea, [ cfire.area, map.scl ] )

  // Stand-alone OR linked inputs

  Vcfg( csurf, 'hpua', vt.fire.hpua, 'Surface Fire', cfgCrownFli, [
    [ 'surface', dagBound, sfw.hpua ],
    [ 'dflt', dagInput ] ] )  // cfgCrown==='fli' || 'fl' (standalone)

  Vcfg( csurf, 'fli', vt.fire.fli, 'Surface Fire', cfgCrownFli, [
    [ 'surface', dagBound, sfw.fli ],
    [ 'fl', lib.surf.fliFromFl, [ sfe.fl ] ], // prefer flame length input
    [ 'dflt', dagInput ] ] )                  // cfgCrownFli==='fli' (standalone)

  Vcfg( csurf, 'fl', vt.fire.fl, 'Surface Fire', cfgCrownFli, [
    [ 'surface', dagBound, sfw.fl ],
    [ 'fl', lib.surf.fl, [ sfe.fli ] ],       // prefer fireline intensity input
    [ 'dflt', dagInput ] ] )                  // cfgCrownFli==='fl' (standalone)

  Vapply( cfire, 'hpuaActive', vt.fire.hpua, 'Active Crown',
    lib.crown.hpuaActive, [ cpy.hpua, sf3.bed.char.hpua ] )

  Vapply( cfire, 'fliActive', vt.fire.fli, 'Active Crown',
    lib.crown.fliActive, [ cfire.hpuaActive, cfire.rActive ] )

  Vapply( cfire, 'flActive', vt.fire.fl, 'Active Crown',
    lib.crown.flThomas, [ cfire.fliActive ] )

  Vapply( cfire, 'powerFire', vt.fire.pow, 'Fire',
    lib.crown.powerFire, [ cfire.fliActive ] )

  Vapply( cfire, 'powerRatio', vt.ratio, 'Fire-to-Wind',
    lib.math.div2, [ cfire.powerFire, cfire.powerWind ] )

  Vapply( cfire, 'windDriven', vt.boolean, 'Fire is Wind Driven',
    lib.math.lt, [ cfire.powerFire, cfire.powerWind ] )

  Vapply( cfire, 'plumeDominated', vt.boolean, 'Fire is Plume Dominated',
    lib.math.ge, [ cfire.powerFire, cfire.powerWind ] )

  //----------------------------------------------------------------------------
  // Scott & Reinhardt Crown Fire
  //----------------------------------------------------------------------------

  // I'initiation: critical surface fireline intensity to initiate a crown fire
  Vapply( csurf, 'fliInit', vt.fire.fli, 'Critical',
    lib.crown.fliInit, [ cpy.mc ,cpy.bh ] )

  Vapply( csurf, 'flInit', vt.fire.fl, 'Critical',
    lib.surf.fl, [ csurf.fliInit ] )

  Vapply( csurf, 'transRatio', vt.ratio, 'Transition',
    lib.crown.transRatio, [ csurf.fli, csurf.fliInit ] )

  Vapply( csurf, 'canTrans', vt.boolean, 'Can Transition to Crown',
    lib.crown.canTrans, [ csurf.transRatio ] )

  Vapply( csurf, 'rInit', vt.fire.ros, 'Critical',
    lib.crown.rInit, [ csurf.fliInit, csurf.hpua ] )

  Vapply( cfire, 'rPrimeActive', vt.fire.ros, 'Critical',
    lib.crown.rPrimeActive, [ cpy.bd ] )

  Vapply( cfire, 'activeRatio', vt.boolean, 'Active',
    lib.math.div2, [ cfire.rActive, cfire.rPrimeActive ] )

  Vapply( cfire, 'type', vt.string, 'Fire Type',
    lib.crown.type, [ csurf.transRatio, cfire.activeRatio ] )

  Vapply( cfire, 'isActive', vt.boolean, 'Is Active',
    lib.crown.isActive, [ csurf.transRatio, cfire.activeRatio ] )

  Vapply( cfire, 'isConditional', vt.boolean, 'Is Active',
    lib.crown.isConditional, [ csurf.transRatio, cfire.activeRatio ] )

  Vapply( cfire, 'isCrown', vt.boolean, 'Is Active',
    lib.crown.isCrown, [ csurf.transRatio, cfire.activeRatio ] )

  Vapply( cfire, 'isPassive', vt.boolean, 'Is Active',
    lib.crown.isPassive, [ csurf.transRatio, cfire.activeRatio ] )

  Vapply( cfire, 'isSurface', vt.boolean, 'Is Active',
    lib.crown.isSurface, [ csurf.transRatio, cfire.activeRatio ] )

  Vapply( cfire, 'cidx', vt.fire.cidx, '',
    lib.crown.ci, [ cpy.bd, sf3.bed.char.rxi, sf3.bed.char.sink, sf3.fire.phis ] )

  Vbound( cfire, 'oActive', vt.wind.spd, 'Active Crown Fire', cfire.cidx )

  // NOTE: R'sa requires a SURFACE FUEL ros0, windB, windK, and phiS
  // which means that if any of the following are selected,
  // 1 - cfgCrownFli MUST === 'surface'
  // 2 - wind heading from upslope MUST === 0

  Vcfg( csurf, 'ros0', vt.fire.ros, 'Surface Fire', cfgCrownFli, [
    [ 'surface', dagBound, sf1bc.ros0 ],
    [ 'dflt', dagInput ] ] )  // cfgCrown==='fli' || 'fl' (standalone)

  Vcfg( csurf, 'mwaf', vt.fuel.mwaf, 'Surface Fire', cfgCrownFli, [
    [ 'surface', dagBound, sf1bc.mwaf ],
    [ 'dflt', dagInput ] ] )  // cfgCrown==='fli' || 'fl' (standalone)

  Vcfg( csurf, 'wndb', vt.fuel.wndb, 'Surface Fire', cfgCrownFli, [
    [ 'surface', dagBound, sf1bc.wndb ],
    [ 'dflt', dagInput ] ] )  // cfgCrown==='fli' || 'fl' (standalone)

  Vcfg( csurf, 'wndk', vt.fuel.wndk, 'Surface Fire', cfgCrownFli, [
    [ 'surface', dagBound, sf1bc.wndk ],
    [ 'dflt', dagInput ] ] )  // cfgCrown==='fli' || 'fl' (standalone)

  Vcfg( csurf, 'phis', vt.fire.phis, 'Surface Fire', cfgCrownFli, [
    [ 'surface', dagBound, sf1.fire.phis ],
    [ 'dflt', dagInput ] ] )  // cfgCrown==='fli' || 'fl' (standalone)

  Vapply( csurf, 'rSa', vt.fire.cidx, '',
    lib.crown.rSa, [ cfire.oActive, csurf.ros0, csurf.mwaf,
      csurf.wndb, csurf.wndk, csurf.phis ] )

  Vcfg( csurf, 'ros', vt.fire.ros, 'Surface Fire', cfgCrownFli, [
    [ 'surface', dagBound, sf1f.ros ],
    [ 'dflt', dagInput ] ] )  // cfgCrown==='fli' || 'fl' (standalone)

  Vapply( cfire, 'cfb', vt.fraction, 'Crown Fraction Burned',
    lib.crown.cfb, [ csurf.ros, csurf.rInit, csurf.rSa ] )

  Vapply( cfire, 'rFinal', vt.fire.ros, 'Final',
    lib.crown.rFinal, [ csurf.ros, cfire.rActive, cfire.cfb ] )

  Vapply( cfire, 'fliFinal', vt.fire.fli, 'Final',
    lib.crown.fliFinal, [ cfire.rFinal, cfire.cfb, cpy.hpua, csurf.hpua ] )

  Vapply( cfire, 'flFinal', vt.fire.fl, 'Final',
    lib.crown.flThomas, [ cfire.fliFinal ] )

  // Add final dist, mdist, area, marea, leng, mleng, width, mwidth

  Vapply( cfire, 'distFinal', vt.fire.dist, 'Final',
    lib.math.mul2, [ ftime.etig, cfire.rFinal ] )

  Vapply( cfire, 'mdistFinal', vt.fire.mdist, 'Final',
    lib.math.div2, [ cfire.distFinal, map.scl ] )

  Vapply( cfire, 'widthFinal', vt.fire.dist, 'Final Width',
    lib.math.div2, [ cfire.distFinal, cfire.elwr ] )

  Vapply( cfire, 'mwidthFinal', vt.fire.mdist, 'Final Width',
    lib.math.div2, [ cfire.mdistFinal, cfire.elwr ] )

  Vapply( cfire, 'perimFinal', vt.fire.eper, 'Final',
    lib.crown.perim, [ cfire.distFinal, cfire.elwr ] )

  Vapply( cfire, 'mperimFinal', vt.fire.mper, 'Final',
    lib.math.div2, [ cfire.perimFinal, map.scl ] )

  Vapply( cfire, 'areaFinal', vt.fire.earea, 'Final',
    lib.crown.area, [ cfire.distFinal, cfire.elwr ] )

  Vapply( cfire, 'mareaFinal', vt.fire.marea, 'Final',
    lib.fell.marea, [ cfire.areaFinal, map.scl ] )

  // var mort = new Dag( nodes, 'mort', 'Mortality' )
  // var spot = new Dag( nodes, 'spot', 'Spot' )
  // var cont = new Dag( nodes, 'cont', 'Contain' )
  // var ignt = new Dag( nodes, 'ignt', 'Ignition Probability' )

  return nodes
}

module.exports = {
  createNodes: createNodes,
}
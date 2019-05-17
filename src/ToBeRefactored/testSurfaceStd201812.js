"use strict"

// Tests standard fuel models 10 and 124 from the catalog
// Tests basic fuel bed and fire behavior

var startTime = Date.now()

const debug = require('./libDebug')
debug.addTime( 'Begin' )
const dag = require('./libDag')
const full = require('./nodesFull201811')
const surf = require('./libSurfaceFire')

debug.addTime( 'require()' )

function test1() {
  var bp7 = dag.createBp7()
  var nodes = full.createNodes()
  var worksheet = dag.addWorksheet( bp7, 'w1', 'Simple Test', nodes )

  debug.addTime( 'Compose Worksheet' )

  var cfg = worksheet.nodes.cfg
  dag.setConfigs( [
    [ worksheet.nodes.cfg.fuel.fuel1, 'catalog' ],    // 'catalog', 'std', 'chp', 'pgb', 'was'
    [ worksheet.nodes.cfg.fuel.fuel2, 'none' ],    // 'none', 'catalog', 'std', 'chp', 'pgb', 'was'
    [ worksheet.nodes.cfg.fuel.hcf, 'estimated' ],        // 'estimated', 'input'
    [ worksheet.nodes.cfg.fuel.chapLoad, 'input' ],   // 'input', 'estimated'
    [ worksheet.nodes.cfg.mois.input, 'individual' ], // 'lifeCategory', 'mixed', 'individual', 'scenario'
    [ worksheet.nodes.cfg.slope.steepness, 'ratio' ], // 'map', 'degrees', 'ratio'
    [ worksheet.nodes.cfg.wind.speed, 'atMidflame' ], // 'at10m', 'at20ft', 'atMidflame'
    [ worksheet.nodes.cfg.wind.waf, 'input' ],        // 'estimated', 'input'
    [ worksheet.nodes.cfg.wind.dir, 'headingFromUpslope' ], // 'sourceFromNorth', 'headingFromUplsope', 'assumedUpslope'
    [ worksheet.nodes.cfg.fire.ewsl, 'yes' ],         // 'yes', 'no'
    [ worksheet.nodes.cfg.fire.wtd, 'arithmetic' ],   // 'arithmetic', 'expected', 'harmonic'
    [ worksheet.nodes.cfg.fire.dir, 'no' ],           // 'hd', 'up, 'no'
    [ worksheet.nodes.cfg.size.link, 'surface' ],  // 'surface', 'standalone'
    [ worksheet.nodes.cfg.fire.fli, 'fl' ],           // 'fl', 'fli
    [ worksheet.nodes.cfg.fire.lwr, 'elwr' ],         // 'elwr', 'ewsp'
    [ worksheet.nodes.cfg.crown.link, 'surface' ], // 'surface', 'standalone'
  ])
  debug.addTime( 'setConfigs' )

  var allow09 = 1.0e-9
  var allow08 = 1.0e-8
  var allow07 = 1.0e-7
  var allow06 = 1.0e-6

  var allTests = true
  var sf1 = worksheet.nodes.surf.fuel.sf1
  var el = worksheet.nodes.surf.fire.el

  var elapsed = 60.0
  var mapScale = 24000.0
  var mwsp = 880.0

  var beta5fli010 = 389.95413667947145 * 2.6256648650882601 / 18.551680325448835
  var beta5fl010 = 0.45 * Math.pow( beta5fli010, 0.46 )
  var beta5scht010 = surf.scorchHt( beta5fli010, 880.0, 95.0 )

  var beta5fli124 = 2467.9286450361865 * 6.8494531181657319 / 48.470425993990560
  var beta5fl124  = 0.45 * Math.pow( beta5fli124, 0.46 )
  var beta5scht124 = surf.scorchHt( beta5fli124, 880.0, 95.0 )

  var testFuelBed = true
  var testFuelFire = true
  var testFireEllipse = true

  // NOTE that adding lots of selected Variants increases reconfig() time
  if ( testFuelBed ) {
    // Primary fuel
    debug.addTests( [
      [ sf1.bed.char.load, 0, 0.552, allow09 ],
      [ sf1.bed.char.savr, 0, 1764.3319812126388, allow09 ],
      [ sf1.bed.char.beta, 0, 0.01725, allow09 ],
      [ sf1.bed.char.bulk, 0, 0.552, allow09 ],

      [ sf1.bed.dead.rxid, 0, 5539.9575948899355, allow09 ],
      [ sf1.bed.dead.efld, 0, 0.15704963842638839, allow09 ],
      [ sf1.bed.dead.efmc, 0, 0.053892078848839550, allow09 ],
      [ sf1.bed.dead.mois, 0, 0.051626884422110553, allow09 ],
      [ sf1.bed.dead.etam, 0, 0.65206408989980214, allow09 ],
      [ sf1.bed.dead.rxi, 0, 3612.4074071954024, allow09 ],

      [ sf1.bed.live.rxid, 0, 3677.5200629895871, allow09 ],
      [ sf1.bed.live.mois, 0, 1.5, allow09 ],
      [ sf1.bed.live.efld, 0, 0.065920880572788609, allow09 ],
      [ sf1.bed.live.mxtk, 0, 6.908948234294801, allow09 ],
      [ sf1.bed.live.mext, 0, 5.1935979022741359, allow09 ],
      [ sf1.bed.live.etam, 0, 0.59341294014849078, allow09 ],
      [ sf1.bed.live.rxi, 0, 2182.2879930337140, allow09 ],

      [ sf1.bed.char.hpua, 0, 1261.1929372603729, allow09 ],
      [ sf1.bed.char.rxi, 0, 5794.6954002291168, allow09 ],
      [ sf1.bed.char.sink, 0, 412.34037227937284, allow09 ], // rhoB Qig
      [ sf1.bed.char.ros0, 0, 0.67900860922904482, allow09 ],
      [ sf1.bed.char.taur, 0, 0.21764611427384198, allow09 ],

      [ sf1.fire.phiw, 0, 26.298112107312534, allow09 ],
      [ sf1.fire.phis, 0, 1.1144632487759358, allow09 ],
      [ sf1.fire.phiew1, 0, 27.412575356088471, allow09 ],
      [ sf1.fire.ews1, 0, 905.9004592463673, allow09 ],
      [ sf1.fire.ros1, 0, 19.292383277153064, allow09 ],

      [ sf1.fire.dir.slpros, 0,  0.75673014058823118, allow09 ],
      [ sf1.fire.dir.wndros, 0,  17.856644527335789, allow09 ],
      [ sf1.fire.dir.x, 0, 0.75673013692577218, 1.0e-8 ],
      [ sf1.fire.dir.y, 0, 17.856644527335789, allow09 ],
      [ sf1.fire.dir.vecros, 0,  17.872671716374864, allow09 ],
      [ sf1.fire.dir.hdup, 0, 87.573367385837855, allow09 ],
      [ sf1.fire.dir.hdno, 0, 87.573367385837855, allow09 ],

      [ sf1.fire.phiew2, 0, 26.321715915373524, allow09 ],
      [ sf1.fire.ews2, 0, 880.55194372010692, allow09 ],
      [ sf1.fire.ros2, 0, 18.551680325448835, allow09 ],

      [ sf1.fire.phiew3a, 0, 26.321715915373524, allow09 ],
      [ sf1.fire.ews3a, 0, 880.55194372010692, allow09 ],
      [ sf1.fire.ros3a, 0, 18.551680325448835, allow09 ],

      [ sf1.fire.phiew3b, 0, 26.321715915373524, allow09 ],
      [ sf1.fire.ews3b, 0, 880.55194372010692, allow09 ],
      [ sf1.fire.ros3b, 0, 18.551680325448835, allow09 ],

      [ sf1.fire.phiew4, 0, 26.321715915373524, allow09 ],
      [ sf1.fire.ews4, 0, 880.55194372010692, allow09 ],
      [ sf1.fire.ros4, 0, 18.551680325448835, allow09 ]])
  }

  if ( testFuelFire ) {
    debug.addTests( [
      [ sf1.fire.ros, 0, 18.551680325448835, allow09 ],
      [ sf1.fire.dist, 0, 1113.1008195269301, allow09 ],
      [ sf1.fire.mdist, 0, 1113.1008195269301/mapScale, allow09 ],
      [ sf1.fire.phiew, 0, 26.321715915373524, allow09 ],
      [ sf1.fire.ewsp, 0, 880.55194372010692, allow09 ],
      [ sf1.fire.elwr, 0, 3.5015680219321221, allow09 ],
      [ sf1.fire.fli, 0, 389.95413667947145, allow09 ],
      [ sf1.fire.fl, 0, 6.9996889013229229, allow09 ],
      [ sf1.fire.scht, 0, 39.580181786322299, allow09 ],
    ])
  }

  if ( testFireEllipse ) {
    debug.addTests( [
      [ el.ecc, 0, 0.95835298387126711, allow09 ],
      [ el.ros, 0, 18.551680325448835, allow09 ],
      [ el.fli, 0, 389.95413667947145, allow09 ],
      [ el.fl, 0, 6.9996889013229229, allow09 ],
      [ el.rosMajor, 0, 0.39452649041938642 + 18.551680325448835, allow09 ],
      [ el.rosMinor, 0, 2. * 2.7053889424963877, allow09 ],
      [ el.rosF, 0, 9.4731034079341114, allow09 ],
      [ el.rosG, 0, 9.0785769175147255, allow09 ],
      [ el.rosH, 0, 2.7053889424963877, allow09 ],
      [ el.head.ros, 0, 18.551680325448835, allow09 ],
      [ el.head.dist, 0, 1113.1008195269301, allow09 ],
      [ el.head.mdist, 0, 1113.1008195269301/mapScale, allow09 ],
      [ el.head.fli, 0, 389.95413667947145, allow09 ],
      [ el.head.fl, 0, 6.9996889013229229, allow09 ],
      [ el.head.scht, 0, 39.580181786322299, allow09 ],
      [ el.back.ros, 0, 0.39452649041938642, allow09 ],
      [ el.back.dist, 0, 23.671589425163184, allow09 ],
      [ el.back.mdist, 0, 23.671589425163184/mapScale, allow09 ],
      [ el.back.fli, 0, 8.2929003879841954, allow09 ],
      [ el.back.fl, 0, 1.1907414731175683, allow09 ],
      [ el.back.scht, 0, 0.52018662032054752, allow09 ],
      [ el.flnk.ros, 0, 2.7053889424963877, allow09 ],
      [ el.flnk.dist, 0, 162.32333654978328, allow09 ],
      [ el.flnk.mdist, 0, 162.32333654978328/mapScale, allow09 ],
      [ el.flnk.fli, 0, 56.866957074505869, allow09 ],
      [ el.flnk.fl, 0, 2.8870088099013929, allow09 ],
      [ el.flnk.scht, 0, 4.8023644521509334, allow09 ],
      [ el.size.area, 0, 6.6540562767917546*(66.*660.), 1.0e-7 ],
      [ el.size.marea, 0, 6.6540562767917546*(66.*660.)/mapScale/mapScale, 1.0e-7 ],
      [ el.size.perim, 0, 2476.2400999186934, 1.0e-9 ],
      [ el.size.mperim, 0, 2476.2400999186934/mapScale, 1.0e-9 ],
      [ el.size.wid, 0, 324.64667309956644, allow09 ],
      [ el.size.mwid, 0, 324.64667309956644/mapScale, allow09 ],
      [ el.size.len, 0, 1136.7724089520932, allow09 ],
      [ el.size.mlen, 0, 1136.7724089520932/mapScale, allow09 ],
      // beta and psi
      [ worksheet.nodes.slp.dir.asp, 0, 180.0, allow09 ],
      [ worksheet.nodes.slp.dir.up, 0, 0.0, allow09 ],
      [ worksheet.nodes.fire.vec.beta.azno, 0, 45.0, allow09 ],
      [ worksheet.nodes.fire.vec.beta.azup, 0, 45.0, allow09 ],
      [ worksheet.nodes.fire.vec.beta.azhd, 0, 360. - 42.573367385837855, allow09 ],
      [ el.beta.ros, 0, 2.6256648650882601, allow09 ],
      [ el.beta.dist, 0, elapsed * 2.6256648650882601, allow09 ],
      [ el.beta.mdist, 0, elapsed * 2.6256648650882601 / mapScale, allow09 ],
      [ el.beta.fli5, 0, beta5fli010, allow09 ],
      [ el.beta.fl5, 0, beta5fl010, allow09 ],
      [ el.beta.scht5, 0, beta5scht010, allow09 ],
      [ el.beta.theta, 0, 138.95912883244358, allow08 ],
      [ el.beta.psi, 0, 108.16241745554537, allow08 ],
      [ el.beta.fli, 0, 22.809320529051977, allow08 ],
      [ el.beta.fl, 0, 1.8964622135871170, allow08 ],
      [ el.beta.scht, 0, 1.6814949065754006, allow08 ],
      [ el.psi.ros, 0, 13.89777958366360, allow09 ],
      [ el.psi.dist, 0, elapsed * 13.89777958366360, allow09 ],
      [ el.psi.mdist, 0, elapsed * 13.89777958366360 / mapScale, allow09 ],
      [ el.psi.fli, 0, 292.12969090863300, allow08 ],
      [ el.psi.fl, 0, 6.12882661647451, allow08 ],
      [ el.psi.scht, 0, 29.307635864149884, allow08 ],
    ] )
  }

  // Secondary fuel
  if ( testFuelBed ) {
    debug.addTests( [
      [ sf1.bed.char.load, 1, 0.5876951331496785, allow09 ],
      [ sf1.bed.char.savr, 1, 1631.1287341340956, allow09 ],
      [ sf1.bed.char.bulk, 1, 0.27985482530937067, allow09 ],
      [ sf1.bed.char.beta, 1, 0.0087454632909178334, allow09 ],

      [ sf1.bed.dead.savr, 1, 1682.0151742581315, allow09 ],
      [ sf1.bed.dead.rxid, 1, 9769.8093293148086, allow09 ],
      [ sf1.bed.dead.efld, 1, 0.19614226054223394, allow09 ],
      [ sf1.bed.dead.efmc, 1, 0.050405399380187531, allow09 ],
      [ sf1.bed.dead.mois, 1, 0.050100676116867547, allow09 ],
      [ sf1.bed.dead.qign, 1, 280.82404927316645, allow09 ],
      [ sf1.bed.dead.etam, 1, 0.74884711762612932, allow09 ],
      [ sf1.bed.dead.rxi, 1, 7316.0935560142625, allow09 ],
      //[ sf1.bed.dead.wnet, 1, 0.20777819078484744, allow09 ],
      [ sf1.bed.dead.load, 1, 0.2270523415977961, allow09 ],

      [ sf1.bed.live.savr, 1, 1600.0, allow09 ],
      [ sf1.bed.live.rxid, 1, 16957.560830348066, allow09 ],
      [ sf1.bed.live.mois, 1, 1.4039058919386871, allow09 ],
      [ sf1.bed.live.qign, 1, 1666.6308455498106, allow09 ],
      [ sf1.bed.live.efld, 1, 0.26385190276630305, allow09 ],
      [ sf1.bed.live.mxtk, 1, 2.1558023634049093, allow09 ],
      [ sf1.bed.live.mext, 1, 1.6581421656244677, allow09 ],
      [ sf1.bed.live.etam, 1, 0.33380976126895767, allow09 ],
      [ sf1.bed.live.rxi, 1, 5660.5993324823157, allow09 ],
      //[ sf1.bed.live.wnet, 1, 0.36064279155188239, allow09 ],
      [ sf1.bed.live.load, 1, 0.36064279155188239, allow09 ],

      [ sf1.bed.char.hpua, 1, 3054.9704415746182, allow09 ],
      [ sf1.bed.char.rxi, 1, 12976.692888496578, allow09 ],
      [ sf1.bed.char.sink, 1, 319.21640437931171, allow09 ], // rhoB Qig
      [ sf1.bed.char.ros0, 1, 1.4333245773924823, allow09 ],
      [ sf1.bed.char.taur, 1, 0.23541979977677915, allow09 ],

      [ sf1.fire.phis, 1, 1.3663678507662047, allow09 ],
      [ sf1.fire.phiw, 1, 32.788325298000515, allow09 ],
      [ sf1.fire.phiew1, 1, 34.1546931487667, allow09 ],
      [ sf1.fire.ews1, 1, 906.591252927795, allow09 ],
      [ sf1.fire.ros1, 1, 50.388085700818451, allow09 ],

      [ sf1.fire.dir.slpros, 1, 1.9584486222621447, allow09 ],
      [ sf1.fire.dir.wndros, 1, 46.996312501163828, allow09 ],
      [ sf1.fire.dir.x, 1, 1.9584486126230398, 1.0e-8 ],
      [ sf1.fire.dir.y, 1, 46.996312501163828, allow09 ],
      [ sf1.fire.dir.vecros, 1, 47.037101416598077, allow09 ],
      [ sf1.fire.dir.hdup, 1, 87.613728665173383, allow09 ],
      [ sf1.fire.dir.hdno, 1, 87.613728665173383, allow09 ],

      [ sf1.fire.phiew2, 1, 32.816782854703028, allow09 ],
      [ sf1.fire.ews2, 1, 880.55684333220040, allow09 ],
      [ sf1.fire.ros2, 1, 48.470425993990560, allow09 ],

      [ sf1.fire.phiew3a, 1, 32.816782854703028, allow09 ],
      [ sf1.fire.ews3a, 1, 880.55684333220040, allow09 ],
      [ sf1.fire.ros3a, 1, 48.470425993990560, allow09 ],

      [ sf1.fire.phiew3b, 1, 32.816782854703028, allow09 ],
      [ sf1.fire.ews3b, 1, 880.55684333220040, allow09 ],
      [ sf1.fire.ros3b, 1, 48.470425993990560, allow09 ],

      [ sf1.fire.phiew4, 1, 32.816782854703028, allow09 ],
      [ sf1.fire.ews4, 1, 880.55684333220040, allow09 ],
      [ sf1.fire.ros4, 1, 48.470425993990560, allow09 ],
    ] )
  }
  if ( testFuelFire ) {
    debug.addTests( [
      [ sf1.fire.ros, 1, 48.470425993990560, allow09 ],
      [ sf1.fire.dist, 1, 2908.2255596394334, allow09 ],
      [ sf1.fire.mdist, 1, 2908.2255596394334/24000.0, allow09 ],
      [ sf1.fire.phiew, 1, 32.816782854703028, allow09 ],
      [ sf1.fire.ewsp, 1, 880.55684333220040, allow09 ],
      [ sf1.fire.elwr, 1, 3.5015819412846603, allow09 ],
      [ sf1.fire.fli, 1, 2467.9286450361865, allow09 ],
      [ sf1.fire.fl, 1, 16.356316633171140, allow09 ],
      [ sf1.fire.scht, 1, 215.68277136796777, allow09 ],
    ])
  }

  if ( testFireEllipse ) {
    debug.addTests( [
      [ el.ecc, 1, 0.95835332217217739, allow09 ],
      [ el.ros, 1, 48.470425993990560, allow09 ],
      [ el.fli, 1, 2467.9286450361865, allow09 ],
      [ el.fl, 1, 16.356316633171140, allow09 ],
      [ el.rosMajor, 1, 1.0307803973340242 + 48.470425993990560, allow09 ],
      [ el.rosMinor, 1, 2. * 7.0684061120619655, allow09 ],
      [ el.rosF, 1, 1485.0361917397374 / 60., allow09 ],
      [ el.rosG, 1, 1423.1893678996960 / 60., allow09 ],
      [ el.rosH, 1, 424.10436672371787 / 60., allow09 ],
      [ el.head.ros, 1, 48.470425993990560, allow09 ],
      [ el.head.dist, 1, 2908.2255596394334, allow09 ],
      [ el.head.mdist, 1, 2908.2255596394334/mapScale, allow09 ],
      [ el.head.fli, 1, 2467.9286450361865, allow09 ],
      [ el.head.fl, 1, 16.356316633171140, allow09 ],
      [ el.back.ros, 1, 1.0307803973340242, allow09 ],
      [ el.back.dist, 1, 61.846823840041452, allow09 ],
      [ el.back.mdist, 1, 61.846823840041452/mapScale, allow09 ],
      [ el.back.fli, 1, 52.483394093499705, allow09 ],
      [ el.back.fl, 1, 2.7824194067294856, allow09 ],
      [ el.back.scht, 1, 4.3824121071933915, allow09 ],
      [ el.flnk.ros, 1, 7.0684061120619655, allow09 ],
      [ el.flnk.dist, 1, 424.10436672371793, allow09 ],
      [ el.flnk.mdist, 1, 424.10436672371793/mapScale, allow09 ],
      [ el.flnk.fli, 1, 359.89619544220318, allow09 ],
      [ el.flnk.fl, 1, 6.7461198324614715, allow09 ],
      [ el.flnk.scht, 1, 36.440372402518008, allow09 ],
      [ el.size.area, 1, 45.422576205218135*(66.*660.), 1.0e-7 ],
      [ el.size.marea, 1, 45.422576205218135*(66.*660.)/mapScale/mapScale, 1.0e-7 ],
      [ el.size.perim, 1, 6469.7282289420209, 1.0e-9 ],
      [ el.size.mperim, 1, 6469.7282289420209/mapScale, 1.0e-9 ],
      [ el.size.wid, 1, 848.20873344743575, allow09 ],
      [ el.size.mwid, 1, 848.20873344743575/mapScale, allow09 ],
      [ el.size.len, 1, 2970.0723834794749, allow09 ],
      [ el.size.mlen, 1, 2970.0723834794749/mapScale, allow09 ],
      // Beta and psi
      [ el.beta.ros, 1, 6.8494531181657319, allow09 ],
      [ el.beta.dist, 1, elapsed * 6.8494531181657319, allow09 ],
      [ el.beta.mdist, 1, elapsed * 6.8494531181657319 / mapScale, allow09 ],
      [ el.beta.fli5, 1, beta5fli124, allow09 ],
      [ el.beta.fl5, 1, beta5fl124, allow09 ],
      [ el.beta.scht5, 1, beta5scht124, allow09 ],
      [ el.beta.fli, 1, 144.22374220988746, allow08 ],
      [ el.beta.fl, 1, 4.4296501098298906, allow08 ],
      [ el.beta.scht, 1, 13.669401441568459, allow08 ],
      [ el.beta.theta, 1, 138.99842626716800, allow08 ],
      [ el.beta.psi, 1, 108.18586769434800, allow08 ],
      [ el.psi.ros, 1, 36.28927049813540, allow09 ],
      [ el.psi.dist, 1, elapsed * 36.28927049813540, allow09 ],
      [ el.psi.mdist, 1, elapsed * 36.28927049813540 / mapScale, allow09 ],
      [ el.psi.fli, 1, 1847.7108119684900, allow08 ],
      [ el.psi.fl, 1, 14.31739984718150, allow08 ],
      [ el.psi.scht, 1, 169.80644998818718, allow08 ],
    ])
  }

  debug.addTime( 'addTests' )

  dag.reconfig( worksheet )
  debug.addTime( 'reconfig()' )

  dag.setInputs( [
    [ worksheet.nodes.surf.fuel.sf1.modl.key, ['10', '124'] ],
    [ worksheet.nodes.mois.dead.tl1, [0.05] ],
    [ worksheet.nodes.mois.dead.tl10, [0.07] ],
    [ worksheet.nodes.mois.dead.tl100, [0.09] ],
    [ worksheet.nodes.mois.live.herb, [0.50] ],
    [ worksheet.nodes.mois.live.stem, [1.50] ],
    [ worksheet.nodes.slp.stp.rat, [0.25] ],
    [ worksheet.nodes.slp.dir.asp, [180.0] ],
    [ worksheet.nodes.wnd.dir.hdg.up, [90.0] ],
    [ worksheet.nodes.air.tmp, [95.0] ],
    [ worksheet.nodes.surf.fuel.sf1.bed.char.mwsp, [880.] ],
    [ worksheet.nodes.fire.time.etig, [60.0] ],
    [ worksheet.nodes.map.scl, [24000.0] ],
    [ worksheet.nodes.fire.vec.beta.azno, [45.0] ],
    [ worksheet.nodes.fire.vec.psi.azno, [45.0] ],
  ])
  debug.addTime( 'setInputs' )

  //console.log( debug.listEdges( worksheet.nodes ) )
  //console.log( debug.listOrder( worksheet ) )
  console.log( `The worksheet has ${worksheet.core.variants.length} Variants` )
  console.log( debug.listSelected( worksheet ) )
  console.log( debug.listActiveConfigs( worksheet ) )
  console.log( debug.listInputs( worksheet ) )
  dag.batch( worksheet )
  debug.addTime( 'batch()' )
  //console.log( listResults( worksheet ) )
  debug.applyTests( worksheet )
  debug.addTime( 'applyTests()' )
}

test1()
debug.usage( startTime )
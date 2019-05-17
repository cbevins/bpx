"use strict"

// Tests weighted standard fuel models 10 and 124 from the catalog
// Tests basic weighted fuel bed and fire behavior

var startTime = Date.now()

const debug = require('./libDebug')
debug.addTime( 'Begin' )

const dag = require('./libDag')
const full = require('./nodesFull')
debug.addTime( 'require()' )

function test1() {
  var bp7 = dag.createBp7()
  var nodes = full.createNodes()
  var w = dag.addWorksheet( bp7, 'w1', 'Simple Test', nodes )
  debug.addTime( 'Compose Worksheet' )

  var cfg = w.nodes.cfg
  dag.setConfigs( [
    [ cfg.fuel.fuel1, 'cat' ],      // 'cat', 'std', 'chp', 'pgb', 'was'
    [ cfg.fuel.hcf, 'est' ],        // 'est', 'inp'
    [ cfg.fuel.fuel2, 'cat' ],      // 'none', 'cat', 'std', 'chp', 'pgb', 'was'
    [ cfg.mois.mois, 'indiv' ],     // 'life', 'mixed', 'indiv', 'scen'
    [ cfg.wind.speed, 'mid' ],      // 'at10', 'at20', 'mid'
    [ cfg.wind.dir, 'hdgUp' ],      // 'srcNo', 'hdgUp, 'upSlp'
    [ cfg.wind.waf, 'inp' ],        // 'est', 'inp'
    [ cfg.fire.wtd, 'arithmetic' ], // 'arithmetic', 'expected', 'harmonic'
    [ cfg.fire.ewsl, 'yes' ],       // 'yes', 'no'
    [ cfg.slp.stp, 'rat' ],         // 'map', 'deg', 'rat'
    [ cfg.chap.load, 'inp'],        // 'inp', 'est'
    [ cfg.crown.method, 'roth' ],   // 'roth', 'sr'
    [ cfg.crown.fli, 'fl' ],        // 'fl', 'fli
    [ cfg.scorch.fli, 'fl' ],       // 'fl', 'fli'
    [ cfg.contain.res, 'single' ],  // 'single', 'multiple'
    [ cfg.cpy.cratio, 'est' ],      // 'est', 'inp'
  ])
  debug.addTime( 'setConfigs()' )

  var allow10 = 1.0e-10
  var sf1 = w.nodes.surf.fuel.sf1
  var sf2 = w.nodes.surf.fuel.sf2
  var sw = w.nodes.surf.fire.wt

  var ros1 = 18.551680325448835
  var ros2 = 48.470425993990560
  var cvr1 = 0.75
  var cvr2 = 0.25
  var rosa = (cvr1 * ros1) + (cvr2 * ros2)
  var rosh = 1. / ( ( cvr1 / ros1 ) + ( cvr2 / ros2 ) )
  var rose = 0.5 * ( rosa + rosh )

  debug.addTests( [
    // Primary fuel
    [ sf1.bed.char.hpua, 0, 1261.1929372603729, allow10 ],
    [ sf1.bed.char.rxi, 0, 5794.6954002291168, allow10 ],
    [ sf1.fire.ros, 0, ros1, allow10 ],
    [ sf1.fire.dir.hdup, 0, 87.573367385837855, allow10 ],
    [ sf1.fire.dist, 0, 1113.1008195269301, allow10 ],
    [ sf1.fire.phiew, 0, 26.321715915373524, allow10 ],
    [ sf1.fire.ewsp, 0, 880.55194372010692, allow10 ],
    // [ sf1.fire.ewsx, 0, false, allow10 ],
    [ sf1.fire.elwr, 0, 3.5015680219321221, allow10 ],
    [ sf1.fire.fli, 0, 389.95413667947145, allow10 ],
    [ sf1.fire.fl, 0, 6.9996889013229229, allow10 ],
    [ sf1.fire.scht, 0, 39.580181786322299, allow10 ],
    // Secondary fuel
    [ sf2.bed.char.hpua, 0, 3054.9704415746182, allow10 ],
    [ sf2.bed.char.rxi, 0, 12976.692888496578, allow10 ],
    [ sf2.fire.ros, 0, ros2, allow10 ],
    [ sf2.fire.dir.hdup, 0, 87.613728665173383, allow10 ],
    [ sf2.fire.dist, 0, 2908.2255596394334, allow10 ],
    [ sf2.fire.phiew, 0, 32.816782854703028, allow10 ],
    [ sf2.fire.ewsp, 0, 880.55684333220040, allow10 ],
    // [ sf2.fire.ewsx, 0, false, allow10 ],
    [ sf2.fire.elwr, 0, 3.5015819412846603, allow10 ],
    [ sf2.fire.fli, 0, 2467.9286450361865, allow10 ],
    [ sf2.fire.fl, 0, 16.356316633171140, allow10 ],
    [ sf2.fire.scht, 0, 215.68277136796777, allow10 ],
    // Weighted tests
    // According to PLA, there are 13 variants affected by 2-fuel weighting
    // Spread rate, which is one of 3 possible weighting methods
    [ sw.rosa, 0, rosa, allow10 ],
    [ sw.rose, 0, rose, allow10 ],
    [ sw.rosh, 0, rosh, allow10 ],
    [ sw.ros, 0, rosa, allow10 ],
    // 5 Variants assigned to the Primary Fuel values
    [ sw.hdup, 0, 87.573367385837855, allow10 ],
    [ sw.mwaf, 0, 1.0, allow10 ],
    [ sw.mwsp, 0, 880.0, allow10 ],
    [ sw.ewsp, 0, 880.55194372010692, allow10 ],
    [ sw.elwr, 0, 3.5015680219321221, allow10 ],
    // 5 Variants assigned to the maximum values
    [ sw.rxi, 0, 12976.692888496578, allow10 ],
    [ sw.hpua, 0, 3054.9704415746182, allow10 ],
    [ sw.fli, 0, 2467.9286450361865, allow10 ],
    [ sw.fl, 0, 16.356316633171140, allow10 ],
    [ sw.depth, 0, 2.1, allow10 ],
    // 1 Variant assigned to the minimum value
    [ sw.ewsp, 0, 880.55194372010692, allow10 ], // minimum
    // [ sw.ewsx, 0, false, allow10 ], // minimum
  ])
  debug.addTime( 'addTests()' )

  dag.reconfig( w )
  debug.addTime( 'reconfig()' )

  dag.setInputs( [
    [ sf1.modl.key, ['10'] ],
    [ sf1.modl.cover, [cvr1] ],
    [ sf2.modl.key, ['124'] ],
    [ w.nodes.mois.dead.tl1, [0.05] ],
    [ w.nodes.mois.dead.tl10, [0.07] ],
    [ w.nodes.mois.dead.tl100, [0.09] ],
    [ w.nodes.mois.live.herb, [0.50] ],
    [ w.nodes.mois.live.stem, [1.50] ],
    [ w.nodes.slp.stp.rat, [0.25] ],
    [ w.nodes.wnd.dir.hdg.up, [90.0] ],
    [ w.nodes.air.tmp, [95.0] ],
    [ sf1.bed.char.mwsp, [880.0] ],
    [ sf1.bed.char.mwaf, [1.0] ],
    [ w.nodes.fire.time.etig, [60.0] ],
    [ w.nodes.map.scl, [24000.0] ],
  ])
  debug.addTime( 'setInputs()' )

  //console.log( listEdges( w1.nodes ) )
  //console.log( listOrder( w ) )
  console.log( `The worksheet has ${w.core.variants.length} Variants` )
  console.log( debug.listSelected( w ) )
  console.log( debug.listActiveConfigs( w ) )
  console.log( debug.listInputs( w ) )
  dag.batch( w )
  debug.addTime( 'batch()' )

  //console.log( debug.listResults( w ) )
  debug.applyTests( w )
  debug.addTime( 'applyTests()' )
}

test1()
debug.usage( startTime )
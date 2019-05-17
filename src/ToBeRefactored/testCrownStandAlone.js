"use strict"

var startTime = Date.now()

const debug = require('./libDebug')
debug.addTime( 'Begin' )
const dag = require('./libDag')
const full = require('./nodesFull')
const surf = require('./libSurfaceFire')

debug.addTime( 'require()' )

/**
 * Test stand-alone crown fire model
 */
function standAlone() {
  var bp7 = dag.createBp7()
  var nodes = full.createNodes()
  var w = dag.addWorksheet( bp7, 'w1', 'Simple Test', nodes )

  debug.addTime( 'Compose Worksheet' )

  var cfg = w.nodes.cfg
  dag.setConfigs( [
    [ cfg.fuel.fuel1, 'cat' ],      // 'cat', 'std', 'chp', 'pgb', 'was'
    [ cfg.fuel.hcf, 'est' ],        // 'est', 'inp'
    [ cfg.fuel.fuel2, 'none' ],     // 'none', 'cat', 'std', 'chp', 'pgb', 'was'
    [ cfg.mois.mois, 'indiv' ],     // 'life', 'mixed', 'indiv', 'scen'
    [ cfg.wind.speed, 'mid' ],      // 'at10', 'at20', 'mid'
    [ cfg.wind.dir, 'hdgUp' ],      // 'srcNo', 'hdgUp, 'upSlp'
    [ cfg.wind.waf, 'inp' ],        // 'est', 'inp'
    [ cfg.fire.dir, 'no' ],         // 'hd', 'up', 'no'
    [ cfg.fire.wtd, 'arithmetic' ], // 'arithmetic', 'expected', 'harmonic'
    [ cfg.fire.ewsl, 'yes' ],       // 'yes', 'no'
    [ cfg.slp.stp, 'rat' ],         // 'map', 'deg', 'rat'
    [ cfg.chap.load, 'inp'],        // 'inp', 'est'
    [ cfg.size.fli, 'surface' ],    // 'surface', 'fl', 'fli'
    [ cfg.crown.method, 'roth' ],   // 'roth', 'sr'
    [ cfg.scorch.fli, 'surface' ],  // 'surface', 'fl', 'fli'
    [ cfg.contain.res, 'single' ],  // 'single', 'multiple'
    [ cfg.cpy.cratio, 'est' ],      // 'est', 'inp'
    // *****
    // Here is the key configuration parameter for this test case
    // *****
    [ cfg.crown.fli, 'fli' ],   // 'surface', 'fl', 'fli
  ])
  debug.addTime( 'setConfigs' )

  var allow09 = 1.0e-9
  var allow08 = 1.0e-8
  var allow07 = 1.0e-7
  var allow06 = 1.0e-6

  var mapScale = 24000.0
  var cpy = w.nodes.cpy
  var crown = w.nodes.crown
  var sf3 = w.nodes.crown.fuel.sf3

  var rSurface = 10.0
  var rActive = 45.607497800636672
  var rInit = 5.3729463827365374
  var rSa = 20.933612183118935
  var cfb = ( rSurface - rInit ) / ( rSa - rInit )
  var rFinal = rSurface + cfb * Math.max( ( rActive - rSurface ), 0.0 )
  var surfHpua = 1261.1929372603729
  var cpyHpua = 7439.9999999999991
  var fliFinal = rFinal * ( surfHpua + ( cfb * cpyHpua ) ) / 60.0

  debug.addTests( [
    [ sf3.bed.char.load, 0, 0.552, allow09 ],
    [ sf3.bed.char.savr, 0, 1764.3319812126388, allow09 ],
    [ sf3.bed.char.beta, 0, 0.01725, allow09 ],
    [ sf3.bed.char.bulk, 0, 0.552, allow09 ],

    [ sf3.bed.dead.rxid, 0, 5539.9575948899355, allow09 ],
    [ sf3.bed.dead.efld, 0, 0.15704963842638839, allow09 ],
    [ sf3.bed.dead.efmc, 0, 0.053892078848839550, allow09 ],
    [ sf3.bed.dead.mois, 0, 0.051626884422110553, allow09 ],
    [ sf3.bed.dead.etam, 0, 0.65206408989980214, allow09 ],
    [ sf3.bed.dead.rxi, 0, 3612.4074071954024, allow09 ],

    [ sf3.bed.live.rxid, 0, 3677.5200629895871, allow09 ],
    [ sf3.bed.live.mois, 0, 1.5, allow09 ],
    [ sf3.bed.live.efld, 0, 0.065920880572788609, allow09 ],
    [ sf3.bed.live.mxtk, 0, 6.908948234294801, allow09 ],
    [ sf3.bed.live.mext, 0, 5.1935979022741359, allow09 ],
    [ sf3.bed.live.etam, 0, 0.59341294014849078, allow09 ],
    [ sf3.bed.live.rxi, 0, 2182.2879930337140, allow09 ],

    [ sf3.bed.char.hpua, 0, 1261.1929372603729, allow09 ],
    [ sf3.bed.char.rxi, 0, 5794.6954002291168, allow09 ],
    [ sf3.bed.char.sink, 0, 412.34037227937284, allow09 ], // rhoB Qig
    [ sf3.bed.char.ros0, 0, 0.67900860922904482, allow09 ],
    [ sf3.bed.char.taur, 0, 0.21764611427384198, allow09 ],
    [ sf3.bed.char.mwaf, 0, 0.4, allow09 ],
    [ sf3.bed.char.mwsp, 0, 8.0 * 88.0, allow09 ],

    [ sf3.fire.phis, 0, 0.0, allow09 ],
    [ sf3.fire.phiw, 0, (13.654939461268466/0.67900860922904482)-1.0, allow09 ],
    [ sf3.fire.ros1, 0, 13.654939461268466, allow09 ],

    [ sf3.fire.ros, 0, 13.654939461268466, allow09 ],
    [ sf3.fire.fli, 0, 287.0252201211624, allow09 ],
    [ sf3.fire.phiew, 0, (13.654939461268466/0.67900860922904482)-1.0, allow09 ],
    [ sf3.fire.ewsp, 0, 8.0 * 88.0, allow09 ],

    [ crown.fire.elwr, 0, 3.5, allow09 ],
    [ crown.fire.rActive, 0, 45.607497800636672, allow09 ],
    [ crown.fire.powerWind, 0, 24.727652569557648, allow09 ],
    [ crown.fire.dist, 0, 2736.4498680382003, allow09 ],
    [ crown.fire.mdist, 0, 2736.4498680382003/mapScale, allow09 ],
    [ crown.fire.width, 0, 2736.4498680382003 / 3.5, allow09 ],
    [ crown.fire.mwidth, 0, 2736.4498680382003 / 3.5/mapScale, allow09 ],
    [ crown.fire.perim, 0, 5526.5212308009077, allow09 ],
    [ crown.fire.mperim, 0, 5526.5212308009077/mapScale, allow09 ],
    [ crown.fire.area, 0, 1680338.6991928287, allow09 ],
    [ crown.fire.marea, 0, 1680338.6991928287/mapScale/mapScale, allow09 ],
    [ crown.surf.hpua, 0, 1261.1929372603729, allow09 ],  // input
    [ crown.surf.fli, 0, 302.93159859986133, allow09 ],   // input
    [ cpy.ht, 0, 40., allow09 ],                          // input
    [ cpy.bh, 0, 10., allow09 ],                          // input
    [ cpy.bd, 0, 0.031, allow09 ],                        // input
    [ cpy.heat, 0, 8000.0, allow09 ],                     // constant
    [ cpy.ld, 0, 0.92999999999999994, allow09 ],
    [ cpy.hpua, 0, 7439.9999999999991, allow09 ],
    [ crown.fire.hpuaActive, 0, 8701.1929372603718, allow09 ],
    [ crown.fire.fliActive, 0, 6613.9939624836288, allow09 ],
    [ crown.fire.flActive, 0, 70.470257499865468, allow09 ],
    [ crown.fire.powerFire, 0, 51.271271027004872, allow09 ],
    [ crown.fire.powerRatio, 0, 2.0734386688255730, allow09 ],
    [ crown.fire.plumeDominated, 0, true, allow09 ],
    [ crown.fire.windDriven, 0, false, allow09 ],
    // Scott & Reinhardt
    [ crown.surf.fliInit, 0, 112.93870050309982, allow09 ],
    [ crown.surf.flInit, 0, 3.9584047171908350, allow09 ],
    [ crown.surf.transRatio, 0, 2.6822656649174634, allow09 ],
    [ crown.surf.canTrans, 0, true, allow09 ],
    [ crown.surf.rInit, 0, 5.3729463827365374, allow09 ],
    [ crown.fire.rPrimeActive, 0, 19.820913450372778, allow09 ],
    [ crown.fire.activeRatio, 0, 2.3009786059975412, allow09 ],
    [ crown.fire.type, 0, 'Active', allow09 ],
    [ crown.fire.isActive, 0, true, allow09 ],
    [ crown.fire.isConditional, 0, false, allow09 ],
    [ crown.fire.isCrown, 0, true, allow09 ],
    [ crown.fire.isPassive, 0, false, allow09 ],
    [ crown.fire.isSurface, 0, false, allow09 ],
    [ crown.fire.cidx, 0, 935.77563665085108, allow09 ],
    // The following require linkage to SURFACE
    // OR must be input to crown.surf.[wndb, wndk, mwaf, phis]
    [ crown.surf.wndb, 0, 1.4308256324729873, allow09 ],
    [ crown.surf.wndk, 0, 0.0016102128596515481, allow09 ],
    [ crown.surf.ros, 0, 10.0, allow09 ],
    [ crown.surf.ros0, 0, 0.67900860922904482, allow09 ],
    [ crown.surf.phis, 0, 1.1144632487759358, allow09 ],
    [ crown.surf.rSa, 0, 20.933612183118935, allow09 ],
    [ crown.fire.cfb, 0, cfb, allow09 ],
    [ crown.fire.rFinal, 0, rFinal, allow09 ],
    [ crown.fire.fliFinal, 0, fliFinal, allow09 ],
  ])

  debug.addTime( 'addTests' )

  dag.reconfig( w )
  debug.addTime( 'reconfig()' )

  dag.setInputs( [
    [ w.nodes.mois.dead.tl1, [0.05] ],
    [ w.nodes.mois.dead.tl10, [0.07] ],
    [ w.nodes.mois.dead.tl100, [0.09] ],
    [ w.nodes.mois.live.herb, [0.50] ],
    [ w.nodes.mois.live.stem, [1.50] ],
    [ w.nodes.slp.stp.rat, [0.25] ],
    [ w.nodes.slp.dir.asp, [180.0] ],
    [ w.nodes.wnd.dir.hdg.up, [90.0] ],
    [ w.nodes.wnd.spd.at20, [20.0 * 88.0] ],
    [ w.nodes.fire.time.etig, [60.0] ],
    [ w.nodes.map.scl, [24000.0] ],
    [ w.nodes.cpy.ht, [40.0] ],
    [ w.nodes.cpy.bh, [10.0] ],
    [ w.nodes.cpy.bd, [0.031] ],
    [ w.nodes.cpy.heat, [8000.0] ],
    [ w.nodes.cpy.mc, [0.50] ],
    // Required input when not linked to SURFACE
    [ w.nodes.crown.surf.ros, [ 10.0 ] ],
    [ w.nodes.crown.surf.mwaf, [ 1.0 ] ],
    [ w.nodes.crown.surf.hpua, [1261.1929372603729]  ],
    [ w.nodes.crown.surf.fli, [ 302.93159859986133 ] ],
    [ w.nodes.crown.surf.wndb, [ 1.4308256324729873 ] ],
    [ w.nodes.crown.surf.wndk, [ 0.0016102128596515481] ],
    [ w.nodes.crown.surf.ros0, [ 0.67900860922904482 ] ],
    [ w.nodes.crown.surf.phis, [ 1.1144632487759358 ] ],
  ])
  debug.addTime( 'setInputs' )

  //console.log( debug.listEdges( w1.nodes ) )
  //console.log( debug.listOrder( w ) )
  console.log( `The worksheet has ${w.core.variants.length} Variants` )
  console.log( debug.listSelected( w ) )
  console.log( debug.listActiveConfigs( w ) )
  console.log( debug.listInputs( w ) )
  dag.batch( w )
  debug.addTime( 'batch()' )
  //console.log( listResults( w ) )
  debug.applyTests( w )
  debug.addTime( 'applyTests()' )
}

standAlone()
debug.usage( startTime )
"use strict"

// Tests weighted standard fuel models 10 and 124 from the catalog
// Tests basic weighted fuel bed and fire behavior

var startTime = Date.now()

const affirm = require( './libDebug' ).affirm
const debug = require('./libDebug')
debug.addTime( 'Begin' )

const dag = require('./libDag')
const clearSelects = require('./libDag').clearSelects
const reconfig = require('./libDag').reconfig
const select = require('./libDag').select
const selects = require('./libDag').selects
const setConfigs = require('./libDag').setConfigs
const unselect = require('./libDag').unselect
const unselects = require('./libDag').unselects

const node = require('./libNode')
const isBound = require('./libNode').isBound
const isFixed = require('./libNode').isFixed
const isInput = require('./libNode').isInput
const isSelected = require('./libNode').isSelected

const full = require('./nodesFull201811')

function initConfigs() {
  dag.setConfigs( [
    [ worksheet.nodes.cfg.fuel.fuel1, 'catalog' ],    // 'catalog', 'std', 'chp', 'pgb', 'was'
    [ worksheet.nodes.cfg.fuel.fuel2, 'catalog' ],    // 'none', 'catalog', 'std', 'chp', 'pgb', 'was'
    [ worksheet.nodes.cfg.fuel.hcf, 'input' ],        // 'estimated', 'input'
    [ worksheet.nodes.cfg.fuel.chapLoad, 'input' ],   // 'input', 'estimated'
    [ worksheet.nodes.cfg.mois.input, 'individual' ], // 'lifeCategory', 'mixed', 'individual', 'scenario'
    [ worksheet.nodes.cfg.slope.steepness, 'ratio' ], // 'map', 'degrees', 'ratio'
    [ worksheet.nodes.cfg.wind.speed, 'atMidflame' ], // 'at10m', 'at20ft', 'atMidflame'
    [ worksheet.nodes.cfg.wind.waf, 'input' ],        // 'estimated', 'input'
    [ worksheet.nodes.cfg.wind.dir, 'headingFromUpslope' ], // 'sourceFromNorth', 'headingFromUplsope', 'assumedUpslope'
    [ worksheet.nodes.cfg.fire.ewsl, 'yes' ],         // 'yes', 'no'
    [ worksheet.nodes.cfg.fire.wtd, 'arithmetic' ],   // 'arithmetic', 'expected', 'harmonic'
    [ worksheet.nodes.cfg.fire.dir, 'up' ],           // 'hd', 'up, 'no'
    [ worksheet.nodes.cfg.size.link, 'standalone' ],  // 'surface', 'standalone'
    [ worksheet.nodes.cfg.fire.fli, 'fl' ],           // 'fl', 'fli
    [ worksheet.nodes.cfg.fire.lwr, 'elwr' ],         // 'elwr', 'ewsp'
    [ worksheet.nodes.cfg.crown.link, 'standalone' ], // 'surface', 'standalone'
    // These still need to be tested...
    // [ worksheet.nodes.cfg.contain.res, 'single' ],    // 'single', 'multiple'
    // [ worksheet.nodes.cfg.canopy.cratio, 'estimated' ],// 'estimated', 'input'
  ])
}

function initInputs() {
  dag.setInputs( [
    [ worksheet.nodes.surf.fuel.sf1.modl.key, ['10'] ],
    [ worksheet.nodes.surf.fuel.sf1.modl.cover, [0.75] ],
    [ worksheet.nodes.surf.fuel.sf2.modl.key, ['124'] ],
    [ worksheet.nodes.mois.dead.tl1, [0.05] ],
    [ worksheet.nodes.mois.dead.tl10, [0.07] ],
    [ worksheet.nodes.mois.dead.tl100, [0.09] ],
    [ worksheet.nodes.mois.live.herb, [0.50] ],
    [ worksheet.nodes.mois.live.stem, [1.50] ],
    [ worksheet.nodes.slp.stp.rat, [0.25] ],
    [ worksheet.nodes.wnd.dir.hdg.up, [90.0] ],
    [ worksheet.nodes.air.tmp, [95.0] ],
    [ worksheet.nodes.surf.fuel.sf1.bed.char.mwsp, [880.0] ],
    [ worksheet.nodes.surf.fuel.sf1.bed.char.mwaf, [1.0] ],
    [ worksheet.nodes.fire.time.etig, [60.0] ],
    [ worksheet.nodes.map.scl, [24000.0] ],
  ])
}

var nodes = full.createNodes()
var bp7 = dag.createBp7()
var worksheet = dag.addWorksheet( bp7, 'w1', 'Simple Test', nodes )
console.log( `The worksheet has ${worksheet.core.variants.length} Variants` )
initConfigs()
initInputs()

//------------------------------------------------------------------------------------------------
// Affirm basic variant selection, unselection, and DAG reconfiguration
function basicSelection () {
  var f = 'basicSelection(): '
  affirm( f, 'No variants selected yet', worksheet.core.selected.length, 'equals', 0 )

  select( worksheet.nodes.surf.fuel.sf1.bed.dead.part.p1.savr )
  affirm( f, 'Particle 1 SAVR selected is now selected',
    isSelected( worksheet.nodes.surf.fuel.sf1.bed.dead.part.p1.savr ), 'equals', true )
  affirm( f, 'Particle 1 SAVR selected, but no call to dag.reconfig(), so not yet in selected array',
    worksheet.core.selected.length, 'equals', 0 )

  reconfig( worksheet )
  affirm( f, 'Particle 1 SAVR selected and dag.reconfig() invoked',
    worksheet.core.selected.length, 'equals', 1 )
  affirm( f, 'worksheet.core.selected contains Particle 1 SAVR',
    worksheet.core.selected, 'contains', worksheet.nodes.surf.fuel.sf1.bed.dead.part.p1.savr )

  unselect( worksheet.nodes.surf.fuel.sf1.bed.dead.part.p1.savr )
  affirm( f, 'Particle 1 SAVR UNselected, DAG is auto-reconfigured, so no longer in selected array',
    worksheet.core.selected.length, 'equals', 0 )

  selects( [worksheet.nodes.surf.fuel.sf1.bed.dead.part.p2.savr,
    worksheet.nodes.surf.fuel.sf1.bed.dead.part.p1.savr] )
  affirm( f, 'Particle 1 and 2 SAVRs selected as array, so dag.reconfig() auto-invoked',
    worksheet.core.selected.length, 'equals', 2 )
  affirm( f, 'Particle 1 SAVR is now in the selected array',
    worksheet.core.selected, 'contains', worksheet.nodes.surf.fuel.sf1.bed.dead.part.p1.savr )
  affirm( f, 'Particle 2 SAVR is now in the selected array',
    worksheet.core.selected, 'contains', worksheet.nodes.surf.fuel.sf1.bed.dead.part.p2.savr )

  clearSelects( worksheet )
  affirm( f, 'UNselecting ALL, DAG is auto-reconfigured',
    worksheet.core.selected.length, 'equals', 0 )

  affirm( f, 'Particle 1 SAVR is NOT in the selected array',
    worksheet.core.selected, 'omits', worksheet.nodes.surf.fuel.sf1.bed.dead.part.p1.savr )
  affirm( f, 'Particle 2 SAVR is NOT in the selected array',
    worksheet.core.selected, 'omits',worksheet.nodes.surf.fuel.sf1.bed.dead.part.p2.savr )
}

//------------------------------------------------------------------------------------------------
// Tests fuel.fuel1, fuel.fuel2, fuel.hcf, and fuel.chapLoad configurations
function configFuel() {
  var f = 'configFuel(): '
  clearSelects( worksheet )
  affirm( f, 'No variants selected yet',
    worksheet.core.selected.length, 'equals', 0 )
  affirm( f, 'No active configs yet',
    worksheet.core.activeCfg.length, 'equals', 0 )
  affirm( f, 'No inputs yet',
    worksheet.core.inputs.length, 'equals', 0 )

  selects( [worksheet.nodes.k.noArea,
    worksheet.nodes.k.noDepth,
    worksheet.nodes.k.noDens,
    worksheet.nodes.k.noDesc,
    worksheet.nodes.k.noHeat,
    worksheet.nodes.k.noLoad,
    worksheet.nodes.k.noMois,
    worksheet.nodes.k.noSavr,
    worksheet.nodes.k.noSeff,
    worksheet.nodes.k.noSize,
    worksheet.nodes.k.noStot,
    worksheet.nodes.k.upslopeWind ] )
  affirm( f, 'Selecting all constant nodes',
    worksheet.core.selected.length, 'equals', 12 )
  affirm( f, 'Selecting all const nodes requires no configs',
    worksheet.core.activeCfg.length, 'equals', 0 )
  affirm( f, 'Selecting all const nodes requires no inputs',
    worksheet.core.inputs.length, 'equals', 0 )

  selects( [worksheet.nodes.surf.fuel.sf1.bed.dead.part.p1.savr ] )
  affirm( f, 'Primary Fuel Particle 1 SAVR selected as array, so dag.reconfig() auto-invoked',
    worksheet.core.selected.length, 'equals', 13 )
  affirm( f, 'Primary Fuel Particle 1 SAVR is now in the selected array',
    worksheet.core.selected, 'contains', worksheet.nodes.surf.fuel.sf1.bed.dead.part.p1.savr )
  affirm( f, 'Primary Fuel Particle 1 SAVR activates the fuel1 config',
    worksheet.core.activeCfg.length, 'equals', 1 )
  affirm( f, 'Cfg fuel.fuel1 is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fuel.fuel1 )
  affirm( f, 'Primary Fuel Particle 1 SAVR requires primary fuel key as input',
    worksheet.core.inputs.length, 'equals', 1 )
  affirm( f, 'Primary Fuel Particle 1 SAVR requires primary fuel key as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.modl.key )

  var inputs = dag.getNodesInputs( worksheet.nodes.surf.fuel.sf1.bed.dead.part.p1.savr )
  affirm( f, 'Primary Fuel Dead Particle 1 SAVR requires just 1 input',
    inputs.length, 'equals', 1 )
  affirm( f, 'Primary Fuel Particle 1 SAVR requires primary fuel key as input',
    inputs, 'contains', worksheet.nodes.surf.fuel.sf1.modl.key )

  unselects( [worksheet.nodes.surf.fuel.sf1.bed.dead.part.p1.savr ] )
  selects( [worksheet.nodes.surf.fuel.sf2.bed.dead.part.p1.savr ] )
  affirm( f, 'Secondary Fuel Dead Particle 1 SAVR selected as array, so dag.reconfig() auto-invoked',
    worksheet.core.selected.length, 'equals', 13 )
  affirm( f, 'Secondary Fuel Dead Particle 1 SAVR is now in the selected array',
    worksheet.core.selected, 'contains', worksheet.nodes.surf.fuel.sf2.bed.dead.part.p1.savr )
  affirm( f, 'Secondary Fuel Dead Particle 1 SAVR activates the fuel2 config',
    worksheet.core.activeCfg.length, 'equals', 1 )
  affirm( f, 'Cfg fuel.fuel2 is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fuel.fuel2 )
  affirm( f, 'Secondary Fuel Particle 1 SAVR requires secondary fuel key as input',
    worksheet.core.inputs.length, 'equals', 1 )
  affirm( f, 'Secondary Fuel Particle 1 SAVR requires secondary fuel key as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf2.modl.key )


  clearSelects( worksheet )
  selects( [ worksheet.nodes.surf.fuel.sf1.bed.dead.part.p1.load,
            worksheet.nodes.surf.fuel.sf1.bed.dead.part.p2.load,
            worksheet.nodes.surf.fuel.sf1.bed.dead.part.p3.load, ] )
  affirm( f, 'Primary Fuel Dead Particles 1, 2, & 3 LOADs selected as array, so dag.reconfig() auto-invoked',
    worksheet.core.selected.length, 'equals', 3 )
  affirm( f, 'Primary Fuel Dead Particle 1 LOAD is now in the selected array',
    worksheet.core.selected, 'contains', worksheet.nodes.surf.fuel.sf1.bed.dead.part.p1.load )
  affirm( f, 'Primary Fuel Dead Particle 2 LOAD is now in the selected array',
    worksheet.core.selected, 'contains', worksheet.nodes.surf.fuel.sf1.bed.dead.part.p2.load )
  affirm( f, 'Primary Fuel Dead Particle 3 LOAD is now in the selected array',
    worksheet.core.selected, 'contains', worksheet.nodes.surf.fuel.sf1.bed.dead.part.p3.load )
  affirm( f, 'Primary Fuel Dead Particle 1 LOAD activates the fuel1 config',
    worksheet.core.activeCfg.length, 'equals', 1 )
  affirm( f, 'Cfg fuel.fuel1 is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fuel.fuel1 )
  affirm( f, 'Cfg fixed so that fuel.chapLoad is NOT active',
    worksheet.core.activeCfg, 'omits', worksheet.nodes.cfg.fuel.chapLoad )

  selects( [ worksheet.nodes.surf.fuel.sf1.bed.dead.part.p4.load ] )
  affirm( f, 'Primary Fuel Dead Particle 4 LOAD selected as array, so dag.reconfig() auto-invoked',
    worksheet.core.selected.length, 'equals', 4 )
  affirm( f, 'Primary Fuel Dead Particle 4 LOAD is now in the selected array',
    worksheet.core.selected, 'contains', worksheet.nodes.surf.fuel.sf1.bed.dead.part.p4.load )
  affirm( f, 'Adding Primary Fuel Dead Particle 4 LOAD activates the fuel.hcf config',
    worksheet.core.activeCfg.length, 'equals', 2 )
  affirm( f, 'Cfg fuel.fuel1 is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fuel.fuel1 )
  affirm( f, 'Cfg fuel.hcf is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fuel.hcf )
  affirm( f, 'Primary Fuel Dead Particle LOADs require primary fuel key and herb cured fraction as inputs',
    worksheet.core.inputs.length, 'equals', 2 )
  affirm( f, 'Primary Fuel Dead Particle 4 LOAD requires primary fuel key as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.modl.key )
  affirm( f, 'Primary Fuel Dead Particle 4 LOAD requires herb cured fraction as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.modl.std.hcf )

  inputs = dag.getNodesInputs( worksheet.nodes.surf.fuel.sf1.bed.dead.part.p4.load )
  affirm( f, '225: Primary Fuel Dead Particle 4 LOAD requires 2 inputs',
    inputs.length, 'equals', 2 )
  affirm( f, '227: Primary Fuel Dead Particle 4 LOAD requires primary fuel key as input',
    inputs, 'contains', worksheet.nodes.surf.fuel.sf1.modl.key )
  affirm( f, '229: Primary Fuel Dead Particle 4 LOAD requires herb cured fraction as input',
    inputs, 'contains', worksheet.nodes.surf.fuel.sf1.modl.std.hcf )

  setConfigs( [ [ worksheet.nodes.cfg.fuel.hcf, 'estimated' ] ]) // 'estimated', 'input'
  affirm( f, 'Estimating HCF forces mois.input to be active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.mois.input )
  affirm( f, 'Estimating HCF adds mois.input to fuel.fuel1 and fuel.hcf',
    worksheet.core.activeCfg.length, 'equals', 3 )
  affirm( f, 'Primary Fuel Dead Particle LOADs require primary fuel key and live herb moisture as inputs',
    worksheet.core.inputs.length, 'equals', 2 )
  affirm( f, 'Primary Fuel Dead Particle 4 LOAD requires primary fuel model key as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.modl.key )
  affirm( f, 'Primary Fuel Dead Particle 4 LOAD requires live herb moisture as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.live.herb )

  inputs = dag.getNodesInputs( worksheet.nodes.surf.fuel.sf1.bed.dead.part.p4.load )
  affirm( f, '244: Primary Fuel Dead Particle 4 LOAD requires 2 inputs',
    inputs.length, 'equals', 2 )
  affirm( f, '246: Primary Fuel Dead Particle 4 LOAD requires primary fuel key as input',
    inputs, 'contains', worksheet.nodes.surf.fuel.sf1.modl.key )
  affirm( f, 'Primary Fuel Dead Particle 4 LOAD requires live herb moisture as input',
    inputs, 'contains', worksheet.nodes.mois.live.herb )

  selects( [worksheet.nodes.surf.fuel.sf2.bed.dead.part.p1.savr ] )
  affirm( f, 'Secondary Fuel Dead Particle 1 SAVR selected as array, so dag.reconfig() auto-invoked',
    worksheet.core.selected.length, 'equals', 5 )
  affirm( f, 'Secondary Fuel Dead Particle 1 SAVR is now in the selected array',
    worksheet.core.selected, 'contains', worksheet.nodes.surf.fuel.sf2.bed.dead.part.p1.savr )
  affirm( f, 'Secondary Fuel Dead Particle 1 SAVR activates the fuel2 config',
    worksheet.core.activeCfg.length, 'equals', 4 )
  affirm( f, 'Cfg fuel.fuel2 is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fuel.fuel2 )
  affirm( f, 'Now requires primary and secondary fuel keys and live herb moisture as inputs',
    worksheet.core.inputs.length, 'equals', 3 )
  affirm( f, 'Primary Fuel Dead Particle 4 LOAD requires primary fuel model key as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.modl.key )
  affirm( f, 'Secondary Fuel Dead Particle 1 SAVR requires seconday fuel model key as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf2.modl.key )
  affirm( f, 'Primary Fuel Dead Particle 4 LOAD requires live herb moisture as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.live.herb )

  setConfigs( [[ worksheet.nodes.cfg.fuel.fuel1, 'chp' ]])   // 'catalog', 'std', 'chp', 'pgb', 'was'
  affirm( f, 'Using dynamic chaparral for primary fuel activates the fuel.chapLoad config',
   worksheet.core.activeCfg.length, 'equals', 5 )
  affirm( f, 'Cfg fuel.fuel1 is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fuel.fuel1 )
  affirm( f, 'Cfg fuel.fuel2 is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fuel.fuel2 )
  affirm( f, 'Cfg fuel.chapLoad is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fuel.chapLoad )
  affirm( f, 'Cfg fuel.hcf is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fuel.hcf )
  affirm( f, 'Estimating HCF forces mois.input to be active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.mois.input )

  affirm( f, 'Now requires secondary fuel key, live herb moisture, chap load, chap dead fractioon as inputs',
    worksheet.core.inputs.length, 'equals', 4 )
  affirm( f, 'Secondary Fuel Dead Particle 1 SAVR requires seconday fuel model key as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf2.modl.key )
  affirm( f, 'Primary Fuel Dead Particle 4 LOAD requires live herb moisture as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.live.herb )
  affirm( f, 'Chaparral estimated total load required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.modl.chp.eld )
  affirm( f, 'Chaparral dead fraction required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.modl.chp.df )

  inputs = dag.getNodesInputs( worksheet.nodes.surf.fuel.sf1.bed.dead.part.p4.load )
  affirm( f, '295: Primary Chaparral Fuel Dead Particle 4 LOAD requires 3 inputs',
    inputs.length, 'equals', 3 )
  affirm( f, '297: Primary Chaparral estimated total load required as input',
    inputs, 'contains', worksheet.nodes.surf.fuel.sf1.modl.chp.eld )
  affirm( f, '299: Primary Chaparral dead fraction required as input',
    inputs, 'contains', worksheet.nodes.surf.fuel.sf1.modl.chp.df )
  affirm( f, '301: Primary Fuel Dead Particle 4 LOAD requires live herb moisture as input',
    inputs, 'contains', worksheet.nodes.mois.live.herb )

  inputs = dag.getNodesInputs( worksheet.nodes.surf.fuel.sf2.bed.dead.part.p1.savr )
  affirm( f, '305: Secondary Dead Particle 1 SAVR requires 1 inputs',
    inputs.length, 'equals', 1 )
  affirm( f, '307: Secondary Dead Particle 1 SAVR requires seconday fuel model key as input',
    inputs, 'contains', worksheet.nodes.surf.fuel.sf2.modl.key )


  setConfigs( [ [ worksheet.nodes.cfg.fuel.chapLoad, 'estimated' ] ]) // 'estimated', 'input'
  affirm( f, 'Now requires secondary fuel key, live herb moisture, chap type, depth, dead fraction as inputs',
    worksheet.core.inputs.length, 'equals', 5 )
  affirm( f, 'Secondary Fuel Dead Particle 1 SAVR requires seconday fuel model key as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf2.modl.key )
  affirm( f, 'Primary Fuel Dead Particle 4 LOAD requires live herb moisture as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.live.herb )
  affirm( f, 'Chaparral depth required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.modl.chp.dep )
  affirm( f, 'Chaparral type required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.modl.chp.ty )
  affirm( f, 'Chaparral dead fraction required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.modl.chp.df )
}

//------------------------------------------------------------------------------------------------
function configMoisture() {
  var f = 'configMoisture(): '
  var options = [ 'lifeCategory', 'mixed', 'individual', 'scenario' ]
  var dead = [ 'tl1', 'tl10', 'tl100']
  var live = [ 'herb', 'stem' ]

  clearSelects( worksheet )
  affirm( f, 'No variants selected yet',
    worksheet.core.selected.length, 'equals', 0 )
  affirm( f, 'No active configs yet',
    worksheet.core.activeCfg.length, 'equals', 0 )
  affirm( f, 'No inputs yet',
    worksheet.core.inputs.length, 'equals', 0 )

  selects( [worksheet.nodes.mois.dead.category ] )
  affirm( f, 'Selecting dead category moisture input does NOT activate the mois.input config',
    worksheet.core.activeCfg.length, 'equals', 0 )
  affirm( f, 'There is now 1 input',
    worksheet.core.inputs.length, 'equals', 1 )
  affirm( f, 'Dead fuel category moisture is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.dead.category )

  selects( [worksheet.nodes.mois.live.category ] )
  affirm( f, 'Selecting live category moisture input does NOT activate the mois.input config',
    worksheet.core.activeCfg.length, 'equals', 0 )
  affirm( f, 'Both dead and live moisture categories are inputs',
    worksheet.core.inputs.length, 'equals', 2 )
  affirm( f, 'Dead fuel category moisture is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.dead.category )
  affirm( f, 'Live fuel category moisture is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.live.category )

  options.forEach( function( option) {
    clearSelects( worksheet )
    setConfigs( [[ worksheet.nodes.cfg.mois.input, option ]])
    selects( [worksheet.nodes.mois.dead.category, worksheet.nodes.mois.live.category ] )
    affirm( f, 'Selecting dead category moisture input does NOT activate the mois.input config',
      worksheet.core.activeCfg.length, 'equals', 0 )
    affirm( f, 'Selecting live category moisture input does NOT activate the mois.input config',
      worksheet.core.activeCfg.length, 'equals', 0 )
    affirm( f, 'Both dead and live moisture categories are inputs',
      worksheet.core.inputs.length, 'equals', 2 )
    affirm( f, 'Cfg mois.input is NOT active',
      worksheet.core.activeCfg, 'omits', worksheet.nodes.cfg.mois.input )
    affirm( f, 'Dead fuel category moisture is required as input',
      worksheet.core.inputs, 'contains', worksheet.nodes.mois.dead.category )
    affirm( f, 'Live fuel category moisture is required as input',
      worksheet.core.inputs, 'contains', worksheet.nodes.mois.live.category )

    dead.forEach( function( fuel ) {
      clearSelects( worksheet )
      selects( [worksheet.nodes.mois.dead[fuel] ] )
      affirm( f, `Selecting dead ${fuel} moisture with cfg option '${option}' activates the mois.input config`,
        worksheet.core.activeCfg.length, 'equals', 1 )
      affirm( f, 'Cfg mois.input is now active',
        worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.mois.input )
    })
    live.forEach( function( fuel ) {
      clearSelects( worksheet )
      selects( [worksheet.nodes.mois.live[fuel] ] )
      affirm( f, `Selecting live ${fuel} moisture with cfg option '${option}' activates the mois.input config`,
        worksheet.core.activeCfg.length, 'equals', 1 )
      affirm( f, 'Cfg mois.input is now active',
        worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.mois.input )
    })
  })

  clearSelects( worksheet )
  setConfigs( [[ worksheet.nodes.cfg.mois.input, 'lifeCategory' ]])
  selects( [worksheet.nodes.mois.dead.tl1 ] )
  affirm( f, 'Dead category moisture is the only input',
    worksheet.core.inputs.length, 'equals', 1 )
  affirm( f, 'Dead category moisture is input',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.dead.category )
  affirm( f, 'Dead 1-h moisture is NOT an input',
    worksheet.core.inputs, 'omits', worksheet.nodes.mois.dead.tl1 )
  affirm( f, 'Live category moisture is NOT an input',
    worksheet.core.inputs, 'omits', worksheet.nodes.mois.live.category )

  selects( [worksheet.nodes.mois.live.herb ] )
  affirm( f, 'Live category moisture is also now an input',
    worksheet.core.inputs.length, 'equals', 2 )
  affirm( f, 'Live category moisture is also now an input',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.live.category )
  affirm( f, 'Dead 1-h moisture is NOT an input',
    worksheet.core.inputs, 'omits', worksheet.nodes.mois.dead.tl1 )
  affirm( f, 'Live herb moisture is NOT an input',
    worksheet.core.inputs, 'omits', worksheet.nodes.mois.live.herb )

}

//------------------------------------------------------------------------------------------------
function configSlope() {
  var f = 'configSlope(): '
  var options = [ 'deg', 'rat', 'map' ]

  clearSelects( worksheet )
  affirm( f, 'No variants selected yet',
    worksheet.core.selected.length, 'equals', 0 )
  affirm( f, 'No active configs yet',
    worksheet.core.activeCfg.length, 'equals', 0 )

  setConfigs( [ [ worksheet.nodes.cfg.slope.steepness, 'ratio' ] ] ) // 'map', 'degrees', 'ratio'

  selects( [worksheet.nodes.slp.stp.rat ] )
  affirm( f, 'Selecting slope steepness ratio activates the slope.steepness config',
    worksheet.core.activeCfg.length, 'equals', 1 )
  affirm( f, 'Cfg slope.steepness is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.slope.steepness )
  affirm( f, 'Slope steepness ratio now an input',
    worksheet.core.inputs.length, 'equals', 1 )
  affirm( f, 'Slope steepness ratio is now an input',
    worksheet.core.inputs, 'contains', worksheet.nodes.slp.stp.rat )

  clearSelects( worksheet )
  selects( [worksheet.nodes.slp.stp.deg ] )
  affirm( f, 'Selecting slope steepness degrees activates the slope.steepness config',
    worksheet.core.activeCfg.length, 'equals', 1 )
  affirm( f, 'Cfg slope.steepness is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.slope.steepness )
  affirm( f, 'Slope steepness ratio is still the input',
    worksheet.core.inputs.length, 'equals', 1 )
  affirm( f, 'Slope steepness ratio is still the input',
    worksheet.core.inputs, 'contains', worksheet.nodes.slp.stp.rat )

  setConfigs( [ [ worksheet.nodes.cfg.slope.steepness, 'degrees' ] ] ) // 'map', 'degrees', 'ratio'

  affirm( f, 'Slope steepness degrees is now the input',
    worksheet.core.inputs.length, 'equals', 1 )
  affirm( f, 'Slope steepness degrees is now the input',
    worksheet.core.inputs, 'contains', worksheet.nodes.slp.stp.deg )
  clearSelects( worksheet )
  selects( [worksheet.nodes.slp.stp.rat ] )
  affirm( f, 'Slope steepness degrees is still the input',
    worksheet.core.inputs.length, 'equals', 1 )
  affirm( f, 'Slope steepness degrees is still the input',
    worksheet.core.inputs, 'contains', worksheet.nodes.slp.stp.deg )

  setConfigs( [ [ worksheet.nodes.cfg.slope.steepness, 'map' ] ] ) // 'map', 'degrees', 'ratio'

  affirm( f, 'Map variants are now the inputs',
    worksheet.core.inputs.length, 'equals', 4 )
  affirm( f, 'Map scale is an input',
    worksheet.core.inputs, 'contains', worksheet.nodes.map.scl )
  affirm( f, 'Map contour interval is an input',
    worksheet.core.inputs, 'contains', worksheet.nodes.map.cint )
  affirm( f, 'Map contours crossed is an input',
    worksheet.core.inputs, 'contains', worksheet.nodes.map.cont )
  affirm( f, 'Map distance is an input',
    worksheet.core.inputs, 'contains', worksheet.nodes.map.dist )
  affirm( f, 'Slope steepness degrees is NOT an input',
    worksheet.core.inputs, 'omits', worksheet.nodes.slp.stp.deg )
  affirm( f, 'Slope steepness ratio is NOT an input',
    worksheet.core.inputs, 'omits', worksheet.nodes.slp.stp.rat )
}

//------------------------------------------------------------------------------------------------
function configWindSpeed() {
  var f = 'configWindSpeed(): '
  var speedOptions = [ 'at10m', 'at20ft', 'atMidflame' ]

  reset()
  affirm( f, 'No variants selected yet',
    worksheet.core.selected.length, 'equals', 0 )
  affirm( f, 'No active configs yet',
    worksheet.core.activeCfg.length, 'equals', 0 )

  // NOTE that wind speed at midflame height and WAF are Primary Fuel Bed variants!
  setConfigs( [ [ worksheet.nodes.cfg.wind.speed, 'atMidflame' ] ] )

  selects( [ worksheet.nodes.surf.fuel.sf1.bed.char.mwsp ] )
  affirm( f, 'Selecting wind speed at midflame activates the wind.speed config',
    worksheet.core.activeCfg.length, 'equals', 1 )
  affirm( f, 'Cfg wind.speed is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.wind.speed )
  affirm( f, 'Wind speed at midflame is now an input',
    worksheet.core.inputs.length, 'equals', 1 )
  affirm( f, 'Wind speed at midflame is now an input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.bed.char.mwsp )
  affirm( f, 'Wind speed at 20-ft is NOT an input',
    worksheet.core.inputs, 'omits', worksheet.nodes.wnd.spd.at20ft )
  affirm( f, 'Wind speed at 10-m is NOT an input',
    worksheet.core.inputs, 'omits', worksheet.nodes.wnd.spd.at10m )

  setConfigs( [ [ worksheet.nodes.cfg.wind.speed, 'at20ft',
    worksheet.nodes.cfg.wind.waf, 'input' ] ] )
  affirm( f, 'Selecting wind speed at 20-ft activates the wind.speed and wind.speed.waf configs',
    worksheet.core.activeCfg.length, 'equals', 2 )
  affirm( f, 'Cfg wind.speed is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.wind.speed )
  affirm( f, 'Cfg wind.waf is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.wind.waf )
  affirm( f, 'Wind speed at 20-ft and Primary Fuel Bed WAF are now inputs',
    worksheet.core.inputs.length, 'equals', 2 )
  affirm( f, 'Wind speed at 20-ft is now an input',
    worksheet.core.inputs, 'contains', worksheet.nodes.wnd.spd.at20ft )
  affirm( f, 'Primary fuel bed wind speed adjustment factor now an input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.bed.char.mwaf )
  affirm( f, 'Wind speed at 10-m is NOT an input',
    worksheet.core.inputs, 'omits', worksheet.nodes.wnd.spd.at10m )

  setConfigs( [ [ worksheet.nodes.cfg.wind.speed, 'at10m',
    worksheet.nodes.cfg.wind.waf, 'input' ] ] )
  affirm( f, 'Selecting wind speed at 10-m activates the wind.speed and wind.speed.waf configs',
    worksheet.core.activeCfg.length, 'equals', 2 )
  affirm( f, 'Cfg wind.speed is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.wind.speed )
  affirm( f, 'Cfg wind.waf is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.wind.waf )
  affirm( f, 'Wind speed at 10-m and WAF are now inputs',
    worksheet.core.inputs.length, 'equals', 2 )
  affirm( f, 'Wind speed at 10-m is now an input',
    worksheet.core.inputs, 'contains', worksheet.nodes.wnd.spd.at10m )
  affirm( f, 'Wind speed adjustment factor now an input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.bed.char.mwaf )
  affirm( f, 'Wind speed at 20-ft is NOT an input',
    worksheet.core.inputs, 'omits', worksheet.nodes.wnd.spd.at20ft )

  setConfigs( [ [ worksheet.nodes.cfg.wind.speed, 'at10m' ],
    [ worksheet.nodes.cfg.wind.waf, 'estimated' ] ] )
  affirm( f, 'Selecting wind speed at 10-m with estimated WAF activates the wind.speed, wind.speed.waf, and fuel.fue1 configs',
    worksheet.core.activeCfg.length, 'equals', 3 )
  affirm( f, 'Cfg wind.speed is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.wind.speed )
  affirm( f, 'Cfg wind.waf is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.wind.waf )
  affirm( f, 'Cfg fuel.fuel1 is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fuel.fuel1 )
  affirm( f, 'Wind speed at 10-m and WAF are now inputs',
    worksheet.core.inputs.length, 'equals', 5 )
  affirm( f, 'Wind speed adjustment factor is NOT an input',
    worksheet.core.inputs, 'omits', worksheet.nodes.surf.fuel.sf1.bed.char.mwaf )
  affirm( f, 'Wind speed at 10-m is now an input',
    worksheet.core.inputs, 'contains', worksheet.nodes.wnd.spd.at10m )
  affirm( f, 'Primary fuel model key is now an input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.modl.key )
  affirm( f, 'Canopy cover is now an input',
    worksheet.core.inputs, 'contains', worksheet.nodes.cpy.cv )
  affirm( f, 'Canopy height is now an input',
    worksheet.core.inputs, 'contains', worksheet.nodes.cpy.ht )
  affirm( f, 'Canopy base height ratio is now an input',
    worksheet.core.inputs, 'contains', worksheet.nodes.cpy.bh )

  // What happens if wind.speed==='atMidflame' and wind.waf==='estimated'?
  setConfigs( [ [ worksheet.nodes.cfg.wind.speed, 'atMidflame' ],
    [ worksheet.nodes.cfg.wind.waf, 'estimated' ] ] )
  affirm( f, 'Selecting wind speed at midflame with estimated WAF activates JUST the wind.speed config',
    worksheet.core.activeCfg.length, 'equals', 1 )
  affirm( f, 'Cfg wind.speed is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.wind.speed )
  affirm( f, 'Cfg wind.waf is NOT active',
    worksheet.core.activeCfg, 'omits', worksheet.nodes.cfg.wind.waf )
  affirm( f, 'Wind speed at midflame is the only input',
    worksheet.core.inputs.length, 'equals', 1 )
  affirm( f, 'Wind speed at midflame is now an input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.bed.char.mwsp )

  // If wind.speed==='atMidflame' AND wnd.spd.at20ft is selected or required by crown
  reset()
  selects( [ worksheet.nodes.surf.fuel.sf1.bed.char.mwsp,
    worksheet.nodes.wnd.spd.at20ft ] )
  setConfigs( [ [ worksheet.nodes.cfg.wind.speed, 'atMidflame' ],
    [ worksheet.nodes.cfg.wind.waf, 'input' ] ] )
  affirm( f, 'Selecting wind speed at midflame activates just the wind.speed config',
    worksheet.core.activeCfg.length, 'equals', 1 )
  affirm( f, 'Cfg wind.speed is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.wind.speed )
  affirm( f, 'Wind speed at midflame AND at 20-ft are inputs',
    worksheet.core.inputs.length, 'equals', 2 )
  affirm( f, 'Wind speed at midflame is now an input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.bed.char.mwsp )
  affirm( f, 'Wind speed at 20-ft is now an input',
    worksheet.core.inputs, 'contains', worksheet.nodes.wnd.spd.at20ft )
}

//------------------------------------------------------------------------------------------------
function configWindDir() {
  var f = 'configWindDir(): '

  reset()
  affirm( f, 'No variants selected yet',
    worksheet.core.selected.length, 'equals', 0 )
  affirm( f, 'No active configs yet',
    worksheet.core.activeCfg.length, 'equals', 0 )

  selects( [ worksheet.nodes.wnd.dir.hdg.up ])
  setConfigs( [ [ worksheet.nodes.cfg.wind.dir, 'headingFromUpslope' ] ] )
  affirm( f, 'Selecting wind heading from upslope activates the wind.dir config',
    worksheet.core.activeCfg.length, 'equals', 1 )
  affirm( f, 'Cfg wind.dir is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.wind.dir )
  affirm( f, 'Wind heading from upslope is the only input',
    worksheet.core.inputs.length, 'equals', 1 )
  affirm( f, 'Wind heading from upslope is now an input',
    worksheet.core.inputs, 'contains', worksheet.nodes.wnd.dir.hdg.up )

  // Selecting wind source from upslope requires no additional inputs or configs
  selects( [ worksheet.nodes.wnd.dir.src.up ])
  affirm( f, 'Selecting wind heading AND source from upslope activates the wind.dir config',
    worksheet.core.activeCfg.length, 'equals', 1 )
  affirm( f, 'Cfg wind.dir is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.wind.dir )
  affirm( f, 'Wind heading from upslope is STILL the only input',
    worksheet.core.inputs.length, 'equals', 1 )
  affirm( f, 'Wind heading from upslope is now an input',
    worksheet.core.inputs, 'contains', worksheet.nodes.wnd.dir.hdg.up )

  // Config to enter wind source from north,
  // (will still always need wind direction from upslope for any fire modeling)
  setConfigs( [ [ worksheet.nodes.cfg.wind.dir, 'sourceFromNorth' ] ] )
  affirm( f, 'Selecting wind heading from upslope activates the wind.dir config',
    worksheet.core.activeCfg.length, 'equals', 1 )
  affirm( f, 'Cfg wind.dir is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.wind.dir )
  affirm( f, 'Wind source from north and aspect are now inputs',
    worksheet.core.inputs.length, 'equals', 2 )
  affirm( f, 'Aspect is now an input',
    worksheet.core.inputs, 'contains', worksheet.nodes.slp.dir.asp )

  // Config to assume wind blows upslope
  reset()
  selects( [ worksheet.nodes.wnd.dir.hdg.up ])
  setConfigs( [ [ worksheet.nodes.cfg.wind.dir, 'assumedUpslope' ] ] )
  affirm( f, 'Selecting wind assumed upslope activates the wind.dir config',
    worksheet.core.activeCfg.length, 'equals', 1 )
  affirm( f, 'Cfg wind.dir is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.wind.dir )
  affirm( f, 'No inputs are required',
    worksheet.core.inputs.length, 'equals', 0 )
}

//------------------------------------------------------------------------------------------------
function configSurfaceFire() {
  var f = 'configSurfaceFire(): '

  reset()
  affirm( f, 'No variants selected yet',
    worksheet.core.selected.length, 'equals', 0 )
  affirm( f, 'No active configs yet',
    worksheet.core.activeCfg.length, 'equals', 0 )

  // Select just the primary fuel maximum ros
  selects( [ worksheet.nodes.surf.fuel.sf1.fire.ros ])
  affirm( f, 'Selecting primary fuel maximum ros activates 7 configs',
    worksheet.core.activeCfg.length, 'equals', 7 )
  affirm( f, 'Cfg mois.input is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.mois.input )
  affirm( f, 'Cfg wind.dir is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.wind.dir )
  affirm( f, 'Cfg wind.spd is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.wind.speed )
  affirm( f, 'Cfg slope.steepness is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.slope.steepness )
  affirm( f, 'Cfg fuel.fuel1 is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fuel.fuel1 )
  affirm( f, 'Cfg fuel.hcf is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fuel.hcf )
  affirm( f, 'Cfg fire.ewsl is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.ewsl )

  affirm( f, 'Dead 1-h fuel moisture is required as input',
  worksheet.core.inputs, 'contains', worksheet.nodes.mois.dead.tl1 )
  affirm( f, 'Dead 10-h fuel moisture is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.dead.tl10 )
  affirm( f, 'Dead 100-h fuel moisture is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.dead.tl100 )
  affirm( f, 'Live herb fuel moisture is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.live.herb )
  affirm( f, 'Live stem fuel moisture is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.live.stem )
  affirm( f, 'Slope steepness ratio is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.slp.stp.rat )
  affirm( f, 'Wind heading from upslope is now an input',
    worksheet.core.inputs, 'contains', worksheet.nodes.wnd.dir.hdg.up )
  affirm( f, 'Primary fuel wind speed at midflame is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.bed.char.mwsp )
  affirm( f, 'Primary fuel model key is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.modl.key )
  affirm( f, 'Primary fuel herb cured fraction is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.modl.std.hcf )
  affirm( f, 'Selecting primary fuel maximum ros requires 10 inputs',
    worksheet.core.inputs.length, 'equals', 10 )

  // Select the weighted maximum ros
  reset()
  selects( [ worksheet.nodes.surf.fire.wt.ros ])
  affirm( f, 'Selecting surface fire maximum ros activates 9 configs',
    worksheet.core.activeCfg.length, 'equals', 9 )
  affirm( f, 'Cfg mois.input is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.mois.input )
  affirm( f, 'Cfg wind.dir is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.wind.dir )
  affirm( f, 'Cfg wind.speed is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.wind.speed )
  affirm( f, 'Cfg slope.steepness is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.slope.steepness )
  affirm( f, 'Cfg fuel.fuel1 is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fuel.fuel1 )
  affirm( f, 'Cfg fuel.fuel2 is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fuel.fuel2 )
  affirm( f, 'Cfg fuel.hcf is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fuel.hcf )
  affirm( f, 'Cfg fire.ewsl is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.ewsl )
  affirm( f, 'Cfg fire.wtd is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.wtd )

  affirm( f, 'Dead 1-h fuel moisture is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.dead.tl1 )
  affirm( f, 'Dead 10-h fuel moisture is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.dead.tl10 )
  affirm( f, 'Dead 100-h fuel moisture is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.dead.tl100 )
  affirm( f, 'Live herb fuel moisture is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.live.herb )
  affirm( f, 'Live stem fuel moisture is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.live.stem )
  affirm( f, 'Slope steepness ratio is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.slp.stp.rat )
  affirm( f, 'Wind heading from upslope is now an input',
    worksheet.core.inputs, 'contains', worksheet.nodes.wnd.dir.hdg.up )
  affirm( f, 'Primary fuel wind speed at midflame is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.bed.char.mwsp )
  affirm( f, 'Primary fuel model key is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.modl.key )
  affirm( f, 'Secondary fuel model key is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf2.modl.key )
  affirm( f, 'Primary fuel herb cured fraction is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.modl.std.hcf )
  affirm( f, 'Secondary fuel herb cured fraction is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf2.modl.std.hcf )
  affirm( f, 'Primary fuel cover is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.modl.cover )
  affirm( f, 'Selecting surface fire maximum ros requires 13 inputs',
    worksheet.core.inputs.length, 'equals', 13 )

  // Selecting the direction of maximum spread from upslope requires no new inputs
  selects( [ worksheet.nodes.surf.fire.wt.hdup ])
  affirm( f, 'Selecting surface fire maximum dir from upslope still activates 9 configs',
    worksheet.core.activeCfg.length, 'equals', 9 )
  affirm( f, 'Selecting surface fire maximum dir from upslope still requires 13 inputs',
    worksheet.core.inputs.length, 'equals', 13 )

  // Selecting the direction of maximum spread from north requires aspect
  selects( [ worksheet.nodes.surf.fire.wt.hdno ])
  affirm( f, 'Selecting surface fire maximum dir from NORTH still activates 9 configs',
    worksheet.core.activeCfg.length, 'equals', 9 )
  affirm( f, 'Selecting surface fire maximum dir from NORTH requires 14 inputs',
    worksheet.core.inputs.length, 'equals', 14 )
  affirm( f, 'Slope steepness ratio is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.slp.dir.asp )

  // Selecting distance requires elapsed time
  selects( [ worksheet.nodes.surf.fire.wt.dist ])
  affirm( f, 'Selecting spread distance STILL activates 9 configs',
      worksheet.core.activeCfg.length, 'equals', 9 )
  affirm( f, 'Selecting spread distance ADDS 1 more input',
    worksheet.core.inputs.length, 'equals', 14+1 )
  affirm( f, 'Selecting spread distance requires elapsed time input',
    worksheet.core.inputs, 'contains', worksheet.nodes.fire.time.etig )

  // Selecting map distance requires map scale
  selects( [ worksheet.nodes.surf.fire.wt.mdist ])
  affirm( f, 'Selecting map spread distance STILL activates 9 configs',
      worksheet.core.activeCfg.length, 'equals', 9 )
  affirm( f, 'Selecting map spread distance ADDS 1 more input',
    worksheet.core.inputs.length, 'equals', 15+1 )
  affirm( f, 'Selecting map spread distance requires map scale',
    worksheet.core.inputs, 'contains', worksheet.nodes.map.scl )
}

//------------------------------------------------------------------------------------------------
function configFireFliFl() {
  var f = 'configFireFliFl(): '

  reset()
  affirm( f, '001: No variants selected yet',
    worksheet.core.selected.length, 'equals', 0 )
  affirm( f, '002: No active configs yet',
    worksheet.core.activeCfg.length, 'equals', 0 )

  selects( [ worksheet.nodes.fire.fli, worksheet.nodes.fire.fl ])
  setConfigs( [ [ worksheet.nodes.cfg.fire.fli, 'fli' ] ] )
  affirm( f, '003: Selecting fire.fli and/or fire.fl activates fire.fli config',
    worksheet.core.activeCfg.length, 'equals', 1 )
  affirm( f, '004: Cfg fire.fli is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.fli )
  affirm( f, '005: Selecting fire.fli and/or fire.fl requires 1 input',
    worksheet.core.inputs.length, 'equals', 1 )
  affirm( f, '006: Fire.fli is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.fire.fli )

  setConfigs( [ [ worksheet.nodes.cfg.fire.fli, 'fl' ] ] )
  affirm( f, '007: Selecting fire.fli and/or fire.fl activates fire.fli config',
    worksheet.core.activeCfg.length, 'equals', 1 )
  affirm( f, '008: Cfg fire.fli is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.fli )
  affirm( f, '009: Selecting fire.fli and/or fire.fl requires 1 input',
    worksheet.core.inputs.length, 'equals', 1 )
  affirm( f, '010: Fire.fl is now required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.fire.fl )
}

//------------------------------------------------------------------------------------------------
function configFireEwspElwr() {
  var f = 'configFireEwspElwr(): '

  reset()
  affirm( f, '001: No variants selected yet',
    worksheet.core.selected.length, 'equals', 0 )
  affirm( f, '002: No active configs yet',
    worksheet.core.activeCfg.length, 'equals', 0 )

  selects( [ worksheet.nodes.fire.ewsp, worksheet.nodes.fire.elwr ])
  setConfigs( [ [ worksheet.nodes.cfg.fire.lwr, 'elwr' ] ] )
  affirm( f, '003: Selecting fire.elwr and/or fire.ewsp activates fire.lwr config',
    worksheet.core.activeCfg.length, 'equals', 1 )
  affirm( f, '004: Cfg fire.lwr is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.lwr )
  affirm( f, '005: Selecting fire.elwr and/or fire.ewsp requires 1 input',
    worksheet.core.inputs.length, 'equals', 1 )
  affirm( f, '006: Fire.elwr is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.fire.elwr )

  setConfigs( [ [ worksheet.nodes.cfg.fire.lwr, 'ewsp' ] ] )
  affirm( f, '007: Selecting fire.elwr and/or fire.ewsp activates fire.lwr config',
    worksheet.core.activeCfg.length, 'equals', 1 )
  affirm( f, '008: Cfg fire.lwr is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.lwr )
  affirm( f, '009: Selecting fire.elwr and/or fire.ewsp requires 1 input',
    worksheet.core.inputs.length, 'equals', 1 )
  affirm( f, '010: Fire.ewsp is now required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.fire.ewsp )
}

//------------------------------------------------------------------------------------------------
function configFireEllipse() {
  var f = 'configFireEllipse(): '

  reset()
  affirm( f, '1.01: No variants selected yet',
    worksheet.core.selected.length, 'equals', 0 )
  affirm( f, '1.02: No active configs yet',
    worksheet.core.activeCfg.length, 'equals', 0 )

  // STANDALONE Select just the fire ellipse ros AND/OR head ros
  reset()
  selects( [ worksheet.nodes.surf.fire.el.head.ros,
              //worksheet.nodes.surf.fire.el.ros
             ])
  setConfigs( [ [ worksheet.nodes.cfg.size.link, 'standalone' ] ] )
  affirm( f, '2.01: Selecting fire ellipse head ros activates size.link config',
    worksheet.core.activeCfg.length, 'equals', 1 )
  affirm( f, '2.02: Cfg size.link is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.size.link )

  affirm( f, '2.03: Selecting fire ellipse head ros requires 1 input',
    worksheet.core.inputs.length, 'equals', 1 )
  affirm( f, '2.04:Fire ellipse maximum ros is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fire.el.ros )

  // LINKED to Surface
  setConfigs( [ [ worksheet.nodes.cfg.size.link, 'surface' ] ] )
  affirm( f, '3.01: Selecting fire ellipse head ros when LINKED TO SURFACE'
    +'activates size.link config and 9 Surface fire configs',
    worksheet.core.activeCfg.length, 'equals', 10 )
  affirm( f, '3.02: Cfg size.link is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.size.link )
  affirm( f, '3.03: Cfg mois.input is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.mois.input )
  affirm( f, '3.04: Cfg wind.dir is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.wind.dir )
  affirm( f, '3.05: Cfg wind.speed is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.wind.speed )
  affirm( f, '3.06: Cfg slope.steepness is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.slope.steepness )
  affirm( f, '3.07: Cfg fuel.fuel1 is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fuel.fuel1 )
  affirm( f, '3.08: Cfg fuel.fuel2 is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fuel.fuel2 )
  affirm( f, '3.09: Cfg fuel.hcf is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fuel.hcf )
  affirm( f, '3.10: Cfg fire.ewsl is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.ewsl )
  affirm( f, '3.11: Cfg fire.wtd is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.wtd )

  affirm( f, '3.12: Selecting fire ellipse head ros when LINKED TO SURFACE requires 13 input',
    worksheet.core.inputs.length, 'equals', 13 )
  affirm( f, '3.13: Dead 1-h fuel moisture is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.dead.tl1 )
  affirm( f, '3.14: Dead 10-h fuel moisture is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.dead.tl10 )
  affirm( f, '3.15: Dead 100-h fuel moisture is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.dead.tl100 )
  affirm( f, '3.16: Live herb fuel moisture is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.live.herb )
  affirm( f, '3.17: Live stem fuel moisture is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.live.stem )
  affirm( f, '3.18: Slope steepness ratio is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.slp.stp.rat )
  affirm( f, '3.19: Wind heading from upslope is now an input',
    worksheet.core.inputs, 'contains', worksheet.nodes.wnd.dir.hdg.up )
  affirm( f, '3.20: Primary fuel wind speed at midflame is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.bed.char.mwsp )
  affirm( f, '3.21: Primary fuel model key is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.modl.key )
  affirm( f, '3.22: Secondary fuel model key is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf2.modl.key )
  affirm( f, '3.33: Primary fuel herb cured fraction is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.modl.std.hcf )
  affirm( f, '3.34: Secondary fuel herb cured fraction is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf2.modl.std.hcf )
  affirm( f, '3.35: Primary fuel cover is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.modl.cover )

  // Back to STANDALONE; Select just the fire ellipse head fli via fli input
  reset()
  selects( [ worksheet.nodes.surf.fire.el.fli,
              worksheet.nodes.surf.fire.el.head.fli ])
  setConfigs( [ [ worksheet.nodes.cfg.size.link, 'standalone' ],
                [ worksheet.nodes.cfg.fire.fli, 'fli' ] ] )
  affirm( f, '4.01: Selecting fire ellipse head fli activates size.link and fire.fli configs',
    worksheet.core.activeCfg.length, 'equals', 2 )
  affirm( f, '4.02: Cfg size.link is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.size.link )
  affirm( f, '4.03: Cfg fire.fli is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.fli )

  affirm( f, '4.04: Selecting fire ellipse head fli requires 1 input',
    worksheet.core.inputs.length, 'equals', 1 )
  affirm( f, '4.05: Fire fli is required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.fire.fli )

  // Back to STANDALONE; Select just the fire ellipse head fli via fl input
  reset()
  selects( [ worksheet.nodes.surf.fire.el.fli,
             worksheet.nodes.surf.fire.el.head.fli ])
  setConfigs( [ [ worksheet.nodes.cfg.size.link, 'standalone' ],
                [ worksheet.nodes.cfg.fire.fli, 'fl' ] ] )
  affirm( f, '5.01: Selecting fire ellipse head fli activates size.link and fire.fli configs',
    worksheet.core.activeCfg.length, 'equals', 2 )
  affirm( f, '5.02: Cfg size.link is still active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.size.link )
  affirm( f, '5.03: Cfg fire.fli is still active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.fli )

  affirm( f, '5.04: Selecting fire ellipse fli requires 1 input',
    worksheet.core.inputs.length, 'equals', 1 )
  affirm( f, '5.05: Fire fl is now required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.fire.fl )

  // Back to STANDALONE; Select just the fire ellipse length-to-width ratio via ELWR input
  reset()
  selects( [ worksheet.nodes.surf.fire.el.elwr ] )
  setConfigs( [ [ worksheet.nodes.cfg.size.link, 'standalone' ],
                [ worksheet.nodes.cfg.fire.lwr, 'elwr' ] ] )
  affirm( f, '6.01: Selecting fire ellipse LWR activates size.link and fire.lwr configs',
    worksheet.core.activeCfg.length, 'equals', 2 )
  affirm( f, '6.02: Cfg size.link is still active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.size.link )
  affirm( f, '6.03: Cfg fire.lwr is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.lwr )

  affirm( f, '6.04: Selecting fire ellipse LWR requires 1 input',
    worksheet.core.inputs.length, 'equals', 1 )
  affirm( f, '6.05: Fire.elwr is now required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.fire.elwr )

  // Back to STANDALONE; Select just the fire ellipse length-to-width ratio via EWSP input
  reset()
  selects( [ worksheet.nodes.surf.fire.el.elwr ] )
  setConfigs( [ [ worksheet.nodes.cfg.size.link, 'standalone' ],
                [ worksheet.nodes.cfg.fire.lwr, 'ewsp' ] ] )
  affirm( f, '7.01: Selecting fire ellipse LWR activates size.link and fire.lwr configs',
    worksheet.core.activeCfg.length, 'equals', 2 )
  affirm( f, '7.02: Cfg size.link is still active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.size.link )
  affirm( f, '7.03: Cfg fire.lwr is still active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.lwr )

  affirm( f, '7.04: Selecting fire ellipse LWR requires 1 input',
    worksheet.core.inputs.length, 'equals', 1 )
  affirm( f, '7.05: Fire.ewsp is now required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.fire.ewsp )

  // Back to STANDALONE; Select just the BACK ros
  reset()
  selects( [ worksheet.nodes.surf.fire.el.back.ros ] )
  setConfigs( [ [ worksheet.nodes.cfg.size.link, 'standalone' ],
                [ worksheet.nodes.cfg.fire.lwr, 'elwr' ] ] )
  affirm( f, '8.01: Selecting fire ellipse LWR activates size.link and fire.lwr configs',
    worksheet.core.activeCfg.length, 'equals', 2 )
  affirm( f, '8.02: Cfg size.link is still active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.size.link )
  affirm( f, '8.03: Cfg fire.lwr is still active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.lwr )

  affirm( f, '8.04: Selecting fire ellipse LWR requires 2 inputs',
    worksheet.core.inputs.length, 'equals', 2 )
  affirm( f, '8.05: Fire.elwr is now required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.fire.elwr )

  // Back to STANDALONE; Select just the FLANK ros
  reset()
  selects( [ worksheet.nodes.surf.fire.el.flnk.ros ] )
  setConfigs( [ [ worksheet.nodes.cfg.size.link, 'standalone' ],
                [ worksheet.nodes.cfg.fire.lwr, 'elwr' ] ] )
  affirm( f, '9.01: Selecting fire ellipse LWR activates size.link and fire.lwr configs',
    worksheet.core.activeCfg.length, 'equals', 2 )
  affirm( f, '9.02: Cfg size.link is still active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.size.link )
  affirm( f, '9.03: Cfg fire.lwr is still active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.lwr )

  affirm( f, '9.04: Selecting fire ellipse LWR requires 2 inputs',
    worksheet.core.inputs.length, 'equals', 2 )
  affirm( f, '9.05: Fire.elwr is now required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.fire.elwr )

  // STANDALONE with JUST the eccentricity
  reset()
  selects( [ worksheet.nodes.surf.fire.el.ecc ] )
  setConfigs( [ [ worksheet.nodes.cfg.size.link, 'standalone' ],
                [ worksheet.nodes.cfg.fire.lwr, 'elwr' ] ] )
  affirm( f, '10.01: Selecting JUST fire ellipse eccentricity activates both size.link and fire.lwr config',
    worksheet.core.activeCfg.length, 'equals', 2 )
  affirm( f, '10.02: Cfg fire.lwr is still active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.lwr )
  affirm( f, '10.03: Cfg size.link is still active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.size.link )
  affirm( f, '10.04: Selecting fire ellipse LWR requires 1 input',
    worksheet.core.inputs.length, 'equals', 1 )
  affirm( f, '10.05: Fire.elwr is now required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.fire.elwr )

  reset()
  selects( [
    worksheet.nodes.surf.fire.el.beta.ros,
    worksheet.nodes.surf.fire.el.head.ros,
    ] )
  setConfigs( [ [ worksheet.nodes.cfg.size.link, 'standalone' ],
                [ worksheet.nodes.cfg.fire.lwr, 'elwr' ],
                [ worksheet.nodes.cfg.fire.dir, 'hd' ] ] )
  affirm( f, '11.01: Selecting fire ellipse beta ros activates fire.dir and fire.lwr configs',
    worksheet.core.activeCfg.length, 'equals', 3 )
  affirm( f, '11.02: Cfg fire.dir is active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.dir )
  affirm( f, '11.03: Cfg fire.lwr is still active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.lwr )
  affirm( f, '11.04: Cfg size.link is still active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.size.link )

  affirm( f, '11.05: Selecting fire ellipse LWR requires 3 inputs',
    worksheet.core.inputs.length, 'equals', 3 )
  affirm( f, '11.06: Fire.elwr is now required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.fire.elwr )
  affirm( f, '11.07: Fire ellipse ros is now required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fire.el.ros )
  affirm( f, '11.08: Fire vector beta from head is now required as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.fire.vec.beta.azhd )

  // Selecting distance requires elapsed time
  selects( [ worksheet.nodes.surf.fire.el.beta.dist,
    worksheet.nodes.surf.fire.el.size.len,
    worksheet.nodes.surf.fire.el.size.wid,
    worksheet.nodes.surf.fire.el.size.perim,
    worksheet.nodes.surf.fire.el.size.area,
    worksheet.nodes.surf.fire.el.head.dist,
    worksheet.nodes.surf.fire.el.flnk.dist,
    worksheet.nodes.surf.fire.el.back.dist,
    //worksheet.nodes.surf.fire.el.psi.dist,
   ])
  affirm( f, '12.01: Selecting beta distance STILL activates 3 configs',
      worksheet.core.activeCfg.length, 'equals', 3 )
  affirm( f, '12.02: Selecting beta spread distance ADDS 1 more input',
    worksheet.core.inputs.length, 'equals', 3+1 )
  affirm( f, '12.03: Selecting beta spread distance requires elapsed time input',
    worksheet.core.inputs, 'contains', worksheet.nodes.fire.time.etig )

  // Selecting map distance requires map scale
  selects( [ worksheet.nodes.surf.fire.el.beta.mdist,
    worksheet.nodes.surf.fire.el.size.mperim,
    worksheet.nodes.surf.fire.el.size.mlen,
    worksheet.nodes.surf.fire.el.size.mwid,
    worksheet.nodes.surf.fire.el.size.marea,
    worksheet.nodes.surf.fire.el.head.mdist,
    worksheet.nodes.surf.fire.el.flnk.mdist,
    worksheet.nodes.surf.fire.el.back.mdist,
 ])
  affirm( f, '13.01: Selecting beta map spread distance STILL activates 3 configs',
      worksheet.core.activeCfg.length, 'equals', 3 )
  affirm( f, '13.02: Selecting beta map spread distance ADDS 1 more input',
    worksheet.core.inputs.length, 'equals', 4+1 )
  affirm( f, '13.03: Selecting beta map spread distance requires map scale',
    worksheet.core.inputs, 'contains', worksheet.nodes.map.scl )
}

//------------------------------------------------------------------------------------------------
function configFireVectors() {
  var f = 'configFireVectors(): '

  reset()
  affirm( f, '1.01: No variants selected yet',
    worksheet.core.selected.length, 'equals', 0 )
  affirm( f, '1.02: No active configs yet',
    worksheet.core.activeCfg.length, 'equals', 0 )

  // STANDALONE Tests
  var vector = worksheet.nodes.fire.vec.beta
  var name = 'beta'
  for ( let i=0; i<2; i++ ) {
    if ( i === 1 ) {
      vector = worksheet.nodes.fire.vec.psi
      name = 'psi'
    }
    // CASE 1.A - SELECT fire.vec.[beta|psi].azhd wrt FIRE HEAD
    // (they are always used to determined beta and psi spread rates,
    // and may be derived from azno or azup )
    // INPUT fire.vec.[beta|psi].azhd, fire vectors wrt FIRE HEAD
    reset()
    selects( [ vector.azhd ] )
    setConfigs( [ [ worksheet.nodes.cfg.size.link, 'standalone' ],
                  [ worksheet.nodes.cfg.fire.dir, 'hd'] ] )
    affirm( f, '2.01: Selecting JUST fire vector beta azhd activates fire.dir config',
      worksheet.core.activeCfg.length, 'equals', 1 )
    affirm( f, '2.02: Cfg fire.dir is now active',
      worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.dir )
    affirm( f, '2.03: Selecting JUST fire vector beta azhd requires 1 input',
      worksheet.core.inputs.length, 'equals', 1 )
    affirm( f, '2.04: fire.vec.beta.azhd is now required as input',
      worksheet.core.inputs, 'contains', vector.azhd )

    // CASE 1.B - SELECT fire.vec.[beta|psi].azhd wrt FIRE HEAD
    // INPUT fire.vec.[beta|psi].azup, fire vectors wrt UPSLOPE
    setConfigs( [ [ worksheet.nodes.cfg.fire.dir, 'up' ] ] )
    affirm( f, '3.01: Selecting JUST fire vector beta azhd activates fire.dir and size.link config',
      worksheet.core.activeCfg.length, 'equals', 2 )
    affirm( f, '3.02: Cfg fire.dir is now active',
      worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.dir )
    affirm( f, '3.03: Cfg size.link is now active',
      worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.size.link )
    affirm( f, '3.04: Selecting JUST fire vector beta azup requires 2 inputs',
      worksheet.core.inputs.length, 'equals', 2 )
    affirm( f, '3.05: fire.vec.beta.azup is now required as input',
      worksheet.core.inputs, 'contains', vector.azup )
    affirm( f, '3.06: fire.vec.head.azup is now required as input',
      worksheet.core.inputs, 'contains', worksheet.nodes.fire.vec.head.azup )

    // CASE 1.C - SELECT fire.vec.[beta|psi].azhd wrt FIRE HEAD
    // INPUT fire.vec.[beta|psi].azno, fire vectors wrt NORTH
    setConfigs( [ [ worksheet.nodes.cfg.fire.dir, 'no' ] ] )
    affirm( f, '4.01: Selecting JUST fire vector beta azhd activates fire.dir and size.link config',
      worksheet.core.activeCfg.length, 'equals', 2 )
    affirm( f, '4.02: Cfg fire.dir is now active',
      worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.dir )
    affirm( f, '4.03: Cfg size.link is now active',
      worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.size.link )
    affirm( f, '4.04: Selecting JUST fire vector azno requires 3 inputs',
      worksheet.core.inputs.length, 'equals', 3 )
    affirm( f, `4.05: fire.vec.${name}.azno is now required as input`,
      worksheet.core.inputs, 'contains', vector.azno )
    affirm( f, `4.06: fire.vec.head.azno is now required as input`,
      worksheet.core.inputs, 'contains', worksheet.nodes.fire.vec.head.azno )
    affirm( f, '4.07: slp.dir.asp is now required as input',
      worksheet.core.inputs, 'contains', worksheet.nodes.slp.dir.asp )

    // Repeat tests while LINKED TO SURFACE

    // CASE 1.A - SELECT fire.vec.[beta|psi].azhd wrt FIRE HEAD
    // INPUT fire.vec.[beta|psi].azhd, fire vectors wrt FIRE HEAD
    reset()
    selects( [ vector.azhd ] )
    setConfigs( [ [ worksheet.nodes.cfg.size.link, 'surface' ],
                  [ worksheet.nodes.cfg.fire.dir, 'hd'] ] )
    affirm( f, '5.01: Selecting JUST fire vector beta azhd activates fire.dir config',
      worksheet.core.activeCfg.length, 'equals', 1 )
    affirm( f, '5.02: Cfg fire.dir is now active',
      worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.dir )

    affirm( f, '5.03: Selecting JUST fire vector beta azhd requires 1 input',
      worksheet.core.inputs.length, 'equals', 1 )
    affirm( f, '5.04: fire.vec.beta.azhd is now required as input',
      worksheet.core.inputs, 'contains', vector.azhd )

    // CASE 1.B - SELECT fire.vec.[beta|psi].azhd wrt FIRE HEAD
    // INPUT fire.vec.[beta|psi].azup, fire vectors wrt UPSLOPE
    // Linking to SURFACE means fire heading from upslope
    // is provided by SURFACE and not by input
    setConfigs( [ [ worksheet.nodes.cfg.fire.dir, 'up' ] ] )
    affirm( f, '6.01: Selecting JUST fire vector beta azhd activates fire.dir and size.link config',
      worksheet.core.activeCfg.length, '=', 8 )
    affirm( f, '6.02: Cfg fire.dir is now active',
      worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.dir )
    affirm( f, '6.03: Cfg size.link is now active',
      worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.size.link )
    affirm( f, '6.04: Cfg fuel.fuel1 is now active',
      worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fuel.fuel1 )
    affirm( f, '6.05: Cfg fuel.hcf is now active',
      worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fuel.hcf )
    affirm( f, '6.06: Cfg mois.input is now active',
      worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.mois.input )
    affirm( f, '6.07: Cfg wind.speed is now active',
      worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.wind.speed )
    affirm( f, '6.08: Cfg wind.dir is now active',
      worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.wind.dir )
    affirm( f, '6.09: Cfg slope.steepness is now active',
      worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.slope.steepness )

    affirm( f, '6.10: Selecting JUST fire vector beta azup requires 11 inputs',
      worksheet.core.inputs.length, 'equals', 11 )
    affirm( f, '6.11: fire.vec.beta.azup is required as input',
      worksheet.core.inputs, 'contains', vector.azup )
    affirm( f, '6.12: fire.vec.head.azup is NOT required as input',
      worksheet.core.inputs, 'omits', worksheet.nodes.fire.vec.head.azup )
    affirm( f, '6.13: slp.dir.asp is NOT required as input',
      worksheet.core.inputs, 'omits', worksheet.nodes.slp.dir.asp )

    // CASE 1.C - SELECT fire.vec.[beta|psi].azhd wrt FIRE HEAD
    // INPUT fire.vec.[beta|psi].azno, fire vectors wrt NORTH
    // Linking to SURFACE means fire heading from upslope
    // is provided by SURFACE and not by input
    setConfigs( [ [ worksheet.nodes.cfg.fire.dir, 'no' ] ] )
    affirm( f, '7.01: Selecting JUST fire vector beta azhd activates fire.dir and size.link config',
      worksheet.core.activeCfg.length, '=', 8 )
    affirm( f, '7.02: Selecting JUST fire vector beta azup requires 11 inputs',
      worksheet.core.inputs.length, 'equals', 12 )
    affirm( f, '7.03: fire.vec.beta.azup is NOT required as input',
      worksheet.core.inputs, 'omits', vector.azup )
    affirm( f, '7.04: fire.vec.beta.azhd is NOT required as input',
      worksheet.core.inputs, 'omits', vector.azhd )
    affirm( f, '7.05: fire.vec.head.azup is NOT required as input',
      worksheet.core.inputs, 'omits', worksheet.nodes.fire.vec.head.azup )
    affirm( f, `7.06: fire.vec.${name}.azno is now required as input`,
      worksheet.core.inputs, 'contains', vector.azno )
    affirm( f, '7.07: slp.dir.asp is now required as input',
      worksheet.core.inputs, 'contains', worksheet.nodes.slp.dir.asp )

    // Simple direction conversion between vectors
    // wrt fire head, upslope, and north

    // STANDALONE Mode

    // CASE 3.A - SELECT fire.vec.[beta|psi].azno wrt NORTH
    // INPUT fire.vec.[beta|psi].azhd, fire vector wrt FIRE HEAD
    reset()
    selects( [ vector.azno ] )
    setConfigs( [ [ worksheet.nodes.cfg.size.link, 'standalone' ],
                  [ worksheet.nodes.cfg.fire.dir, 'hd'] ] )
    affirm( f, '8.01: Selecting JUST fire vector beta azno activates fire.dir config',
      worksheet.core.activeCfg.length, 'equals', 2 )
    affirm( f, '8.02: Cfg fire.dir is now active',
      worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.dir )
    affirm( f, '8.03: Cfg size.link is now active',
      worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.size.link )
    affirm( f, '8.04: Selecting JUST fire vector beta azno requires 3 inputs',
      worksheet.core.inputs.length, 'equals', 3 )
    affirm( f, '8.05: fire.vec.beta.azhd is input',
      worksheet.core.inputs, 'contains', vector.azhd )
    affirm( f, '8.06: fire.vec.head.azup is input',
      worksheet.core.inputs, 'contains', worksheet.nodes.fire.vec.head.azup )
    affirm( f, '8.07: slp.dir.asp is input',
      worksheet.core.inputs, 'contains', worksheet.nodes.slp.dir.asp )
    //console.log( debug.listEdges( vector.azno ))

    // CASE 3.B - SELECT fire.vec.[beta|psi].azno, wrt NORTH
    // INPUT fire.vec.[beta|psi].azup, fire vector wrt UPSLOPE
    // No longer need fire heading from upslope, so no size.link needed
    setConfigs( [ [ worksheet.nodes.cfg.size.link, 'standalone' ],
                  [ worksheet.nodes.cfg.fire.dir, 'up'] ] )
    affirm( f, '9.01: Selecting JUST fire vector beta azno activates fire.dir config',
      worksheet.core.activeCfg.length, 'equals', 1 )
    affirm( f, '9.02: Cfg fire.dir is now active',
      worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.dir )
    affirm( f, '9.03: Cfg size.link is now INactive',
      worksheet.core.activeCfg, 'omits', worksheet.nodes.cfg.size.link )
    affirm( f, '9.04: Selecting JUST fire vector beta azno requires 2 inputs',
      worksheet.core.inputs.length, 'equals', 2 )
    affirm( f, '9.05: fire.vec.beta.azup is input',
      worksheet.core.inputs, 'contains', vector.azup )
    affirm( f, '9.06: fire.vec.head.azup is NOT input',
      worksheet.core.inputs, 'omits', worksheet.nodes.fire.vec.head.azup )
    affirm( f, '9.07: slp.dir.asp is input',
      worksheet.core.inputs, 'contains', worksheet.nodes.slp.dir.asp )

    // CASE 3.C - SELECT fire.vec.[beta|psi].azno, wrt NORTH
    // INPUT fire.vec.[beta|psi].azno, fire vector wrt NORTH
    // No longer need fire heading from upslope, so no size.link needed
    setConfigs( [ [ worksheet.nodes.cfg.size.link, 'standalone' ],
                  [ worksheet.nodes.cfg.fire.dir, 'no'] ] )
    affirm( f, '10.01: Selecting JUST fire vector beta azno activates fire.dir config',
      worksheet.core.activeCfg.length, 'equals', 1 )
    affirm( f, '10.02: Cfg fire.dir is now active',
      worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.dir )
    affirm( f, '10.03: Cfg size.link is now INactive',
      worksheet.core.activeCfg, 'omits', worksheet.nodes.cfg.size.link )
    affirm( f, '10.04: Selecting JUST fire vector beta azno requires 1 inputs',
      worksheet.core.inputs.length, 'equals', 1 )
    affirm( f, '10.05: fire.vec.beta.azup is NOT input',
      worksheet.core.inputs, 'omits', vector.azup )
    affirm( f, '10.06: fire.vec.head.azup is NOT input',
      worksheet.core.inputs, 'omits', worksheet.nodes.fire.vec.head.azup )
    affirm( f, '10.07: slp.dir.asp is NOT input',
      worksheet.core.inputs, 'omits', worksheet.nodes.slp.dir.asp )
    affirm( f, '10.08: fire.vec.beta.azno is the only input',
      worksheet.core.inputs, 'contains', vector.azno )

    // STANDALONE Mode
    // CASE 2.1 - SELECT fire.vec.beta.azup wrt UPSLOPE
    // INPUT fire.vec.beta.azhd, fire vectors wrt FIRE HEAD
    reset()
    selects( [ vector.azup ] )
    setConfigs( [ [ worksheet.nodes.cfg.size.link, 'standalone' ],
                  [ worksheet.nodes.cfg.fire.dir, 'hd'] ] )
    affirm( f, '11.01: Selecting JUST fire vector beta azno activates fire.dir config',
      worksheet.core.activeCfg.length, 'equals', 2 )
    affirm( f, '11.02: Cfg fire.dir is now active',
      worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.dir )
    affirm( f, '11.03: Cfg size.link is now active',
      worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.size.link )
    affirm( f, '11.04: Selecting JUST fire vector beta azup requires 3 inputs',
      worksheet.core.inputs.length, 'equals', 2 )
    affirm( f, `11.05: fire.vec.${name}.azhd is input`,
      worksheet.core.inputs, 'contains', vector.azhd )
    affirm( f, '11.06: fire.vec.head.azup is input',
      worksheet.core.inputs, 'contains', worksheet.nodes.fire.vec.head.azup )
    affirm( f, '11.07: slp.dir.asp is NOT an input',
      worksheet.core.inputs, 'omits', worksheet.nodes.slp.dir.asp )

    // CASE 2.2 - SELECT fire.vec.beta.azup wrt UPSLOPE
    // INPUT fire.vec.beta.azup, fire vector wrt UPSLOPE
    // No longer need fire heading from upslope, so no size.link needed
    setConfigs( [ [ worksheet.nodes.cfg.size.link, 'standalone' ],
                  [ worksheet.nodes.cfg.fire.dir, 'up'] ] )
    affirm( f, '12.01: Selecting JUST fire vector beta azno activates fire.dir config',
      worksheet.core.activeCfg.length, 'equals', 1 )
    affirm( f, '12.02: Cfg fire.dir is now active',
      worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.dir )
    affirm( f, '12.03: Cfg size.link is now INactive',
      worksheet.core.activeCfg, 'omits', worksheet.nodes.cfg.size.link )
    affirm( f, '12.04: Selecting JUST fire vector beta azup requires 1 inputs',
      worksheet.core.inputs.length, 'equals', 1 )
    affirm( f, '12.05: fire.vec.beta.azup is input',
      worksheet.core.inputs, 'contains', vector.azup )
    affirm( f, '12.06: fire.vec.head.azup is NOT input',
      worksheet.core.inputs, 'omits', worksheet.nodes.fire.vec.head.azup )
    affirm( f, '12.07: slp.dir.asp is NOT input',
      worksheet.core.inputs, 'omits', worksheet.nodes.slp.dir.asp )
    affirm( f, '12.08: fire.vec.beta.azno is NOT input',
      worksheet.core.inputs, 'omits', vector.azno )

    // CASE 2.3 - SELECT fire.vec.beta.azup wrt UPSLOPE
    // INPUT fire.vec.beta.azno, fire vector wrt NORTH
    // No longer need fire heading from upslope, so no size.link needed
    setConfigs( [ [ worksheet.nodes.cfg.size.link, 'standalone' ],
                  [ worksheet.nodes.cfg.fire.dir, 'no'] ] )
    affirm( f, '13.01: Selecting JUST fire vector beta azup activates fire.dir config',
      worksheet.core.activeCfg.length, 'equals', 1 )
    affirm( f, '13.02: Cfg fire.dir is now active',
      worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.dir )
    affirm( f, '13.03: Cfg size.link is now INactive',
      worksheet.core.activeCfg, 'omits', worksheet.nodes.cfg.size.link )
    affirm( f, '13.04: Selecting JUST fire vector beta azup requires 2 inputs',
      worksheet.core.inputs.length, 'equals', 2 )
    affirm( f, `13.05: fire.vec.${name}.azno is input`,
      worksheet.core.inputs, 'contains', vector.azno )
    affirm( f, '13.06: fire.vec.beta.azup is NOT input',
      worksheet.core.inputs, 'omits', vector.azup )
    affirm( f, '13.07: fire.vec.head.azup is NOT input',
      worksheet.core.inputs, 'omits', worksheet.nodes.fire.vec.head.azup )
    affirm( f, '13.08: slp.dir.asp is input',
      worksheet.core.inputs, 'contains', worksheet.nodes.slp.dir.asp )
  }
}

//------------------------------------------------------------------------------------------------
function configFireEllipseScorch() {
  var f = 'configFireEllipseScorch(): '

  reset()
  affirm( f, '1.01: No variants selected yet',
    worksheet.core.selected.length, 'equals', 0 )
  affirm( f, '1.02: No active configs yet',
    worksheet.core.activeCfg.length, 'equals', 0 )

  // The following scorch height variants exist:
  // 1 - Primary fuel bed maximum (worksheet.nodes.surf.fuel.sf1.fire.scht)
  // 2 - Secondary fuel bed maximum (worksheet.nodes.surf.fuel.sf2.fire.scht)
  // 3 - Weighted fuel bed (worksheet.nodes.surf.fire.wt.scht)
  // 4 - Fire ellipse head [SIMPLE] (worksheet.nodes.surf.fire.el.head.scht)
  // 5 - Fire ellipse flank [SIMPLE] (worksheet.nodes.surf.fire.el.flnk.scht)
  // 6 - Fire ellipse back [SIMPLE] (worksheet.nodes.surf.fire.el.back.scht)
  // 7 - Fire ellipse beta [SIMPLE] (worksheet.nodes.surf.fire.el.beta.scht)
  // 8 - Fire ellipse beta5 [SIMPLE] (worksheet.nodes.surf.fire.el.beta5.scht)
  // 9 - Fire ellipse psi [SIMPLE] (worksheet.nodes.surf.fire.el.psi.scht)

  // Selecting SCORCH HT at FIRE ELLIPSE HEAD
  // is the ame as running SCORCH in STANDALONE Mode

  selects( [ worksheet.nodes.surf.fire.el.head.scht ] )
  setConfigs( [ [ worksheet.nodes.cfg.size.link, 'standalone' ],
                [ worksheet.nodes.cfg.fire.fli, 'fli' ],
                [ worksheet.nodes.cfg.wind.speed, 'atMidflame' ] ] )
  affirm( f, '2.01: Selecting fire ellipse head scorch height activates size.link config',
    worksheet.core.activeCfg.length, 'equals', 3 )
  affirm( f, '2.02: Cfg fire.fli is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.fli )
  affirm( f, '2.03: Cfg size.link is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.size.link )
  affirm( f, '2.04: Cfg wind.speed is now active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.wind.speed )
  affirm( f, '2.05: Selecting JUST scorch ht requires 3 inputs',
    worksheet.core.inputs.length, 'equals', 3 )
  affirm( f, '2.06: Scorch ht requires fireline intensity',
    worksheet.core.inputs, 'contains', worksheet.nodes.fire.fli )
  affirm( f, '2.07: Scorch ht requires windspeed at midflame',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.bed.char.mwsp )
  affirm( f, '2.08: Scorch ht requires air temperature',
    worksheet.core.inputs, 'contains', worksheet.nodes.air.tmp )

  // Prefer flame length input over fireline intensity input
  setConfigs( [ [ worksheet.nodes.cfg.size.link, 'standalone' ],
                [ worksheet.nodes.cfg.fire.fli, 'fl' ],
                [ worksheet.nodes.cfg.wind.speed, 'atMidflame' ] ] )
  affirm( f, '3.01: Selecting JUST scorch ht requires 3 inputs',
    worksheet.core.inputs.length, 'equals', 3 )
  affirm( f, '3.02: Scorch ht NOW requires flame length',
    worksheet.core.inputs, 'contains', worksheet.nodes.fire.fl )
  affirm( f, '3.03: Scorch ht STILL requires windspeed at midflame',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.bed.char.mwsp )
  affirm( f, '3.04: Scorch ht STILL requires air temperature',
    worksheet.core.inputs, 'contains', worksheet.nodes.air.tmp )

  // Prefer wind speed at 20-ft input
  setConfigs( [ [ worksheet.nodes.cfg.size.link, 'standalone' ],
                [ worksheet.nodes.cfg.fire.fli, 'fl' ],
                [ worksheet.nodes.cfg.wind.speed, 'at20ft' ] ] )
  affirm( f, '4.01: Prefer 20-ft wind speed activates the wind.waf config',
    worksheet.core.activeCfg.length, 'equals', 4 )
  affirm( f, '4.02: Cfg wind.waf is NOWL active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.wind.waf )
  affirm( f, '4.01: Selecting JUST scorch ht NOW requires 4 inputs',
    worksheet.core.inputs.length, 'equals', 4 )
  affirm( f, '4.02: Scorch ht NOW requires flame length',
    worksheet.core.inputs, 'contains', worksheet.nodes.fire.fl )
  affirm( f, '4.03: Scorch ht NOW requires windspeed at 20-ft',
    worksheet.core.inputs, 'contains', worksheet.nodes.wnd.spd.at20ft )
  affirm( f, '4.04: Scorch ht NOW requires wind speed adjustment factor',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.bed.char.mwaf )
  affirm( f, '4.05: Scorch ht STILL requires air temperature',
    worksheet.core.inputs, 'contains', worksheet.nodes.air.tmp )

  // Add scorch ht at flank
  selects( [ worksheet.nodes.surf.fire.el.flnk.scht,
            worksheet.nodes.surf.fire.el.back.scht ] )
  affirm( f, '5.01: Selecting scorch ht at flank or back activate fire.lwr config',
    worksheet.core.activeCfg.length, 'equals', 5 )
  affirm( f, '5.02: Cfg fire.lwr is NOW active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.lwr )
  affirm( f, '5.03: Cfg fire.fli is STILL active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.fli )
  affirm( f, '5.04: Cfg size.link is STILL active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.size.link )
  affirm( f, '5.05: Cfg wind.speed is STILL active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.wind.speed )
  affirm( f, '5.06: Cfg wind.waf is STILL active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.wind.waf )
  affirm( f, '5.07: Selecting scorch ht at flank NOW requires 6 inputs',
    worksheet.core.inputs.length, 'equals', 6 )
  affirm( f, '5.08: Scorch ht STILL requires flame length',
    worksheet.core.inputs, 'contains', worksheet.nodes.fire.fl )
  affirm( f, '5.09: Scorch ht STILL requires windspeed at 20-ft',
    worksheet.core.inputs, 'contains', worksheet.nodes.wnd.spd.at20ft )
  affirm( f, '5.10: Scorch ht STILL requires wind speed adjustment factor',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.bed.char.mwaf )
  affirm( f, '5.11: Scorch ht STILL requires air temperature',
    worksheet.core.inputs, 'contains', worksheet.nodes.air.tmp )
  affirm( f, '5.12: Scorch ht at flank ADDS maximum spread rate input',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fire.el.ros )
  affirm( f, '5.13: Scorch ht at flank ADDS length-to-width ratio input',
    worksheet.core.inputs, 'contains', worksheet.nodes.fire.elwr )

  // Linking to SURFACE activates all the usual SURFACE configs and inputs
  reset()
  setConfigs( [ [ worksheet.nodes.cfg.size.link, 'surface' ] ] )
  selects( [ worksheet.nodes.surf.fire.el.head.scht ] )
  affirm( f, '6.01: Linking to surface activates all the usual SURFACE configs',
    worksheet.core.activeCfg.length, 'gt', 3 )
  affirm( f, '6.02: Linking to surface activates all the usual SURFACE inputs',
    worksheet.core.inputs.length, 'gt', 3 )

  // Selecting the fuel scorch heights activates all the usual SURFACE configs and inputs
  reset()
  setConfigs( [ [ worksheet.nodes.cfg.size.link, 'standalone' ] ] )
  selects( [
    worksheet.nodes.surf.fuel.sf1.fire.scht,  // requires 7 configs, 11 inputs
    worksheet.nodes.surf.fuel.sf2.fire.scht,  // requires 7 configs, 11 inputs
    worksheet.nodes.surf.fire.wt.scht,        // requires 8 configs, 13 inputs
   ] )
  affirm( f, '6.01: Linking to surface activates all the usual SURFACE configs',
    worksheet.core.activeCfg.length, 'ge', 7 )
  affirm( f, '6.02: Linking to surface activates all the usual SURFACE inputs',
    worksheet.core.inputs.length, 'ge', 11 )

}

//------------------------------------------------------------------------------------------------
function configCrownFire() {
  var f = 'configCrownFire(): '

  reset()
  affirm( f, '0.01: No variants selected yet',
    worksheet.core.selected.length, 'equals', 0 )
  affirm( f, '0.02: No active configs yet',
    worksheet.core.activeCfg.length, 'equals', 0 )

  // STANDALONE Selecting JUST the crown fire active spread rate
  // just requires Fuel Model 10 moisture, slope, wind
  selects( [ worksheet.nodes.crown.fire.rActive ])
  setConfigs( [ [ worksheet.nodes.cfg.crown.link, 'standalone' ] ] )
  affirm( f, '1.01: Selecting crown fire active ros activates surface fire 3 configs',
    worksheet.core.activeCfg.length, 'equals', 3 )
  affirm( f, '1.02: Cfg mois.input is now active because fuel moisture is required by crown fuel FM10',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.mois.input )
  affirm( f, '1.03: Cfg wind.spd is now active because wind speed is required by crown fuel FM10',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.wind.speed )
  affirm( f, '1.04: Cfg fire.ewsl is now active because its required by crown fuel FM10',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.ewsl )

  affirm( f, '1.05: Cfg crown.link should not yet be active',
    worksheet.core.activeCfg, 'omits', worksheet.nodes.cfg.crown.link )
  affirm( f, '1.06: Cfg slope.steepness should not be active because crown fire assumes 0 slope',
    worksheet.core.activeCfg, 'omits', worksheet.nodes.cfg.slope.steepness )
  affirm( f, '1.07: Cfg fuel.fuel3 should not be active because it has just 1 option',
    worksheet.core.activeCfg, 'omits', worksheet.nodes.cfg.fuel.fuel3 )
  affirm( f, '1.08: Cfg wind.dir should not be active because crown fire assumes wind blows upslope',
    worksheet.core.activeCfg, 'omits', worksheet.nodes.cfg.wind.dir )
  affirm( f, '1.09: Cfg fuel.hcf should not be active because FM10 has no herbaceous fuel',
    worksheet.core.activeCfg, 'omits', worksheet.nodes.cfg.fuel.hcf )

  affirm( f, '1.10: Crown active ROS requires 5 moisture and a wind speed input',
    worksheet.core.inputs.length, 'equals', 6 )
  affirm( f, '1.11: Crown active ros requires wind speed at 20-ft input',
    worksheet.core.inputs, 'contains', worksheet.nodes.wnd.spd.at20ft )
  affirm( f, '1.12: Crown active ros requires dead 1-h fuel moisture',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.dead.tl1 )
  affirm( f, '1.13: Crown active ros requires dead 10-h fuel moisture',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.dead.tl10 )
  affirm( f, '1.14: Crown active ros requires dead 100-h fuel moisture',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.dead.tl100 )
  affirm( f, '1.15: Crown active ros requires live herb fuel moisture',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.live.herb )
  affirm( f, '1.16: Crown active ros requires live stem fuel moisture',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.live.stem )

  // Adding power of the wind requires no new variants
  selects( [ worksheet.nodes.crown.fire.powerWind ])
  affirm( f, '2.01: Selecting power of Wind STILL activates same surface fire 3 configs',
    worksheet.core.activeCfg.length, 'equals', 3 )
  affirm( f, '2.02: Selecting Power of Wind STILL requires 5 moisture and 20-ft wind speed input',
    worksheet.core.inputs.length, 'equals', 6 )

  // Adding power of the fire or power ratio requires canopy hpua
  selects( [ worksheet.nodes.crown.fire.hpuaActive ])
  affirm( f, '3.01: Selecting active crown fire HPUA STILL activates same surface fire 3 configs',
    worksheet.core.activeCfg.length, 'equals', 3 )
  affirm( f, '3.02: Selecting active crown fire HPUA requires canopy bulk density, base, and height',
    worksheet.core.inputs.length, 'equals', 6+3 )
  affirm( f, '3.03: Selecting active crown fire HPUA requires canopy height input',
    worksheet.core.inputs, 'contains', worksheet.nodes.cpy.ht )
  affirm( f, '3.04: Selecting active crown fire HPUA requires canopy base height input',
    worksheet.core.inputs, 'contains', worksheet.nodes.cpy.bh )
  affirm( f, '3.05: Selecting active crown fire HPUA requires canopy bulk density input',
    worksheet.core.inputs, 'contains', worksheet.nodes.cpy.bd )

  // Adding these active crown fire variants requires nothing new:
  selects( [
    worksheet.nodes.crown.fire.powerFire,
    worksheet.nodes.crown.fire.powerRatio,
    worksheet.nodes.crown.fire.fliActive,
    worksheet.nodes.crown.fire.flActive,
    worksheet.nodes.crown.fire.windDriven,
    worksheet.nodes.crown.fire.plumeDominated,
   ])
  affirm( f, '4.01: Selecting more active crown fire variants STILL activates same surface fire 3 configs',
    worksheet.core.activeCfg.length, 'equals', 3 )
  affirm( f, '4.02: Selecting more active crown fire variant STILL requires same 9 inputs',
    worksheet.core.inputs.length, 'equals', 9 )

  // Adding I'initiation just requires canopy moisture (and canopy base ht, already an input)
  selects( [ worksheet.nodes.crown.surf.fliInit ])
  affirm( f, '5.01: Selecting I`initiaion STILL activates same surface fire 3 configs',
    worksheet.core.activeCfg.length, 'equals', 3 )
  affirm( f, '5.02: Selecting I`initiation requires canopy moisture content input',
    worksheet.core.inputs.length, 'equals', 10 )
  affirm( f, '5.03: Selecting I`initiation requires canopy moisture content input',
    worksheet.core.inputs, 'contains', worksheet.nodes.cpy.mc )

  // Adding flInit requires nothing new:
  selects( [ worksheet.nodes.crown.surf.flInit ] )
  affirm( f, '6.01: Selecting F`initiaion STILL activates same surface fire 3 configs',
    worksheet.core.activeCfg.length, 'equals', 3 )
  affirm( f, '6.02: Selecting F`Initiation STILL requires same 10 inputs'+
    ' (5 moistures, wnd.at20ft, cpy.bh, cpy.ht, cpy.bd, cpy.mc)',
    worksheet.core.inputs.length, 'equals', 10 )

  // Adding transition ratio requires surface fireline intensity
  selects( [ worksheet.nodes.crown.surf.transRatio,
    worksheet.nodes.crown.surf.canTrans, ])
  affirm( f, '7.01: Selecting transition variants activates fire.fli and crown.link config',
    worksheet.core.activeCfg.length, 'equals', 5 )
  affirm( f, '7.02: Cfg crown.link should NOW be active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.crown.link )
  affirm( f, '7.03: Cfg fire.fli should NOW be active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.fli )
  affirm( f, '7.04: Selecting transition variants requires 1 more input',
    worksheet.core.inputs.length, 'equals', 10+1 )
  affirm( f, '7.05: Selecting transition variants required surface FLI or FL as input',
    worksheet.core.inputs, 'contains', worksheet.nodes.fire.fl )

  // Scott & Reinhardt Crown Fire

  selects( [ worksheet.nodes.crown.surf.rInit ] )
  affirm( f, '9.01: Selecting r`Init requires same 5 configs',
    worksheet.core.activeCfg.length, 'equals', 5 )
  affirm( f, '9.02: Selecting r`Init requires 1 more input',
    worksheet.core.inputs.length, 'equals', 11+1 )
  affirm( f, '9.03: Selecting r`Init requires surface fire HPUA',
    worksheet.core.inputs, 'contains', worksheet.nodes.crown.surf.hpua )

  // Adding following variants require no new configs or inputs:
  selects( [
    worksheet.nodes.crown.fire.rPrimeActive,
    worksheet.nodes.crown.fire.activeRatio,
    worksheet.nodes.crown.fire.type,
    worksheet.nodes.crown.fire.isActive,
    worksheet.nodes.crown.fire.isConditional,
    worksheet.nodes.crown.fire.isCrown,
    worksheet.nodes.crown.fire.isPassive,
    worksheet.nodes.crown.fire.isSurface,
    worksheet.nodes.crown.fire.cidx,
    worksheet.nodes.crown.fire.oActive,
  ])
  affirm( f, '10.01: Selecting more S&R STILL requires same 5 configs',
    worksheet.core.activeCfg.length, 'equals', 5 )
  affirm( f, '10.02: Selecting more S&R STILL requires same 12 inputs'+
    ' (5 moistures, wnd.at20ft, cpy.bh, cpy.ht, cpy.bd, cpy.mc, crown.surf.hpua, fire.fl)',
    worksheet.core.inputs.length, 'equals', 12 )

  // This is where STANDALONE S&R CROWN fire model blows up wrt unrealistic user inputs
  // May consider forcing linkage to surface fire
  selects( [ worksheet.nodes.crown.surf.rSa ] )
  affirm( f, '11.01: Selecting rSa STILL requires same 5 configs',
    worksheet.core.activeCfg.length, 'equals', 5 )
  affirm( f, '11.02: Selecting rSa NOW requires 17 inputs'+
    ' (5 moistures, wnd.at20ft, cpy.bh, cpy.ht, cpy.bd, cpy.mc, crown.surf.hpua, '+
    ' fire.fl, ros0, mwaf, windB, windK, phiS )',
    worksheet.core.inputs.length, 'equals', 17 )
  affirm( f, '11.03: Selecting rSa requires surface fire ros0',
    worksheet.core.inputs, 'contains', worksheet.nodes.crown.surf.ros0 )
  affirm( f, '11.04: Selecting rSa requires surface fire mwaf',
    worksheet.core.inputs, 'contains', worksheet.nodes.crown.surf.mwaf )
  affirm( f, '11.05: Selecting rSa requires surface fire wind factor B',
    worksheet.core.inputs, 'contains', worksheet.nodes.crown.surf.wndb )
  affirm( f, '11.06: Selecting rSa requires surface fire wind factor K',
    worksheet.core.inputs, 'contains', worksheet.nodes.crown.surf.wndk )
  affirm( f, '11.07: Selecting rSa requires surface fire phi slope',
    worksheet.core.inputs, 'contains', worksheet.nodes.crown.surf.phis )

  // CFB adds even more: requires surface fire ros input
  selects( [ worksheet.nodes.crown.fire.cfb ] )
  affirm( f, '12.01: Selecting CFB STILL requires same 5 configs',
    worksheet.core.activeCfg.length, 'equals', 5 )
  affirm( f, '12.02: Selecting CFB NOW requires 18 inputs'+
    ' (5 moistures, wnd.at20ft, cpy.bh, cpy.ht, cpy.bd, cpy.mc, crown.surf.hpua, '+
    ' fire.fl, ros0, mwaf, windB, windK, phiS, surf.ros )',
    worksheet.core.inputs.length, 'equals', 18 )
  affirm( f, '12.03: Selecting CFB requires surface spread rate',
    worksheet.core.inputs, 'contains', worksheet.nodes.crown.surf.ros )

  // No more configs or inputs needed for remainder of crown fire variants
  selects( [
    worksheet.nodes.crown.fire.rFinal,
    worksheet.nodes.crown.fire.fliFinal,
    worksheet.nodes.crown.fire.flFinal,
     ] )
  affirm( f, '13.01: Selecting remaining crown fire variants STILL requires same 5 configs',
    worksheet.core.activeCfg.length, 'equals', 5 )
  affirm( f, '13.02: Selecting remaining crown fire variants STILL requires 18 inputs'+
    ' (5 moistures, wnd.at20ft, cpy.bh, cpy.ht, cpy.bd, cpy.mc, crown.surf.hpua, '+
    ' fire.fl, ros0, mwaf, windB, windK, phiS, surf.ros )',
    worksheet.core.inputs.length, 'equals', 18 )

  // The following require elapsed time since ignition
  selects( [
    worksheet.nodes.crown.fire.dist,
    worksheet.nodes.crown.fire.width,
    worksheet.nodes.crown.fire.perim,
    worksheet.nodes.crown.fire.area,
    worksheet.nodes.crown.fire.distFinal,
    worksheet.nodes.crown.fire.widthFinal,
    worksheet.nodes.crown.fire.perimFinal,
    worksheet.nodes.crown.fire.areaFinal,
     ] )
  affirm( f, '14.01: Selecting crown fire distance variants STILL requires same 5 configs',
    worksheet.core.activeCfg.length, 'equals', 5 )
  affirm( f, '14.02: Selecting crown fire distance variants ADDS 1 input, elapsed time'+
    ' (5 moistures, wnd.at20ft, cpy.bh, cpy.ht, cpy.bd, cpy.mc, crown.surf.hpua, '+
    ' fire.fl, ros0, mwaf, windB, windK, phiS, surf.ros, fire.time.etig )',
    worksheet.core.inputs.length, 'equals', 19 )
  affirm( f, '14.03: Selecting crown fire distance variants requires elapsed time input',
    worksheet.core.inputs, 'contains', worksheet.nodes.fire.time.etig )

  // The following require map scale input
  selects( [
    worksheet.nodes.crown.fire.mdistFinal,
    worksheet.nodes.crown.fire.mwidthFinal,
    worksheet.nodes.crown.fire.mperimFinal,
    worksheet.nodes.crown.fire.mareaFinal,
     ] )
  affirm( f, '15.01: Selecting crown fire map distance variants STILL requires same 5 configs',
    worksheet.core.activeCfg.length, 'equals', 5 )
  affirm( f, '15.02: Selecting crown fire MAP distance variants ADDS 1 inputs'+
    ' (5 moistures, wnd.at20ft, cpy.bh, cpy.ht, cpy.bd, cpy.mc, crown.surf.hpua, '+
    ' fire.fl, ros0, mwaf, windB, windK, phiS, surf.ros, fire.time.etig, map.scl )',
    worksheet.core.inputs.length, 'equals', 19+1 )
  affirm( f, '15.03: Selecting crown fire MAP distance variants STILL requires elapsed time',
    worksheet.core.inputs, 'contains', worksheet.nodes.fire.time.etig )
  affirm( f, '15.03: Selecting crown fire MAP distance variants requires map scale input',
    worksheet.core.inputs, 'contains', worksheet.nodes.map.scl )

  // Linking to SURFACE requires fewer variants that are easier to understand
  setConfigs( [ [ worksheet.nodes.cfg.crown.link, 'surface' ],
    [ worksheet.nodes.cfg.fuel.fuel1, 'catalog' ],
    [ worksheet.nodes.cfg.fuel.fuel2, 'none' ],
    [ worksheet.nodes.cfg.wind.speed, 'at20ft' ] ] )
  affirm( f, '16.01: Linking to SURFACE changes number of configs from 5 t0 10',
    worksheet.core.activeCfg.length, 'equals', 10 )
  affirm( f, '16.02: Cfg mois.input is now active because fuel moisture is required by crown fuel FM10',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.mois.input )
  affirm( f, '16.03: Cfg wind.spd is now active because wind speed is required by crown fuel FM10',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.wind.speed )
  affirm( f, '16.04: Cfg fire.ewsl is now active because its required by crown fuel FM10',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fire.ewsl )
  affirm( f, '16.05: Cfg crown.link is STILL active',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.crown.link )
  affirm( f, '16.06: Cfg fire.fli is NO LONGER required',
    worksheet.core.activeCfg, 'omits', worksheet.nodes.cfg.fire.fli )
  affirm( f, '16.07: SURFACE requires slope.steepness config',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.slope.steepness )
  affirm( f, '16.08: SURFACE requires wind.dir config',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.wind.dir )
  affirm( f, '16.09: SURFACE requires fuel.fuel1 config',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fuel.fuel1 )
  affirm( f, '16.10: SURFACE requires fuel.fuel2 config',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fuel.fuel2 )
  affirm( f, '16.11: SURFACE requires fuel.hcf config',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.fuel.hcf )
  affirm( f, '16.12: SURFACE requires wind.waf config',
    worksheet.core.activeCfg, 'contains', worksheet.nodes.cfg.wind.waf )

  affirm( f, '16.07: Linking to SURFACE changes inputs from 20 to 18'+
    ' (5 moistures, wnd.at20ft, cpy.bh, cpy.ht, cpy.bd, cpy.mc, crown.surf.hpua, '+
    ' fire.fl, ros0, mwaf, windB, windK, phiS, surf.ros, fire.time.etig, map.scl )',
    worksheet.core.inputs.length, 'equals', 17 )
  // 12 inputs remain the same:
  // Same 5 fuel moisture and 1 wind speed input
  affirm( f, '16.08: Linked SURFACE STILL requires wind speed at 20-ft input',
    worksheet.core.inputs, 'contains', worksheet.nodes.wnd.spd.at20ft )
  affirm( f, '16.09: Linked SURFACE STILL requires dead 1-h fuel moisture',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.dead.tl1 )
  affirm( f, '16.10: Linked SURFACE STILL requires dead 10-h fuel moisture',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.dead.tl10 )
  affirm( f, '16.11: Linked SURFACE STILL requires dead 100-h fuel moisture',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.dead.tl100 )
  affirm( f, '16.12: Linked SURFACE STILL requires live herb fuel moisture',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.live.herb )
  affirm( f, '16.13: Linked SURFACE STILL requires live stem fuel moisture',
    worksheet.core.inputs, 'contains', worksheet.nodes.mois.live.stem )
  // Same 4 canopy inputs
  affirm( f, '16.14: Linked SURFACE STILL requires canopy height input',
    worksheet.core.inputs, 'contains', worksheet.nodes.cpy.ht )
  affirm( f, '16.15: Linked SURFACE STILL requires canopy base height input',
    worksheet.core.inputs, 'contains', worksheet.nodes.cpy.bh )
  affirm( f, '16.16: Linked SURFACE STILL requires canopy bulk density input',
    worksheet.core.inputs, 'contains', worksheet.nodes.cpy.bd )
  affirm( f, '16.17: Linked SURFACE STILL requires canopy moisture content',
    worksheet.core.inputs, 'contains', worksheet.nodes.cpy.mc )
  // Same 2 time and scale variants
  affirm( f, '16.18: Linked SURFACE STILL requires elapsed time since ignition',
    worksheet.core.inputs, 'contains', worksheet.nodes.fire.time.etig )
  affirm( f, '16.19: Linked SURFACE STILL requires map scale',
    worksheet.core.inputs, 'contains', worksheet.nodes.map.scl )

  // DROPPED 8 esoteric inputs
  affirm( f, '16.20: Linked SURFACE DROPS surface fire ros0 input',
    worksheet.core.inputs, 'omits', worksheet.nodes.crown.surf.ros0 )
  affirm( f, '16.21: Linked SURFACE DROPS surface fire mwaf input',
    worksheet.core.inputs, 'omits', worksheet.nodes.crown.surf.mwaf )
  affirm( f, '16.22: Linked SURFACE DROPS surface fire wind factor B input',
    worksheet.core.inputs, 'omits', worksheet.nodes.crown.surf.wndb )
  affirm( f, '16.23: Linked SURFACE DROPS surface fire wind factor K input',
    worksheet.core.inputs, 'omits', worksheet.nodes.crown.surf.wndk )
  affirm( f, '16.24: Linked SURFACE DROPS surface fire phi slope input',
    worksheet.core.inputs, 'omits', worksheet.nodes.crown.surf.phis )
  affirm( f, '16.25: Linked SURFACE DOPS surface spread rate input',
    worksheet.core.inputs, 'omits', worksheet.nodes.crown.surf.ros )
  affirm( f, '16.26: Linked SURFACE DROPS surface fire HPUA input',
    worksheet.core.inputs, 'omits', worksheet.nodes.crown.surf.hpua )
  affirm( f, '16.27: Linked SURFACE DROPS surface fire HPUA input',
    worksheet.core.inputs, 'omits', worksheet.nodes.fire.fl )

  // ADDED 5 common SURFACE inputs
  affirm( f, '16.28: Linked SURFACE NOW requires primary fuel model key',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.modl.key )
  affirm( f, '16.29: Linked SURFACE NOW requires primary fuel herb cured fraction',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.modl.std.hcf )
  affirm( f, '16.30: Linked SURFACE NOW requires slope steepness ratio',
    worksheet.core.inputs, 'contains', worksheet.nodes.slp.stp.rat )
  affirm( f, '16.31: Linked SURFACE NOW requires wind direction',
    worksheet.core.inputs, 'contains', worksheet.nodes.wnd.dir.hdg.up )
  affirm( f, '16.32: Linked SURFACE NOW requires WAF',
    worksheet.core.inputs, 'contains', worksheet.nodes.surf.fuel.sf1.bed.char.mwaf )

  // Config CONFLICT when crown fire model active AND cfg.wind.speed==='atMidflame'
  var conflict = full.checkConflicts( worksheet )
  affirm( f, '16.33: No conflict when cfg.wind.speed===`at20ft`',
    conflict, 'equals', false )

  setConfigs( [ [ worksheet.nodes.cfg.wind.speed, 'atMidflame' ] ] )

  conflict = full.checkConflicts( worksheet )
  affirm( f, '16.34: Conflict when cfg.wind.speed===`atMidflame` '
    + 'and sf3.bed.char.mwsp has dependents (i.e. is in use and requires wind at 20-ft)',
    conflict, 'equals', true )

  // This is how to fix conflict
  if ( conflict ) {
    setConfigs( [ [ worksheet.nodes.cfg.wind.speed, 'at20ft' ] ] )
  }
  affirm( f, '16.35: Linked SURFACE should not require primary fuel wind speed at midflame '
    + 'when 20-ft wind and primary fuel WAF are already input',
    worksheet.core.inputs, 'omits', worksheet.nodes.surf.fuel.sf1.bed.char.mwsp )
}

function reset() {
  clearSelects( worksheet )
  initConfigs()
}

basicSelection()
configFuel()
configMoisture()
configSlope()
configWindSpeed()
configWindDir()
configSurfaceFire()
configFireFliFl()
configFireEwspElwr()
configFireVectors()
configFireEllipse()
configFireEllipseScorch()
configCrownFire()

console.log( 'PASSED: ' + debug.getPassed() )
console.log( 'FAILED: ' + debug.getFailed() )
debug.usage( startTime )
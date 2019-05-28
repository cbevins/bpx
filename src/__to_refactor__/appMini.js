"use strict"
var startTime = Date.now()

const dag = require('./libDag')
const debug = require('./libDebug')
const mini = require('./nodesMini')

var bp7 = dag.createBp7()
var nodes = mini.createNodes()
var w = dag.addWorksheet( bp7, 'w2', 'Simple Test', nodes )
dag.setConfig( w.nodes.cfg.cfge, 'full' )  // 'full' or 'partial'
dag.select( w.nodes.g )
dag.reconfig( w )
console.log( debug.listEdges( w.nodes ) )
console.log( debug.listSelected( w ) )
console.log( debug.listOrder( w ) )
console.log( debug.listInputs( w ) )
dag.batch( w )
debug.usage( startTime )

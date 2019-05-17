"use strict"

const debug = require('./libDebug')
const node = require('./libNode')
const vt = require('./vt').vt

var self = module.exports = {

  sum: function ( a, b, c ) {
    var s = 0
    if ( a !== undefined ) s += a
    if ( b !== undefined ) s += b
    if ( c !== undefined ) s += c
    return s
  },

  createNodes: function () {
    var nodes = new node.Dag( null, 'nodes', 'Variants' )
      var cfg = new node.Dag( nodes, 'cfg', 'Configuration' )
        var cfge = new node.Cfg( cfg, 'cfge', 'The DAG will be', [
          [ 'full', 'full', true ],
          [ 'partial', 'partial' ]])
      node.Vfixed( nodes, 'k1', vt.int, '', 10 )
      node.Vinput( nodes, 'i1', vt.int, '', [ 1, 2 ] )
      node.Vinput( nodes, 'i2', vt.int, '', [ 2, 3 ] )
      node.Vinput( nodes, 'i3', vt.int, '', [ 4, 5 ] )
      node.Vinput( nodes, 'i4', vt.int, '', [ 6, 7 ] )
      node.Vbound( nodes, 'a', vt.int, 'a', nodes.i1 )
      node.Vapply( nodes, 'b', vt.int, 'b', self.sum, [ nodes.a ] )
      node.Vapply( nodes, 'c', vt.int, 'c', self.sum, [ nodes.b, nodes.i2 ] )
      node.Vapply( nodes, 'd', vt.int, 'd', self.sum, [ nodes.a, nodes.c, nodes.k1 ] )
      node.Vcfg( nodes, 'e', vt.int, 'e', cfge, [
        [ 'partial', node.dagBound, nodes.i3 ],  // if cfge==='partial', then get 'e' value from i3
        [ 'dflt', self.sum, [ nodes.d ]]] )     // if cfge==='full', derive 'e' value from 'd'
      node.Vapply( nodes, 'f', vt.int, '', self.sum, [ nodes.i4, nodes.e ] )
      node.Vapply( nodes, 'g', vt.int, '', self.sum, [ nodes.f ] )
    return nodes
  },
}

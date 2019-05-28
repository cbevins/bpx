"use strict";

const fullId = require('./libNode').fullId
const fullLabel = require('./libNode').fullLabel
const isCfg = require('./libNode').isCfg
const isDag = require('./libNode').isDag
const isOpt = require('./libNode').isOpt
const isVar = require('./libNode').isVar

const select = require('./libDag').select

var self = module.exports = {
  passed: 0,
  failed: 0,
  tests: [],
  timers: [],

  addTest: function ( vref, runIdx, expectedValue, allowance, msg ) {
    select( vref )
    self.tests.push( [ vref, runIdx, expectedValue, allowance,
      (msg===undefined) ? '' : msg ] )
  },

  addTests: function ( tests ) {
    tests.forEach( function ( test ) {
      self.addTest( test[0], test[1], test[2], test[3], test[4] )
    })
  },

  addTime: function ( label ) {
    self.timers.push( [label, Date.now()] )
  },

  affirm: function ( loc, msg, arg1, op, arg2, verbose ) {
    var pass = false
    if ( op === 'equals' || op === '=' ) {
      pass = self.affirmEquals( arg1, arg2 )
    } else if ( op === 'lt' || op === '<' ) {
      pass = self.affirmLT( arg1, arg2 )
    } else if ( op === 'le' || op === '<=' ) {
      pass = self.affirmLE( arg1, arg2 )
    } else if ( op === 'gt' || op === '>') {
      pass = self.affirmGT( arg1, arg2 )
    } else if ( op === 'ge' || op === '>=') {
      pass = self.affirmGE( arg1, arg2 )
    } else if ( op === '!=' || op === '<>' ) {
      pass = ! self.affirmEquals( arg1, arg2 )
    } else if ( op === 'contains' ) {
      pass = self.affirmContains( arg1, arg2 )
    } else if ( op === 'omits' ) {
      pass = self.affirmOmits( arg1, arg2 )
    } else {
      self.freakOut( `${loc}: unknown affirm operator '${op}'` )
    }
    if ( pass ) {
      self.passed++
      if ( verbose === true ) {
        console.log( `PASSED: ${loc}: ${msg}`)
      }
    } else {
      self.failed++
      var reason = ''
      if ( op === 'equals' ) reason = `(Expected '${arg2}' but got '${arg1}')`
      console.log( `FAILED: ${loc}: ${msg} ${reason}`)
    }
  },

  affirmContains: function ( ar, member ) {
    for ( let item in ar ) {
      if ( ar[item] === member ) {
        return true
      }
    }
    return false
  },

  affirmEquals: function ( arg1, arg2 ) {
    return ( arg1 === arg2 )
  },

  affirmGT: function ( arg1, arg2 ) {
    return ( arg1 > arg2 )
  },

  affirmGE: function ( arg1, arg2 ) {
    return ( arg1 >= arg2 )
  },

  affirmLT: function ( arg1, arg2 ) {
    return ( arg1 < arg2 )
  },

  affirmLE: function ( arg1, arg2 ) {
    return ( arg1 <= arg2 )
  },

  affirmOmits: function ( ar, member ) {
    return ! self.affirmContains( ar, member )
  },

  applyTests: function( worksheet, verbose ) {
    verbose = (verbose===undefined) ? false : true
    var results = worksheet.core.results
    var npass = 0
    var nfail = 0
    var vref = null
    var runIdx = 0
    var expected = 0.
    var actual = 0.
    var allow = 0.
    var fid = ''
    var diff = ''
    var err = ''
    var msg = ''
    var ok = false
    for ( let vidx in self.tests ) {
      [vref, runIdx, expected, allow, msg] = self.tests[vidx]
      actual = results[runIdx][vref.own.sidx]
      if( typeof( expected ) === "boolean" ) {
        ok = ( expected===true && actual===true )
          || ( expected===false && actual===false )
      } else if ( typeof( expected ) === "string" ) {
        ok = ( expected === actual )
      } else {
        diff = Math.abs( expected - actual )
        err = ( expected === 0.0 ) ? diff : ( diff / expected )
        ok = ( err < allow )
      }
      if ( ok ) {
        npass++
        fid = fullId( vref )
        if ( verbose ) {
          console.log( `Test: ${fid} [${runIdx}]: PASSED ${msg}` )
        }
      } else {
        nfail++
        fid = fullId( vref )
        console.log( `Test: ${fid} [${runIdx}]: *** FAILED expected='${expected}' actual='${actual}' diff='${diff}', err='${err}' ${msg}\n` )
      }
    }
    console.log( `TEST RESULTS: ${npass} Passed, ${nfail} Failed`)
  },

  freakOut: function ( msg ) {
    console.log('***')
    console.log('*** ' + msg )
    console.log('***')
    exit()
  },

  getPassed: function () {
    return self.passed
  },

  getFailed: function () {
    return self.failed
  },

  listActiveConfigs: function ( worksheet ) {
    var n = 0
    var str = ''
    for( let idx in worksheet.core.configs ) {
      var cfg = worksheet.core.configs[idx]
      if ( cfg.own.deps ) {
        n++
        let fid = fullId( cfg )
        str += `    ${idx}: ${fid} = '${cfg.own.cv}'\n`
      }
    }
    return `\nCurrently Active Configs (${n}):\n` + str
  },

  listEdges: function ( node, depth ) {
    depth = ( depth === undefined ) ? 0 : depth
    var myStr = ''
    if ( isVar( node ) ) {
      myStr = "\n" + fullId( node ) + ` = '${node.own.cv}'` +
        `\n    {cost: ${node.own.cost}, tord: ${node.own.tord}, deps: ${node.own.deps}, sel: ${node.own.selected}}\n    `
      if ( node.own.copt.ty === 'derived' ) {
        myStr += `DERIVED from ${node.own.copt.fn.name}():`
      } else if ( node.own.copt.ty === 'bound' ) {
        myStr += `BOUND to:`
      } else if ( node.own.copt.ty === 'input' ) {
        myStr += `INPUT`
      } else if ( node.own.copt.ty === 'fixed' ) {
        myStr += `FIXED to ${node.own.cv}`
      }
      myStr += "\n    " + node.own.prod.length + ' producers:'
      for( let idx in node.own.prod ) {
        myStr += "\n        " + fullId( node.own.prod[idx] )
      }
      myStr += "\n    " + node.own.user.length + ' consumers:'
      for ( let idx in node.own.user ) {
        myStr += "\n        " + fullId( node.own.user[idx] )
      }
    }
    var str = ''
    for ( let propName in node ) {
      if ( propName !== 'own' ) {
        str += self.listEdges( node[propName], depth+1 )
      }
    }
    return `${myStr}\n` + str
  },

  listInputs: function ( worksheet ) {
    var n = worksheet.core.inputs.length
    var str = `\nCurrently Active Inputs (${n}):\n`
    for( let idx in worksheet.core.inputs ) {
      let inp = worksheet.core.inputs[idx]
      let fid = fullId( inp )
      //console.log(fid)
      var stars = (inp.own.in.va.length < 1 ) ? `***\n` : ''
      str += `${stars}    ${idx}: ${fid} = {va: [` + inp.own.in.va.join(', ') + `], idx: ${inp.own.in.idx}}\n${stars}`
    }
    return str
  },

  listOrder: function ( worksheet ) {
    var nVariants = worksheet.core.variants.length
    var str = `\nCurrent Topological Processing Order for ${nVariants} Variants:\n`
    for ( let varIdx in worksheet.core.variants ) {
      let node = worksheet.core.variants[varIdx]
      if ( node.own.deps > 0 ) {
        let id = fullId( node )
        str += `\n\n${varIdx}: ${id} = '${node.own.cv}'` +
          `\n    {cost: ${node.own.cost}, tord: ${node.own.tord}, deps: ${node.own.deps}, sel: ${node.own.selected}}\n`
        let cfg = node.own.cfg
        if ( cfg !== null ) {
          let cid = fullId( cfg )
          str += `    CONFIGURED by '${cid}'==='${cfg.own.cv}' to use route '${node.own.coptId}'\n`
        }
        for( let optIdx in node.own.opt ) {
          str += `    ${optIdx}: `
          var optRef = node.own.opt[optIdx]
          if ( optRef.ty === 'derived' ) {
            str += `DERIVED from ${optRef.fn.name}():\n`
            for( let argIdx in optRef.ar ) {
              let argId = fullId( optRef.ar[argIdx] )
              str += `        ${argId}\n`
            }
          } else if ( optRef.ty === 'bound' ) {
              let boundId = fullId( optRef.to )
              str += `BOUND to: ${boundId}\n`
          } else if ( optRef.ty === 'input' ) {
            str += `INPUT\n`
          } else if ( optRef.ty === 'fixed' ) {
            str += `FIXED to ${node.own.cv}\n`
          }
        }
      }
    }
    return str
  },

  listResults: function ( worksheet ) {
    var stored = worksheet.core.stored
    var results = worksheet.core.results
    var str = ''
    var ref = null
    var fid = ''
    for ( let rid in results ) {
      var result = results[rid]
      str += `Run ${rid}:\n`
      for ( let vid in stored ) {
        ref = stored[vid]
        fid = fullId( ref )
        str += `    ${fid}: '${ref.own.cv}'\n`
      }
    }
    return str
  },

  listSelected: function ( worksheet ) {
    var n = worksheet.core.selected.length
    var str = `\nCurrently Selected Variants (${n}):\n`
    for( let idx in worksheet.core.selected ) {
      let fid = fullId( worksheet.core.selected[idx] )
      str += `    ${fid}\n`
    }
    return str
  },

  resetAFfirms: function () {
    self.passed = 0
    self.failed = 0
  },

  showTimes: function () {
    var str = ''
    if ( self.timers.length < 1 ) {
      return str
    }
    var wid1 = 0
    var wid2 = 6
    for ( let idx in self.timers ) {
      wid1 = Math.max( self.timers[idx][0].length, wid1 )
    }
    var t0 = self.timers[0][1]
    var t1 = t0
    var t2 = 0
    var et = 0
    var lb = ''
    for ( let idx in self.timers ) {
      lb = self.timers[idx][0].padEnd(wid1, ' ')
      t2 = self.timers[idx][1]
      et = (t2 - t1).toFixed(0).padStart(wid2, ' ')
      str += `    ${lb} : ${et}\n`
      t1 = t2
    }
    lb = 'Total Elapsed'.padEnd(wid1, ' ')
    et = (t2 - t0).toFixed(0).padStart(wid2, ' ')
    str += `    ${lb} : ${et}\n`
    return str
  },

  usage: function ( startTime ) {
    const used = process.memoryUsage()
    console.log('----------------')
    console.log( 'TimeStamp '+Date.now() )
    for (let key in used) {
      console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
    }
    var s = ( Date.now() - startTime ) / 1000.
    console.log( `Elapsed ${s} s` )
    console.log( self.showTimes() )
    console.log('----------------')
  },
}

"use strict";

var self = module.exports = {

  freakOut: function ( msg ) {
    console.log('***')
    console.log('*** ' + msg )
    console.log('***')
    exit()
  },

  fullId: function ( node ) {
    var str = ''
    if ( node.own.up !== null ) {
      str = self.fullId( node.own.up )
    }
    return str + '.' + node.own.id
  },

  fullLabel: function ( node ) {
    var str = ''
    if ( node.own.up !== null ) {
      str = self.fullLabel( node.own.up )
    }
    return str + '/' + node.own.lb
  },

  isBound: function ( node ) {
    return node.own.copt.ty === 'bound'
  },

  isCfg: function ( node ) {
    return node.own.ty === 'cfg'
  },

  isDag: function ( node ) {
    return node.own.ty === 'dag'
  },

  isFixed: function ( node ) {
    return node.own.copt.ty === 'fixed'
  },

  isInput: function ( node ) {
    return node.own.copt.ty === 'input' && node.own.deps
  },

  isOpt: function ( node ) {
    return node.own.ty === 'opt'
  },

  isVar: function ( node ) {
    return node.own.ty === 'var'
  },

  //------------------------------------------------------------------------------
  // Object constructors
  //------------------------------------------------------------------------------

  // Creates and returns a new BehavePlus7 object
  createBp7: function () {
    var bp = new self.Dag( null, 'bp', 'BehavePlus7' )
      var fuelCat = new self.Dag( bp, 'fuels', 'Fuel Catalog' )
      var moisCat = new self.Dag( bp, 'moistures', 'Moisture Catalog' )
      var funcLib = new self.Dag( bp, 'functions', 'Function Library' )
      var vtype = new self.Dag( bp, 'vtypes', 'Variant Types' )
      var worksheets = new self.Dag( bp, 'worksheets', 'Worksheets' )
    return bp
  },

  // Adds a worksheet to a Bp7
  addWorksheet: function ( bp7, id, label, nodes ) {
    var w = new self.Dag( bp7.worksheets, id, label )
    w['nodes'] = nodes
    nodes.own.up = w
    var core = new self.Dag( w, 'core', 'Internals' )
    core.variants = []  // References to ALL Variants
    self.addWorksheetCoreVariantsArray( nodes, core.variants )
    core.configs = []   // References to ALL Configs
    self.addWorksheetCoreConfigsArray( nodes, core.configs )
    core.inputs = []    // References to all active INPUTS (i.e., inputs with dependents)
    core.results = []   // Array with 1 element per run (which is itself an array of selected results)
    core.selected = []  // References to all SELECTED Variants
    core.stack = []     // References to all processed (INPUT, SELECTED, or dependent) Variants
    core.stored = []    // References to all stored (INPUT or SELECTED) Variants
    core.runlimit = 10000
    return w
  },

  // Adds an array of ALL Cfg to the worksheet
  addWorksheetCoreConfigsArray: function ( node, nodeArray ) {
    if ( self.isCfg( node ) ) {
      nodeArray.push( node )
    }
    for ( let propName in node ) {
      if ( propName !== 'own' ) {
        self.addWorksheetCoreConfigsArray( node[propName], nodeArray )
      }
    }
  },

  // Adds an array of ALL variants to the worksheet
  // that will be sorted in topological order
  addWorksheetCoreVariantsArray: function ( node, nodeArray ) {
    if ( self.isVar( node ) ) {
      nodeArray.push( node )
    }
    for ( let propName in node ) {
      if ( propName !== 'own' ) {
        self.addWorksheetCoreVariantsArray( node[propName], nodeArray )
      }
    }
  },

  // A Dag may contain Variants, Configs, and other Dags
  // A DAG behaves like a folder or directory, i.e., as a container for other DAGs
  // and Variants.  DAGs are also useful for creating a name hierarchy.
  Dag: function ( parent, id, label ) {
    if ( parent !== null ) parent[id] = this
    this.own = new self.Own( 'dag', parent, id, label )
  },

  /**
   * A specialized Node that sets configuration options for other Variant Nodes
   *
   * The Cfg Node has an Own object named 'own' with the following properties:
   * - tp: string Constant 'cfg'
   * - up: nodeRef Reference to the parent Node
   * - id: string Node id segment
   * - lb: string Node label segment
   * - cv: string Name of the current option property
   *
   * All other Cfg Node properties are also Own objects, 1 per config option, with the following properties:
   *  - tp: string Constant 'opt'
   *  - up: nodeRef Reference to *this*
   *  - id: string Option property name and id segment
   *  - lb: string Option label segment
   */
  Cfg: function ( parentRef, idStr, labelStr, optionsArr ) {
    parentRef[idStr] = this
    this['own'] = new self.Own( 'cfg', parentRef, idStr, labelStr )
    var options = optionsArr.length
    var hasCurrent = false
    for( let idx=0; idx<options; idx++ ) {
      var optItem = optionsArr[idx]
      var optIdStr = optItem[0]
      var optLbStr = optItem[1]
      this[optIdStr] = new self.Opt( this, optIdStr, optLbStr )
      if ( optItem.length > 2 && optItem[2] === true ) {
        this.own.cv = optIdStr
        hasCurrent = true
      }
    }
    if ( ! hasCurrent ) {
      var id = fullId( idStr )
      freakOut( `Cfg Node '${id}' has no current value`)
    }
    this.own.deps = 0
  },

  // An Opt must have a Cfg parent
  Opt: function ( parentRef, idStr, labelStr ) {
    this.own = new self.Own( 'opt', parentRef, idStr, labelStr )
  },

  Own: function ( typeStr, parentRef, idStr, labelStr ) {
    this.ty = typeStr
    this.up = parentRef
    this.id = idStr
    this.lb = labelStr
  },

  // A Variant contains its type, current state, and topological order info
  Var: function ( parentRef, idStr, vtypeRef, labelStr ) {
    labelStr = ( arguments.length > 3 ) ? labelStr : ''
    parentRef[idStr] = this
    this.own = new self.Own( 'var', parentRef, idStr, labelStr )
    this.own.vt = vtypeRef
    this.own.cv = vtypeRef.dv
    this.own.deps = 0   // Number of dependent, selected Variants
    this.own.prod = []  // Producer Variant references unde the current configuration
    this.own.user = []  // Consumer Variant references unde the current configuration
  },

  // Dummy method placeholder references for bound, fixed, and input Variant types
  dagBound: function (){},
  dagFixed: function(){},
  dagInput: function(){},

  //------------------------------------------------------------------------------
  // Variant factory functions
  //------------------------------------------------------------------------------

  /**
   * Creates a non-configuraable Variant with exactly 1 provider function
   */
  Vapply: function( parentRef, idStr, vtypeRef, labelStr, fnRef, argRefsArr, optionalValue ) {
    var v = self.Vnew( parentRef, idStr, vtypeRef, labelStr, null,
        [['dflt', fnRef, argRefsArr]] )
    v.own.cv = ( arguments.length > 6 ) ? optionalValue : vtypeRef.dv
    return v
  },

  // Variant is non-configurable and binds to exactly one other Variant (or is unused)
  Vbound: function( parentRef, idStr, vtypeRef, labelStr, bindToRef ) {
    var v = self.Vnew( parentRef, idStr, vtypeRef, labelStr, null,
      [['dflt', self.dagBound, bindToRef]] )
    v.own.cv = bindToRef.own.cv
    return v
  },

  Vcfg: function( parentRef, idStr, vtypeRef, labelStr, cfgRef, optionsArr, optionalValue ) {
    var v = self.Vnew( parentRef, idStr, vtypeRef, labelStr, cfgRef, optionsArr )
    v.own.cv = ( arguments.length > 6 ) ? optionalValue : vtypeRef.dv
    return v
  },

  // Variant is non-configurable and has a fixed constant value (or is unused)
  Vfixed: function( parentRef, idStr, vtypeRef, labelStr, optionalValue ) {
    optionalValue = ( arguments.length > 4 ) ? optionalValue : vtypeRef.dv
    var v = self.Vnew( parentRef, idStr, vtypeRef, labelStr, null,
      [['dflt', self.dagFixed, optionalValue]] )
    v.own.cv = optionalValue
    return v
  },

  // Variant is non-configurable and is always input (or is unused)
  Vinput: function( parentRef, idStr, vtypeRef, labelStr, optionalValuesArray ) {
    var v = self.Vnew( parentRef, idStr, vtypeRef, labelStr, null,
      [['dflt', self.dagInput]] )
    var iv = ( arguments.length > 4 ) ? optionalValuesArray : [ vtypeRef.dv ]
    v.own.in = { va: iv, idx: 0 }
    v.own.cv = v.own.in.va[0]
    return v
  },

  /**
   * Centralized Variant factory used by Vapply(), Vbound(), Vcfg(), Vfixed(), Vinput()
   *
   * Creates and returns a Var whose active producer function
   * is determined by a Cfg Opt.
   * @param {*} parent Reference to the Parent Dag
   * @param {*} id  Id segment
   * @param {*} vtype Reference to the Variant Type
   * @param {*} label Label segment
   * @param {*} cfg  Reference to a Cfg object
   * @param {*} options An array config option-action-[args] items
   *  where each item is an array as follows:
   *  - <optId>, <someFuncRef>, [array of vars]
   *  - <optId>, dagBound(), <bindNodeRef>
   *  - <optId>, dagFixed(), <constantValue>
   *  - <optId>, dagInput()
   */
  Vnew: function( parentRef, idStr, vtypeRef, labelStr, cfgRef, optionsArr ) {
    var v = self.Vnew0( parentRef, idStr, vtypeRef, labelStr, cfgRef )
    return self.Vnew1( v, optionsArr )
  },

  VnewDEPRECATED: function( parentRef, idStr, vtypeRef, labelStr, cfgRef, optionsArr ) {
    var v = new self.Var( parentRef, idStr, vtypeRef, labelStr )
    v.own.cfg = cfgRef // if null, then Variant is non-configurable
    v.own.opt = {}
    v.own.coptId = 'dflt'
    //v.own.coptRef = v.own.opt['dflt']
    var fid = self.fullId( v )
    var options = optionsArr.length
    for ( let idx=0; idx<options; idx++ ) {
      var option = optionsArr[idx]
      var optIdStr = option[0]
      var optFnRef = option[1]
      var optArgs = option[2]

      if ( typeof optFnRef !== 'function' ) {
        console.log( `Variant ${fid} function ${optFnRef} is not a function`)
        exit()
      }

      // If configurable, reset the current local config option
      if ( cfgRef !== null && cfgRef.own.cv === optIdStr ) {
        v.own.coptId = optIdStr
      }
      if ( optFnRef === self.dagBound ) {
        if ( typeof optArgs !== 'object' ) {
          console.log( `Variant '${fid}' dagBound() target '${optArgs}' is not a Variant reference`)
          exit()
        }
        v.own.opt[optIdStr] = { ty: 'bound', to: optArgs }
      } else if ( optFnRef === self.dagFixed ) {
        v.own.opt[optIdStr] = { ty: 'fixed', cv: optArgs }
      } else if ( optFnRef === self.dagInput ) {
        v.own.opt[optIdStr] = { ty: 'input' }
        v.own.in = { va: [], idx: 0 }
      } else {  // apply
        if ( ! Array.isArray( optArgs ) ) {
          console.log( `Variant ${fid} function args is not an array`)
          exit()
        }
        v.own.opt[optIdStr] = { ty: 'derived', fn: optFnRef, ar: optArgs }
      }
    }
    v.own.copt = v.own.opt[ v.own.coptId ]
    v.own.prod = []
    v.own.user = []
    v.own.cost = 0
    v.own.tord = 0
    v.own.deps = 0  // Number of dependent Variants
    v.own.selected = false // TRUE if selected for output
    return v
  },

  Vnew0: function( parentRef, idStr, vtypeRef, labelStr, cfgRef ) {
    var v = new self.Var( parentRef, idStr, vtypeRef, labelStr )
    v.own.cfg = cfgRef // if null, then Variant is non-configurable
    v.own.opt = {}
    v.own.coptId = 'dflt'
    v.own.prod = []
    v.own.user = []
    v.own.cost = 0
    v.own.tord = 0
    v.own.deps = 0  // Number of dependent Variants
    v.own.selected = false // TRUE if selected for output
    return v
  },
  Vnew1: function( v, optionsArr ) {
    var fid = self.fullId( v )
    var options = optionsArr.length
    for ( let idx=0; idx<options; idx++ ) {
      var option = optionsArr[idx]
      var optIdStr = option[0]
      var optFnRef = option[1]
      var optArgs = option[2]

      if ( typeof optFnRef !== 'function' ) {
        console.log( `Variant ${fid} function ${optFnRef} is not a function`)
        exit()
      }

      // If configurable, reset the current local config option
      var cfgRef = v.own.cfg
      if ( cfgRef !== null && cfgRef.own.cv === optIdStr ) {
        v.own.coptId = optIdStr
      }
      if ( optFnRef === self.dagBound ) {
        if ( typeof optArgs !== 'object' ) {
          console.log( `Variant '${fid}' dagBound() target '${optArgs}' is not a Variant reference`)
          exit()
        }
        v.own.opt[optIdStr] = { ty: 'bound', to: optArgs }
      } else if ( optFnRef === self.dagFixed ) {
        v.own.opt[optIdStr] = { ty: 'fixed', cv: optArgs }
      } else if ( optFnRef === self.dagInput ) {
        v.own.opt[optIdStr] = { ty: 'input' }
        v.own.in = { va: [], idx: 0 }
      } else {  // apply
        if ( ! Array.isArray( optArgs ) ) {
          console.log( `Variant ${fid} function args is not an array`)
          exit()
        }
        v.own.opt[optIdStr] = { ty: 'derived', fn: optFnRef, ar: optArgs }
      }
    }
    v.own.copt = v.own.opt[ v.own.coptId ]
    return v
  },

  //------------------------------------------------------------------------------
  // DAG processing functions
  //------------------------------------------------------------------------------

  batch: function ( worksheet ) {
    worksheet.core.stack = []
    worksheet.core.stored = []
    worksheet.core.results = []
    // Create the processing stack of input, selected, and dependent Variants
    var vref = null
    var core = worksheet.core
    for ( let idx in core.variants ) {
      vref = core.variants[idx]
      if ( vref.own.deps ) {
        core.stack.push( vref )
        if ( vref.own.copt.ty === 'input' || vref.own.selected ) {
          vref.own.sidx = core.stored.length
          core.stored.push(vref)
        }
      }
    }

    // \TODO Use local iterators for required input
    // instead of making them properties of the Variant itself
    // (That way, can even have multiple iterators simultaenously)

    // Yoyo the stack
    var vidx = 0
    var last = worksheet.core.stack.length
    var delta = 1
    var args = []
    //var fid = null
    var step = 0
    var nBound = 0
    var nDerived = 0
    var nResults = 0
    // var p = '' // \TODO Remove after debugging
    var type = null
    console.log( `BATCH processing ${last} of ${worksheet.core.variants.length} Variants` )
    while ( vidx >= 0 ) {
      step++
      // p = `    ${step}: `
      vref = worksheet.core.stack[vidx]
      // If this Variant has any dependents
      if ( vref.own.deps ) {
        type = vref.own.copt.ty
        // fid = self.fullId( vref )  // \TODO Remove this after debugging
        // If progressing down the stack in topological order (towards vidx===last)
        if ( delta > 0 ) {
          // If INPUT, reset the Variant's current value to the first input value
          if ( type === 'input' ) {
            vref.own.cv = vref.own.in.va[0]
            vref.own.in.idx = 0
            //console.log( p+`DOWN to INPUT ${fid} (vid=${vidx}): idx=0, cv='${vref.own.cv}'`)
          }
          // If FIXED, nothing to do as the value is already set
          else if ( type === 'fixed' ) {
            //console.log( p+`DOWN to FIXED ${fid} (vid=${vidx}) cv='${vref.own.cv}'`)
          }
          // If BOUND, update the Variant's current value to the bound Variant's current value
          else if ( type === 'bound') {
            //console.log( p+`DOWN to BOUND ${fid} (vid=${vidx}) cv='${vref.own.cv}'`)
            nBound++
            vref.own.cv = vref.own.prod[0].own.cv
          }
          // Otherwise, update the Variant's current value by calling a function
          else {
            args = []
            for( let aidx in vref.own.copt.ar ) {
              args.push( vref.own.copt.ar[aidx].own.cv )
            }
            nDerived++
            vref.own.cv = vref.own.copt.fn.apply( this, args )
            //console.log( p+`DOWN to DERIVED ${fid} (vid=${vidx}) cv='${vref.own.cv}', args=[` + args.join(', ')+']')
          }
        }
        // Else if progressing up the stack in toplogical order (towards vidx===0)
        else if ( delta < 0 ) {
          if ( type === 'input' ) {
            // this is an input Variant; does it have more values to process?
            vref.own.in.idx++
            if ( vref.own.in.idx < vref.own.in.va.length ) {
              // there are more input values to process
              vref.own.cv = vref.own.in.va[vref.own.in.idx]
              // so go back down the stack
              delta = 1
              //console.log( p+`UP to ${fid} (vid=${vidx}): iterating DOWN for idx=${vref.own.in.idx} cv='${vref.own.cv}'`)
            } else {
              //console.log( p+`UP to ${fid} (vid=${vidx}): DONE iterating`)
            }
          } else {
            //console.log( p+`UP to ${fid} (vid=${vidx})`)
          }
          // All other Variant types keep going up the stack
        } // delta < 0
      } // if vref.deps
      vidx += delta
      if ( vidx === last ) {
        // Store selected values and go back up the stack
        var result = []
        for ( let idx in worksheet.core.stored ) {
          result.push( worksheet.core.stored[idx].own.cv )
        }
        worksheet.core.results.push( result )
        nResults++
        if ( nResults >= worksheet.core.runlimit ) { break }
        //console.log( 'At LAST: store results; heading back UP')
        delta = -1
        vidx += delta
      }
    } // while
    console.log( `Batch run produced ${nResults} results sets` )
    console.log( `Batch run required ${nDerived} function calls` )
    console.log( `Batch run required ${nBound} bound assignments` )
  },

  // Pushes all selected Variants onto the array
  // The array is usually worksheet.node.Variants
  getSelected: function ( node, nodeArray ) {
    if ( self.isVar( node ) && node.own.selected ) {
      nodeArray.push( node )
    }
    for ( let propName in node ) {
      if ( propName !== 'own' ) {
        self.getSelected( node[propName], nodeArray )
      }
    }
  },

  // Get reference to the Node's worksheet DAG
  nodeWorksheet( node ) {
    var parent = node.own.up
    while ( parent !== null ) {
      // If the parent id is 'nodes', then the worksheet is the parent's parent
      if ( parent.own.id === 'nodes' ) {
        return parent.own.up
      }
      parent = parent.own.up
    }
  },

  reconfig: function ( worksheet ) {
    self.reconfig_1_SaveSelected( worksheet )
    self.reconfig_2_Init( worksheet.nodes )
    self.reconfig_3_Edges( worksheet.nodes )
    self.reconfig_4_Costs( worksheet )
    self.reconfig_5_SetSelected( worksheet )
    self.reconfig_6_AddInputs( worksheet )
  },

  reconfig_1_SaveSelected: function ( worksheet ) {
    worksheet.core.selected = []
    self.getSelected( worksheet.nodes, worksheet.core.selected )
  },

  // Must be called whenever the configuration changes
  reconfig_2_Init: function ( node ) {
    if ( self.isVar( node ) ) {
      node.own.prod = []  // references to immediate producer Variants
      node.own.user = []  // references to immediate consumer Variants
      node.own.deps = 0   // number of direct and indirect consumer Variants based on current selections
      node.own.cost = 0   // topological cost (or 'height')
      node.own.tord = 0   // topological processing order
      node.own.selected = false
      return
    }
    if ( self.isCfg( node ) ) {
      node.own.deps = 0
    }
    for ( let propName in node ) {
      if ( propName !== 'own' ) {
        self.reconfig_2_Init( node[propName] )
      }
    }
  },

  // Must be called whenever the configuration changes
  // Start with bp.ws.w1, which has the following children:
  // cfg, air, cpy, doc, map, mois, slp, wnd, surf, mort, spot, cont, crwn, ignt
  reconfig_3_Edges: function( node ) {
    // Variant nodes are terminal
    if ( self.isVar( node ) ) {
      node.own.coptId = 'dflt'
      // If this Variant is configurable
      if ( node.own.cfg !== null ) {
        // Check if any of the Variant's options match the current configuration option
        for ( let cfgOpt in node.own.opt ) {
          if ( cfgOpt === node.own.cfg.own.cv ) {
            node.own.coptId = cfgOpt
          }
        }
      }
      node.own.copt = node.own.opt[ node.own.coptId ]
      var vref = null
      if ( node.own.copt.ty === 'bound' ) {
        vref = node.own.copt.to
        node.own.prod = [ vref ]    // Add the bound Node to the producer list
        vref.own.user.push( node )  // Add this node to the procucers list of users
      } else if ( node.own.copt.ty === 'fixed' || node.own.copt.ty == 'input' ) {
        // do nothing
      } else if ( node.own.copt.ty === 'derived' ) {
        for( let idx in node.own.copt.ar ) {
          vref = node.own.copt.ar[idx]
          if ( vref === undefined ) {
            self.freakOut( `Undefined producer at idx ${idx} for node ` + self.fullId(node) )
          }
          vref.own.user.push( node )  // Add this node to the producers list of users
          node.own.prod.push( vref )  // Add the arg Node the the producer list
        }
      } else {
        self.freakOut( `Invalid node.own.opt.ty '${optRef.ty}' for node ` + self.fullId(node))
      }
      return
    } else if ( self.isOpt( node ) ) {
      // Configuration Option Nodes are terminal
      return
    }
    // Must be a Dag or a Cfg
    for ( let propName in node ) {
      if ( propName !== 'own' ) {
        self.reconfig_3_Edges( node[propName] )
      }
    }
  },

  // Must be called whenever the configuration changes
  reconfig_4_Costs: function ( worksheet ) {
    // Add topological cost to each Variant (v.own.cost)
    var cost = 0
    for( let idx in worksheet.core.variants ) {
      cost += self.reconfig_4_CostsRecursive( worksheet.core.variants[idx] )
    }
    // Order the node reference array by decreasing cost
    worksheet.core.variants.sort( function ( a, b ) {
      return b.own.cost - a.own.cost
    })
    // Store toplogical order with the Variants
    for( let idx in worksheet.core.variants ) {
      worksheet.core.variants[idx].own.tord = idx
    }
    return cost
  },

  reconfig_4_CostsRecursive: function ( node ) {
    if ( self.isVar( node ) && ( node.own.cost === 0 ) ) {
      // During topological sorting, if multiple nodes have the same cost,
      // it is better that any input nodes are processed last.
      // SO give non-input nodes twice the cost as input nodes.
      var cost = ( node.own.copt.ty === 'input' ) ? 1 : 2
      for ( let idx in node.own.user ) {
        cost += self.reconfig_4_CostsRecursive( node.own.user[idx] )
      }
      node.own.cost = cost
    }
    return node.own.cost
  },

  reconfig_5_SetSelected: function ( worksheet ) {
    for( let idx in worksheet.core.selected ) {
      self.select( worksheet.core.selected[idx] )
    }
  },

  reconfig_6_AddInputs: function ( worksheet ) {
    var variants = worksheet.core.variants
    worksheet.core.inputs = []
    for ( let idx in variants ) {
      if ( variants[idx].own.copt.ty === 'input' && variants[idx].own.deps ) {
        worksheet.core.inputs.push( variants[idx] )
      }
    }
  },

  selects: function ( nodeArray ) {
    for( let idx in nodeArray ) {
      self.select( nodeArray[idx] )
    }
  },

  select: function ( node ) {
    if ( ! node.own.selected ) {
      node.own.selected = true
      node.own.deps++
      self.selectRecursive( node )
    }
  },

  selectRecursive: function ( node ) {
    if ( node.own.cfg !== null ) {
      node.own.cfg.own.deps++
    }
    for ( let idx in node.own.prod ) {
      let producer = node.own.prod[idx]
      // Adding the following if() improved testStd.js reconfig() from 11300 to 9 ms !!!
      if ( ! producer.own.deps ) {
        producer.own.deps++
        self.selectRecursive( producer )
      }
    }
  },

  setConfigs: function ( cfgOptPairs ) {
    for ( let idx in cfgOptPairs ) {
      self.setConfig( cfgOptPairs[idx][0], cfgOptPairs[idx][1] )
    }
  },

  setConfig: function ( cfg, opt ) {
    cfg.own.cv = opt
  },

  setInput: function ( node, valuesArray ) {
    if ( ! Array.isArray( valuesArray ) ) {
      //var fid = self.fullId( node )
      self.freakOut( `Attempt to setInputValues() on Variant '${fid}' with a non-array value` )
    }
    node.own.in = { va: valuesArray, idx: 0 }
  },

  setInputs: function ( inputs ) {
    if ( ! Array.isArray( inputs ) ) {
      self.freakOut( `Attempt to setInputs() on a non-array value` )
    }
    inputs.forEach( function( input ) {
      self.setInput( input[0], input[1] )
    })
  },

  setValue: function ( node, value ) {
    node.own.cv = value
  },

  setValues: function ( nodeValuePairs ) {
    for ( let idx in nodeValuePairs ) {
      nodeValuePairs[idx][0].own.cv = nodeValuePairs[idx][1]
    }
  },

  // Unselect a single Node
  unselect: function ( node ) {
    if ( node.own.selected ) {
      node.own.selected = false
      node.own.deps--
      self.reconfig( self.nodeWorksheet( node ) )
    }
  },

  // Unselect an array of Nodes
  unselects: function ( nodeArray ) {
    var update = false
    for( let idx in nodeArray ) {
      var node = nodeArray[idx]
      if ( node.own.selected ) {
        node.own.selected = false
        node.own.deps--
        update = true
      }
    }
    if ( update ) {
      self.reconfig( self.nodeWorksheet( nodeArray[0] ) )
    }
  },
}
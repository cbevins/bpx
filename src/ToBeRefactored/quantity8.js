module.exports = {
  scale: {
    temperature: [{
      name: 'F',
      factor: 1.0,
      offset: 0.0
    },{
      name: 'C',
      factor: 9./5.,  // F = 32. + 9./5. * C [i.e., F = offset + factor * C ]
      offset: 32.     // C = (F - 32) * 5./9. [i.e., C = (F-offset) / factor]
    }]
  },
  quantity: {
    areaSm: [
      { name: 'ft+2', factor: 1.0 },
      { name: 'm+2', factor: 1.0 }, // \todo
      { name: 'in+2', factor: 1.0 }, // \todo
      { name: 'cm+2', factor: 1.0 }, // \todo
      { name: 'mm+2', factor: 1.0 }, // \todo
    ],
    areaMd: [
      { name: 'ft+2', factor: 1.0 },
      { name: 'm+2', factor: 1.0 }, // \todo
    ],
    areaLg: [
      { name: 'ft+2', factor: 1.0 },
      { name: 'm+2', factor: 1.0 }, // \todo
      { name: 'ch+2', factor: 1.0 }, // \todo
      { name: 'mi+2', factor: 1.0 }, // \todo
      { name: 'km+2', factor: 1.0 }, // \todo
    ],
    compass: [
      { name: 'deg+1', factor: 1.0 },
    ],
    dens: [{
      name: 'lb+1 ft-3',
      factor: 1.0,
    },{
      name: 'kg+1 m-3',
      factor: 99999.0,  // \TODO
    }],
    // distSm used for particle diameter, bed depth, map distance
    distSm : [{
      name: 'ft+1',
      factor: 1.0,
    },{
      name: 'm+1',
      factor: 3.28084,  // ft = factor * m; m = ft / factor
    },{
      name: 'in+1',
      factor: 1./12.,   // ft = factor * in; in = ft / factor
    }, {
      name: 'cm+1',
      factor: 0.328084,  // ft = factor * cm; cm = ft / factor
    },{
      name: 'mm+1',
      factor: 0.0328084,  // ft = factor * mm; mm = ft / factor
    }],
    // distMd used for flame length, scorch height, tree heights
    distMd : [{
      name: 'ft+1',
      factor: 1.0,
    },{
      name: 'm+1',
      factor: 3.28084,  // ft = factor * m
    }],
    // distLg is used for spread distance, fire perimeter
    distLg : [{
      name: 'ft+1',
      factor: 1.0,
    },{
      name: 'm+1',
      factor: 3.28084,  // ft = factor * m
    },{
      name: 'ch+1',
      factor: 66.,   // ft = factor * ch
    }, {
      name: 'mi+1',
      factor: 5280.,  // ft = factor * mi
    },{
      name: 'km+1',
      factor: 3280.84,  // ft = factor * km
    }],
    // fli is fireline intensity
    fli: [{
      name: 'btu+1 ft-1 s-1',
      factor: 1.0,
    },{
      name: 'kJ+1 m-1 s-1',
      factor: 1.0,      // \TODO
    }],
    // hpua is used for fire heat per unit area
    hpua: [{
      name: 'btu+1 ft-2',
      factor: 1.0,
    },{
      name: 'kJ+1 m-2',
      factor: 1.0,    // \TODO
    }],
    // velMd is used for fire spread rate
    velMd: [{
      name: 'ft+1 min-1',
      factor: 1.0,
    },{
      name: 'm+1 min-1',
      factor: 3.29084
    }],
    years: [{
      name: 'yr+1',
      factor: 1.0,
    }]
  }
}
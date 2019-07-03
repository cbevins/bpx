/**
 * @file Defines all the units-of-measure used by BehavePlus Explorer LeafQuantity item,
 * including their validation parameters (min, max, etc)
 * and decorators (conversions, decimal digits, etc).
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

const BpxUnits = {
  azimuth: {
    uom: {
      base: { deg: 0 },
    },
    apply: 'base',
    min: 0,
    max: 360,
  },
  basalArea: {
    uom: {
      base: { ft: 2, ac: -1 },
      alt1: { m: 2, ha: -1 },
    },
    apply: 'base',
    min: 0,
  },
  bulkDensity: {
    uom: {
      base: { lb: 1, ft: -3 },
      alt1: { kg: 1, m: -3 },
    },
    apply: 'base',
    min: 0,
  },
  // distances on the order of inches to feet
  distanceFt: {
    units: {
      'ft' : {
        fromBase: (value) => value,
        intoBase: (value) => value,
      },
      'm' : {
        fromBase: (value) => value / 3.28084,
        intoBase: (value) => value * 3.28084,
      },
      'in' : {
        fromBase: (value) => value * 12,
        intoBase: (value) => value / 12,
      },
      'cm' : {
        fromBase: (value) => value / 0.0328084,
        intoBase: (value) => value * 0.0328084,
      },
},
    base: 'ft',
    display: {
      units: 'ft',
      decimals: 2,
    },
    validate: {
      real: [],
      gt: [0],
    },
    uom: {
      base: { ft: 1 },
      alt1: { in: 1 },
      alt2: { m: 1 },
      alt3: { cm: 1 },
    },
    apply: 'base',
    min: 0,
  },
  // distances on the order of feet to miles
  distanceMi: {
    uom: {
      base: { ft: 1 },
      alt1: { mi: 1 },
      alt2: { m: 1 },
      alt3: { km: 1 },
    },
    apply: 'base',
    min: 0,
  },
  // a generic real value with no limits or conversions
  factor: {
    units: {
      'dl': {
        fromBase: (value) => value,
        intoBase: (value) => value,
      },
    },
    base: 'dl',
    display: {
      units: 'dl',
      decimals: 4,
    },
    validate: {
      real: [],
    },
    uom: {
      base: { real: 0 },
    },
    apply: 'base',
  },
  fireArea: {
    uom: {
      base: { ft: 2 },
      alt1: { m: 2 },
      alt2: { ac: 1 },
      alt3: { ha: 1 },
    },
    apply: 'base',
    min: 0,
  },
  fireDistance: { // distances on the order of feet to miles
    uom: {
      base: { ft: 1 },
      alt1: { mi: 1 },
      alt2: { m: 1 },
      alt3: { km: 1 },
    },
    apply: 'base',
    min: 0,
    precision: 12,
  },
  fireFlame: { // distances on the order of feet to miles
    uom: {
      base: { ft: 1 },
      alt1: { m: 1 },
    },
    apply: 'base',
    min: 0,
  },
  fireFli: {
    uom: {
      base: { btu: 1, ft: -1, s: -1 },
      alt1: { kJ: 1, m: -1, s: -1 },
    },
    apply: 'base',
    min: 0,
  },
  fireHpua: {
    uom: {
      base: { btu: 1, ft: -2 },
      alt1: { kJ: 1, m: -2 },
    },
    apply: 'base',
    min: 0,
  },
  fireLwr: {
    uom: {
      base: { fraction: 1 },
      alt1: { percent: 1 },
    },
    apply: 'base',
    min: 1,
  },
  firePower: {
    uom: {
      base: { lb: 1, ft: -1, s: -1 },
      alt2: { kg: 1, m:-1, s: -1 },
    },
    apply: 'base',
    min: 0,
  },
  fireRos: {
    units: {
      'ft/min' : {
        fromBase: (value) => value,
        intoBase: (value) => value,
      },
      'm/min' : {
        fromBase: (value) => value / 3.28084,
        intoBase: (value) => value * 3.28084,
      }
    },
    base: 'ft/min',
    display: {
      units: 'ft/min',
      decimals: 2,
    },
    validate: {
      real: [],
      gt: [0],
    },
    uom: {
      base: { ft: 1, min: -1 },
      alt1: { mi: 1, h: -1 },
      alt2: { ch: 1, min: -1 },
      alt3: { m: 1, min: -1 },
      alt4: { km: 1, h: -1 },
    },
    apply: 'base',
    min: 0,
  },
  fireRxi: {
    uom: {
      base: { btu: 1, ft: -2, min: -1 },
      alt1: { kJ: 1, m: -2, min: -1 },
    },
    apply: 'base',
    min: 0,
  },
  fireRxv: {
    uom: {
      base: { min: -1 },
    },
    apply: 'base',
    min: 0,
  },
  fireScorch: {
    uom: {
      base: { ft: 1 },
      alt1: { m: 1 },
    },
    apply: 'base',
    min: 0,
  },
  fraction: { // ratios within the range [0..1]
    uom: {
      base: { fraction: 0 },
      alt1: { percent: 0 },
    },
    apply: 'base',
  },
  fuelAge: {
    uom: {
      base: { y: 1 },
    },
    apply: 'base',
    min: 0,
  },
  fuelArea: {
    uom: {
      base: { ft: 2 },
      alt1: { m: 2 },
      alt2: { in: 2 },
      alt3: { cm: 2 },
    },
    apply: 'base',
    min: 0,
  },
  fuelAwtg: {
    uom: {
      base: { fraction: 0 },
      alt1: { percent: 0 },
    },
    apply: 'base',
    min: 0,
    max: 1,
  },
  fuelCover: {
    uom: {
      base: { fraction: 0 },
      alt1: { percent: 0 },
    },
    apply: 'base',
    min: 0,
    max: 1,
  },
  fuelCured: {
    uom: {
      base: { fraction: 0 },
      alt1: { percent: 0 },
    },
    apply: 'base',
    min: 0,
    max: 1,
  },
  fuelDens: {
    uom: {
      base: { lb: 1, ft: -3 },
      alt1: { kg: 1, m: -3 },
    },
    apply: 'base',
    min: 10,
    max: 50,
  },
  fuelDepth: {
    uom: {
      base: { ft: 1 },
      alt1: { m: 1 },
      alt2: { in: 1 },
      alt3: { cm: 1 },
    },
    apply: 'base',
    min: 0,
    max: 10,
  },
  fuelDiam: {
    uom: {
      base: { ft: 1 },
      alt1: { m: 1 },
      alt2: { in: 1 },
      alt3: { cm: 1 },
    },
    apply: 'base',
    min: 0,
    max: 1,
  },
  fuelHeat: {
    uom: {
      base: { btu: 1, lb: -1 },
      alt1: { kJ: 1, kg: -1 },
    },
    apply: 'base',
    min: 6000,
    max: 15000,
  },
  fuelHeight: {
    uom: {
      base: { ft: 1 },
      alt1: { m: 1 },
      alt2: { in: 1 },
      alt3: { cm: 1 },
    },
    display: {
      base: 'ft',
      alt1: 'm',
      alt2: 'in',
      alt3: 'cm',
    },
    apply: 'base',
    min: 0,
    max: 100,
  },
  fuelLoad: {
    uom: {
      base: { lb: 1, ft: -2 },
      alt1: { ton: 1, ac: -1 },
      alt2: { kg: 1, m: -2 },
      alt3: { tonne: 1, ha: -1 },
    },
    display: {
      base: 'lb/ft2',
      alt1: 't/ac',
      alt2: 'kg/m2',
      alt3: 'T/ha',
    },
    apply: 'base',
    min: 0,
  },
  fuelMois: {
    uom: {
      base: { fraction: 0 },
      alt1: { percent: 0 },
    },
    display: {
      base: 'fraction',
      alt1: '%',
    },
    apply: 'base',
    min: 0.01,
    max: 5,
  },
  fuelSavr: {
    uom: {
      base: { ft: -1 },
      alt1: { cm: -1 },
    },
    apply: 'base',
    min: 1,
    max: 4000,
  },
  fuelSeff: {
    uom: {
      base: { fraction: 0 },
      alt1: { percent: 0 },
    },
    apply: 'base',
    min: 0,
    max: 0.05,
  },
  fuelSink: {
    uom: {
      base: { btu: 1, ft: -3 },
      alt1: { kJ: 1, m: -3 },
    },
    apply: 'base',
    min: 0,
  },
  fuelStot: { // ratios within the range [0..1]
    uom: {
      base: { fraction: 0 },
      alt1: { percent: 0 },
    },
    apply: 'base',
    min: 0,
    max: 0.1,
  },
  fuelSwtg: {
    uom: {
      base: { fraction: 0 },
      alt1: { percent: 0 },
    },
    apply: 'base',
    min: 0,
    max: 1,
  },
  fuelVolm: {
    uom: {
      base: { ft: 3 },
      alt1: { m: 3 },
    },
    apply: 'base',
    min: 0,
  },
  index: {
    uom: {
      base: { integer: 0 },
    },
    apply: 'base',
    min: 0,
  },
  mapArea: {
    uom: {
      base: { ft: 2 },
      alt1: { m: 2 },
      alt2: { in: 2 },
      alt3: { cm: 2 },
    },
    apply: 'base',
    min: 0,
  },
  mapDistance: {
    uom: {
      base: { ft: 1 },
      alt1: { mi: 1 },
      alt2: { in: 1 },
      alt3: { cm: 1 },
    },
    apply: 'base',
    min: 0,
  },
  nonNegative: { // a generic non-negative real value
    uom: {
      base: { real: 0 },
    },
    apply: 'base',
    min: 0,
  },
  ratio: { // ratios outside the range [0..1] that convert fraction-to-percent
    uom: {
      base: { fraction: 1 },
      alt1: { percent: 1 },
    },
    apply: 'base',
  },
  slopeSteepness: {
    uom: {
      base: { ratio: 0 },
      alt1: { degrees: 0 },
    },
    display: {
      base: 'ratio',
      alt1: 'degrees',
    },
    apply: 'base',
    min: 0,
  },
  temperature: {
    uom: {
      base: { F: 0 },
      alt1: { C: 0 },
    },
    apply: 'base',
    min: -40,
    max: 140,
  },
  timeMin: {
    uom: {
      base: { min: 1 },
      alt1: { s: 1 },
      alt2: { h: 1 },
    },
    apply: 'base',
    min: 0,
  },
  timeYear: {
    uom: {
      base: { y: 1 },
    },
    apply: 'base',
    min: 0,
  },
  windSpeed: {
    uom: {
      base: { ft: 1, min: -1 },
      alt1: { mi: 1, h: -1 },
      alt3: { m: 1, min: -1 },
      alt4: { km: 1, h: -1 },
    },
    apply: 'base',
    min: 0,
    max: 88 * 100,
  },
};

export default BpxUnits;

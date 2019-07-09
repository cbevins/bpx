/**
 * @file Defines all the units-of-measure used by BehavePlus Explorer LeafQuantity item,
 * including their validation parameters (min, max, etc)
 * and decorators (conversions, decimal digits, etc).
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagUnits from './DagUnits';

export default class BpxUnits extends DagUnits {
  constructor() {
    super();
    this.uom = {
      azimuth: {
        units: {
          'deg' : {
            fromBase: (deg) => deg,
            intoBase: (deg) => deg,
          },
        },
        config: {
          base: ['deg', 0],
          imperial: ['deg', 0],
          metric: ['deg', 0]
        },
        display: {
          units: 'deg',
          decimals: 0,
        },
        validate: {
          minVal: 0,
          maxVal: 359,
        },
      },
      basalArea: {
        units: {
          'ft2': {
            fromBase: (ft2) => ft2,
            intoBase: (ft2) => ft2,
          },
          'm2': {
            fromBase: (ft2) => ft2 / 10.76391111,
            intoBase: (m2) => m2 * 10.76391111,
          },
          'in2': {
            fromBase: (ft2) => ft2 * 144,
            intoBase: (in2) => in2 / 144,
          },
          'cm2': {
            fromBase: (ft2) => ft2 / 0.001076391111,
            intoBase: (cm2) => cm2 * 0.001076391111,
          },
        },
        config: {
          base: ['ft2', 2],
          imperial: ['ft2', 2],
          metric: ['m2', 2],
        },
        display: {
          units: 'ft2',
          decimals: 2,
        },
        validate: {
          minVal: 0,
        },
      },
      bulkDensity: {
        units: {
          'lb/ft3': {
            fromBase: (lbft3) => lbft3,
            intoBase: (lbft3) => lbft3,
          },
          'kg/m3': {
            fromBase: (lbft3) => lbft3 * 16.0185,
            intoBase: (kgm3) => kgm3 / 16.0185,
          },
        },
        config: {
          base: ['lb/ft3', 0],
          imperial: ['lb/ft3', 0],
          metric: ['kg/m3', 0],
        },
        display: {
          units: 'lb/ft3',
          decimals: 0,
        },
        validate: {
          minVal: 0,
        },
      },
      count: {
        units: {
          ' ': {
            fromBase: (n) => n,
            intoBase: (n) => n,
          },
        },
        config: {
          base: [' ', 0],
          imperial: [' ', 0],
          metric: [' ', 0],
        },
        display: {
          units: ' ',
          decimals: 0,
        },
        validate: {
          minVal: 0,
          integer: true,
        },
      },
      distance: {
        units: {
          'ft' : {
            fromBase: (ft) => ft,
            intoBase: (ft) => ft,
          },
          'm' : {
            fromBase: (ft) => ft / 3.28084,
            intoBase: (m) => m * 3.28084,
          },
          'in' : {
            fromBase: (ft) => ft * 12,
            intoBase: (inch) => inch / 12,
          },
          'cm' : {
            fromBase: (ft) => ft / 0.0328084,
            intoBase: (cm) => cm * 0.0328084,
          },
          'mi' : {
            fromBase: (ft) => ft / 5280,
            intoBase: (mi) => mi * 5280,
          },
          'km' : {
            fromBase: (ft) => ft * 3280.84,
            intoBase: (km) => km / 3280.84,
          },
        },
        config: {
          base: ['ft', 2],
          imperial: ['ft', 2],
          metric: ['m', 2],
        },
        display: {
          units: 'ft',
          decimals: 2,
        },
        validate: {
          minVal: 0,
        },
      },
      // a generic real value with no limits or conversions
      factor: {
        units: {
          'dl': {
            fromBase: (value) => value,
            intoBase: (value) => value,
          },
        },
        config: {
          base: ['dl', 2],
          imperial: ['dl', 2],
          metric: ['dl', 2],
        },
        display: {
          units: 'dl',
          decimals: 2,
        },
        validate: {
        },
      },
      fireArea: {
        units: {
          'ft2': {
            fromBase: (ft2) => ft2,
            intoBase: (ft2) => ft2,
          },
          'm2': {
            fromBase: (ft2) => ft2 / 10.76391111,
            intoBase: (m2) => m2 * 10.76391111,
          },
          'ac': {
            fromBase: (ft2) => ft2 / 43560,
            intoBase: (ac) => ac * 43560,
          },
          'ha': {
            fromBase: (ft2) => ft2 / 107639.1111,
            intoBase: (ha) => ha * 107639.1111,
          },
        },
        config: {
          base: ['ft2', 0],
          imperial: ['ac', 2],
          metric: ['ha', 2],
        },
        display: {
          units: 'ft2',
          decimals: 0,
        },
        validate: {
          minVal: 0,
        },
      },
      fireDistance: {
        units: {
          'ft' : {
            fromBase: (ft) => ft,
            intoBase: (ft) => ft,
          },
          'm' : {
            fromBase: (ft) => ft / 3.28084,
            intoBase: (m) => m * 3.28084,
          },
          'mi' : {
            fromBase: (ft) => ft / 5280,
            intoBase: (mi) => mi * 5280,
          },
          'km' : {
            fromBase: (ft) => ft * 3280.84,
            intoBase: (km) => km / 3280.84,
          },
        },
        config: {
          base: ['ft', 2],
          imperial: ['ft', 2],
          metric: ['m', 2],
        },
        display: {
          units: 'ft',
          decimals: 2,
        },
        validate: {
          minVal: 0,
        },
      },
      fireFlame: { // distances on the order of feet to miles
        units: {
          'ft' : {
            fromBase: (ft) => ft,
            intoBase: (ft) => ft,
          },
          'm' : {
            fromBase: (ft) => ft / 3.28084,
            intoBase: (m) => m * 3.28084,
          },
          'in' : {
            fromBase: (ft) => ft * 12,
            intoBase: (inch) => inch / 12,
          },
          'cm' : {
            fromBase: (ft) => ft / 0.0328084,
            intoBase: (cm) => cm * 0.0328084,
          },
        },
        config: {
          base: ['ft', 2],
          imperial: ['ft', 2],
          metric: ['m', 2],
        },
        display: {
          units: 'ft',
          decimals: 2,
        },
        validate: {
          minVal: 0,
          maxVal: 300,
        },
      },
      fireFli: {
        units: {
          'btu/ft-s': {
            fromBase: (bfs) => bfs,
            intoBase: (bfs) => bfs,
          },
          'kJ/m-s': {
            fromBase: (bfs) => bfs * 3.46414,
            intoBase: (Jms) => Jms / 3.46414,
          }
        },
        config: {
          base: ['btu/ft-s', 0],
          imperial: ['btu/ft-s', 0],
          metric: ['kJ/m-s', 0],
        },
        display: {
          units: 'btu/ft-s',
          decimals: 0,
        },
        validate: {
          minVal: 0,
        }
      },
      fireHpua: {
        units: {
          'btu/ft2' : {
            fromBase: (bf2) => bf2,
            intoBase: (bf2) => bf2,
          },
          'kJ/m2' : {
            fromBase: (bf2) => bf2 * 11.3653,
            intoBase: (kJm2) => kJm2 / 11.3653,
          },
        },
        config: {
          base: ['btu/ft2', 0],
          imperial: ['btu/ft2', 0],
          metric: ['kJ/m2', 0],
        },
        display: {
          units: 'btu/ft2',
          decimals: 0,
        },
        validate: {
          minVal: 0,
        }
      },
      fireLwr: {
        units: {
          'ratio': {
            fromBase: (ratio) => ratio,
            intoBase: (ratio) => ratio,
          }
        },
        config: {
          base: ['ratio', 2],
          imperial: ['ratio', 2],
          metric: ['ratio', 2],
        },
        display: {
          units: 'ratio',
          decimals: 2,
        },
        validate: {
          minVal: 1,
        }
      },
      firePower: {
        units: {
          'lb/ft-s': {
            fromBase: (pfs) => pfs,
            intoBase: (pfs) => pfs,
          },
          'kg/m-s': {
            fromBase: (pfs) => pfs * 1.48816,
            intoBase: (kms) => kms / 1.48816,
          },
        },
        config: {
          base: ['lb/ft-s', 2],
          imperial: ['lb/ft-s', 2],
          metric: ['kJ/m-s', 2],
        },
        display: {
          units: 'lb/ft-s',
          decimals: 2,
        },
        validate: {
          minVal: 0,
        }
      },
      fireRos: {
        units: {
          'ft/min' : {
            fromBase: (fpm) => fpm,
            intoBase: (fpm) => fpm,
          },
          'm/min' : {
            fromBase: (fpm) => fpm / 3.28084,
            intoBase: (mpm) => mpm * 3.28084,
          },
          'mi/hr' : {
            fromBase: (fpm) => fpm / 88,
            intoBase: (mph) => mph * 88,
          },
          'km/h' : {
            fromBase: (fpm) => fpm / 54.6807,
            intoBase: (mpm) => mpm * 54.6807,
          },
          'ch/hr' : {
            fromBase: (fpm) => fpm / 1.1,
            intoBase: (cph) => cph * 1.1,
          },
        },
        config: {
          base: ['ft/min', 2],
          imperial: ['ft/min', 2],
          metric: ['m/min', 2],
        },
        display: {
          units: 'ft/min',
          decimals: 2,
        },
        validate: {
          minVal: 0,
        },
      },
      fireRxi: {
        units: {
          'btu/ft2-min': {
            fromBase: (bft2m) => bft2m,
            intoBase: (bft2m) => bft2m,
          },
          'kJ/m2-min': {
            fromBase: (bft2m) => bft2m * 11.3653,
            intoBase: (kJm2m) => kJm2m / 11.3653,
          },
        },
        config: {
          base: ['btu/ft2-min', 0],
          imperial: ['btu/ft2-min', 0],
          metric: ['kJ/m2-min', 0],
        },
        display: {
          units: 'btu/ft2-min',
          decimals: 0,
        },
        validate: {
          minVal: 0,
        }
      },
      fireRxv: {
        units: {
          'min' : {
            fromBase: (min) => min,
            intoBase: (min) => min,
          },
        },
        config: {
          base: ['min', 4],
          imperial: ['min', 4],
          metric: ['min', 4],
        },
        display: {
          units: 'min',
          decimals: 4,
        },
        validate: {
          minVal: 0,
        }
      },
      fireScorch: {
        units: {
          'ft' : {
            fromBase: (ft) => ft,
            intoBase: (ft) => ft,
          },
          'm' : {
            fromBase: (ft) => ft / 3.28084,
            intoBase: (m) => m * 3.28084,
          },
          'in' : {
            fromBase: (ft) => ft * 12,
            intoBase: (inch) => inch / 12,
          },
          'cm' : {
            fromBase: (ft) => ft / 0.0328084,
            intoBase: (cm) => cm * 0.0328084,
          },
        },
        config: {
          base: ['ft', 2],
          imperial: ['ft', 2],
          metric: ['m', 2],
        },
        display: {
          units: 'ft',
          decimals: 2,
        },
        validate: {
          minVal: 0,
          maxVal: 500,
        },
      },
      fraction: { // ratios within the range [0..1]
        units: {
          'fraction' : {
            fromBase: (fraction) => fraction,
            intoBase: (fraction) => fraction,
          },
          '%' : {
            fromBase: (fraction) => fraction * 100,
            intoBase: (percent) => percent / 100,
          }
        },
        config: {
          base: ['fraction', 2],
          imperial: ['%', 0],
          metric: ['%', 0],
        },
        display: {
          units: 'fraction',
          decimals: 2,
        },
        validate: {
          minVal: 0,
          maxVal: 1,
        },
      },
      fuelAge: {
        units: {
          'y' : {
            fromBase: (y) => y,
            intoBase: (y) => y,
          }
        },
        config: {
          base: ['y', 2],
          imperial: ['y', 2],
          metric: ['y', 2],
        },
        display: {
          units: 'y',
          decimals: 2,
        },
        validate: {
          minVal: 0,
        }
      },
      fuelArea: {
        units: {
          'ft2': {
            fromBase: (ft2) => ft2,
            intoBase: (ft2) => ft2,
          },
          'm2': {
            fromBase: (ft2) => ft2 / 10.76391111,
            intoBase: (m2) => m2 * 10.76391111,
          },
          'in2': {
            fromBase: (ft2) => ft2 * 144,
            intoBase: (in2) => in2 / 144,
          },
          'cm2': {
            fromBase: (ft2) => ft2 / 0.001076391111,
            intoBase: (cm2) => cm2 * 0.001076391111,
          },
        },
        config: {
          base: ['ft2', 2],
          imperial: ['ft2', 2],
          metric: ['m2', 2],
        },
        display: {
          units: 'ft2',
          decimals: 0,
        },
        validate: {
          minVal: 0,
        },
      },
      fuelDens: {
        units: {
          'lb/ft3': {
            fromBase: (lbft3) => lbft3,
            intoBase: (lbft3) => lbft3,
          },
          'kg/m3': {
            fromBase: (lbft3) => lbft3 * 16.0185,
            intoBase: (kgm3) => kgm3 / 16.0185,
          },
        },
        config: {
          base: ['lb/ft3', 0],
          imperial: ['lb/ft3', 0],
          metric: ['kg/m3', 0],
        },
        display: {
          units: 'lb/ft3',
          decimals: 0,
        },
        validate: {
          minVal: 0,
          maxVal: 50,
        },
      },
      fuelDepth: {
        units: {
          'ft' : {
            fromBase: (ft) => ft,
            intoBase: (ft) => ft,
          },
          'm' : {
            fromBase: (ft) => ft / 3.28084,
            intoBase: (m) => m * 3.28084,
          },
          'in' : {
            fromBase: (ft) => ft * 12,
            intoBase: (inch) => inch / 12,
          },
          'cm' : {
            fromBase: (ft) => ft / 0.0328084,
            intoBase: (cm) => cm * 0.0328084,
          },
        },
        config: {
          base: ['ft', 2],
          imperial: ['ft', 2],
          metric: ['m', 2],
        },
        display: {
          units: 'ft',
          decimals: 2,
        },
        validate: {
          minVal: 0,
          maxVal: 10,
        },
      },
      fuelDiam: {
        units: {
          'ft' : {
            fromBase: (ft) => ft,
            intoBase: (ft) => ft,
          },
          'm' : {
            fromBase: (ft) => ft / 3.28084,
            intoBase: (m) => m * 3.28084,
          },
          'in' : {
            fromBase: (ft) => ft * 12,
            intoBase: (inch) => inch / 12,
          },
          'cm' : {
            fromBase: (ft) => ft / 0.0328084,
            intoBase: (cm) => cm * 0.0328084,
          },
        },
        config: {
          base: ['ft', 4],
          imperial: ['ft', 4],
          metric: ['cm', 2],
        },
        display: {
          units: 'ft',
          decimals: 4,
        },
        validate: {
          minVal: 0,
          maxVal: 1,
        },
      },
      fuelHeat: {
        units: {
          'btu/lb' : {
            fromBase: (bpp) => bpp,
            intoBase: (bpp) => bpp,
          },
          'kJ/kg' : {
            fromBase: (bpp) => bpp * 2.32779,
            intoBase: (kJkg) => kJkg / 2.32779,
          },
        },
        config: {
          base: ['btu/lb', 0],
          imperial: ['btu/lb', 0],
          metric: ['kJ/kg', 0],
        },
        display: {
          units: 'btu/lb',
          decimals: 0,
        },
        validate: {
          minVal: 8000,
          maxVal: 15000,
        }
      },
      fuelLoad: {
        units: {
          'lb/ft2' : {
            fromBase: (pft2) => pft2,
            intoBase: (pft2) => pft2,
          },
          'kg/m2' : {
            fromBase: (pft2) => pft2,
            intoBase: (kgm2) => kgm2,
          },
          't/ac' : {
            fromBase: (pft2) => pft2 * 21.78,
            intoBase: (tpa) => tpa / 21.78,
          },
          'T/ha' : {
            fromBase: (pft2) => pft2 * 48.8243,
            intoBase: (Tha) => Tha / 48.8243,
          },
        },
        config: {
          base: ['lb/ft2', 4],
          imperial: ['t/ac', 2],
          metric: ['T/ha', 2],
        },
        display: {
          units: 'lb/ft2',
          decimals: 4,
        },
        validate: {
          minVal: 0,
          maxVal: 10,
        },
      },
      fuelMois: {
        units: {
          'ratio' : {
            fromBase: (ratio) => ratio,
            intoBase: (ratio) => ratio,
          },
          '%' : {
            fromBase: (ratio) => ratio * 100,
            intoBase: (percent) => percent / 100,
          }
        },
        config: {
          base: ['ratio', 2],
          imperial: ['%', 0],
          metric: ['%', 0],
        },
        display: {
          units: 'ratio',
          decimals: 2,
        },
        validate: {
          minVal: 0.01,
          maxVal: 5,
        },
      },
      fuelSavr: {
        units: {
          'ft2/ft3' : {
            fromBase: (ft2ft3) => ft2ft3,
            intoBase: (ft2ft3) => ft2ft3,
          },
          'm2/m3' : {
            fromBase: (ft2ft3) => ft2ft3 * 3.28084,
            intoBase: (m2m3) => m2m3 / 3.28084,
          },
          'in2/in3' : {
            fromBase: (ft2ft3) => ft2ft3 / 12,
            intoBase: (in2in3) => in2in3 * 12,
          },
          'cm2/cm3' : {
            fromBase: (ft2ft3) => ft2ft3 * 0.0328084,
            intoBase: (cm2cm3) => cm2cm3 / 0.0328084,
          },
        },
        config: {
          base: ['ft2/ft3', 0],
          imperial: ['ft2/ft3', 0],
          metric: ['m2/m3', 0],
        },
        display: {
          units: 'ft2/ft3',
          decimals: 0,
        },
        validate: {
          minVal: 1,
          maxVal: 4000,
        },
      },
      fuelSeff: {
        units: {
          'fraction' : {
            fromBase: (ratio) => ratio,
            intoBase: (ratio) => ratio,
          },
          '%' : {
            fromBase: (ratio) => ratio * 100,
            intoBase: (percent) => percent / 100,
          }
        },
        config: {
          base: ['fraction', 2],
          imperial: ['%', 0],
          metric: ['%', 0],
        },
        display: {
          units: 'fraction',
          decimals: 2,
        },
        validate: {
          minVal: 0,
          maxVal: 0.05,
        },
      },
      fuelSink: {
        units: {
          'btu/ft3' : {
            fromBase: (bpf3) => bpf3,
            intoBase: (bpf3) => bpf3,
          },
          'kJ/m3' : {
            fromBase: (bpf3) => bpf3 * 37.2877,
            intoBase: (kJm3) => kJm3 / 37.2877,
          },
        },
        config: {
          base: ['btu/ft3', 2],
          imperial: ['btu/ft3', 2],
          metric: ['kJ/m3', 2],
        },
        display: {
          units: 'btu/ft3',
          decimals: 2,
        },
        validate: {
          minVal: 0,
        },
      },
      fuelStot: {
        units: {
          'fraction' : {
            fromBase: (ratio) => ratio,
            intoBase: (ratio) => ratio,
          },
          '%' : {
            fromBase: (ratio) => ratio * 100,
            intoBase: (percent) => percent / 100,
          }
        },
        config: {
          base: ['fraction', 2],
          imperial: ['%', 0],
          metric: ['%', 0],
        },
        display: {
          units: 'fraction',
          decimals: 2,
        },
        validate: {
          minVal: 0,
          maxVal: 0.1,
        },
      },
      fuelVolm: {
        units: {
          'ft3': {
            fromBase: (ft3) => ft3,
            intoBase: (ft3) => ft3,
          },
          'm3': {
            fromBase: (ft3) => ft3 / 35.3147,
            intoBase: (m3) => m3 * 35.3147,
          },
        },
        config: {
          base: ['ft3', 4],
          imperial: ['ft3', 4],
          metric: ['m3', 4],
        },
        display: {
          units: 'ft3',
          decimals: 4,
        },
        validate: {
          minVal: 0,
        },
      },
      mapArea: {
        units: {
          'ft2': {
            fromBase: (ft2) => ft2,
            intoBase: (ft2) => ft2,
          },
          'm2': {
            fromBase: (ft2) => ft2 / 10.76391111,
            intoBase: (m2) => m2 * 10.76391111,
          },
          'in2': {
            fromBase: (ft2) => ft2 * 144,
            intoBase: (in2) => in2 / 144,
          },
          'cm2': {
            fromBase: (ft2) => ft2 / 0.001076391111,
            intoBase: (cm2) => cm2 * 0.001076391111,
          },
        },
        config: {
          base: ['ft2', 6],
          imperial: ['in2', 2],
          metric: ['cm2', 2],
        },
        display: {
          units: 'ft2',
          decimals: 0,
        },
        validate: {
          minVal: 0,
        },
      },
      mapDistance: {
        units: {
          'ft' : {
            fromBase: (ft) => ft,
            intoBase: (ft) => ft,
          },
          'm' : {
            fromBase: (ft) => ft / 3.28084,
            intoBase: (m) => m * 3.28084,
          },
          'in' : {
            fromBase: (ft) => ft * 12,
            intoBase: (inch) => inch / 12,
          },
          'cm' : {
            fromBase: (ft) => ft / 0.0328084,
            intoBase: (cm) => cm * 0.0328084,
          },
          'mi' : {
            fromBase: (ft) => ft / 5280,
            intoBase: (mi) => mi * 5280,
          },
          'km' : {
            fromBase: (ft) => ft * 3280.84,
            intoBase: (km) => km / 3280.84,
          },
        },
        config: {
          base: ['ft', 2],
          imperial: ['ft', 2],
          metric: ['m', 2],
        },
        display: {
          units: 'ft',
          decimals: 2,
        },
        validate: {
          minVal: 0,
        },
      },
      // ratios outside the range [0..1] that convert fraction-to-percent
      ratio: {
        units: {
          'ratio' : {
            fromBase: (ratio) => ratio,
            intoBase: (ratio) => ratio,
          },
          '%' : {
            fromBase: (ratio) => ratio * 100,
            intoBase: (percent) => percent / 100,
          }
        },
        config: {
          base: ['ratio', 2],
          imperial: ['%', 0],
          metric: ['%', 0],
        },
        display: {
          units: 'ratio',
          decimals: 2,
        },
        validate: {
        },
      },
      slopeSteepness: {
        units: {
          'ratio' : {
            fromBase: (ratio) => ratio,
            intoBase: (ratio) => ratio,
          },
          '%' : {
            fromBase: (ratio) => ratio * 100,
            intoBase: (percent) => percent / 100,
          },
          // 'deg': {
          //   fromBase: (ratio) => Math.atan(ratio),
          //   intoBase: (deg) => Math.tan(deg)
          // }
        },
        config: {
          base: ['ratio', 2],
          imperial: ['%', 0],
          metric: ['%', 0],
        },
        display: {
          units: 'ratio',
          decimals: 2,
        },
        validate: {
          minVal: 0,
          maxVal: 60, // about 89.04 deg
        },
      },
      temperature: {
        units: {
          'F' : {
            fromBase: (f) => f,
            intoBase: (f) => f,
          },
          'C' : {
            fromBase: (f) => (f-32) * 5/9,
            intoBase: (c) => 32 + c*9/5,
          },
        },
        config: {
          base: ['F', 0],
          imperial: ['F', 0],
          metric: ['C', 0],
        },
        display: {
          units: 'F',
          decimals: 0,
        },
        validate: {
          minVal: -40,
          maxVal: 140,
        },
      },
      timeMin: {
        units: {
          'min': {
            fromBase: (min) => min,
            intoBase: (min) => min,
          },
          's': {
            fromBase: (min) => min * 60,
            intoBase: (s) => s / 60,
          },
          'h': {
            fromBase: (min) => min / 3600,
            intoBase: (h) => h * 3600,
          },
          'day': {
            fromBase: (min) => min / (24*3600),
            intoBase: (day) => day * 24 * 3600,
          },
        },
        config: {
          base: ['min', 0],
          imperial: ['min', 0],
          metric: ['min', 0],
        },
        display: {
          units: 'min',
          decimals: 2,
        },
        validate: {
          minVal: 0,
        },
      },
      treeHt: {
        units: {
          'ft' : {
            fromBase: (ft) => ft,
            intoBase: (ft) => ft,
          },
          'm' : {
            fromBase: (ft) => ft / 3.28084,
            intoBase: (m) => m * 3.28084,
          },
        },
        config: {
          base: ['ft', 0],
          imperial: ['ft', 0],
          metric: ['m', 1],
        },
        display: {
          units: 'ft',
          decimals: 0,
        },
        validate: {
          minVal: 0,
          maxVal: 400,
        },
      },
      windSpeed: {
        units: {
          'ft/min' : {
            fromBase: (fpm) => fpm,
            intoBase: (fpm) => fpm,
          },
          'm/min' : {
            fromBase: (fpm) => fpm / 3.28084,
            intoBase: (mpm) => mpm * 3.28084,
          },
          'mi/h' : {
            fromBase: (fpm) => fpm / 88,
            intoBase: (mph) => mph * 88,
          },
          'km/h' : {
            fromBase: (fpm) => fpm / 54.6807,
            intoBase: (mpm) => mpm * 54.6807,
          },
        },
        config: {
          base: ['ft/min', 0],
          imperial: ['mi/h', 2],
          metric: ['km/h', 2],
        },
        display: {
          units: 'ft/min',
          decimals: 0,
        },
        validate: {
          minVal: 0,
          maxVal: 88*50,
        },
      },
    }
  }
};

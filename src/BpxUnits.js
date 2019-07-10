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
    this.uom.basalArea = {...this.uom.area,
      config: {
        base: ['ft2', 2],
        imperial: ['ft2', 2],
        metric: ['m2', 2],
      },
      display: {
        units: 'ft2',
        decimals: 2,
      },
    };
    this.uom.bulkDensity = {...this.uom.density,
      config: {
        base: ['lb/ft3', 2],
        imperial: ['lb/ft3', 2],
        metric: ['kg/m3', 2],
      },
      display: {
        units: 'lb/ft3',
        decimals: 2,
      },
    };
    this.uom.fireArea = {...this.uom.area,
      config: {
        base: ['ft2', 2],
        imperial: ['ft2', 2],
        metric: ['m2', 2],
      },
      display: {
        units: 'ft2',
        decimals: 2,
      },
    };
    this.uom.fireDistance = {...this.uom.length,
        config: {
          base: ['ft', 2],
          imperial: ['ft', 2],
          metric: ['m', 2],
        },
        display: {
          units: 'ft',
          decimals: 2,
        },
      };
    this.uom.fireFlame = {...this.uom.length,
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
      };
    this.uom.fireFli = {
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
      };
    this.uom.fireHpua = {
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
      };
    this.uom.fireLwr = {...this.uom.ratio,
        config: {
          base: ['ratio', 2],
        },
        display: {
          units: 'ratio',
          decimals: 2,
        },
        validate: {
          minVal: 1,
        }
      };
    this.uom.firePower = {
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
      };
    this.uom.fireRos = {...this.uom.velocity,
        config: {
          base: ['ft/min', 2],
          imperial: ['ft/min', 2],
          metric: ['m/min', 2],
          survey: ['ch/h', 2],
        },
        display: {
          units: 'ft/min',
          decimals: 2,
        },
      };
    this.uom.fireRxi = {
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
      };
    this.uom.fireRxv = {...this.uom.time,
        config: {
          base: ['min', 4],
        },
        display: {
          units: 'min',
          decimals: 4,
        },
      };
    this.uom.fireScorch = {...this.uom.length,
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
      };
    this.uom.fuelAge = {...this.uom.time,
        config: {
          base: ['y', 2],
        },
        display: {
          units: 'y',
          decimals: 2,
        },
        validate: {
          minVal: 0,
          maxVal: 50,
        }
      };
    this.uom.fuelArea = {...this.uom.area,
        config: {
          base: ['ft2', 2],
          imperial: ['ft2', 2],
          metric: ['m2', 2],
        },
        display: {
          units: 'ft2',
          decimals: 0,
        },
      };
    this.uom.fuelDens = {...this.uom.density,
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
      };
    this.uom.fuelDepth = {...this.uom.length,
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
      };
    this.uom.fuelDiam = {...this.uom.length,
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
      };
    this.uom.fuelHeat = {...this.uom.specificInternalEnergy,
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
      };
    this.uom.fuelLoad = {...this.uom.load,
        config: {
          base: ['lb/ft2', 4],
          imperial: ['ton/ac', 2],
          metric: ['tonne/ha', 2],
        },
        display: {
          units: 'lb/ft2',
          decimals: 4,
        },
        validate: {
          minVal: 0,
          maxVal: 10,
        },
      };
    this.uom.fuelMois = {...this.uom.ratio,
        config: {
          base: ['ratio', 2],
          ratio: ['ratio', 0],
          percent: ['%', 0],
        },
        display: {
          units: 'ratio',
          decimals: 2,
        },
        validate: {
          minVal: 0.01,
          maxVal: 5,
        },
      };
    this.uom.fuelSavr = {
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
      };
    this.uom.fuelSeff = {...this.uom.fraction,
        display: {
          units: 'fraction',
          decimals: 2,
        },
        validate: {
          minVal: 0,
          maxVal: 0.05,
        },
      };
    this.uom.fuelSink = {
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
      };
    this.uom.fuelStot = {...this.uom.fraction,
        display: {
          units: 'fraction',
          decimals: 2,
        },
        validate: {
          minVal: 0,
          maxVal: 0.1,
        },
      };
    this.uom.fuelVolm = {...this.uom.volume,
      config: {
        base: ['ft3', 4],
        imperial: ['ft3', 4],
        metric: ['m3', 4],
      },
      display: {
        units: 'ft3',
        decimals: 4,
      },
    };
    this.uom.mapArea = {...this.uom.area,
        config: {
          base: ['ft2', 6],
          imperial: ['in2', 2],
          metric: ['cm2', 2],
        },
        display: {
          units: 'ft2',
          decimals: 0,
        },
      };
    this.uom.mapDistance = {...this.uom.length,
        config: {
          base: ['ft', 2],
          imperial: ['ft', 2],
          metric: ['m', 2],
        },
        display: {
          units: 'ft',
          decimals: 2,
        },
     };
    this.uom.slopeSteepness = {
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
          ratio: ['ratio', 0],
          percent: ['%', 0],
        },
        display: {
          units: 'ratio',
          decimals: 2,
        },
        validate: {
          minVal: 0,
          maxVal: 60, // about 89.04 deg
        },
      };
    this.uom.timeMin = {...this.uom.time,
      config: {
        base: ['min', 0],
        sec: ['sec', 0],
        min: ['min', 0],
        h: ['h', 0],
      },
      display: {
        units: 'min',
        decimals: 2,
      },
    };
    this.uom.treeHt = {...this.uom.length,
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
      };
    this.uom.windSpeed = {...this.uom.velocity,
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
      };
  }
};

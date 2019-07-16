/**
 * @file Defines the DAG Units class.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

export default class DagUnits {
  constructor(unitDefs) {
    // See NIST Special Publication 1038, May 2006,
    // The International System of Units (SI) - Conversion Factors for General Use
    this.uom = {
      area: {
        units: {
          'ft2': {
            fromBase: (ft2) => ft2,
            intoBase: (ft2) => ft2,
          },
          'in2': {
            fromBase: (ft2) => ft2 * 144,
            intoBase: (in2) => in2 / 144,
          },
          'ac': {
            fromBase: (ft2) => ft2 / 43560,
            intoBase: (ac) =>   ac * 43560,
          },
          'm2': {
            fromBase: (ft2) => ft2 * 0.09290304,
            intoBase: (m2) =>   m2 / 0.09290304,
          },
          'cm2': {
            fromBase: (ft2) => ft2 * (0.09290304 * 100 * 100),
            intoBase: (cm2) => cm2 / (0.09290304 * 100 * 100),
          },
          'ha': {
            fromBase: (ft2) => ft2 * (0.09290304 * 0.01 * 0.01),
            intoBase: (ha) =>   ha / (0.09290304 * 0.01 * 0.01),
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
      azimuth: {
        units: {
          'deg' : {
            fromBase: (deg) => deg,
            intoBase: (deg) => deg,
          },
        },
        config: {
          base: ['deg', 0],
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
      count: {
        units: {
          ' ': {
            fromBase: (n) => n,
            intoBase: (n) => n,
          },
        },
        config: {
          base: [' ', 0],
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
      density: {
        units: {
          'lb/ft3' : {
            fromBase: (pf3) => pf3,
            intoBase: (pf3) => pf3,
          },
          'kg/m3' : {
            fromBase: (pf3) =>   pf3 * 16.01846,
            intoBase: (kgm3) => kgm3 / 16.01846,
          },
        },
        config: {
          base: ['lb/ft3', 2],
          imperial: ['lb/ft3', 2],
          metric: ['kg/m3', 2],
        },
        display: {
          units: 'lb/ft3',
          decimals: 2,
        },
        validate: {
          minVal: 0,
        },
      },
      energy: {
        units: {
          'btu' : { //International Table BTU, adopted in 1956
            fromBase: (btu) => btu ,
            intoBase: (btu) => btu,
          },
          'kJ': {
            fromBase: (btu) => btu * 1.055056,
            intoBase: (kJ) =>   kJ / 1.055056,
          },
        },
        config: {
          base: ['btu', 0],
          imperial: ['btu', 0],
          metric: ['kJ', 0],
        },
        display: {
          units: 'btu',
          decimals: 0,
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
        },
        display: {
          units: 'dl',
          decimals: 2,
        },
        validate: {
        },
      },
      // ratios within the range [0..1]
      fraction: {
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
          ratio: ['fraction', 0],
          percent: ['%', 0],
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
      length: {
        units: {
          'ft' : {
            fromBase: (ft) => ft,
            intoBase: (ft) => ft,
          },
          'in' : {
            fromBase: (ft) =>     ft * 12,
            intoBase: (inch) => inch / 12,
          },
          'yd' : {
            fromBase: (ft) => ft / 3,
            intoBase: (yd) => yd * 3,
          },
          'fa' : {
            fromBase: (ft) => ft / 6,
            intoBase: (fa) => fa * 6,
          },
          'ch' : {
            fromBase: (ft) => ft / 66,
            intoBase: (ch) => ch * 66,
          },
          'mi' : {
            fromBase: (ft) => ft / 5280,
            intoBase: (mi) => mi * 5280,
          },
          'm' : {
            fromBase: (ft) => ft * 0.3048,
            intoBase: (m) =>   m / 0.3048,
          },
          'cm' : {
            fromBase: (ft) => ft * 30.48,
            intoBase: (cm) => cm / 30.48,
          },
          'mm' : {
            fromBase: (ft) => ft * 304.8,
            intoBase: (cm) => cm / 304.8,
          },
          'km' : {
            fromBase: (ft) => ft * 0.0003048,
            intoBase: (km) => km / 0.0003048,
          },
        },
        config: {
          base: ['ft', 2],
          imperial: ['ft', 2],
          metric: ['m', 2],
          survey: ['ch', 2],
        },
        display: {
          units: 'ft',
          decimals: 2,
        },
        validate: {
          minVal: 0,
        },
      },
      load: {
        units: {
          'lb/ft2' : {
            fromBase: (pft2) => pft2,
            intoBase: (pft2) => pft2,
          },
          'kg/m2' : {
            fromBase: (pft2) => pft2,
            intoBase: (kgm2) => kgm2,
          },
          'ton/ac' : {
            fromBase: (pft2) => pft2 * 21.78,
            intoBase: (tpa) =>   tpa / 21.78,
          },
          'tonne/ha' : {
            fromBase: (pft2) => pft2 * 48.8243,
            intoBase: (tha) =>   tha / 48.8243,
          },
        },
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
      },
      mass: {
        units: {
          'lb': {
            fromBase: (lb) => lb,
            intoBase: (lb) => lb,
          },
          'ton-short': {
            fromBase: (lb) => lb * 2000,
            intoBase: (ts) => ts / 2000,
          },
          'ton-long': {
            fromBase: (lb) => lb * 2240,
            intoBase: (tl) => tl / 2240,
          },
          'kg': {
            fromBase: (lb) => lb * 0.45359237,
            intoBase: (kg) => kg / 0.45359237,
          },
          'ton-metric': {
            fromBase: (lb) => lb * (0.45359237 * 0.001),
            intoBase: (tm) => tm / (0.45359237 * 0.001),
          },
        },
        config: {
          base: ['lb', 4],
          imperial: ['lb', 4],
          metric: ['ton-metric', 4],
        },
        display: {
          units: 'ft3',
          decimals: 4,
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
          fraction: ['ratio', 0],
          percent: ['%', 0],
        },
        display: {
          units: 'ratio',
          decimals: 2,
        },
        validate: {
        },
      },
      specificInternalEnergy: {
        units: {
          'btu/lb': {
            fromBase: (bpp) => bpp,
            intoBase: (bpp) => bpp,
          },
          'kJ/kg' : {
            fromBase: (bpp) =>   bpp * 2.326,
            intoBase: (kJkg) => kJkg / 2.326,
          }
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
          minVal: 0,
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
      time: {
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
          'wk': {
            fromBase: (min) => min / (3600 * 24 * 7),
            intoBase: (wk) =>   wk * (3600 * 24 * 7),
          },
          'y': {
            fromBase: (min) => min / (3600 * 24 * 365),
            intoBase: (y) =>     y * (3600 * 24 * 365),
          },
        },
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
        validate: {
          minVal: 0,
        },
      },
      velocity: {
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
          'ch/h' : {
            fromBase: (fpm) => fpm / 1.1,
            intoBase: (cph) => cph * 1.1,
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
          survey: ['ch/h', 2],
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
      volume: {
        units: {
          'ft3': {
            fromBase: (ft3) => ft3,
            intoBase: (ft3) => ft3,
          },
          'in3': {
            fromBase: (ft3) => ft3 * 1728,
            intoBase: (in3) => in3 / 1728,
          },
          'm3': {
            fromBase: (ft3) => ft3 * 0.02831685,
            intoBase: (m3) =>   m3 / 0.02831685,
          },
          'l': {
            fromBase: (ft3) => ft3 * 28.31685,
            intoBase: (m3) =>   m3 / 28.31685,
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
    };
  }

  /**
   *  Applies one ore more units configurations to the units set.
   * Applies one or more `configs` units and decimals configurations
   * as the display attributes to all quantities with the `cfg`
   * as a property of its this.uom.config object
   * Examples:
   *  applyDisplay('base');
   *  applyDisplay('imperial', 'ratio');
   *  applyDisplay('imperial', 'percent', 'survey');
   *  applyDisplay('metric', 'percent');
   *
   * @param {*} configs An array or single configuration tag.
   */

  applyDisplay(configs) {
    const cfgs = (Array.isArray(configs)) ? configs : [configs];
    cfgs.forEach((cfg) => {
      Object.keys(this.uom).forEach((key, idx) => {
        let u = this.uom[key];
        if (u.config[cfg]!==undefined) {
          u.display.units = u.config[cfg][0];
          u.display.decimals = u.config[cfg][1];
        }
      });
    });
  }

  // Returns base units default decimal digits for `quantity`
  baseDecimals(quantity) {
    return this.uom[quantity].config.base[1];
  }

  // Returns the formatted display value of `baseValue` for `quantity`
  baseValueToDisplayValue(quantity, baseValue) {
    return this.uom[quantity].units[this.displayUnits(quantity)]
      .fromBase(baseValue)
      .toFixed(this.displayDecimals(quantity));
  }

  // Returns base units name for `quantity`
  baseUnits(quantity) {
    return this.uom[quantity].config.base[0];
  }

  // Returns current display decimal digits for `quantity`
  displayDecimals(quantity) {
    return this.uom[quantity].display.decimals;
  }

  // Returns current display units name for `quantity`
  displayUnits(quantity) {
    return this.uom[quantity].display.units;
  }

  // Returns the unformatted base value of `displayValue` for `quantity`
  displayValueToBaseValue(quantity, displayValue) {
    return this.uom[quantity].units[this.displayUnits(quantity)]
      .intoBase(displayValue);
  }

  hasUnits(quantity) {
    return this.uom.hasOwnProperty(quantity);
  }

  // Returns null if valid, [errorMsg, badValue] on error
  validateBaseValue(quantity, baseValue) {
    const validate = this.uom[quantity].validate;
    if (validate.hasOwnProperty('minVal')) {
      if (baseValue < validate.minVal) {
        return ['VALUE_LESS_THAN_MINIMUM', [validate.minVal]];
      }
    }
    if (validate.hasOwnProperty('maxVal')) {
      if (baseValue > validate.maxVal) {
        return ['VALUE_GREATER_THAN_MAXIMUM', [validate.maxVal]];
      }
    }
    return null;
  }

  // Returns null if valid, [errorMsg, [badValues]] on error
  validateDisplayValue(quantity, displayValue) {
    const baseValue = this.displayValueToBaseValue(quantity, displayValue);
    const result = this.validateBaseValue(quantity, baseValue);
    if (result!==null) {
      const parms=[];
      result[1].forEach((parm) => {
        parms.push(this.baseValueToDisplayValue(quantity,parm));
      });
      result[1] = parms;
    }
    return result;
  }

  // Returns null on success, max bound on error
  validMax(quantity) {
    return this.uom[quantity].validate.hasOwnProperty('maxVal')
      ? this.uom[quantity].validate.maxVal : null;
  }

  // Returns null on success, min bound on error
  validMin(quantity) {
    return this.uom[quantity].validate.hasOwnProperty('minVal')
      ? this.uom[quantity].validate.minVal : null;
  }
}
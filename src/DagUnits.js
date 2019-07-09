/**
 * @file Defines the DAG Units class.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

export default class DagUnits {
  constructor(unitDefs) {
    this.uom = {
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
    };
  }

  // Applies 'base' units and decimals to all quantities
  applyBase() {
    this.applyConfig('base');
  }

  // Applies 'imperial' units and decimals to all quantities
  applyImperial() {
    this.applyConfig('imperial');
  }

  // Applies 'metric' units and decimals to all quantities
  applyMetric() {
    this.applyConfig('metric');
  }

  // Applies `cfg` units and decimals configuration to all quantities
  // where `cfg` is a property of all this.uom.config objects
  applyConfig(cfg) {
    Object.keys(this.uom).forEach((key) => {
      let u = this.uom[key];
      u.display.units = u.config[cfg][0];
      u.display.decimals = u.config[cfg][1];
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

  validMax(quantity) {
    return this.uom[quantity].validate.hasOwnProperty('maxVal')
      ? this.uom[quantity].validate.maxVal : null;
  }

  validMin(quantity) {
    return this.uom[quantity].validate.hasOwnProperty('minVal')
      ? this.uom[quantity].validate.minVal : null;
  }

}
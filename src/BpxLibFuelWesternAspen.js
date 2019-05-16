/**
 * @file Class of static BehavePlus Explorer western aspen dynamic fuel model equations
 * as described by Brown and Simmerman (1986) and implemented by BehavePlus V6.
 * @copyright Systems for Environmentl Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

const BpxLibFuelWesternAspenTable = {
  aspenShrub: {
    depth: 0.65,
    dead1Load: [0.800, 0.893, 1.056, 1.218, 1.379, 1.4595],
    dead1Savr: [1440.0, 1620.0, 1910.0, 2090.0, 2220.0, 2285.0],
    dead10Load: 0.975,
    liveHerbLoad: [0.335, 0.234, 0.167, 0.100, 0.033, 0.000],
    liveStemLoad: [0.403, 0.403, 0.333, 0.283, 0.277, 0.274],
    liveStemSavr: [2440.0, 2440.0, 2310.0, 2090.0, 1670.0, 1670.0],
  },
  aspenTallForb: {
    depth: 0.30,
    dead1Load: [0.738, 0.930, 1.056, 1.183, 1.309, 1.3720],
    dead1Savr: [1480.0, 1890.0, 2050.0, 2160.0, 2240.0, 2280.0],
    dead10Load: 0.475,
    liveHerbLoad: [0.665, 0.465, 0.332, 0.199, 0.067, 0.000],
    liveStemLoad: [0.000, 0.000, 0.000, 0.000, 0.000, 0.000],
    liveStemSavr: [2440.0, 2440.0, 2440.0, 2440.0, 2440.0, 2440.0],
  },
  aspenLowForb: {
    depth: 0.18,
    dead1Load: [0.601, 0.645, 0.671, 0.699, 0.730, 0.7455],
    dead1Savr: [1400.0, 1540.0, 1620.0, 1690.0, 1750.0, 1780.0],
    dead10Load: 1.035,
    liveHerbLoad: [0.150, 0.105, 0.075, 0.045, 0.015, 0.000],
    liveStemLoad: [0.000, 0.000, 0.000, 0.000, 0.000, 0.000],
    liveStemSavr: [2440.0, 2440.0, 2440.0, 2440.0, 2440.0, 2440.0],
  },
  mixedShrub: {
    depth: 0.50,
    dead1Load: [0.880, 0.906, 1.037, 1.167, 1.300, 1.3665],
    dead1Savr: [1350.0, 1420.0, 1710.0, 1910.0, 2060.0, 2135.0],
    dead10Load: 1.340,
    liveHerbLoad: [0.100, 0.070, 0.050, 0.030, 0.010, 0.000],
    liveStemLoad: [0.455, 0.455, 0.364, 0.290, 0.261, 0.2465],
    liveStemSavr: [2530.0, 2530.0, 2410.0, 2210.0, 1800.0, 1800.0],
  },
  mixedForb: {
    depth: 0.18,
    dead1Load: [0.754, 0.797, 0.825, 0.854, 0.884, 0.8990],
    dead1LoadDEPRECATED: [0.754, 0.797, 0.825, 1.167, 0.884, 0.8990],
    dead1Savr: [1420.0, 1540.0, 1610.0, 1670.0, 1720.0, 1745.0],
    dead10Load: 1.115,
    liveHerbLoad: [0.150, 0.105, 0.075, 0.045, 0.015, 0.000],
    liveStemLoad: [0.000, 0.000, 0.000, 0.000, 0.000, 0.000],
    liveStemSavr: [2440.0, 2440.0, 2440.0, 2440.0, 2440.0, 2440.0],
  },
};

class BpxLibFuelWesternAspen {
  static interpolate(curingLevel, valueAtLevel) {
    const Curing = [0.0, 0.3, 0.5, 0.7, 0.9, 1.000000001];
    const cl = Math.min(Math.max(curingLevel, 0.0), 1.0);
    let fraction = 0.0;
    for (let idx = 1; idx <= 4; idx += 1) {
      if (cl < Curing[idx]) {
        fraction = 1.0 - (Curing[idx] - cl) / (Curing[idx] - Curing[idx - 1]);
        return valueAtLevel[idx - 1] + fraction * (valueAtLevel[idx] - valueAtLevel[idx - 1]);
      }
    }
    return valueAtLevel[5];
  }

  static aspenTypes() {
    return Object.keys(BpxLibFuelWesternAspenTable);
  }

  static domain() {
    return 'westernAspen';
  }

  static deadMext() {
    return 0.25;
  }

  static has(fuelType) {
    return Object.keys(BpxLibFuelWesternAspenTable).includes(fuelType);
  }

  static depth(fuelType) {
    return BpxLibFuelWesternAspen.has(fuelType)
      ? BpxLibFuelWesternAspenTable[fuelType].depth
      : 0.01;
  }

  static deadFineLoad(fuelType, curingLevel) {
    return (BpxLibFuelWesternAspen.has(fuelType))
      ? 2000 / 43560 * BpxLibFuelWesternAspen.interpolate(
        curingLevel, BpxLibFuelWesternAspenTable[fuelType].dead1Load,
      )
      : 0;
  }

  static deadFineSavr(fuelType, curingLevel) {
    return (BpxLibFuelWesternAspen.has(fuelType))
      ? BpxLibFuelWesternAspen.interpolate(curingLevel,
        BpxLibFuelWesternAspenTable[fuelType].dead1Savr)
      : 1;
  }

  static deadSmallLoad(fuelType) {
    return BpxLibFuelWesternAspen.has(fuelType)
      ? 2000 / 43560 * BpxLibFuelWesternAspenTable[fuelType].dead10Load
      : 0;
  }

  // Live herb
  static liveHerbLoad(fuelType, curingLevel) {
    return (BpxLibFuelWesternAspen.has(fuelType))
      ? 2000 / 43560 * BpxLibFuelWesternAspen.interpolate(
        curingLevel, BpxLibFuelWesternAspenTable[fuelType].liveHerbLoad,
      )
      : 0;
  }

  // Live stem
  static liveStemLoad(fuelType, curingLevel) {
    return (BpxLibFuelWesternAspen.has(fuelType))
      ? 2000 / 43560 * BpxLibFuelWesternAspen.interpolate(
        curingLevel, BpxLibFuelWesternAspenTable[fuelType].liveStemLoad,
      )
      : 0;
  }

  static liveStemSavr(fuelType, curingLevel) {
    return (BpxLibFuelWesternAspen.has(fuelType))
      ? BpxLibFuelWesternAspen.interpolate(curingLevel,
        BpxLibFuelWesternAspenTable[fuelType].liveStemSavr)
      : 1;
  }
}

export default BpxLibFuelWesternAspen;

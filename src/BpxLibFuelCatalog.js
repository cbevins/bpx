/**
 * @file Class of static BehavePlus Explorer Fuel Catalog accessors.
 * @copyright Systems for Environmentl Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */
const tpa = 2000.0 / 43560.0;

const BpxLibFuelRecord = {
  10: {
    domain: 'behave',
    label: 'Timber litter and understory',
    depth: 1.0,
    deadMext: 0.25,
    dead1Load: 0.138,
    dead10Load: 0.092,
    dead100Load: 0.230,
    totalHerbLoad: 0.0,
    liveStemLoad: 0.092,
    dead1Savr: 2000.0,
    liveHerbSavr: 1500.0,
    liveStemSavr: 1500.0,
    deadHeat: 8000.0,
    liveHeat: 8000.0,
  },
  124: {
    domain: 'behave',
    label: 'High load, humid climate grass-shrub',
    depth: 2.1,
    deadMext: 0.40,
    dead1Load: tpa * 1.9,
    dead10Load: tpa * 0.3,
    dead100Load: tpa * 0.1,
    totalHerbLoad: tpa * 3.4,
    liveStemLoad: tpa * 7.1,
    dead1Savr: 1800.0,
    liveHerbSavr: 1600.0,
    liveStemSavr: 1600.0,
    deadHeat: 8000.0,
    liveHeat: 8000.0,
  },
  chamise6: {
    domain: 'chaparral',
    label: '6-ft chamise 50%',
    depth: 6.0,
    totalLoad: 2.0,
    deadFraction: 0.75,
    fuelType: 'chamise',
  },
  pg6: {
    domain: 'palmettoGallberry',
    label: '6-ft pg',
    age: 10.0,
    basal: 30.0,
    cover: 70.0,
    height: 6.0,
  },
  aspenShrub50: {
    domain: 'westernAspen',
    label: 'Aspen-shrub 50%',
    curingLevel: 0.50,
    fuelType: 'aspenShrub',
  },
}; // fuel

class BpxLibFuelCatalog {
  static domain(key) {
    return BpxLibFuelRecord[key].domain;
  }

  static ensureKey(key) {
    if (!BpxLibFuelCatalog.hasKey(key)) {
      throw new Error(`Fuel catalog does not have key '${key}'`);
    }
  }

  static hasKey(key) {
    return Object.prototype.hasOwnProperty.call(
      BpxLibFuelRecord, key,
    );
  }

  static label(key) {
    return BpxLibFuelRecord[key].label;
  }

  static behaveDead1Load(key) {
    return (BpxLibFuelRecord[key].domain === 'behave')
      ? BpxLibFuelRecord[key].dead1Load : 0.0;
  }

  static behaveDead1Savr(key) {
    return (BpxLibFuelRecord[key].domain === 'behave')
      ? BpxLibFuelRecord[key].dead1Savr : 1.0;
  }

  static behaveDead10Load(key) {
    return (BpxLibFuelRecord[key].domain === 'behave')
      ? BpxLibFuelRecord[key].dead10Load : 0.0;
  }

  static behaveDead100Load(key) {
    return (BpxLibFuelRecord[key].domain === 'behave')
      ? BpxLibFuelRecord[key].dead100Load : 0.0;
  }

  static behaveDeadHeat(key) {
    return (BpxLibFuelRecord[key].domain === 'behave')
      ? BpxLibFuelRecord[key].deadHeat : 0.0;
  }

  static behaveDeadMext(key) {
    return (BpxLibFuelRecord[key].domain === 'behave')
      ? BpxLibFuelRecord[key].deadMext : 0.01;
  }

  static behaveDepth(key) {
    return (BpxLibFuelRecord[key].domain === 'behave')
      ? BpxLibFuelRecord[key].depth : 0.01;
  }

  static behaveLiveHeat(key) {
    return (BpxLibFuelRecord[key].domain === 'behave')
      ? BpxLibFuelRecord[key].liveHeat : 0.0;
  }

  static behaveLiveHerbSavr(key) {
    return (BpxLibFuelRecord[key].domain === 'behave')
      ? BpxLibFuelRecord[key].liveHerbSavr : 1.0;
  }

  static behaveLiveStemLoad(key) {
    return (BpxLibFuelRecord[key].domain === 'behave')
      ? BpxLibFuelRecord[key].liveStemLoad : 0.0;
  }

  static behaveLiveStemSavr(key) {
    return (BpxLibFuelRecord[key].domain === 'behave')
      ? BpxLibFuelRecord[key].liveStemSavr : 1.0;
  }

  static behaveTotalHerbLoad(key) {
    return (BpxLibFuelRecord[key].domain === 'behave')
      ? BpxLibFuelRecord[key].totalHerbLoad : 0.0;
  }

  static chaparralDeadFraction(key) {
    return (BpxLibFuelRecord[key].domain === 'chaparral')
      ? BpxLibFuelRecord[key].deadFraction : 0.0;
  }

  static chaparralDepth(key) {
    return (BpxLibFuelRecord[key].domain === 'chaparral')
      ? BpxLibFuelRecord[key].depth : 0.01;
  }

  static chaparralFuelType(key) {
    return (BpxLibFuelRecord[key].domain === 'chaparral')
      ? BpxLibFuelRecord[key].fuelType : 'none';
  }

  static chaparralTotalLoad(key) {
    return (BpxLibFuelRecord[key].domain === 'chaparral')
      ? BpxLibFuelRecord[key].totalLoad : 0.0;
  }

  static pgAge(key) {
    return (BpxLibFuelRecord[key].domain === 'palmettoGallberry')
      ? BpxLibFuelRecord[key].age : 0.0;
  }

  static pgBasalArea(key) {
    return (BpxLibFuelRecord[key].domain === 'palmettoGallberry')
      ? BpxLibFuelRecord[key].basalArea : 0.0;
  }

  static pgCover(key) {
    return (BpxLibFuelRecord[key].domain === 'palmettoGallberry')
      ? BpxLibFuelRecord[key].cover : 'none';
  }

  static pgHeight(key) {
    return (BpxLibFuelRecord[key].domain === 'palmettoGallberry')
      ? BpxLibFuelRecord[key].height : 0.0;
  }

  static westernAspenCuringLevel(key) {
    return (BpxLibFuelRecord[key].domain === 'westernAspen')
      ? BpxLibFuelRecord[key].curingLevel : 0.0;
  }

  static westernAspenFuelType(key) {
    return (BpxLibFuelRecord[key].domain === 'westernAspen')
      ? BpxLibFuelRecord[key].fuelType : 'none';
  }
}

export default BpxLibFuelCatalog;

/**
 * @file Class of static BehavePlus Explorer Fuel Catalog accessors.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import { BpxLibFuelRecord } from './BpxLibFuelCatalogData';

export default class BpxLibFuelCatalog {
  static domain(key) {
    BpxLibFuelCatalog.ensureKey(key)   ;
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

  static keys() {
    return Object.keys(BpxLibFuelRecord).sort();
  }

  static list() {
    return Object.keys(BpxLibFuelRecord).sort().map((key) =>
      [key, BpxLibFuelRecord[key].label]
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

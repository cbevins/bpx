/**
 * @file Defines the BehavePlus Explorer crown canopy model.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';
import DagLeafQuantity from './DagLeafQuantity';
import DagLeafBool from './DagLeafBool';
import BpxLibCanopy from './BpxLibCanopy';

export default class BpxTreeSiteCanopy extends DagBranch {
  constructor(parent, name) {
    super(parent, name);

    new DagLeafQuantity(this, 'bulkDensity')
      .desc('canopy bulk density')
      .units('bulkDensity').value(0);

    new DagLeafQuantity(this, 'cover')
      .desc('canopy aerial coverage')
      .units('fraction').value(0);

    new DagLeafQuantity(this, 'crownBase')
      .desc('canopy crown base height above the surface')
      .units('distanceFt').value(0);

    new DagLeafQuantity(this, 'crownFill')
      .desc('fraction of canopy volume filled by crown fuel')
      .units('fraction').value(0);

    new DagLeafQuantity(this, 'crownHeight')
      .desc('canopy crown top height above the surfface')
      .units('distanceFt').value(0);

    new DagLeafQuantity(this, 'crownLength')
      .desc('canopy crown length')
      .units('distanceFt').value(0);

    new DagLeafQuantity(this, 'crownRatio')
      .desc('canopy crown lengtrh-to-height ratio')
      .units('fraction').value(0);

    new DagLeafQuantity(this, 'foliarMoisture')
      .desc('canopy foliar moisture content')
      .units('fuelMois').value(5);

    new DagLeafQuantity(this, 'fuelHeat')
      .desc('canopy heat content')
      .units('fuelHeat').value(8000);

    new DagLeafQuantity(this, 'fuelLoad')
      .desc('canopy oven-dry fuel load')
      .units('fuelLoad').value(0);

    new DagLeafQuantity(this, 'heatPerUnitArea')
      .desc('canopy fuel heat per unit area')
      .units('fireHpua').value(0);

    new DagLeafBool(this, 'sheltersFuel')
      .desc('canopy crown shelters the fuel from wind')
      .value(false);

    new DagLeafQuantity(this, 'shelteredWaf')
      .desc('canopy sheltered midflame windspeed adjustment factor')
      .units('fraction').value(1);
  }

  connect( /*tree */) {
    this.bulkDensity.input();

    this.cover.input();

    this.crownBase.input();

    this.crownHeight.input();

    this.foliarMoisture.input();

    this.fuelHeat.fixed(8000);

    this.crownLength
      .calc(BpxLibCanopy.crownLength,
          this.crownBase,
          this.crownHeight);

    this.crownRatio
      .calc(BpxLibCanopy.crownRatio,
        this.crownLength,
        this.crownHeight);

    this.crownFill
      .calc(BpxLibCanopy.crownFill,
        this.cover,
        this.crownRatio);

    this.fuelLoad
      .calc(BpxLibCanopy.fuelLoad,
        this.bulkDensity,
        this.crownLength);

    this.heatPerUnitArea
      .calc(BpxLibCanopy.hpua,
        this.fuelLoad,
        this.fuelHeat);

    this.sheltersFuel
      .calc(BpxLibCanopy.sheltersFuel,
        this.cover,
        this.crownHeight,
        this.crownFill);

    this.shelteredWaf
      .calc(BpxLibCanopy.waf,
        this.cover,
        this.crownHeight,
        this.crownFill);
  }
}

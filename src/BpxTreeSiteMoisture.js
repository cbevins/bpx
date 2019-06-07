/**
 * @file Defines the BehavePlus Explorer fuel moisture tree and leafs.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';
import DagLeafQuantity from './DagLeafQuantity';

export class BpxTreeMoistureDead extends DagBranch {
  constructor(parent, name) {
    super(parent, name);

    new DagLeafQuantity(this, 'tl1h')
      .desc('site dead 1-h time-lag fuel moisture')
      .label('Fuel Moisture, Dead 1-h')
      .units('fuelMois').value(0.05);

    new DagLeafQuantity(this, 'tl10h')
      .desc('site dead 10-h time-lag fuel moisture')
      .label('Fuel Moisture, Dead 10-h')
      .units('fuelMois').value(0.07);

    new DagLeafQuantity(this, 'tl100h')
      .desc('site dead 100-h time-lag fuel moisture')
      .label('Fuel Moisture, Dead 100-h')
      .units('fuelMois').value(0.09);

    new DagLeafQuantity(this, 'category')
      .desc('site dead category fuel moisture')
      .label('Fuel Moisture, Dead Category')
      .units('fuelMois').value(0.05);
  }

  connect(tree) {
    const cfgMoisture = tree.configs.fuel.moisture;
    this.tl1h
      .bindIf(cfgMoisture, 'category', this.category)
      .input();

    this.tl10h
      .bindIf(cfgMoisture, 'category', this.category)
      .input();

    this.tl100h
      .bindIf(cfgMoisture, 'category', this.category)
      .input();

    this.category.input();
  }
}

export class BpxTreeMoistureLive extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    new DagLeafQuantity(this, 'herb')
      .desc('site live herbaceous fuel moisture')
      .label('Fuel Moisture, Live Herb')
      .units('fuelMois').value(0.5);

    new DagLeafQuantity(this, 'stem')
      .desc('site live stem wood fuel moisture')
      .label('Fuel Moisture, Live Stem')
      .units('fuelMois').value(1.5);

    new DagLeafQuantity(this, 'category')
      .desc('site live category fuel moisture')
      .label('Fuel Moisture, Live Category')
      .units('fuelMois').value(1.5);
  }

  connect(tree) {
    const cfgMoisture = tree.configs.fuel.moisture;
    this.herb
      .bindIf(cfgMoisture, 'category', this.category)
      .bindIf(cfgMoisture, 'liveCategory', this.category)
      .input();

    this.stem
      .bindIf(cfgMoisture, 'category', this.category)
      .bindIf(cfgMoisture, 'liveCategory', this.category)
      .input();

    this.category.input();
  }
}

export default class BpxTreeSiteMoisture extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    new BpxTreeMoistureDead(this, 'dead');
    new BpxTreeMoistureLive(this, 'live');
  }
}

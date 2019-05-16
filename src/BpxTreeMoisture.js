import Branch from './Branch';
import LeafQuantity from './LeafQuantity';

export class BpxTreeMoistureDead extends Branch {
  constructor(parent, name = 'dead') {
    super(parent, name);
    new LeafQuantity(this, 'tl1h')
      .desc('site dead 1-h time-lag fuel moisture')
      .units('fuelMois').value(5);
    new LeafQuantity(this, 'tl10h')
      .desc('site dead 10-h time-lag fuel moisture')
      .units('fuelMois').value(5);
    new LeafQuantity(this, 'tl100h')
      .desc('site dead 100-h time-lag fuel moisture')
      .units('fuelMois').value(5);
    new LeafQuantity(this, 'category')
      .desc('site dead category fuel moisture')
      .units('fuelMois').value(5);
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

export class BpxTreeMoistureLive extends Branch {
  constructor(parent, name = 'live') {
    super(parent, name);
    new LeafQuantity(this, 'herb')
      .desc('site live herbaceous fuel moisture')
      .units('fuelMois').value(5);
    new LeafQuantity(this, 'stem')
      .desc('site live stem wood fuel moisture')
      .units('fuelMois').value(5);
    new LeafQuantity(this, 'category')
      .desc('site live category fuel moisture')
      .units('fuelMois').value(5);
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

export class BpxTreeMoisture extends Branch {
  constructor(parent, name = 'moisture') {
    super(parent, name);
    new BpxTreeMoistureDead(this, 'dead');
    new BpxTreeMoistureLive(this, 'live');
  }
}

export default BpxTreeMoisture;

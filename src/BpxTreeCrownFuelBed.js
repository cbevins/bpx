import BpxTreeBaseFuelBed from './BpxTreeBaseFuelBed';

export default class BpxTreeCrownFuelBed extends BpxTreeBaseFuelBed {
  connect(tree) {
    BpxTreeBaseFuelBed.prototype.baseConnect.call(this, tree);
  }
}

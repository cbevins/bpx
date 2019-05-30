import BpxTreeBaseFuelBed from './BpxTreeBaseFuelBed';

export default class BpxTreeSurfaceFuelBed extends BpxTreeBaseFuelBed {
  connect(tree) {
    BpxTreeBaseFuelBed.prototype.baseConnect.call(this, tree);
  }
}

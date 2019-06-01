/**
 * @file Defines the BehavePlus Explorer crown fire surface subtree and leafs.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';
import DagLeafQuantity from './DagLeafQuantity';

export class BpxTreeCrownFireSurface extends DagBranch {
  constructor(parent, name) {
    super(parent, name);

    new DagLeafQuantity(this, 'firelineIntensity')
      .desc('surface fire fireline intensity')
      .units('fireFli').value(0);

    new DagLeafQuantity(this, 'heatPerUnitArea')
      .desc('surface fire heat per unit area')
      .units('fireHpua').value(0);

    new DagLeafQuantity(this, 'flameLength')
      .desc('surface fire flame length')
      .units('fireFlame').value(0);
  }
}

export default class BpxTreeCrownFireSurfaceLinked extends BpxTreeCrownFireSurface {
  constructor(parent, name) {
    super(parent, name);
  }

  connect( tree ) {
    const surface = tree.surface.fire.weighted;

    this.heatPerUnitArea
      .bind(surface.heatPerUnitArea);

    this.firelineIntensity
      .bind(surface.firelineIntensity);

    this.flameLength
      .bind(surface.flameLength);
  }
}

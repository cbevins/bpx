import AppDag from './AppDag';

/**
 * Defines the leafs that are available for selection.
 *
 * Each static function returns text to be displayed
 * for each category of leafs.
 */
export default class AppSelections {

  static surfacePrimary() {
    const dag = AppDag.getDag();
    const root = dag.tree.surface.fuel.primary;
    const prefix = 'Primary Surface Fuel ';
    return {
      title: prefix + 'Fire Behavior',
      // An array of [leaf, label] pairs
      leafs: [
        [root.fire.ros, prefix+'Fire Spread Rate'],
        [root.fire.firelineIntensity, prefix+'Fireline Intensity'],
        [root.fire.flameLength, prefix+'Flame Length'],
      ],
    }
  }

  static surfaceSecondary() {
    const dag = AppDag.getDag();
    const root = dag.tree.surface.fuel.secondary;
    const prefix = 'Secondary Surface Fuel ';
    return {
      title: prefix + 'Fire Behavior',
      leafs: [
        [root.fire.ros, prefix+'Fire Spread Rate'],
        [root.fire.firelineIntensity, prefix+'Fireline Intensity'],
        [root.fire.flameLength, prefix+'Flame Length'],
      ],
    }
  }

  static surfaceEllipse() {
    const dag = AppDag.getDag();
    const root = dag.tree.surface.fire.ellipse;
    const prefix = 'Surface Fire Ellipse ';
    return {
      title: prefix + 'Size and Shape',
      leafs: [
        [root.axis.lengthToWidthRatio, prefix+'Length-to-Width Ratio'],
        [root.size.area, prefix+'Area'],
        [root.size.perimeter, prefix+'Perimeter'],
      ],
    }
  }

  static all() {
    return [
      AppSelections.surfacePrimary(),
      AppSelections.surfaceSecondary(),
      AppSelections.surfaceEllipse(),
    ];
  }
}

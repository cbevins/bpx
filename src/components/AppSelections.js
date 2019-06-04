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
    return {
      title: 'Primary Surface Fuel and Fire Behavior',
      leafs: [
        [root.fire.ros, 'Maximum Fire Spread Rate'],
        [root.fire.firelineIntensity, 'Maximum Fireline Intensity'],
        [root.fire.flameLength, 'Maximum Flame Length'],
      ],
    }
  }

  static surfaceSecondary() {
    const dag = AppDag.getDag();
    const root = dag.tree.surface.fuel.secondary;
    return {
      title: 'Secondary Surface Fuel and Fire Behavior',
      leafs: [
        [root.fire.ros, 'Maximum Fire Spread Rate'],
        [root.fire.firelineIntensity, 'Maximum Fireline Intensity'],
        [root.fire.flameLength, 'Maximum Flame Length'],
      ],
    }
  }

  static surfaceEllipse() {
    const dag = AppDag.getDag();
    const root = dag.tree.surface.fire.ellipse;
    return {
      title: 'Surface Fire Ellipse Size and Shape',
      leafs: [
        [root.axis.lengthToWidthRatio, 'Length-to-Width Ratio'],
        [root.size.area, 'Area'],
        [root.size.perimeter, 'Perimeter'],
        [root.head.ros, 'Spread Rate at Head'],
        [root.back.ros, 'Spread Rate at Back'],
        [root.flank.ros, 'Spread Rate at Flank'],
        [root.beta.ros, 'Spread Rate at Beta'],
        [root.beta5.ros, 'Spread Rate at Beta (BP5)'],
        [root.psi.ros, 'Spread Rate at Psi'],
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

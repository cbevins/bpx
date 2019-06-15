import AppDag from './AppDag';

/**
 * Defines the leafs that are available for selection.
 *
 * Each static function returns text to be displayed
 * for each category of leafs.
 */
export default class AppSelections {

  static surfaceEllipseSize() {
    const dag = AppDag.getDag();
    const root = dag.tree.surface.fire.ellipse;
    return {
      title: 'Surface Fire Ellipse Size and Shape',
      leafs: [
        [root.size.area, 'Area'],
        [root.size.perimeter, 'Perimeter'],
        [root.size.length, 'Length'],
        [root.size.width, 'Width'],
        [root.axis.lengthToWidthRatio, 'Length-to-Width Ratio'],
      ],
    }
  }

  static surfaceEllipseHead() {
    const dag = AppDag.getDag();
    const root = dag.tree.surface.fire.ellipse;
    return {
      title: 'Surface Fire Ellipse Behavior at Head',
      leafs: [
        [root.head.ros, 'Spread Rate at Head'],
        [root.head.firelineIntensity, 'Fireline Intensity at Head'],
        [root.head.flameLength, 'Flame Length at Head'],
        [root.head.scorchHt, 'Scorch Height at Head'],
        [root.head.distance, 'Spread Distance at Head'],
        [root.head.mapDistance, 'Map Spread Distance at Head'],
      ]
    };
  }

  static surfaceEllipseBack() {
    const dag = AppDag.getDag();
    const root = dag.tree.surface.fire.ellipse;
    return {
      title: 'Surface Fire Ellipse Behavior at Back',
      leafs: [
        [root.back.ros, 'Spread Rate at Head'],
        [root.back.firelineIntensity, 'Fireline Intensity at Head'],
        [root.back.flameLength, 'Flame Length at Head'],
        [root.back.scorchHt, 'Scorch Height at Head'],
        [root.back.distance, 'Spread Distance at Head'],
        [root.back.mapDistance, 'Map Spread Distance at Head'],
      ],
    }
  }

  static surfaceEllipseFlank() {
    const dag = AppDag.getDag();
    const root = dag.tree.surface.fire.ellipse;
    return {
      title: 'Surface Fire Ellipse Behavior at Flank',
      leafs: [

        [root.flank.ros, 'Spread Rate at Head'],
        [root.flank.firelineIntensity, 'Fireline Intensity at Head'],
        [root.flank.flameLength, 'Flame Length at Head'],
        [root.flank.scorchHt, 'Scorch Height at Head'],
        [root.flank.distance, 'Spread Distance at Head'],
        [root.flank.mapDistance, 'Map Spread Distance at Head'],
      ],
    }
  }

  static surfaceEllipseBeta() {
    const dag = AppDag.getDag();
    const root = dag.tree.surface.fire.ellipse;
    return {
      title: 'Surface Fire Ellipse Behavior at Vector from Ignition Point',
      leafs: [
        [root.beta.ros, 'Spread Rate at Vector from Ignition Point'],
        [root.beta.firelineIntensity, 'Fireline Intensity at Vector from Ignition Point'],
        [root.beta.flameLength, 'Flame Length at Vector from Ignition Point'],
        [root.beta.scorchHt, 'Scorch Height at Vector from Ignition Point'],
        [root.beta.distance, 'Spread Distance at Vector from Ignition Point'],
        [root.beta.mapDistance, 'Map Spread Distance at Vector from Ignition Point'],
      ],
    }
  }

  static surfaceEllipseBeta5() {
    const dag = AppDag.getDag();
    const root = dag.tree.surface.fire.ellipse;
    return {
      title: 'Surface Fire Ellipse Behavior at Vector from Ignition Point (V5)',
      leafs: [
        [root.beta5.firelineIntensity, 'Fireline Intensity at Vector from Ignition Point (V5)'],
        [root.beta5.flameLength, 'Flame Length at Vector from Ignition Point (V5)'],
        [root.beta5.scorchHt, 'Scorch Height at Vector from Ignition Point (V5)'],
      ],
    }
  }

  static surfaceEllipsePsi() {
    const dag = AppDag.getDag();
    const root = dag.tree.surface.fire.ellipse;
    return {
      title: 'Surface Fire Ellipse Behavior at Vector from Fire Perimeter',
      leafs: [
        [root.psi.ros, 'Spread Rate at Vector from Fire Perimeter'],
        [root.psi.firelineIntensity, 'Fireline Intensity at Vector from Fire Perimeter'],
        [root.psi.flameLength, 'Flame Length at Vector from Fire Perimeter'],
        [root.psi.scorchHt, 'Scorch Height at Vector from Fire Perimeter'],
        [root.psi.distance, 'Spread Distance at Vector from Fire Perimeter'],
        [root.psi.mapDistance, 'Map Spread Distance at Vector from Fire Perimeter'],
      ],
    }
  }

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

  static all() {
    return [
      AppSelections.surfaceEllipseHead(),
      AppSelections.surfaceEllipseSize(),
      AppSelections.surfaceEllipseBack(),
      AppSelections.surfaceEllipseFlank(),
      AppSelections.surfaceEllipseBeta(),
      AppSelections.surfaceEllipseBeta5(),
      AppSelections.surfaceEllipsePsi(),
      AppSelections.surfacePrimary(),
      AppSelections.surfaceSecondary(),
    ];
  }
}

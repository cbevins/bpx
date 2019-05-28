/**
 * @file Defines the BehavePlus Explorer Weighted Fire sub-tree.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins
 * @version 0.1.0
 */

import DagBranch from './DagBranch';
import DagLeafQuantity from './DagLeafQuantity';

import BpxLibCompass from './BpxLibCompass';
import BpxLibMath from './BpxLibMath';
import BpxLibFireEllipse from './BpxLibFireEllipse';
import BpxLibSurfaceFire from './BpxLibSurfaceFire';

export class TreeFireEllipseAxis extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    new DagLeafQuantity(this, 'eccentricity')
      .desc('fire ellipse eccentricity')
      .units('fireLwr').value(1);
    new DagLeafQuantity(this, 'lengthToWidthRatio')
      .desc('fire ellipse length-to-width ratio')
      .units('fireLwr').value(1);
    new DagLeafQuantity(this, 'major')
      .desc('spread rate along ellipse major (head + back) axis')
      .units('fireRos').value(0);
    new DagLeafQuantity(this, 'minor')
      .desc('spread rate along ellipse minor (head + back) axis')
      .units('fireRos').value(0);
    new DagLeafQuantity(this, 'f')
      .desc('spread rate at ellipse focal point F')
      .units('fireRos').value(0);
    new DagLeafQuantity(this, 'g')
      .desc('spread rate at ellipse focal point G')
      .units('fireRos').value(0);
    new DagLeafQuantity(this, 'h')
      .desc('spread rate at ellipse focal point H')
      .units('fireRos').value(0);
  }
}

class TreeFireEllipseAzimuth extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    new DagLeafQuantity(this, 'fromHead')
      .desc('azimuth from fire head')
      .units('azimuth').value(0);
    new DagLeafQuantity(this, 'fromNorth')
      .desc('azimuth from north')
      .units('azimuth').value(0);
    new DagLeafQuantity(this, 'fromUpslope')
      .desc('azimuth from upslope direction')
      .units('azimuth').value(0);
  }
}

export class TreeFireEllipseBehavior extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    new DagLeafQuantity(this, 'distance')
      .desc('maximum fire spread distance')
      .units('fireDistance').value(0);
    new DagLeafQuantity(this, 'firelineIntensity')
      .desc('maximum fireline intensity')
      .units('fireFli').value(0);
    new DagLeafQuantity(this, 'flameLength')
      .desc('maximum flame length')
      .units('fireFlame').value(0);
    new DagLeafQuantity(this, 'mapDistance')
      .desc('maximum fire spread distance')
      .units('mapDistance').value(0);
    new DagLeafQuantity(this, 'ros')
      .desc('maximum spread rate')
      .units('fireRos').value(0);
    new DagLeafQuantity(this, 'scorchHt')
      .desc('maximum scorch height')
      .units('fireScorch').value(0);
  }
}

export class TreeFireEllipseMap extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    new DagLeafQuantity(this, 'area')
      .desc('fire ellipse map area')
      .units('mapArea').value(0);
    new DagLeafQuantity(this, 'length')
      .desc('fire ellipse map length')
      .units('mapDistance').value(0);
    new DagLeafQuantity(this, 'perimeter')
      .desc('fire ellipse map perimeter')
      .units('mapDistance').value(0);
    new DagLeafQuantity(this, 'width')
      .desc('fire ellipse map width')
      .units('mapDistance').value(0);
  }
}

export class TreeFireEllipseSize extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    new DagLeafQuantity(this, 'area')
      .desc('fire ellipse area')
      .units('fireArea').value(0);
    new DagLeafQuantity(this, 'length')
      .desc('fire ellipse length')
      .units('fireDistance').value(0);
    new DagLeafQuantity(this, 'perimeter')
      .desc('fire ellipse perimeter')
      .units('fireDistance').value(0);
    new DagLeafQuantity(this, 'width')
      .desc('fire ellipse width')
      .units('fireDistance').value(0);
  }
}

export class TreeFireEllipse extends DagBranch {
  constructor(parent, name) {
    super(parent, name);

    new TreeFireEllipseAxis(this, 'axis');
    new TreeFireEllipseBehavior(this, 'back');
    new TreeFireEllipseBehavior(this, 'flank');
    new TreeFireEllipseBehavior(this, 'head');

    const psi = new TreeFireEllipseBehavior(this, 'psi');
    new TreeFireEllipseAzimuth(psi, 'azimuth');

    const beta = new TreeFireEllipseBehavior(this, 'beta');
    new TreeFireEllipseAzimuth(beta, 'azimuth');
    new DagLeafQuantity(beta, 'theta')
      .desc('angle from ellipse center that intersects the BETA vector at the ellipse perimeter')
      .units('azimuth').value(0);
    new DagLeafQuantity(beta, 'psi')
      .desc('the PSI vector that intersects the BETA vector at the ellipse perimeter')
      .units('azimuth').value(0);
    new DagLeafQuantity(beta, 'rosPsi')
      .desc('ellipse perimeter expansion rate at BETA.PSI vector intersection')
      .units('fireRos').value(0);

    const beta5 = new TreeFireEllipseBehavior(this, 'beta5');

    new TreeFireEllipseMap(this, 'map');
    new TreeFireEllipseSize(this, 'size');

    // These are linked to a fire, or else are stand-alone inputs
    new DagLeafQuantity(this, 'headingFromNorth')
      .desc('direction of maximum spread, degrees clockwise from north')
      .units('azimuth').value(0);
    new DagLeafQuantity(this, 'headingFromUpslope')
      .desc('direction of maximum spread, degrees clockwise from upslope')
      .units('azimuth').value(0);
    new DagLeafQuantity(this, 'midflameWindSpeed')
      .desc('wind speed at midflame height')
      .units('windSpeed').value(0);
  }
}

/**
 * Implements the BpxTreeFireEllipse
 * where fire ros and lwr are linked to BpxTreeFireWeighted.
 */
export default class BpxTreeFireEllipse extends TreeFireEllipse {
  connect(tree) {
    // Require just 1 configuration
    const cfgVector = tree.configs.fire.vector;

    // If LINKED to SURFACE
    // Requires 5 fire leafs: ros, firelineIntensity,
    // lengthToWidthRatio, headingFromUpslope, and midflameWindSpeed
    const link = tree.surface.fire.weighted;
    this.axis.lengthToWidthRatio
      .bind(link.lengthToWidthRatio);
    this.head.ros
      .bind(link.ros);
    this.head.firelineIntensity
      .bind(link.firelineIntensity);
    this.headingFromUpslope
      .bind(link.headingFromUpslope);
    this.midflameWindSpeed
      .bind(link.midflameWindSpeed);

    // If NOT linked to surface,
    if ( false ) {
      this.axis.lengthToWidthRatio.input();
      this.head.ros.input();
      this.head.firelineIntensity.input();
      this.headingFromUpslope.input();
      this.midflameWindSpeed.bind(tree.site.wind.speed.atMidflame);
    }

    // The remaining external leafs are not dependent on links
    // Map distances and areas require 1 map leaf: scale
    const map = tree.site.map;
    // *FromNorth azimuths require 1 slope leaf: direction.upslope
    const slope = tree.site.slope;
    // Schorch Heights require 1 temp leaf: air
    const temp = tree.site.temp;
    // Requires 1 time leaf: fire.sinceIgnition (for distances and sizes only)
    const time = tree.site.time;

    this.axis.eccentricity
      .calc(BpxLibFireEllipse.eccentricity,
        this.axis.lengthToWidthRatio);

    // Ros at vectors
    this.back.ros
      .calc(BpxLibFireEllipse.rosBack,
        this.head.ros,
        this.axis.eccentricity);

    this.axis.major
      .calc(BpxLibFireEllipse.rosMajor,
        this.head.ros,
        this.back.ros);

    this.axis.minor
      .calc(BpxLibFireEllipse.rosMinor,
        this.axis.major,
        this.axis.lengthToWidthRatio);

    this.flank.ros
      .calc(BpxLibFireEllipse.rosFlank,
        this.axis.minor);

    this.axis.f
      .calc(BpxLibFireEllipse.rosF,
        this.axis.major);

    this.axis.g
      .calc(BpxLibFireEllipse.rosG,
        this.axis.major,
        this.back.ros);

    this.axis.h
      .calc(BpxLibFireEllipse.rosH,
        this.axis.minor);

    this.beta.ros
      .calc(BpxLibFireEllipse.rosBeta,
        this.beta.azimuth.fromHead,
        this.head.ros,
        this.axis.eccentricity);

    this.beta5.ros
      .bind(this.beta.ros);

    this.psi.ros
      .calc(BpxLibFireEllipse.rosPsi,
        this.psi.azimuth.fromHead,
        this.axis.f,
        this.axis.g,
        this.axis.h);

    // Fire line intensity at vectors
    this.back.firelineIntensity
      .calc(BpxLibFireEllipse.fliAtAzimuth,
        this.head.firelineIntensity,
        this.head.ros,
        this.back.ros);

    this.flank.firelineIntensity
      .calc(BpxLibFireEllipse.fliAtAzimuth,
        this.head.firelineIntensity,
        this.head.ros,
        this.flank.ros);

    this.beta5.firelineIntensity
      .calc(BpxLibFireEllipse.fliAtAzimuth,
        this.head.firelineIntensity,
        this.head.ros,
        this.beta.ros);

    this.psi.firelineIntensity
      .calc(BpxLibFireEllipse.fliAtAzimuth,
        this.head.firelineIntensity,
        this.head.ros,
        this.psi.ros);

    // V6 uses the fire PERIMETER expansion rate
    // where BETA intersects the perimeter
    // to derive fireline intensity, which takes the following 4 steps:

    // Step 1 - determine Theta angle from ellipse center
    // that intersects the BETA vector at the fire perimeter
    this.beta.theta
      .calc(BpxLibFireEllipse.thetaFromBeta,
        this.beta.azimuth.fromHead,
        this.axis.f,
        this.axis.g,
        this.axis.h);

    // Step 2 - determine the PSI vector that intersects the BETA vector
    // at the fire perimeter
    this.beta.psi
      .calc(BpxLibFireEllipse.psiFromTheta,
        this.beta.theta,
        this.axis.f,
        this.axis.h);

    // Step 3 - determine the fire perimeter expansion rate
    // at BETA.PSI vector intersection
    this.beta.rosPsi
      .calc(BpxLibFireEllipse.rosPsi,
        this.beta.psi,
        this.axis.f,
        this.axis.g,
        this.axis.h);

    // Step 4 - V6 fireline intensity at BETA uses the
    // FIRE PERIMETER expansion rate at BETA
    this.beta.firelineIntensity
      .calc(BpxLibFireEllipse.fliAtAzimuth,
        this.head.firelineIntensity,
        this.head.ros,
        this.beta.rosPsi);

    // Flame length at vectors
    const vectors = [
      this.head,
      this.back,
      this.beta,
      this.beta5,
      this.flank,
      this.psi];
    vectors.forEach((vector) => {
      vector.distance
        .calc(BpxLibSurfaceFire.distance,
          vector.ros,
          time.fire.sinceIgnition);
      vector.flameLength
        .calc(BpxLibSurfaceFire.flameLength,
          vector.firelineIntensity);
      vector.mapDistance
        .calc(BpxLibMath.div,
          vector.distance,
          map.scale);
      vector.scorchHt
        .calc(BpxLibSurfaceFire.scorchHt,
          vector.firelineIntensity,
          this.midflameWindSpeed,
          temp.air);
    });

    this.size.length
      .calc(BpxLibSurfaceFire.distance,
        this.axis.major,
        time.fire.sinceIgnition);

    this.size.width
      .calc(BpxLibSurfaceFire.distance,
        this.axis.minor,
        time.fire.sinceIgnition);

    this.size.perimeter
      .calc(BpxLibFireEllipse.perimeter,
        this.size.length,
        this.size.width);

    this.size.area
      .calc(BpxLibFireEllipse.area,
        this.size.length,
        this.axis.lengthToWidthRatio);

    this.map.area
      .calc(BpxLibFireEllipse.mapArea,
        this.size.area,
        map.scale);

    this.map.length
      .calc(BpxLibMath.div,
        this.size.length,
        map.scale);

    this.map.width
      .calc(BpxLibMath.div,
        this.size.width,
        map.scale);

    this.map.perimeter
      .calc(BpxLibMath.div,
        this.size.perimeter,
        map.scale);

    // Fire vector azimuths
    /*
        Require = Input
        beta.hd = beta.hd
        beta.hd = beta.up - head.up
        beta.hd = beta.no - head.no

        beta.up = beta.hd + head.up
        beta.up = beta.up
        beta.up = beta.no - slope.no

        beta.no = beta.hd + head.no
        beta.no = beta.up + slope.no
        beta.no = beta.no
    */
    this.headingFromNorth
      .calc(BpxLibCompass.sum,
        slope.direction.upslope,
        this.headingFromUpslope);

    this.beta.azimuth.fromHead
      .inputIf(cfgVector, 'fromFireHead')
      .calcIf(cfgVector, 'fromUpslope',
        BpxLibCompass.diff,
          this.beta.azimuth.fromUpslope,
          this.headingFromUpslope)
      .calcIf(cfgVector, 'fromNorth',
        BpxLibCompass.diff,
          this.beta.azimuth.fromNorth,
          this.headingFromNorth);

    this.beta.azimuth.fromUpslope
      .inputIf(cfgVector, 'fromUpslope')
      .calcIf(cfgVector, 'fromFireHead',
        BpxLibCompass.sum,
          this.beta.azimuth.fromHead,
          this.headingFromUpslope)
      .calcIf(cfgVector, 'fromNorth',
        BpxLibCompass.diff,
          this.beta.azimuth.fromNorth,
          slope.direction.upslope);

    this.beta.azimuth.fromNorth
      .inputIf(cfgVector, 'fromNorth')
      .calcIf(cfgVector, 'fromFireHead',
        BpxLibCompass.sum,
          this.beta.azimuth.fromHead,
          this.headingFromNorth)
      .calcIf(cfgVector, 'fromUpslope',
        BpxLibCompass.sum,
          this.beta.azimuth.fromUpslope,
          slope.direction.upslope);

    this.psi.azimuth.fromHead
      .inputIf(cfgVector, 'fromFireHead')
      .calcIf(cfgVector, 'fromUpslope',
        BpxLibCompass.diff,
          this.psi.azimuth.fromUpslope,
          this.headingFromUpslope)
      .calcIf(cfgVector, 'fromNorth',
        BpxLibCompass.diff,
          this.psi.azimuth.fromNorth,
          this.headingFromNorth);

    this.psi.azimuth.fromUpslope
      .inputIf(cfgVector, 'fromUpslope')
      .calcIf(cfgVector, 'fromFireHead',
        BpxLibCompass.sum,
          this.psi.azimuth.fromHead,
          this.headingFromUpslope)
      .calcIf(cfgVector, 'fromNorth',
        BpxLibCompass.diff,
          this.psi.azimuth.fromNorth,
          slope.direction.upslope);

    this.psi.azimuth.fromNorth
      .inputIf(cfgVector, 'fromNorth')
      .calcIf(cfgVector, 'fromFireHead',
        BpxLibCompass.sum,
          this.psi.azimuth.fromHead,
          this.headingFromNorth)
      .calcIf(cfgVector, 'fromUpslope',
        BpxLibCompass.sum,
          this.psi.azimuth.fromUpslope,
          slope.direction.upslope);
    }
}

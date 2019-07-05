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

import {TreeFireVector} from './BpxTreeSiteFire';

/**
 * Defines the fire ellipse's axis (shape) leafs.
*/
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

/**
 * Defines the fire behavior leafs at a specific vector.
*/
export class TreeFireEllipseBehavior extends DagBranch {
  constructor(parent, name) {
    super(parent, name);

    new DagLeafQuantity(this, 'distance')
      .desc('fire spread vector maximum spread distance')
      .units('fireDistance').value(0);

    new DagLeafQuantity(this, 'firelineIntensity')
      .desc('fire spread vector maximum fireline intensity')
      .units('fireFli').value(0);

    new DagLeafQuantity(this, 'flameLength')
      .desc('fire spread vector maximum flame length')
      .units('fireFlame').value(0);

    new DagLeafQuantity(this, 'mapDistance')
      .desc('fire spread vector maximum spread map distance')
      .units('mapDistance').value(0);

    new DagLeafQuantity(this, 'ros')
      .desc('fire spread vector maximum spread rate')
      .units('fireRos').value(0);

    new DagLeafQuantity(this, 'scorchHt')
      .desc('fire spread vector maximum scorch height')
      .units('fireScorch').value(0);
  }
}

/**
 * Defines the fire ellipse area and size in map units.
*/
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

/**
 * Defines the fire area and size.
*/
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

/**
 * Defines a fire ellipse.
 */
export class TreeFireEllipse extends DagBranch {
  constructor(parent, name) {
    super(parent, name);

    // Fire ellipse shape
    new TreeFireEllipseAxis(this, 'axis');
    new TreeFireVector(this, 'vector');

    // Fire ellipse distance and size
    new TreeFireEllipseSize(this, 'size');
    new TreeFireEllipseMap(this, 'map');

    // Fire behavior for various vectors
    new TreeFireEllipseBehavior(this, 'back');
    new TreeFireEllipseBehavior(this, 'flank');
    new TreeFireEllipseBehavior(this, 'head');
    new TreeFireEllipseBehavior(this, 'psi');

    // This beta vector uses BehavePlus V5 FLI, FL, and scorchHt
    new TreeFireEllipseBehavior(this, 'beta5');

    // This beta behavior uses BehavePlus V6 FLI, FL, and scorchHt ...
    const beta = new TreeFireEllipseBehavior(this, 'beta');

    // ... and requires some more leafs:
    new DagLeafQuantity(beta, 'theta')
      .desc('angle from ellipse center that intersects the BETA vector at the ellipse perimeter')
      .units('azimuth').value(0);

    new DagLeafQuantity(beta, 'psi')
      .desc('the PSI vector that intersects the BETA vector at the ellipse perimeter')
      .units('azimuth').value(0);

    new DagLeafQuantity(beta, 'rosPsi')
      .desc('ellipse perimeter expansion rate at BETA.PSI vector intersection')
      .units('fireRos').value(0);

    //  Heading from uplsope is used by vector.fromHead and vector.fromUpslope
    // - a fire tree such as tree.surface.fire.weighted
    // - an input tree, such as tree.site.fire
    new DagLeafQuantity(this, 'headingFromUpslope')
      .desc('direction of maximum spread, degrees clockwise from upslope')
      .units('azimuth').value(0);

    new DagLeafQuantity(this, 'headingFromNorth')
      .desc('direction of maximum spread, degrees clockwise from north')
      .units('azimuth').value(0);

    // Midflame wind speed is ONLY used for scorch height and is bound to:
    // - a fire tree such as tree.surface.fire.weighted
    // - an input tree, such as tree.site.wind.speed
    new DagLeafQuantity(this, 'midflameWindSpeed')
      .desc('wind speed at midflame height')
      .units('windSpeed').value(0);
  }
}

/**
 * Implements the BpxTreeFireEllipse
 * where fire ros and lwr are LINKED to BpxTreeFireWeighted.
 */
export default class BpxTreeFireEllipse extends TreeFireEllipse {
  constructor(parent, name, isLinked = true) {
    super(parent, name);
    this.own.isLinked = isLinked;
  }

  setLinked() {
    this.own.isLinked = true;
  }

  setStandAlone() {
    this.own.isLinked = false;
  }

  connect(tree) {
    // Is this LINKED to surface fire model OR to fire inputs?
    const fireLink = tree.surface.fire.weighted;
    const fireInput = tree.site.fire;
    const link = this.own.isLinked ? fireLink : fireInput;
    const cfgVector = tree.configs.fire.vector;

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

    // *FromNorth azimuths require 1 slope leaf: direction.upslope
    const slope = tree.site.slope;

    // The remaining external leafs are not dependent on links
    // Map distances and areas require 1 map leaf: scale
    const map = tree.site.map;

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
        this.vector.fromHead,
        this.head.ros,
        this.axis.eccentricity);

    this.beta5.ros
      .bind(this.beta.ros);

    this.psi.ros
      .calc(BpxLibFireEllipse.rosPsi,
        this.vector.fromHead,
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
        this.vector.fromHead,
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
          fireInput.time.sinceIgnition);

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
          tree.site.temperature.air);
    });

    this.size.length
      .calc(BpxLibSurfaceFire.distance,
        this.axis.major,
        fireInput.time.sinceIgnition);

    this.size.width
      .calc(BpxLibSurfaceFire.distance,
        this.axis.minor,
        fireInput.time.sinceIgnition);

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

     this.vector.fromHead
      .bindIf(cfgVector, 'fromHead', fireInput.vector.fromHead)
      .calcIf(cfgVector, 'fromUpslope',
        BpxLibCompass.diff,
          this.vector.fromUpslope,
          this.headingFromUpslope)
      .calcIf(cfgVector, 'fromNorth',
        BpxLibCompass.diff,
          this.vector.fromNorth,
          this.headingFromNorth);

    this.vector.fromUpslope
      .bindIf(cfgVector, 'fromUpslope', fireInput.vector.fromUpslope)
      .calcIf(cfgVector, 'fromHead',
        BpxLibCompass.sum,
          this.vector.fromHead,
          this.headingFromUpslope)
      .calcIf(cfgVector, 'fromNorth',
        BpxLibCompass.diff,
          this.vector.fromNorth,
          slope.direction.upslope);

    this.vector.fromNorth
      .bindIf(cfgVector, 'fromNorth', fireInput.vector.fromNorth)
      .calcIf(cfgVector, 'fromHead',
        BpxLibCompass.sum,
          this.vector.fromHead,
          this.headingFromNorth)
      .calcIf(cfgVector, 'fromUpslope',
        BpxLibCompass.sum,
          this.vector.fromUpslope,
          slope.direction.upslope);
  }
}

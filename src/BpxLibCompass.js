/**
 * @file Class of static compass functions used by other BehavePlus Explorer files.
 * @copyright Systems for Environmental Management 2019
 * @author Collin D. Bevins <cbevins@montana.com>
 * @version 0.1.0
 */

 export default class BpxLibCompass {

  /**
   * Constrain compass degrees to the azimuth range [0 <= degrees < 360].
   *
   * @param float degrees The compass azimuth (degrees).
   *
   * @return float The compass azimuth constrained to the range [0 <= azimuth < 360] degrees.
   */
  static constrain(degrees) {
    while (degrees >= 360) {
      degrees -= 360;
    }
    while (degrees < 0) {
      degrees += 360;
    }
    return degrees;
  }

  /**
   * Calculate compass degrees (azimuth, clockwise from north) from radians.
   *
   * @param float radians Compass azimuth expressed in radians.
   *
   * @return float Compass azimuth expressed in degrees.
   */
  static degrees(radians) {
    return radians * 180 / Math.PI;
  }

  static diff(x, y) {
    return BpxLibCompass.constrain(x - y);
  }

  /**
   * Get the opposite azimuth from degrees.
   *
   * @param float deg A compass azimuth (degrees).
   *
   * @return float The opposite compass azimuth from dgrees.
   */
  static opposite(degrees) {
    return BpxLibCompass.constrain(degrees - 180);
  }

  /**
   * Calculate the radians of the compass azimuth (clockwise from north).
   *
   * @param float degrees  Compass azimuth (degrees clockwise from north).
   *
   * @return float The compass azimuth expressed in radians.
   */
  static radians(degrees) {
    return degrees * Math.PI / 180;
  }

  /**
   * Calculate the slope steepness in degrees from the slope vertical rise / horizontal reach ratio.
   *
   * @param float $ratio Ratio of the slope vertical rise / horizontal reach (fraction).
   *
   * @return float Slope steepness expressed in degrees.
   */
  static slopeDegrees(ratio) {
    let radians = Math.atan(ratio);
    return BpxLibCompass.degrees(radians);
  }

  /**
   * Calculate the slope vertical rise / horizontal reach ratio from its steepness in degrees.
   *
   * @param float $degrees  Slope steepness in degrees.
   *
   * @return float Slope vertical rise / horizontal reach ratio (fraction).
   */
  static slopeRatio(degrees) {
    let rad = BpxLibCompass.radians(BpxLibCompass.constrain(degrees));
    return Math.tan(rad);
  }

  /**
   * Calculate slope steepness ratio from map measurements.
   *
   * @param float $mapScale Map sacle factor (Greater than 1, i.e., 24000)
   * @param float $contourInterval Map contour interval (in same units-of-measure as $distance)
   * @param float $contours Number of contours crossed in the measurement
   * @param float $mapDistance Map distance covered in the measurement
   *
   * @return float Slope steepness ratio
   */
  static slopeRatioMap(mapScale, contourInterval, contours, mapDistance) {
    let reach = mapScale * mapDistance;
    let rise = contours * contourInterval;
    return (reach <= 0) ? 0 : (rise / reach);
  }

  static sum(x, y) {
    return BpxLibCompass.constrain(x + y);
  }
}

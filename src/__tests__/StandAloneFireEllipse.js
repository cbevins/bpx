import Dag from '../Dag';
import { approx, logNames } from '../__test_data__/Debug';
import { BpxTreeStandAloneFireEllipse } from '../BpxTreeStandAloneFireEllipse';
import BpxLibSurfaceFire from '../BpxLibSurfaceFire';
import BpxLibFireEllipse from '../BpxLibFireEllipse';

test('1: Stand-alone fire ellipse', () => {
  const dag = new Dag('fireEllipse',
    new BpxTreeStandAloneFireEllipse('standAlone'));
  const { tree } = dag;
  const cfgVector = tree.configs.fire.vector;
  const input = tree.site.fire;
  const { axis, head, back, beta, beta5, flank, map, psi, size, vector } = tree.surface.fire.ellipse;

  // Inputs
  let ros = 10;
  let elapsed = 60;
  let aspect = 225;     // upslopeNo=45, fireHeadNo=90, vectorNo=135
  let fireHead = 45;    // fireHeadUp=45, upslope=45, fireHeadNo=90
  let fireNo = 90;      // fireHeadUp=45, upslope=45, fireHeadNo=90
  let vectorHead = 45;  // vectorHd=45, vectorUp=90, vectorNo=135
  let vectorUp = 90;    // beta and psi vector from fire head
  let vectorNo = 135;   // beta and psi vector from fire head
  let fli = 5000;
  let lwr = 3;
  let scale = 24000;
  let wind = 880;
  let air = 95;

  // Expected
  let headRos =ros;
  let headDist = headRos * elapsed;
  let headMap = headDist / scale;
  let headFli = fli;
  let headFlame = BpxLibSurfaceFire.flameLength(headFli);
  let headScorch = BpxLibSurfaceFire.scorchHt(headFli, wind, air);

  let ecc = BpxLibFireEllipse.eccentricity(lwr);

  let backRos = BpxLibFireEllipse.rosBack(headRos, ecc);
  let backDist = backRos * elapsed;
  let backMap = backDist / scale;
  let backFli = BpxLibFireEllipse.fliAtAzimuth(headFli, headRos, backRos);
  let backFlame = BpxLibSurfaceFire.flameLength(backFli);
  let backScorch = BpxLibSurfaceFire.scorchHt(backFli, wind, air);

  let major = BpxLibFireEllipse.rosMajor(headRos, backRos);
  let minor = BpxLibFireEllipse.rosMinor(major, lwr);
  let f = BpxLibFireEllipse.rosF(major);
  let g = BpxLibFireEllipse.rosG(major, backRos);
  let h = BpxLibFireEllipse.rosH(minor);

  let flankRos = BpxLibFireEllipse.rosFlank(minor);
  let flankDist = flankRos * elapsed;
  let flankMap = flankDist / scale;
  let flankFli = BpxLibFireEllipse.fliAtAzimuth(headFli, headRos, flankRos);
  let flankFlame = BpxLibSurfaceFire.flameLength(flankFli);
  let flankScorch = BpxLibSurfaceFire.scorchHt(flankFli, wind, air);

  let length = BpxLibFireEllipse.length(major, elapsed);
  let lengthMap = length / scale;
  let width = BpxLibFireEllipse.width(minor, elapsed);
  let widthMap = width / scale;
  let perimeter = BpxLibFireEllipse.perimeter(length, width);
  let perimeterMap = perimeter / scale;
  let area = BpxLibFireEllipse.area(length, lwr);
  let areaMap = area / scale / scale;

  let beta5Ros = BpxLibFireEllipse.rosBeta(vectorHead, headRos, ecc);
  let beta5Dist = beta5Ros * elapsed;
  let beta5Map = beta5Dist / scale;
  let beta5Fli = BpxLibFireEllipse.fliAtAzimuth(headFli, headRos, beta5Ros);
  let beta5Flame = BpxLibSurfaceFire.flameLength(beta5Fli);
  let beta5Scorch = BpxLibSurfaceFire.scorchHt(beta5Fli, wind, air);

  let betaRos = BpxLibFireEllipse.rosBeta(vectorHead, headRos, ecc);
  let betaDist = betaRos * elapsed;
  let betaMap = betaDist / scale;
  let betaTheta = BpxLibFireEllipse.thetaFromBeta(vectorHead, f, g, h);
  let betaPsi = BpxLibFireEllipse.psiFromTheta(betaTheta, f, h);
  let betaRosPsi = BpxLibFireEllipse.rosPsi(betaPsi, f, g, h);
  let betaFli = BpxLibFireEllipse.fliAtAzimuth(headFli, headRos, betaRosPsi);
  let betaFlame = BpxLibSurfaceFire.flameLength(betaFli);
  let betaScorch = BpxLibSurfaceFire.scorchHt(betaFli, wind, air);

  let psiRos = BpxLibFireEllipse.rosPsi(vectorHead, f, g, h);
  let psiDist = psiRos * elapsed;
  let psiMap = psiDist / scale;
  let psiFli = BpxLibFireEllipse.fliAtAzimuth(headFli, headRos, psiRos);
  let psiFlame = BpxLibSurfaceFire.flameLength(psiFli);
  let psiScorch = BpxLibSurfaceFire.scorchHt(psiFli, wind, air);

  // Start with just the head fire ros as output
  dag.setSelected([head.ros]);
  let inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(1);
  expect(inputLeafs).toContain(input.ros);
  dag.setValue(input.ros, ros);
  expect(head.ros.value()).toEqual(headRos);

  // Add head distance
  dag.setSelected([head.distance]);
  inputLeafs = dag.getRequiredInputLeafs();
  // Now requires ros and elapsed time as input
  expect(inputLeafs.length).toEqual(2);
  expect(inputLeafs).toContain(input.ros);
  expect(inputLeafs).toContain(input.time.sinceIgnition);
  dag.setValue(input.time.sinceIgnition, elapsed);
  expect(head.ros.value()).toEqual(headRos);
  expect(head.distance.value()).toEqual(headDist);

  // Selecting axis, size, back, flank requires LWR input
  dag.setSelected([
    axis.eccentricity, axis.major, axis.minor, axis.f, axis.g, axis.h,
    back.ros, back.distance,
    flank.ros, flank.distance,
    size.length, size.width,
    size.perimeter, size.area,
  ]);
  inputLeafs = dag.getRequiredInputLeafs();
  // Now requires ros, elapsed time, and length-to-width ratio as inputs
  expect(inputLeafs.length).toEqual(3);
  expect(inputLeafs).toContain(input.ros);
  expect(inputLeafs).toContain(input.time.sinceIgnition);
  expect(inputLeafs).toContain(input.lengthToWidthRatio);
  dag.setValue(input.lengthToWidthRatio, lwr);
  expect(head.ros.value()).toEqual(headRos);
  expect(head.distance.value()).toEqual(headDist);
  expect(back.ros.value()).toEqual(backRos);
  expect(back.distance.value()).toEqual(backDist);
  expect(flank.ros.value()).toEqual(flankRos);
  expect(flank.distance.value()).toEqual(flankDist);
  expect(axis.eccentricity.value()).toEqual(ecc);
  expect(axis.major.value()).toEqual(major);
  expect(axis.minor.value()).toEqual(minor);
  expect(axis.f.value()).toEqual(f);
  expect(axis.g.value()).toEqual(g);
  expect(axis.h.value()).toEqual(h);
  expect(size.length.value()).toEqual(length);
  expect(size.width.value()).toEqual(width);
  expect(size.area.value()).toEqual(area);
  expect(size.perimeter.value()).toEqual(perimeter);

  // Selecting beta or psi requires vector from fire head
  dag.setSelected([
    beta.ros, beta.distance,
    beta5.ros, beta5.distance,
    psi.ros, psi.distance,
  ]);
  inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(4);
  expect(inputLeafs).toContain(input.ros);
  expect(inputLeafs).toContain(input.time.sinceIgnition);
  expect(inputLeafs).toContain(input.lengthToWidthRatio);
  expect(inputLeafs).toContain(input.vector.fromHead);
  dag.setValue(input.vector.fromHead, vectorHead);
  expect(vector.fromHead.value()).toEqual(vectorHead);
  expect(beta.ros.value()).toEqual(betaRos);
  expect(beta.distance.value()).toEqual(betaDist);
  expect(beta5.ros.value()).toEqual(beta5Ros);
  expect(beta5.distance.value()).toEqual(beta5Dist);
  expect(psi.ros.value()).toEqual(psiRos);
  expect(psi.distance.value()).toEqual(psiDist);

  // Selecting map distances requires map scale
  dag.setSelected([
    head.mapDistance, back.mapDistance, flank.mapDistance,
    beta.mapDistance, beta5.mapDistance, psi.mapDistance,
    map.length, map.width, map.perimeter, map.area
  ]);
  inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(5);
  expect(inputLeafs).toContain(input.ros);
  expect(inputLeafs).toContain(input.time.sinceIgnition);
  expect(inputLeafs).toContain(input.lengthToWidthRatio);
  expect(inputLeafs).toContain(input.vector.fromHead);
  expect(inputLeafs).toContain(tree.site.map.scale);
  dag.setValue(tree.site.map.scale, scale);
  expect(head.mapDistance.value()).toEqual(headMap);
  expect(back.mapDistance.value()).toEqual(backMap);
  expect(beta.mapDistance.value()).toEqual(betaMap);
  expect(beta5.mapDistance.value()).toEqual(beta5Map);
  expect(flank.mapDistance.value()).toEqual(flankMap);
  expect(psi.mapDistance.value()).toEqual(psiMap);
  expect(map.length.value()).toEqual(lengthMap);
  expect(map.width.value()).toEqual(widthMap);
  expect(map.perimeter.value()).toEqual(perimeterMap);
  expect(map.area.value()).toEqual(areaMap);

  // Selecting fireline intensity and flame length requires fireline intensity input
  dag.setSelected([
    head.firelineIntensity, head.flameLength,
    back.firelineIntensity, back.flameLength,
    flank.firelineIntensity, flank.flameLength,
    beta.firelineIntensity, beta.flameLength,
    beta5.firelineIntensity, beta5.flameLength,
    psi.firelineIntensity, psi.flameLength,
  ]);
  inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(6);
  expect(inputLeafs).toContain(input.ros);
  expect(inputLeafs).toContain(input.time.sinceIgnition);
  expect(inputLeafs).toContain(input.lengthToWidthRatio);
  expect(inputLeafs).toContain(input.vector.fromHead);
  expect(inputLeafs).toContain(tree.site.map.scale);
  expect(inputLeafs).toContain(input.firelineIntensity);
  dag.setValue(input.firelineIntensity, fli);
  expect(head.firelineIntensity.value()).toEqual(headFli);
  expect(back.firelineIntensity.value()).toEqual(backFli);
  expect(beta.firelineIntensity.value()).toEqual(betaFli);
  expect(beta5.firelineIntensity.value()).toEqual(beta5Fli);
  expect(flank.firelineIntensity.value()).toEqual(flankFli);
  expect(psi.firelineIntensity.value()).toEqual(psiFli);
  expect(head.flameLength.value()).toEqual(headFlame);
  expect(back.flameLength.value()).toEqual(backFlame);
  expect(beta.flameLength.value()).toEqual(betaFlame);
  expect(beta5.flameLength.value()).toEqual(beta5Flame);
  expect(flank.flameLength.value()).toEqual(flankFlame);
  expect(psi.flameLength.value()).toEqual(psiFlame);

  // Selecting scorch height requires midflame wind and air temp
  dag.setValue(tree.configs.wind.speed, 'atMidflame');
  dag.setSelected([
    head.scorchHt, back.scorchHt, flank.scorchHt,
    beta.scorchHt, beta5.scorchHt, psi.scorchHt
  ]);
  inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(8);
  expect(inputLeafs).toContain(input.ros);
  expect(inputLeafs).toContain(input.time.sinceIgnition);
  expect(inputLeafs).toContain(input.lengthToWidthRatio);
  expect(inputLeafs).toContain(input.vector.fromHead);
  expect(inputLeafs).toContain(tree.site.map.scale);
  expect(inputLeafs).toContain(input.firelineIntensity);
  expect(inputLeafs).toContain(tree.site.temperature.air);
  expect(inputLeafs).toContain(tree.site.wind.speed.atMidflame);
  dag.setValues([
    [tree.site.temperature.air, air],
    [tree.site.wind.speed.atMidflame, wind],
  ]);
  expect(head.scorchHt.value()).toEqual(headScorch);
  expect(back.scorchHt.value()).toEqual(backScorch);
  expect(beta.scorchHt.value()).toEqual(betaScorch);
  expect(beta5.scorchHt.value()).toEqual(beta5Scorch);
  expect(flank.scorchHt.value()).toEqual(flankScorch);
  expect(psi.scorchHt.value()).toEqual(psiScorch);

  // Selecting vectors from upslope requires fire heading from upslope
  // and changes vector from fire head input to vector from upslope
  dag.setValue(tree.configs.fire.vector, 'fromUpslope');
  inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(9);
  expect(inputLeafs).toContain(input.ros);
  expect(inputLeafs).toContain(input.time.sinceIgnition);
  expect(inputLeafs).toContain(input.lengthToWidthRatio);
  expect(inputLeafs).toContain(tree.site.map.scale);
  expect(inputLeafs).toContain(input.firelineIntensity);
  expect(inputLeafs).toContain(tree.site.temperature.air);
  expect(inputLeafs).toContain(tree.site.wind.speed.atMidflame);
  expect(inputLeafs).toContain(input.vector.fromUpslope);
  expect(inputLeafs).toContain(input.headingFromUpslope);
  dag.setValues([
    [input.vector.fromUpslope, vectorUp],
    [input.headingFromUpslope, fireHead],
  ]);
  // These should be the same
  expect(head.scorchHt.value()).toEqual(headScorch);
  expect(back.scorchHt.value()).toEqual(backScorch);
  expect(beta.scorchHt.value()).toEqual(betaScorch);
  expect(beta5.scorchHt.value()).toEqual(beta5Scorch);
  expect(flank.scorchHt.value()).toEqual(flankScorch);
  expect(psi.scorchHt.value()).toEqual(psiScorch);

  // Selecting vectors from north requires aspect
  // and changes vector from upslope input to vector from north
  dag.setValue(tree.configs.fire.vector, 'fromNorth');
  inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(10);
  expect(inputLeafs).toContain(input.ros);
  expect(inputLeafs).toContain(input.time.sinceIgnition);
  expect(inputLeafs).toContain(input.lengthToWidthRatio);
  expect(inputLeafs).toContain(tree.site.map.scale);
  expect(inputLeafs).toContain(input.firelineIntensity);
  expect(inputLeafs).toContain(tree.site.temperature.air);
  expect(inputLeafs).toContain(tree.site.wind.speed.atMidflame);
  expect(inputLeafs).toContain(input.headingFromUpslope);
  expect(inputLeafs).toContain(tree.site.slope.direction.aspect);
  expect(inputLeafs).toContain(input.vector.fromNorth);
  dag.setValues([
    [input.vector.fromNorth, vectorNo],
    [tree.site.slope.direction.aspect, aspect],
  ]);
  // These should be the same
  expect(head.scorchHt.value()).toEqual(headScorch);
  expect(back.scorchHt.value()).toEqual(backScorch);
  expect(beta.scorchHt.value()).toEqual(betaScorch);
  expect(beta5.scorchHt.value()).toEqual(beta5Scorch);
  expect(flank.scorchHt.value()).toEqual(flankScorch);
  expect(psi.scorchHt.value()).toEqual(psiScorch);

})

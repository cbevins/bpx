// Tests weighted standard fuel models 10 and 124 from the catalog
// Tests basic weighted fuel bed and fire behavior
import Dag from '../Dag';

function approx(actual, expected, prec = 12) {
  if (typeof expected === 'number') {
    let result = actual.toPrecision(prec) === expected.toPrecision(prec);
    if ( ! result ) {
      console.log('*** Expected='+expected+' Actual='+actual);
    }
    return result;
  }
  return actual === expected;
}

function logNames(leafArray) {
  leafArray.forEach((leaf)=>{
    console.log(leaf.name());
  });
}

test('1: FM10 and FM124 weighted', () => {
  const name = 'worksheet1';
  const dag = new Dag(name);
  const { tree } = dag;
  const { moisture, slope, wind } = tree.site;
  const { primary, secondary } = tree.surface.fuel;
  const pfire = tree.surface.fuel.primary.fire;
  const sfire = tree.surface.fuel.secondary.fire;
  const wfire = tree.surface.fire.weighted;
  const cfg = tree.configs;

  dag.setValues( [
    [cfg.fuel.primary, 'catalog'],
    [cfg.fuel.secondary, 'catalog'],
    [cfg.fuel.moisture, 'individual'],
    [cfg.fuel.waf, 'input'],
    [cfg.fuel.curedHerbFraction, 'estimated'],
    [cfg.fuel.chaparralTotalLoad, 'input'],
    [cfg.slope.steepness, 'ratio'],
    [cfg.wind.direction, 'headingFromUpslope'],
    [cfg.wind.speed, 'atMidflame'],
    [cfg.fire.ewsLimit, 'applied'],
    //[cfg.fire.vector, 'fromFireHead'],
    [cfg.fire.weightingMethod, 'arithmetic'],
  ])

  // Select all the BpxTreeFireWeighted leafs
  dag.setSelected([
    pfire.ros,
    sfire.ros,
    wfire.ros,
    wfire.rosArithmetic,
    wfire.rosExpected,
    wfire.rosHarmonic,
    // Same as primary fuel bed
    wfire.headingFromUpslope,
    wfire.waf,
    wfire.midflameWindSpeed,
    wfire.effectiveWindSpeed,
    wfire.lengthToWidthRatio,
    // Maximum
    wfire.heatPerUnitArea,
    wfire.reactionIntensity,
    wfire.firelineIntensity,
    wfire.flameLength,
    wfire.effectiveWindSpeed,
    // minimum
    wfire.effectiveWindSpeedLimit,
    wfire.effectiveWindSpeedExceeded,
  ]);

  let configLeafs = dag.getRequiredConfigLeafs();
  expect(configLeafs.length).toEqual(11);

  let inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(12);
  expect(inputLeafs).toContain(wfire.primaryCover);

  dag.setValues([
    [primary.model.key, '10'],
    [secondary.model.key, '124'],
    [wfire.primaryCover, 0.75],
    [moisture.dead.tl1h, 0.05],
    [moisture.dead.tl10h, 0.07],
    [moisture.dead.tl100h, 0.09],
    [moisture.live.herb, 0.50],
    [moisture.live.stem, 1.50],
    [slope.steepness.ratio, 0.25],
    [wind.direction.headingFromUpslope, 90],
    [wind.speed.atMidflame, 880],
    [wind.speed.waf, 1],
  ]);

  const ros1 = 18.551680325448835;
  const ros2 = 48.470425993990560;
  const cvr1 = 0.75;
  const cvr2 = 0.25;
  const rosa = (cvr1 * ros1) + (cvr2 * ros2);
  const rosh = 1. / ( ( cvr1 / ros1 ) + ( cvr2 / ros2 ) );
  const rose = 0.5 * ( rosa + rosh );

  expect(approx(pfire.ros.value(),18.551680325448835, 9)).toEqual(true);
  expect(approx(sfire.ros.value(), 48.470425993990560, 9)).toEqual(true);
  expect(wfire.primaryCover.value()).toEqual(0.75);
  expect(approx(wfire.rosArithmetic.value(), rosa, 11)).toEqual(true);
  expect(approx(wfire.rosExpected.value(), rose, 11)).toEqual(true);
  expect(approx(wfire.rosHarmonic.value(), rosh, 11)).toEqual(true);
  expect(approx(wfire.ros.value(), rosa, 11)).toEqual(true);

  // These are assigned the primary fuel (FM 10) values
  expect(wfire.effectiveWindSpeed.value()).toEqual(pfire.effectiveWindSpeed.value());
  expect(wfire.headingFromUpslope.value()).toEqual(pfire.headingFromUpslope.value());
  expect(wfire.lengthToWidthRatio.value()).toEqual(pfire.lengthToWidthRatio.value());
  expect(wfire.midflameWindSpeed.value()).toEqual(pfire.wind.atMidflame.value());
  expect(wfire.waf.value()).toEqual(pfire.wind.waf.value());

  // These are assigned the maximum (FM 124) values
  expect(wfire.heatPerUnitArea.value()).toEqual(sfire.heatPerUnitArea.value());
  expect(wfire.firelineIntensity.value()).toEqual(sfire.firelineIntensity.value());
  expect(wfire.flameLength.value()).toEqual(sfire.flameLength.value());
  expect(wfire.reactionIntensity.value()).toEqual(sfire.reactionIntensity.value());

  // These are assigned the minimum (FM 10) values
  expect(wfire.effectiveWindSpeedLimit.value()).toEqual(pfire.limit.ews.value());
  expect(wfire.effectiveWindSpeedExceeded.value()).toEqual(pfire.exceeded.ews.value());
})

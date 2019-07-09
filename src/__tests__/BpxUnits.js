import Dag from '../Dag';
import BpxUnits from '../BpxUnits';

import { approx, logNames } from '../__test_data__/Debug';
import BpxLibSurfaceFire from '../BpxLibSurfaceFire';
import { exportAllDeclaration } from '@babel/types';

test('1: BpxUnits conversion', () => {
  const name = 'worksheet1';
  const dag = new Dag(name);
  const { tree } = dag;
  const { moisture, slope, wind } = tree.site;
  const { primary, secondary } = tree.surface.fuel;
  const { head, size } = tree.surface.fire.ellipse;

  const cfg = tree.configs;
  dag.setValues( [
    [cfg.fire.ewsLimit, 'applied'],
    [cfg.fire.weightingMethod, 'arithmetic'],
    [cfg.fire.vector, 'fromNorth'],
    [cfg.fire.fli, 'firelineIntensity'],
    [cfg.fire.lwr, 'lengthToWidthRatio'],
    [cfg.fire.scorchHt, 'estimated'],
    [cfg.fuel.primary, 'catalog'],
    [cfg.fuel.secondary, 'none'],
    [cfg.fuel.moisture, 'individual'],
    [cfg.fuel.waf, 'input'],
    [cfg.fuel.curedHerbFraction, 'estimated'],
    [cfg.fuel.chaparralTotalLoad, 'input'],
    [cfg.slope.steepness, 'ratio'],
    [cfg.wind.direction, 'headingFromUpslope'],
    [cfg.wind.speed, 'atMidflame'],
  ]);

  expect(head.ros.baseUnits()).toEqual('ft/min');
  expect(head.ros.displayDecimals()).toEqual(2);
  expect(head.ros.displayUnits()).toEqual('ft/min');

  dag.units.uom.fireRos.display.decimals = 6;
  expect(head.ros.displayDecimals()).toEqual(6);
  dag.units.uom.fireRos.display.units = 'm/min';
  expect(head.ros.displayUnits()).toEqual('m/min');

  expect(head.ros.baseValueToDisplayValue(1)).toEqual('0.304800');

  head.ros.value(2);
  expect(head.ros.value()).toEqual(2);
  expect(head.ros.displayValue()).toEqual('0.609600');

  head.ros.setInputValues([1, 2, 3]);
  const dv = head.ros.displayInputs();
  expect(dv[0]).toEqual('0.304800');
  expect(dv[1]).toEqual('0.609600');
  expect(dv[2]).toEqual('0.914400');

  expect(head.ros.displayValueToBaseValue(1)).toEqual(3.28084);
});

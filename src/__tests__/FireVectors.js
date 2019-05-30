import Dag from '../Dag';
import { approx, logNames } from '../__test_data__/Debug';
import { BpxTreeStandAloneFireEllipse } from '../BpxTreeStandAloneFireEllipse';

test('1: Stand-alone fire ellipse fire vectors', () => {
  const dag = new Dag('fireEllipse',
    new BpxTreeStandAloneFireEllipse('standAlone'));
  const { tree } = dag;
  const cfgVector = tree.configs.fire.vector;
  const { aspect } = tree.site.slope.direction;
  const input = tree.site.fire;
  const { vector, head } = tree.surface.fire.ellipse;

  dag.setSelected([
    vector.fromHead,
    vector.fromUpslope,
    vector.fromNorth]);

  const testData = [
  // asp, Hup, Hno, Vhd, Vup, Vno
    [180,   0,   0,   0,   0,   0],
    [225,  45,  90,   0,  45,  90],
    [225,  45,  90, 285, 330,  15],
    [225,  45,  90, 330,  15,  60],
    [225,  45,  90,  45,  90, 135],
    [225,  45,  90, 315,   0,  45],
  ];

  // First test when vector from fire head is an input
  dag.setValue(cfgVector, 'fromHead');

  let inputLeafs = dag.getRequiredInputLeafs();
  //logNames(inputLeafs);
  expect(inputLeafs.length).toEqual(3);
  expect(inputLeafs).toContain(input.vector.fromHead);
  expect(inputLeafs).toContain(input.headingFromUpslope);
  expect(inputLeafs).toContain(aspect);

  testData.forEach((data) => {
    let [asp, hup, hno, vhd, vup, vno] = data;
    dag.setValues([
      [aspect, asp],
      [input.headingFromUpslope, hup],
      [input.vector.fromHead, vhd],
    ]);

    expect(vector.fromHead.value()).toEqual(vhd);
    expect(vector.fromUpslope.value()).toEqual(vup);
    expect(vector.fromNorth.value()).toEqual(vno);
  })

  // Next test when vector from upslope is an input
  dag.setValue(cfgVector, 'fromUpslope');

  inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(3);
  expect(inputLeafs).toContain(input.vector.fromUpslope);
  expect(inputLeafs).toContain(input.headingFromUpslope);
  expect(inputLeafs).toContain(aspect);

  testData.forEach((data) => {
    let [asp, hup, hno, vhd, vup, vno] = data;
    dag.setValues([
      [aspect, asp],
      [input.headingFromUpslope, hup],
      [input.vector.fromUpslope, vup],
    ]);

    expect(vector.fromHead.value()).toEqual(vhd);
    expect(vector.fromUpslope.value()).toEqual(vup);
    expect(vector.fromNorth.value()).toEqual(vno);
  })

  // Finally, test when vector from north is an input
  dag.setValue(cfgVector, 'fromNorth');

  inputLeafs = dag.getRequiredInputLeafs();
  expect(inputLeafs.length).toEqual(3);
  expect(inputLeafs).toContain(input.vector.fromNorth);
  expect(inputLeafs).toContain(input.headingFromUpslope);
  expect(inputLeafs).toContain(aspect);

  testData.forEach((data) => {
    let [asp, hup, hno, vhd, vup, vno] = data;
    dag.setValues([
      [aspect, asp],
      [input.headingFromUpslope, hup],
      [input.vector.fromNorth, vno],
    ]);

    expect(vector.fromHead.value()).toEqual(vhd);
    expect(vector.fromUpslope.value()).toEqual(vup);
    expect(vector.fromNorth.value()).toEqual(vno);
  })
})

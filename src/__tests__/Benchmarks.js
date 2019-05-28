import Dag from '../Dag';
import BenchmarkTester from '../__test_data__/BenchmarkTester';

import {
  BenchmarkFm010In,
  BenchmarkFm010Out,
} from '../__test_data__/BenchmarkFm010';
import {
  BenchmarkFm124In,
  BenchmarkFm124Out,
} from '../__test_data__/BenchmarkFm124';

test('1: Benchmark FM 124', () => {
  const inpTree = BenchmarkFm124In;
  const expected = BenchmarkFm124Out;
  const dag = new Dag('benchmark');
  const benchmark = new BenchmarkTester('FM 124 Ellipse', 7)
  benchmark.test(dag, dag.tree, inpTree,
    dag.tree.surface.fire.ellipse,
    expected.surface.fire.ellipse);
})

test('2: Benchmark FM 10', () => {
  const inpTree = BenchmarkFm010In;
  const expected = BenchmarkFm010Out;
  const dag = new Dag('benchmark');
  const benchmark = new BenchmarkTester('FM 10 Ellipse',7)
  benchmark.test(dag, dag.tree, inpTree,
    dag.tree.surface.fire.ellipse,
    expected.surface.fire.ellipse);
})

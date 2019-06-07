import React from 'react';
import Table from 'react-bootstrap/Table';
import DagLeafQuantity from '../DagLeafQuantity';

function ResultsRows(props) {
  const { leafs } = props;
  const rows = leafs.map((leaf) =>
    <tr>
      <td>{leaf.label()}</td>
      <td align="right">{leaf.value()}</td>
      <td>{(leaf instanceof DagLeafQuantity) ? leaf.currentUnitsString() : ''}</td>
    </tr>
  );
  return (<tbody>{rows}</tbody>);
}

export function SimpleResultsPage(props) {
  const { dag } = props;
  return (
    <Table responsive="md" size="sm" striped>
      <thead><tr colspan="3" align="center"><th>Input Conditions</th></tr></thead>
      <ResultsRows dag={dag} leafs={dag.requiredInputLeafs} />
      <thead><tr colspan="3" align="center"><th>Results</th></tr></thead>
      <ResultsRows dag={dag} leafs={dag.selectedLeafs} />
    </Table>
  );
}

export default function ResultsPage(props) {
  const { dag } = props;
  let dimensions = 0;
  dag.requiredInputLeafs.forEach((leaf) => {
    let inputs = leaf.own.inputs.length;
    if (inputs > 1 ) {
      dimensions += 1;
    }
  });
  if (dimensions===0) {
    return (<SimpleResultsPage dag={dag} />);
  } else {
    return (<SimpleResultsPage dag={dag} />);
  }
}

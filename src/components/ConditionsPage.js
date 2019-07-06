import React from 'react';

import Table from 'react-bootstrap/Table';

import DagLeafQuantity from '../DagLeafQuantity';

function ConditionsRows(props) {
  const { dag, leafs } = props;
  const rows = leafs.map((leaf, idx) =>
    <tr key={idx}>
      <td>{leaf.label()}</td>
      <td align="right"> [{leaf.value()}] of [{leaf.own.inputs.join()}]</td>
      <td>{(leaf instanceof DagLeafQuantity) ? leaf.currentUnitsString() : ''}</td>
    </tr>
  );
  return (<tbody>{rows}</tbody>);
}

export default function ConditionsPage(props) {
  const { dag } = props;
  if (dag.selectedLeafs.length===0) {
    return (<h3>There are currently no outputs selected</h3>);
  }
  return (
    <Table responsive="md" size="sm" striped>
      <thead><tr colSpan="3" align="center"><th>Input Conditions</th></tr></thead>
      <ConditionsRows dag={dag} leafs={dag.requiredInputLeafs} />
    </Table>
  );
}
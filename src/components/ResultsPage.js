import React from 'react';
import Table from 'react-bootstrap/Table';

function ResultsHeaderRow({dag, title, color}) {
  const leaf = dag.storedLeafs[0];
  const cols = leaf.own.results.map((value, idx) =>
    <td key={idx} align='right'><em>#{idx+1}</em></td>
  );
  return (
    <thead>
      <tr style={{'width':'100%','text-align':'left','background-color':color,}}>
        <th key='a'>{title} by Run #</th>
        <th key='b'><em>Units</em></th>
        {cols}
      </tr>
    </thead>);
}

function ResultsLeafCols({leaf}) {
  const cols = leaf.own.results.map((value, idx) =>
    <td key={idx} align='right'>{leaf.baseValueToDisplayValue(value)}</td>
  );
  return cols;
}

function ResultsLeafRows({dag, leafs}) {
  const rows = leafs.map((leaf, idx) =>
    <tr key={idx}>
      <td>{leaf.label()}</td>
      <td align='left'><em>{leaf.displayUnits()}</em></td>
      <ResultsLeafCols leaf={leaf} />
    </tr>
  );
  return (<tbody>{rows}</tbody>);
}

export default function ResultsPage(props) {
  const { dag } = props;
  if (dag.runs()===0) {
    return (<h3>There are currently no run results</h3>);
  }
  return (
    <Table responsive="md" size="sm" hover striped>
      <ResultsHeaderRow dag={dag} title='Input Conditions' color='palegreen' />
      <ResultsLeafRows dag={dag} leafs={dag.requiredInputLeafs} />
      <ResultsHeaderRow dag={dag} title='Selected Outputs' color='paleturquoise' />
      <ResultsLeafRows dag={dag} leafs={dag.selectedLeafs} />
    </Table>
  );
}

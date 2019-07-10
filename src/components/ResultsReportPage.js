import React from 'react';
import Table from 'react-bootstrap/Table';
import ReactTable from 'react-table'
import DagLeafQuantity from '../DagLeafQuantity';

function ResultsRows(props) {
  const { leafs } = props;
  const rows = leafs.map((leaf, idx) =>
    <tr key={idx}>
      <td>{leaf.label()}</td>
      <td align="right">{leaf.displayValue()}</td>
      <td align='left'><em>{leaf.displayUnits()}</em></td>
    </tr>
  );
  return (<tbody>{rows}</tbody>);
}

export default function ResultsReportPage(props) {
  const { dag } = props;
  if (dag.runs()===0) {
    return (<h3>There are currently no run results</h3>);
  }
  return (
    <Table responsive="md" size="sm" striped>
      <thead><tr colSpan="3" align="center"><th>Input Conditions</th></tr></thead>
      <ResultsRows dag={dag} leafs={dag.requiredInputLeafs} />
      <thead><tr colSpan="3" align="center"><th>Results</th></tr></thead>
      <ResultsRows dag={dag} leafs={dag.selectedLeafs} />
    </Table>
  );
}

// Version using react-table
export function ResultsReportPage2(props) {
  const { dag } = props;
  let data = [];
  dag.requiredInputLeafs.forEach((leaf) => {
    let units = (leaf instanceof DagLeafQuantity) ? leaf.currentUnitsString() : '';
    data.push([leaf.label(), leaf.value(), units]);
  });
  dag.selectedLeafs.forEach((leaf) => {
    let units = (leaf instanceof DagLeafQuantity) ? leaf.currentUnitsString() : '';
    data.push([leaf.label(), leaf.value(), units]);
  });

  const columns = [{
    id: 'a',
    Header: 'Variable',
    accessor: (d) => d[0],
  }, {
    id: 'b',
    Header: 'Value',
    accessor: (d) => d[1],
    //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
  }, {
    id: 'c',
    Header: props => <span>Units</span>, // Custom header components!
    accessor: (d) => d[2],
  }]
  return ( <ReactTable
    data={data}
    columns={columns}
  />);
}

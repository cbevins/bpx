import React from 'react';
import ReactTable from 'react-table'

export default function ResultsTablePage2(props) {
  const { dag } = props;
  if (dag.runs()===0) {
    return (<h3>There are currently no run results</h3>);
  }

  let data = [];
  for(let idx=0; idx<dag.batch.results; idx+=1) {
    let row = [];
    dag.storedLeafs.forEach((leaf) => {
      row.push(leaf.fetchDisplay(idx));
    })
    data.push(row);
  }

  let columns = [];
  dag.storedLeafs.forEach((leaf, idx) => {
    columns.push({
      id: idx+'-'+leaf.name(),
      Header: () =>
        <ul style={{'list-style-type': 'none'}}>
          <li>{leaf.name()}</li>
          <li>{leaf.displayUnits()}</li>
        </ul>,
      accessor: (d) => d[idx],
      //Cell: row => (Number.parseFloat(row.value).toFixed(2)),
    });
  });

  return ( <ReactTable
    data={data}
    columns={columns}
    defaultPageSize={20}
    style={{
      height: "400px" // This will force the table body to overflow and scroll, since there is not enough room
    }}
    className="-striped -highlight"
    showPaginationTop
  />);
}

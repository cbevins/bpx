import React from 'react';
import ReactTable from 'react-table'
import DagLeafQuantity from '../DagLeafQuantity';

export default function TablePage(props) {
  const { dag } = props;
  let data = [];
  for(let idx=0; idx<dag.batch.results; idx+=1) {
    let row = [];
    dag.storedLeafs.forEach((leaf) => {
      row.push(leaf.fetch(idx));
    })
    data.push(row);
  }

  let columns = [];
  dag.storedLeafs.forEach((leaf, idx) => {
    if (leaf instanceof DagLeafQuantity) {
      columns.push({
        id: idx+'-'+leaf.name(),
        Header: leaf.name(),
        accessor: (d) => d[idx],
        Cell: row => (Number.parseFloat(row.value).toFixed(2)),
      });
    } else {
      columns.push({
        id: idx+'-'+leaf.name(),
        Header: leaf.name(),
        accessor: (d) => d[idx],
      });
    }
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

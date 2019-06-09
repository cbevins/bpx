import React from 'react';
import ReactTable from 'react-table'
import DagLeafQuantity from '../DagLeafQuantity';

export default function TablePage(props) {
  const { dag } = props;
  let data = dag.batch.store;
  let columns = [];
  dag.storedLeafs.forEach((leaf, idx) => {
    if (leaf instanceof DagLeafQuantity) {
      columns.push({
        id: idx+'-'+leaf.name(),
        Header: leaf.name(),
        accessor: (d) => d[idx],
        Cell: row => (row.value.toPrecision(2)),
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

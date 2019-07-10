import React from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

function ResultsTableHeaders({dag}) {
  const names = dag.storedLeafs.map((leaf, idx) =>
    <th key={idx} align='center'>{leaf.name()}</th>);
  const units = dag.storedLeafs.map((leaf, idx) =>
    <th key={idx} align='center'>{leaf.displayUnits()}</th>);
  return (
    <thead>
      <tr key='names'><th>Run</th>{names}</tr>
      <tr key='units'><th></th>{units}</tr>
    </thead>
  );
}

function ResultsTableRows({dag}) {
  const leaf0 = dag.storedLeafs[0];
  const rows = leaf0.own.results.map((value, rowIdx) => {
    const cols = dag.storedLeafs.map((leaf, colIdx) =>
      <td key={colIdx} align='right'>{leaf.fetchDisplay(rowIdx)}</td>);
      return <tr key={rowIdx}><td>{rowIdx}</td>{cols}</tr>
  });
  return (<tbody>{rows}</tbody>);
}

export default function ResultsTablePage({dag}) {
  return (
    <Container>
      <Table responsive striped bordered hover size='sm'>
        <ResultsTableHeaders dag={dag}/>
        <ResultsTableRows dag={dag}/>
      </Table>
    </Container>
  );
}
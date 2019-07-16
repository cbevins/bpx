import React, { useState } from 'react';

import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

import QuantityEditorModal from './QuantityEditorModal';

function ConditionsButton(props) {
  const {leaf, setLeaf, setShow} = props;
  return (
    <Button variant="link" size="sm"
        onClick={() => {
          setLeaf(leaf);
          setShow(true)}
        }>
      <Badge variant='info'>Edit</Badge>
    </Button>
  )
}

function ConditionsRows(props) {
  const {leafs, setLeaf, setShow} = props;
  const rows = leafs.map((leaf, idx) =>
    <tr key={idx}>
      <td align='left'>
        <ConditionsButton
          leaf={leaf}
          setLeaf={setLeaf}
          setShow={setShow}/>
      </td>
      <td align='left'>
        {leaf.label()}
      </td>
      <td align='right' ><em>{leaf.displayUnits()}</em></td>
      <td align='left'>{leaf.displayInputs().join(', ')}</td>
    </tr>
  );
  return (<tbody>{rows}</tbody>);
}

export default function ConditionsPage({dag}) {
  const [show, setShow] = useState(false);
  const [leaf, setLeaf] = useState(dag.tree);

  if (dag.selectedLeafs.length===0) {
    return (<h3>There are currently no outputs selected</h3>);
  }

  return (
    <Container>
      <h3>Input Conditions</h3>
      <QuantityEditorModal
        dag={dag}
        leaf={leaf}
        show={show}
        setShow={setShow} />
      <Table responsive='sm' striped size='sm'>
        <ConditionsRows
          dag={dag}
          leafs={dag.requiredInputLeafs}
          setShow={setShow}
          setLeaf={setLeaf}/>
      </Table>
    </Container>
  );
}

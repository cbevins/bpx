import React, { useState } from 'react';

import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

import QuantityEditorModal from './QuantityEditorModal';

function ConditionsButton(props) {
  const {leaf, setLeaf, setShowEditor} = props;
  return (
    <Button variant="link" size="sm"
        onClick={() => {
          setLeaf(leaf);
          setShowEditor(true)}
        }>
      <Badge variant='info'>Edit</Badge>
    </Button>
  )
}

function ConditionsRows(props) {
  const {leafs, setLeaf, setShowEditor} = props;
  const rows = leafs.map((leaf, idx) =>
    <tr key={idx}>
      <td align='left'>
        <ConditionsButton
          leaf={leaf}
          setLeaf={setLeaf}
          setShowEditor={setShowEditor}/>
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
  const [showEditor, setShowEditor] = useState(false);
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
        showEditor={showEditor}
        setShowEditor={setShowEditor} />

      <Table responsive='sm' striped size='sm'>
        <ConditionsRows
          dag={dag}
          leafs={dag.requiredInputLeafs}
          setShowEditor={setShowEditor}
          setLeaf={setLeaf}/>
      </Table>
    </Container>
  );
}

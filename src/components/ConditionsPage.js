import React, { useState } from 'react';

import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

import DagLeafQuantity from '../DagLeafQuantity';
import ConditionsEditor from './ConditionsEditor';

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
  const { dag, leafs, setLeaf, setShow } = props;
  const rows = leafs.map((leaf, idx) =>
    <tr key={idx}>
      <td align='left' valign='center'>
        <ConditionsButton leaf={leaf} setLeaf={setLeaf} setShow={setShow}/>
      </td>
      <td align='left'>{leaf.label()}</td>
      <td align='right'>{leaf.value()}</td>
      <td align='left'>{(leaf instanceof DagLeafQuantity)
          ? leaf.currentUnitsString() : ''}</td>
      <td align='left'>[{leaf.own.inputs.join()}]</td>
    </tr>
  );
  return (<tbody>{rows}</tbody>);
}

export default function ConditionsPage(props) {
  const { dag } = props;
  const [show, setShow] = useState(false);
  const [leaf, setLeaf] = useState(dag.tree);
  const [isValid, setIsValid] = useState(null);
  const [isInvalid, setIsInvalid] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [values, setValues] = useState([]);

  if (dag.selectedLeafs.length===0) {
    return (<h3>There are currently no outputs selected</h3>);
  }

  return (
    <Container>
      <h3>Input Conditions</h3>
      <ConditionsEditor
        dag={dag}
        leaf={leaf}
        show={show}
        setShow={setShow}
        isValid={isValid}
        setIsValid={setIsValid}
        isInvalid={isInvalid}
        setIsInvalid={setIsInvalid}
        errorMsg={errorMsg}
        setErrorMsg={setErrorMsg}
        values={values}
        setValues={setValues}/>
      <Table responsive='md' striped size='sm'>
        <ConditionsRows
          dag={dag}
          leafs={dag.requiredInputLeafs}
          setShow={setShow}
          setLeaf={setLeaf}/>
      </Table>
    </Container>
  );
}
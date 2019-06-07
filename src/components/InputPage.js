import React, { useState } from 'react';
import Badge from 'react-bootstrap/Badge'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

import AppDag from './AppDag';

import DagLeafBool from '../DagLeafBool';
import DagLeafOption from '../DagLeafOption';
import DagLeafQuantity from '../DagLeafQuantity';
import DagLeafText from '../DagLeafText';

function boolInputHandler(leaf, e) {
  // Validate and covert here
  const value = e.target.value;
  AppDag.setValue(leaf, value);
}

function optionInputHandler(leaf, e) {
  // Validate and covert here
  const value = e.target.value;
  AppDag.setValue(leaf, value);
}

function quantityInputHandler(leaf, e) {
  // Validate and covert here
  const value = e.target.value;
  let newValues = [];
  let parts = value.replace(/,/g, ' ').split(' ');
  parts.forEach((part) => {
    let n = Number.parseFloat(part);
    if (!Number.isNaN(n)) {
      newValues.push(n);
    }
  })
  let nv = newValues.join(' ');
  if (newValues.length === 1 ) {
    AppDag.setValue(leaf, value);
    return [nv, '']
  } else if (newValues.length > 1) {
    AppDag.setBatchInputs(leaf, newValues);
    return [nv, '']
  } else {
    return ['', 'You must enter a valid quantity'];
  }
}

function textInputHandler(leaf, e) {
  // Validate and covert here
  const value = e.target.value;
  AppDag.setValue(leaf, value);
}

function InputBool(props) {
  const { leaf, id, label, desc, value} = props;
  return (
    <Form.Group as={Form.Row} controlId={id}>
      <Form.Label column sm="4">{label}</Form.Label>
      <Col sm="1"></Col>
      <Col sm="4">
        <Form.Check type="checkbox" inline label="" value={value}
          aria-label="radio 1"
          onClick={(e) => boolInputHandler(leaf, e)} />
        <Form.Text className="text-muted">{desc}</Form.Text>
      </Col>
    </Form.Group>
  );
}

function InputOptionItem(props) {
  const {label, value} = props;
  return (<option value={value} key={value}>{label}</option>);
}

function InputOption(props) {
  const { leaf, id, label, desc, value } = props;
  const options = leaf.itemKeys().map((item) =>
    <InputOptionItem value={item} key={item}
      label={leaf.item(item)} />
  );
  // Because this is a <select>, and no validation is needed,
  // the optionInputHandler() is invoked 'onChange', not 'onBlur'
  return (
    <Form.Group as={Form.Row} controlId={id}>
      <Form.Label column sm="4">{label}</Form.Label>
      <Col sm="1">(select one)</Col>
      <Col sm="4">
        <Form.Control as="select" size="sm" value={value}
          onChange={(e) => optionInputHandler(leaf, e)}>
          {options}
        </Form.Control>
        <Form.Text className="text-muted">{desc}</Form.Text>
      </Col>
    </Form.Group>
  );
}

function InputQuantity(props) {
  const { leaf, id, label, desc, value } = props;
  const units = '(' + leaf.currentUnitsString() + ')';
  const [val, setVal] = useState(value);
  const [err, setErr] = useState('');
  function validate(leaf, e) {
    const [newValue, msg] = quantityInputHandler(leaf, e);
    //alert(`validate '${e.target.value}' into '${newValue}' msg='${msg}'`);
    setVal(newValue);
    setErr(err, msg);
    e.target.focus();
    if (err !== '') {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  // Because this is a quantity, delay calling quantityInputHandler()
  // until 'onBlur' so the entire entry can be parsed and validated
  return (
    <Form.Group as={Form.Row} controlId={id}>
      <Form.Label column sm="4">{label}</Form.Label>
      <Col sm="1">{units}</Col>
      <Col sm="4">
        <Form.Control size="sm" type="text" required
          defaultValue={val}
          onBlur={(e) => validate(leaf, e)} />
        <Form.Text className="text-muted">{desc}</Form.Text>
        <Form.Control.Feedback type="invalid">
          {err}
        </Form.Control.Feedback>
      </Col>
    </Form.Group>
  );
}

function InputText(props) {
  const { leaf, id, label, desc, value } = props;
  return (
    <Form.Group as={Form.Row} controlId={id}>
      <Form.Label column sm="4">{label}</Form.Label>
      <Col sm="1"></Col>
      <Col sm="4">
        <Form.Control size="sm" type="text"
          defaultValue={value}
          onBlur={(e) => textInputHandler(leaf, e)} />
        <Form.Text className="text-muted">{desc}</Form.Text>
      </Col>
    </Form.Group>
  );
}

function InputItem(props) {
  const { dag, leaf, id, label, desc, value } = props;
  if (leaf instanceof DagLeafBool) {
    return (<InputBool dag={dag} leaf={leaf} id={id} value={value} label={label} desc={desc} />);
  } else if (leaf instanceof DagLeafOption) {
    return (<InputOption dag={dag} leaf={leaf} id={id} value={value} label={label} desc={desc} />);
  } else if (leaf instanceof DagLeafQuantity) {
    return (<InputQuantity dag={dag} leaf={leaf} id={id} value={value} label={label} desc={desc} />);
  } else if (leaf instanceof DagLeafText) {
    return (<InputText dag={dag} leaf={leaf} id={id} value={value} label={label} desc={desc} />);
  }
}

export function InputForm(props) {
  const {dag} = props;
  const inputs = dag.requiredInputLeafs.map((leaf) =>
    <InputItem
      key={'inputForm-'+leaf.fullName()}
      id={'formCOntrol-'+leaf.fullName()}
      dag={dag}
      leaf={leaf}
      value={leaf.value()}
      label={leaf.label()}
      desc={leaf.desc()} />
  );
  return (
    <Form>
      {inputs}
    </Form>
  );
}

export default function InputPage(props) {
  const { dag } = props;
  const nselected = dag.selectedLeafs.length;
  const ninputs = dag.requiredInputLeafs.length
  let dimensions = 0;
  let runs = 1;
  dag.requiredInputLeafs.forEach((leaf) => {
    let n = leaf.own.inputs.length;
    if (n > 1 ) {
      dimensions += 1;
      runs *= n;
    }
  });
  return (
    <div>
      <p>
      <Table responsive="sm" bordered>
        <tr>
        <td><Badge variant="secondary">{nselected}</Badge>Selected Outputs</td>
        <td><Badge variant="secondary">{ninputs}</Badge>Required Inputs</td>
        <td><Badge variant="secondary">{dimensions}</Badge>Ranged Inputs</td>
        <td><Badge variant="secondary">{runs}</Badge>Result Sets</td>
        </tr>
      </Table>
      </p>
      <InputForm dag={dag} />
    </div>
  );
}

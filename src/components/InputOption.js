import React from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import AppDag from './AppDag';

function optionInputHandler(leaf, e) {
  // Validate and covert here
  const value = e.target.value;
  AppDag.setValue(leaf, value);
}

function InputOptionItem(props) {
  const {label, value} = props;
  return (<option value={value} key={value}>{label}</option>);
}

export default function InputOption(props) {
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

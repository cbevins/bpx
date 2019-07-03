import React from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

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
  const { leaf, id, label, value } = props;
  const options = leaf.itemKeys().map((item) =>
    <InputOptionItem value={item} key={item}
      label={leaf.item(item)} />
  );
  // Because this is a <select>, and no validation is needed,
  // the optionInputHandler() is invoked 'onChange', not 'onBlur'
  return (
    <Form.Group as={Form.Row} controlId={id}>
      <Form.Label column sm="4">{label}</Form.Label>
      <Col sm={1}>
        <Button size="sm">?</Button>
      </Col>
      <Col sm="3">
        <Form.Control as="select" size="sm" value={value}
          onChange={(e) => optionInputHandler(leaf, e)}>
          {options}
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          {leaf.own.form.errors.join(', ')}
        </Form.Control.Feedback>
      </Col>
    </Form.Group>
  );
}

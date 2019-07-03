import React from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import AppDag from './AppDag';

function textInputHandler(leaf, e) {
  // Validate and covert here
  const value = e.target.value;
  AppDag.setValue(leaf, value);
}

export default function InputText(props) {
  const { leaf, id, label, value } = props;
  return (
    <Form.Group as={Form.Row} controlId={id}>
      <Form.Label column sm="4">{label}</Form.Label>
      <Col sm={1}>
        <Button size="sm">?</Button>
      </Col>
      <Col sm="3">
        <Form.Control size="sm" type="text"
          defaultValue={value}
          onBlur={(e) => textInputHandler(leaf, e)} />
        <Form.Control.Feedback type="invalid">
          {leaf.own.form.errors.join(', ')}
        </Form.Control.Feedback>
      </Col>
    </Form.Group>
  );
}

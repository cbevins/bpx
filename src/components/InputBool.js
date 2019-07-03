import React from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import AppDag from './AppDag';

function boolInputHandler(leaf, e) {
  // Validate and covert here
  const value = e.target.value;
  AppDag.setValue(leaf, value);
}

export default function InputBool(props) {
  const { leaf, id, label, value} = props;
  return (
    <Form.Group as={Form.Row} controlId={id}>
      <Form.Label column sm="4">{label}</Form.Label>
      <Col sm={1}>
        <Button size="sm">?</Button>
      </Col>
      <Col sm="3">
        <Form.Check type="checkbox" inline label="" value={value}
          aria-label="radio 1"
          onClick={(e) => boolInputHandler(leaf, e)} />
        <Form.Control.Feedback type="invalid">
          {leaf.own.form.errors.join(', ')}
        </Form.Control.Feedback>
      </Col>
    </Form.Group>
  );
}

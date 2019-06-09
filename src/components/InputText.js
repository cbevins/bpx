import React from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import AppDag from './AppDag';

function textInputHandler(leaf, e) {
  // Validate and covert here
  const value = e.target.value;
  AppDag.setValue(leaf, value);
}

export default function InputText(props) {
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

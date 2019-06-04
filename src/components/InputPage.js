import React from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import AppDag from './AppDag';

function InputText(props) {
  const { leaf, id } = props;
  const label = leaf.label();
  const value = leaf.value();
  const desc = leaf.desc();
  return (
    <Form.Group as={Form.Row} controlId={id}>
      <Form.Label column sm="2">{label}</Form.Label>
      <Col sm="2">
        <Form.Control size="sm" type="text" value={value} />
        <Form.Text className="text-muted">{desc}</Form.Text>
      </Col>
    </Form.Group>
  );
}

export function InputForm(props) {
  const dag = AppDag.getDag();
  const inputs = dag.requiredInputLeafs.map((leaf, idx) =>
    <InputText leaf={leaf} id={idx} />
  );
  return (
    <Form>
      {inputs}
    </Form>
  );
}

export default function InputPage(props) {
  const dag = AppDag.getDag();
  const input = dag.requiredInputLeafs.length;
  const selected = dag.selectedLeafs.length;
  return (
    <div>
      <h3>The {selected} selected variables require {input} inputs:</h3>
      <InputForm />
    </div>
  );
}

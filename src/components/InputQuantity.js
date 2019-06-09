import React, { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import AppDag from './AppDag';

function quantityInputHandler(leaf, e) {
  // Validate and covert here
  const value = e.target.value;
  let newValues = [];
  let parts = value.replace(/,/g, ' ').split(' ');
  let n = 0;
  parts.forEach((part) => {
    // Is this part a from/thru/step loop?
    let loop = part.split('/');
    if ( loop.length === 3) {
      let from = Number.parseFloat(loop[0]);
      let thru = Number.parseFloat(loop[1]);
      let step = Math.abs(Number.parseFloat(loop[2]));
      if (!Number.isNaN(from) && !Number.isNaN(thru) && !Number.isNaN(step) ){
        if (from <= thru) {
          if (step!==0) {
            for (n=from; n<=thru; n+=step) {
              newValues.push(n);
            }
          }
        } else if (thru < from) {
          if (step!==0) {
            for(n=from; n>=thru; n-=step) {
              newValues.push(n);
            }
          }
        }
      }
    } else {
      n = Number.parseFloat(part);
      if (!Number.isNaN(n)) {
        newValues.push(n);
      }
    }
  })
  let nv = newValues.join(' ');
  if (newValues.length === 1 ) {
    AppDag.setValue(leaf, value);
    return [nv, '']
  } else if (newValues.length > 1) {
    AppDag.setBatchInputs(leaf, newValues);
    AppDag.updateBatch(false);
    return [nv, '']
  } else {
    return ['', 'You must enter a valid quantity'];
  }
}

export default function InputQuantity(props) {
  const { leaf, id, label, desc, value } = props;
  const units = '(' + leaf.currentUnitsString() + ')';
  const [val, setVal] = useState(value);
  const [err, setErr] = useState('');
  function validate(leaf, e) {
    const [newValue, msg] = quantityInputHandler(leaf, e);
    //alert(`validate '${e.target.value}' into '${newValue}' msg='${msg}'`);
    setVal(newValue);
    setErr(msg);
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

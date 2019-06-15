import React, { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import AppDag from './AppDag';

function quantityInputParser(leaf, content) {
  let values = [];
  const errors = [];
  let parts = content.replace(/,/g, ' ').split(' ');
  let n = 0;
  parts.forEach((part) => {
    // Is this part a from/thru/step loop?
    let loop = part.split('/');
    if ( loop.length === 3) {
      let from = Number.parseFloat(loop[0]);
      let thru = Number.parseFloat(loop[1]);
      let step = Math.abs(Number.parseFloat(loop[2]));
      if (Number.isNaN(from)) {
        errors.push(`LOOP_FROM_IS_NaN`);
      } else if (Number.isNaN(thru)) {
        errors.push(`LOOP_THRU_IS_NaN`);
      } else if (Number.isNaN(step)) {
        errors.push(`LOOP_STEP_IS_NaN`);
      } else if (step===0) {
        errors.push(`LOOP_STEP_IS_ZERO`);
      } else {
        step = Math.abs(step);
        if (from <= thru) {
          for (n=from; n<=thru; n+=step) {
            values.push(n);
          }
        } else {
          for(n=from; n>=thru; n-=step) {
            values.push(n);
          }
        }
      }
    } else if (part==='') {
      // do nothing
    } else {  // not loop notation, expect a simple number
      n = Number.parseFloat(part);
      if (Number.isNaN(n)) {
        errors.push(`VALUE_IS_NaN`);
      }
      values.push(n);
    }
  })

  if (errors.length) {
    return {values: [], errors: errors, display: content};
  } else if (values.length===0) {
    return {values: [], errors: [`INPUT_REQUIRED`], display: ''};
  }
  // Everything is ok
  return {values: values, errors: errors, display: values.join(' ')};
}

function quantityInputHandler(leaf, content, setDisplay, setValid, setInvalid, setErrors) {
  const {values, errors, display} = quantityInputParser(leaf, content);
  leaf.own.form.display = display;
  leaf.own.form.errors = errors;
  if (errors.length===0) {
    leaf.own.form.isValid = true;
    leaf.own.form.isInvalid = false;
    AppDag.setBatchInputs(leaf, values);
  } else {
    leaf.own.form.isValid = false;
    leaf.own.form.isInvalid = true;
  }
  setValid(leaf.own.form.isValid);
  setInvalid(leaf.own.form.isInvalid);
  setDisplay(leaf.own.form.display);
  const errorStr = leaf.own.form.errors.join(', ');
  setErrors(errorStr);
  AppDag.stateUpdater();
  alert(`content='${content}' display='${display}' errs='${errorStr}'`);
}

export default function InputQuantity(props) {
  const { leaf, label } = props;
  const units = '(' + leaf.currentUnitsString() + ')';

  const [display, setDisplay] = useState(leaf.own.form.display);
  const [valid, setValid] = useState(true);
  const [invalid, setInvalid] = useState(false);
  const [errors, setErrors] = useState('');

  function inputQuantityValidate(leaf, e) {
    quantityInputHandler(leaf, e.target.value, setDisplay, setValid, setInvalid, setErrors);
  }

  // Because this is a quantity, delay calling quantityInputHandler()
  // until 'onBlur' so the entire entry can be parsed and validated
  return (
    <Form.Group as={Form.Row}>
      <Form.Label column sm="4">{label}</Form.Label>
      <Col sm={1}>
        <Button size="sm">?</Button>
      </Col>
      <Col sm="3">
        <Form.Control size="sm" type="text"
          defaultValue={display}
          isValid={valid}
          isInvalid={invalid}
          onBlur={(e) => inputQuantityValidate(leaf, e)}/>
        <Form.Control.Feedback type="invalid">
          {errors}
        </Form.Control.Feedback>
      </Col>
      <Col sm={2}>
        <Button>{units}</Button>
      </Col>
    </Form.Group>
  );
}

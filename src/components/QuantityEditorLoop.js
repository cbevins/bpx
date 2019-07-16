import React from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import AppDag from './AppDag';

function loopValues(from, thru, step) {
  step = Math.abs(step);
  if (step===0) {
    step = Math.abs(thru - from);
  }
  const values = [];
  if (from<=thru) {
    for(let val=from; val<=thru; val+=step) {
      values.push(val);
    }
  } else {
    for(let val=from; val>=thru; val-=step) {
      values.push(val);
    }
  }
  return values;
}

export default function QuantityEditorLoop(props) {
  const {leaf, setShow, form, setForm, freshForm, visited} = props;

  function validateQuantity(leaf, text, item) {
    const newForm = {...form};
    newForm[item] = {...visited};
    let [errMsg, val] = leaf.validateInput(text);
    if (errMsg) {
      newForm[item].errors.push(errMsg);
      newForm[item].isValid = false;
      newForm[item].isInvalid = true;
    } else {
      newForm[item].values.push(val);
    }
    setForm(newForm);
    return (newForm.from.errors.length===0)
  }

  return (
    <Card.Body>
      <Card.Title></Card.Title>
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text>From</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control type="text"
          isValid={form.from.isValid}
          isInvalid={form.from.isInvalid}
          onBlur={(e) => validateQuantity(leaf, e.target.value, 'from')}/>
        <Form.Control.Feedback type="invalid">
          {form.from.errors}
        </Form.Control.Feedback>
      </InputGroup>

      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text>Thru</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control type="text"
          isValid={form.thru.isValid}
          isInvalid={form.thru.isInvalid}
          onBlur={(e) => validateQuantity(leaf, e.target.value, 'thru')}/>
        <Form.Control.Feedback type="invalid">
          {form.thru.errors}
        </Form.Control.Feedback>
      </InputGroup>

      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text>Step</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control type="text"
          isValid={form.step.isValid}
          isInvalid={form.step.isInvalid}
          onBlur={(e) => validateQuantity(leaf, e.target.value, 'step')}/>
        <Form.Control.Feedback type="invalid">
          {form.step.errors}
        </Form.Control.Feedback>
      </InputGroup>

      <Button variant='primary'
          onClick={() => {
            if (form.from.isValid && form.thru.isValid && form.step.isValid) {
              const displayValues = loopValues(form.from.values[0],
                form.thru.values[0], form.step.values[0]);
              // Convert from display units values to base units values
              const baseValues = displayValues.map(x =>
                leaf.displayValueToBaseValue(x));
              // Store the base units values back onto the leaf
              AppDag.setBatchInputs(leaf, baseValues);
              // Clear the form and drop the modal dialog
              setForm({...freshForm});
              setShow(false);
            } else {
              alert('Please complete all fields and fix any errors');
            }
          }}>
        Apply Loop
      </Button>
      <Button variant='secondary'
          onClick={() => {
            // Clear the form and drop the modal dialog
            setForm({...freshForm});
            setShow(false);
          }}>
        Cancel
      </Button>
    </Card.Body>
  );
}

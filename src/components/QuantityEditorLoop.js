import React, {useState} from 'react';

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

export default function QuantityEditorLoop({leaf, setShowEditor}) {
  const pristineField = {isValid: null, isInvalid: null, visited: false, values: [], errors: []};
  const visitedField = {isValid: true, isInvalid: false, visited: true, values: [], errors: [] };
  const pristineForm = {
    from: {...pristineField},
    thru: {...pristineField},
    step: {...pristineField},
  };
  const [form, setForm] = useState({...pristineForm});

  function validateQuantity(leaf, text, field) {
    const newForm = {...form};
    newForm[field] = {...visitedField};
    let [errMsg, val] = leaf.validateInput(text);
    if (errMsg) {
      newForm[field].errors.push(errMsg);
      newForm[field].isValid = false;
      newForm[field].isInvalid = true;
    } else {
      newForm[field].values.push(val);
    }
    setForm(newForm);
    return (newForm[field].errors.length===0)
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
              setForm({...pristineForm});
              setShowEditor(false);
            } else {
              alert('Please complete all fields and fix any errors');
            }
          }}>
        Apply Loop
      </Button>
      <Button variant='secondary'
          onClick={() => {
            // Clear the form and drop the modal dialog
            setForm({...pristineForm});
            setShowEditor(false);
          }}>
        Cancel
      </Button>
    </Card.Body>
  );
}

import React, {useState} from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import AppDag from './AppDag';

export default function QuantityEditorValues({leaf, setShowEditor}) {
  const pristineField = {isValid: null, isInvalid: null, visited: false, values: [], errors: []};
  const visitedField = {isValid: true, isInvalid: false, visited: true, values: [], errors: [] };
  const pristineForm = {
    values: {...pristineField},
  };

  const [form, setForm] = useState({...pristineForm});

  function validateQuantityValues(leaf, text) {
    const newForm = {...form};
    newForm.values = {...visitedField};
    let parts = text.replace(/,/g, ' ').split(' ');
    parts.forEach((part) => {
      let [errMsg, val] = leaf.validateInput(part);
      if (errMsg) {
        newForm.values.errors.push(errMsg);
        newForm.values.isValid = false;
        newForm.values.isInvalid = true;
      } else {
        newForm.values.values.push(val);
      }
    });
    setForm(newForm);
    return (newForm.values.errors.length===0)
  }

  return (
    <Card.Body>
      <Card.Title></Card.Title>
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text>Enter Values</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control type="text"
          isValid={form.values.isValid}
          isInvalid={form.values.isInvalid}
          onBlur={(e) => validateQuantityValues(leaf, e.target.value)}/>
        <Form.Control.Feedback type="invalid">
          {form.values.errors}
        </Form.Control.Feedback>
      </InputGroup>
      <Button variant='primary'
          onClick={() => {
            if (form.values.isValid) {
              // Convert from display units values to base units values
              const baseValues = form.values.values.map(x =>
                leaf.displayValueToBaseValue(x));
              // Store the base units values back onto the leaf
              AppDag.setBatchInputs(leaf, baseValues);
              setForm({...pristineForm});
              setShowEditor(false);
            } else {
              alert('Please complete all fields and fix any errors');
            }
          }}>
        Apply Values
      </Button>
      <Button variant='secondary'
          onClick={() => {
            setForm({...pristineForm});
            setShowEditor(false);
          }}>
        Cancel
      </Button>
    </Card.Body>
  );
}

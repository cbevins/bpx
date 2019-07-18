import React, {useState} from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import ProgressBar from 'react-bootstrap/ProgressBar'

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

export function QuantityEditorLoopItem({leaf, form, field, setForm}) {
  const visitedField = {isValid: true, isInvalid: false, visited: true, values: [], errors: [] };

  function validateQuantity2(leaf, text, field) {
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

  const label = field.charAt(0).toUpperCase() + field.slice(1);
  return (
    <InputGroup className="mb-3">
      <InputGroup.Prepend>
        <InputGroup.Text>{label}</InputGroup.Text>
      </InputGroup.Prepend>
      <Form.Control type="text"
        isValid={form[field].isValid}
        isInvalid={form[field].isInvalid}
        onBlur={(e) => validateQuantity2(leaf, e.target.value, field)}/>
      <Form.Control.Feedback type="invalid">
        {form[field].errors}
      </Form.Control.Feedback>
    </InputGroup>
  );
}

function QuantityEditorLoopProgressBar(props) {
  const {now, showProgress, setShowProgress} = props;
  return (
    <Modal show={showProgress} centered onHide={() => setShowProgress(false)}>
      <Modal.Header closeButton>
        <Modal.Title></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ProgressBar now={now} />
      </Modal.Body>
    </Modal>
  );
}

export default function QuantityEditorLoop({leaf, setShowEditor}) {
  const pristineField = {isValid: null, isInvalid: null, visited: false, values: [], errors: []};
  const pristineForm = {
    from: {...pristineField},
    thru: {...pristineField},
    step: {...pristineField},
  };
  const [form, setForm] = useState({...pristineForm});

  // Progress bar state
  const [showProgress, setShowProgress] = useState(false);
  const [now, setNow] = useState(0);

  function updateProgress(run, runs) {
    const current = 100 * run / runs;
    //setNow(current);
  }

  return (
    <Card.Body>
      <Card.Title></Card.Title>

      <QuantityEditorLoopItem leaf={leaf} form={form} field='from' setForm={setForm} />
      <QuantityEditorLoopItem leaf={leaf} form={form} field='thru' setForm={setForm} />
      <QuantityEditorLoopItem leaf={leaf} form={form} field='step' setForm={setForm} />

      <Button variant='primary'
          onClick={() => {
            if (form.from.isValid && form.thru.isValid && form.step.isValid) {
              const displayValues = loopValues(form.from.values[0],
                form.thru.values[0], form.step.values[0]);
              // Convert from display units values to base units values
              const baseValues = displayValues.map(x =>
                leaf.displayValueToBaseValue(x));
              // Store the base units values back onto the leaf
              setShowProgress(true);
              setNow(0);
              AppDag.setBatchInputs(leaf, baseValues, updateProgress);
              setNow(100);
              setShowProgress(false);
              // Clear the form and drop the modal dialog
              setForm({...pristineForm});
              setShowEditor(false);
            } else {
              alert('Please complete all fields and fix any errors');
            }
          }}>
        Apply Loop &amp; Update
      </Button>

      <Button variant='secondary'
          onClick={() => {
            // Clear the form and drop the modal dialog
            setForm({...pristineForm});
            setShowEditor(false);
          }}>
        Cancel
      </Button>

      <QuantityEditorLoopProgressBar
        showProgress={showProgress}
        setShowProgress={setShowProgress}
        now={now} />
    </Card.Body>
  );
}

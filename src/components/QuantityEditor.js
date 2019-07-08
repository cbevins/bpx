import React from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import AppDag from './AppDag';

export function freshData() {
  return {
    values: {isValid: null, isInvalid: null, values: [], errors: [] },
    from: {isValid: null, isInvalid: null, value: [], errors: [] },
    thru: {isValid: null, isInvalid: null, value: [], errors: [] },
    step: {isValid: null, isInvalid: null, value: [], errors: [] },
  };
}

export default function QuantityEditor (props) {
  const {dag, leaf, show, setShow, data, setData} = props;
  const fresh = {isValid: true, isInvalid: false, values: [], errors: [] };

  function loopValues() {
    const from = data.from.values[0];
    const thru = data.thru.values[0];
    const step = Math.abs(data.step.values[0]);
    const values = [];
    if (from<=thru) {
      for(let val=from; val<=thru; val+=step) {
        values.push(val);
      }
    } else {
      for(let val=from; val<=thru; val-=step) {
        values.push(val);
      }
    }
    return values;
  }

  // Returns null errorMsg and a value on success.
  // Returns a literal string error message and null value on failure.
  function isValidQuantityValue(text) {
    //alert(`validating '${text}'`);
    const content = text.trim();
    if ( content==='') {
      return [`INPUT_REQUIRED`, null];
    }
    let val = Number.parseFloat(content);
    if (Number.isNaN(val)) {
      return [`VALUE_IS_NaN: '${content}'`, null];
    }
    // \TODO Add min, max validation here
    return [null, val];
  }

  function validateQuantityFromThru(text) {
    const item = {...fresh};
    let [errMsg, val] = isValidQuantityValue(text);
    if (errMsg) {
      item.errors.push(errMsg);
      item.isValid = false;
      item.isInvalid = true;
    } else {
      item.values.push(val);
    }
    return item;
  }

  function validateQuantityFrom(text) {
    const newData = {...data};
    newData.from = validateQuantityFromThru(text)
    setData(newData);
    return (newData.from.errors.length===0)
  }

  function validateQuantityThru(text) {
    const newData = {...data};
    newData.thru = validateQuantityFromThru(text)
    setData(newData);
    return (newData.thru.errors.length===0)
  }

  function validateQuantityStep(text) {
    const newData = {...data};
    newData.step = validateQuantityFromThru(text)
    setData(newData);
    return (newData.step.errors.length===0)
  }

  function validateQuantityValues(text) {
    const newData = {...data};
    newData.values = {...fresh};
    let parts = text.replace(/,/g, ' ').split(' ');
    parts.forEach((part) => {
      let [errMsg, val] = isValidQuantityValue(part);
      if (errMsg) {
        newData.values.errors.push(errMsg);
        newData.values.isValid = false;
        newData.values.isInvalid = true;
      } else {
        newData.values.values.push(val);
      }
    });
    setData(newData);
    return (newData.values.errors.length===0)
  }

  return (
    <Modal show={show} centered onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{leaf.label()}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs defaultActiveKey='individual' id='quantity-input-tab-example'>
          <Tab eventKey='individual' title='Enter All Values'>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text>Enter Values</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control type="text"
              isValid={data.values.isValid}
              isInvalid={data.values.isInvalid}
              onBlur={(e) => validateQuantityValues(e.target.value)}/>
            <Form.Control.Feedback type="invalid">
              {data.values.errors}
            </Form.Control.Feedback>
          </InputGroup>
            <Button variant='primary'
                onClick={() => {
                  if (data.values.isValid) {
                    // Store the values back onto the leaf
                    AppDag.setBatchInputs(leaf, data.values.values);
                    setData(freshData());
                    setShow(false);
                  } else {
                    alert('Please fix the errors');
                  }
                }}>
              Apply Values
            </Button>
            <Button variant='secondary'
                onClick={() => {
                  setData(freshData());
                  setShow(false);
                }}>
              Cancel
            </Button>
          </Tab>

          <Tab eventKey='loop' title='Enter Loop Values'>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>From</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control type="text"
                isValid={data.from.isValid}
                isInvalid={data.from.isInvalid}
                onBlur={(e) => validateQuantityFrom(e.target.value)}/>
              <Form.Control.Feedback type="invalid">
                {data.from.errors}
              </Form.Control.Feedback>
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>Thru</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control type="text"
                isValid={data.thru.isValid}
                isInvalid={data.thru.isInvalid}
                onBlur={(e) => validateQuantityThru(e.target.value)}/>
              <Form.Control.Feedback type="invalid">
                {data.thru.errors}
              </Form.Control.Feedback>
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>Step</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control type="text"
                isValid={data.step.isValid}
                isInvalid={data.step.isInvalid}
                onBlur={(e) => validateQuantityStep(e.target.value)}/>
              <Form.Control.Feedback type="invalid">
                {data.step.errors}
              </Form.Control.Feedback>
            </InputGroup>

            <Button variant='primary'
                onClick={() => {
                  if (data.from.isValid && data.thru.isValid && data.step.isValid) {
                    // Store the values back onto the leaf
                    //alert(`Set the loop values ${data.from.values[0]},${data.thru.values[0]}.${data.step.values[0]}`);
                    AppDag.setBatchInputs(leaf, loopValues());
                    setData(freshData());
                    setShow(false);
                  } else {
                    alert('Please make valid entries');
                  }
                }}>
              Apply Loop
            </Button>
            <Button variant='secondary'
                onClick={() => {
                  setData(freshData());
                  setShow(false);
                }}>
              Cancel
            </Button>
              </Tab>
          <Tab eventKey='wizard' title='Wizard'>
            Select one or more recommended values...
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
}

import React from 'react';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import AppDag from './AppDag';

export default function ConditionsEditor (props) {
  const {
    dag, leaf,
    show, setShow,
    isValid, setIsValid,
    isInvalid, setIsInvalid,
    values, setValues,
    errorMsg, setErrorMsg} = props;

  function validateQuantityValues(text) {
    alert(`validating '${text}'`);
    let nerr = 0;
    const newValues = [];
    setErrorMsg(null);
    const content = text.trim();
    if ( content==='') {
      setErrorMsg('INPUT_REQUIRED');
      nerr += 1;
    } else {
      let parts = content.replace(/,/g, ' ').split(' ');
      parts.forEach((part) => {
        let n = Number.parseFloat(part);
        if (Number.isNaN(n)) {
          setErrorMsg(`VALUE_IS_NaN: '${part}'`);
          nerr += 1;
        } else {
          newValues.push(n);
        }
      })
    }
    if (nerr > 0) {
      setIsValid(false);
      setIsInvalid(true);
      return false;
    }
    setValues(newValues);
    setIsValid(true);
    setIsInvalid(false);
    return true;
  }

  return (
    <Modal show={show} centered onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{leaf.label()}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs defaultActiveKey='individual' id='quantity-input-tab-example'>
          <Tab eventKey='individual' title='Enter Values'>
            <Form.Group as={Form.Row}>
              <Form.Label column sm="4">One or More Values</Form.Label>
              <Col sm="4">
                <Form.Control size="sm" type="text"
                  isValid={isValid}
                  isInvalid={isInvalid}
                  onBlur={(e) => validateQuantityValues(e.target.value)}/>
                <Form.Control.Feedback type="invalid">
                  {errorMsg}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
          </Tab>
          <Tab eventKey='loop' title='Enter Loop'>
            Enter min, max, and increment values
          </Tab>
          <Tab eventKey='units' title='Units'>
            Select units-of-measure and number of decimal places...
          </Tab>
          <Tab eventKey='wizard' title='Wizard'>
            Select one or more recommended values...
          </Tab>
          <Tab eventKey='info' title='Info'>
            See more info about this quantity...
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary'
            onClick={() => {
              setIsValid(null);
              setIsInvalid(null);
              setShow(false);
            }}>
          Cancel
        </Button>
        <Button variant='primary'
            onClick={() => {
              if (isValid) {
                // Store the values back onto the leaf
                AppDag.setBatchInputs(leaf, values);
                setIsValid(null);
                setIsInvalid(null);
                setShow(false);
              }
            }}>
          Apply
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

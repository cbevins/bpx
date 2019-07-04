import React, { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

export default function RbModalForm (props) {
  const { dag } = props;
  const leaf = dag.tree.site.moisture.dead.tl1h;

  const [show, setShow] = useState(false);
  const [isValid, setIsValid] = useState(null);
  const [isInvalid, setIsInvalid] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [values, setValues] = useState([]);

  function validateQuantityValues(text) {
    alert(`validating '${text}'`);
    let nerr = 0;
    const values = [];
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
          values.push(n);
        }
      })
    }
    if (nerr > 0) {
      setIsValid(false);
      setIsInvalid(true);
      return false;
    }
    setValues(values);
    setIsValid(true);
    setIsInvalid(false);
    return true;
  }

  return (
    <>
      <Button variant='primary' onClick={() => setShow(true)}>
        React-Bootstrap Modal Form
      </Button>

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
              Select on or more recommended values...
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
                  setIsValid(null);
                  setIsInvalid(null);
                  setShow(false);
                }
              }}>
            Apply
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

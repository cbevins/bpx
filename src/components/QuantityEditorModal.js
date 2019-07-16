import React from 'react';

import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import QuantityEditorLoop from './QuantityEditorLoop';
import QuantityEditorValues from './QuantityEditorValues';

export function freshInput() {
  return {isValid: null, isInvalid: null, visited: false, values: [], errors: []};
}

export function freshForm() {
  return {
    values: freshInput(),
    from: freshInput(),
    thru: freshInput(),
    step: freshInput(),
  };
}

export default function QuantityEditor (props) {
  const {dag, leaf, show, setShow, form, setForm} = props;
  const visited = {isValid: true, isInvalid: false, visited: true, values: [], errors: [] };

  return (
    <Modal show={show} centered onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{leaf.label()}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs defaultActiveKey='individual' id='quantity-input-tab-example'>
          <Tab eventKey='individual' title='Enter All Values'>
          </Tab>
            <QuantityEditorValues leaf={leaf} setShow={setShow}
              form={form} setForm={setForm} freshForm={freshForm} visited={visited}/>
          <Tab eventKey='loop' title='Enter Loop Values'>
           <QuantityEditorLoop leaf={leaf} setShow={setShow}
              form={form} setForm={setForm} freshForm={freshForm} visited={visited}/>
          </Tab>
          <Tab eventKey='wizard' title='Wizard'>
            <Card.Body>
              <Card.Title></Card.Title>
              Select one or more recommended values...
            </Card.Body>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
}

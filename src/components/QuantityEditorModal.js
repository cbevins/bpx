import React from 'react';

import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import QuantityEditorLoop from './QuantityEditorLoop';
import QuantityEditorValues from './QuantityEditorValues';

export default function QuantityEditorModal(props) {
  const {leaf, show, setShow, form, setForm, freshForm, visited} = props;

  return (
    <Modal show={show} centered onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{leaf.label()}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs defaultActiveKey='individual' id='quantity-input-tab-example'>

          <Tab eventKey='individual' title='Enter All Values'>
            <QuantityEditorValues
              leaf={leaf}
              setShow={setShow}
              form={form}
              setForm={setForm}
              freshForm={freshForm}
              visited={visited}/>
          </Tab>

          <Tab eventKey='loop' title='Enter Loop Values'>
            <QuantityEditorLoop
              leaf={leaf}
              setShow={setShow}
              form={form}
              setForm={setForm}
              freshForm={freshForm}
              visited={visited}/>
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

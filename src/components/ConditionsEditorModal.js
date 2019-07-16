import React from 'react';

import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';

import OptionEditor from './OptionEditor';
import QuantityEditor from './QuantityEditor';

function ConditionsEditor(props) {
  const {leaf, setShowEditor} = props;
  if (leaf.isQuantity()) {
    return (
      <QuantityEditor leaf={leaf} setShowEditor={setShowEditor} />
    );
  } else if (leaf.isOption()) {
    return (
      <Card.Body>
      <Card.Title></Card.Title>
        <OptionEditor leaf={leaf} setShowEditor={setShowEditor} />
      </Card.Body>
    )
  } else if (leaf.isText()) {
    return (
      <Card.Body>
      <Card.Title></Card.Title>
        Please enter text:
      </Card.Body>
    )
  } else if (leaf.isBool()) {
    return (
      <Card.Body>
      <Card.Title></Card.Title>
        Select one of these options:
      </Card.Body>
    )
  }
}

export default function ConditionsEditorModal(props) {
  const {leaf, showEditor, setShowEditor} = props;

  return (
    <Modal show={showEditor} centered onHide={() => setShowEditor(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{leaf.label()}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ConditionsEditor leaf={leaf} setShowEditor={setShowEditor} />
      </Modal.Body>
    </Modal>
  );
}

import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import AppDag from './AppDag';
import AppSelections from './AppSelections';

function selectionHandler(leaf, e) {
  if (e.target.checked) {
    AppDag.select(leaf);
  } else {
    AppDag.unselect(leaf);
  }
}

function SelectItem(props) {
  const { leafs } = props;
  const items = leafs.map((item) => {
    let [leaf, label] = item;
    return (
      <Form.Check type="checkbox"
        onClick={(e) => selectionHandler(leaf, e)}
        id={leaf.fullName('-')}
        key={leaf.fullName('-')}
        label={`${label} (${leaf.name()})`} />
    );
  });
  return (<div>{items}</div>);
}

function SelectBlock(props) {
  const { data, ekey, id } = props;
  return (
    <Card>
    <Card.Header>
      <Accordion.Toggle as={Card.Header} variant="link" eventKey={ekey}>
        {data.title}
      </Accordion.Toggle>
    </Card.Header>
      <Accordion.Collapse eventKey={ekey}>
        <Card.Body>
          <Form.Group controlId={id}>
            <SelectItem leafs={data.leafs} />
          </Form.Group>
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
}

export default function SelectPage(props) {
  const selections = AppSelections.all().map((cat, idx) =>
    <SelectBlock key={idx} data={cat} id={idx} ekey={idx.toString()} />
  );
  return (<Accordion defaultActiveKey="0">{selections}</Accordion>);
}

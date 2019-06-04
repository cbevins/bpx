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
  const items = leafs.map((item) =>
    <Form.Check type="checkbox"
      onClick={(e) => selectionHandler(item[0], e)}
      id={item[0].fullName('-')}
      key={item[0].fullName('-')}
      label={`${item[1]} (${item[0].name()})`} />
  );
  return (<div>{items}</div>);
}

function SelectBlock(props) {
  const { data, ekey } = props;
  return (
    <Card>
    <Card.Header>
      <Accordion.Toggle as={Card.Header} variant="link" eventKey={ekey}>
        {data.title}
      </Accordion.Toggle>
    </Card.Header>
      <Accordion.Collapse eventKey={ekey}>
        <Card.Body>
          <Form.Group controlId="formSelectPage">
            <SelectItem leafs={data.leafs} />
          </Form.Group>
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
}

export default function SelectPage(props) {
  const selections = AppSelections.all().map((cat, idx) =>
    <SelectBlock key={idx} data={cat} ekey={idx.toString()} />
  );
  return (
    <Accordion defaultActiveKey="0">
      {selections}
    </Accordion>
  );
}

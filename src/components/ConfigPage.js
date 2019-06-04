import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

function configChanged(dag, leaf, e) {
  //alert(e.target.value);
  dag.setValue(leaf, e.target.value);
}

function ConfigOption(props) {
  const label = props.leaf.own.option.items[props.value];
  const current = props.leaf.own.value;
  if (current === props.value) {
    return <option value={props.value} selected>{label}</option>;
  } else {
    return <option value={props.value}>{label}</option>;
  }
}

function ConfigItem(props) {
  const leaf = props.leaf;
  const items = Object.keys(leaf.own.option.items);
  const options = items.map((item) =>
    <ConfigOption leaf={leaf} value={item} />
  );
  return (
    <Form.Control as="select"
      onChange={(e) => configChanged(props.dag, leaf, e)}>
      {options}
    </Form.Control>
  );
}

function ConfigLabel(props) {
  return (
    <Form.Label>{props.leaf.own.option.header}</Form.Label>
  );
}

function ConfigList(props) {
  const block = props.block;
  const configs = Object.keys(block);
  const items = configs.map((config) =>
    <Form.Group controlId="formConfigPage">
      <ConfigLabel leaf={block[config]} />
      <ConfigItem dag={props.dag} leaf={block[config]}/>
    </Form.Group>
  );
  return (
    <div>
      {items}
    </div>
  );
}

function ConfigBlock(props) {
  const block = props.block;  // parent branch of the block config leafs
  const title = block.fullName();
  return (
    <Card>
    <Card.Header>
      <Accordion.Toggle as={Card.Header} variant="link"
          eventKey={props.ekey}>
        {title}
      </Accordion.Toggle>
    </Card.Header>
    <Accordion.Collapse eventKey={props.ekey}>
      <Card.Body>
        <ConfigList dag={props.dag} block={block} />
      </Card.Body>
    </Accordion.Collapse>
  </Card>
  );
}

export default function ConfigPage(props) {
  const { fuel, slope, fire, wind, crown } = props.dag.tree.configs;
  return (
    <Accordion defaultActiveKey="0">
      <ConfigBlock dag={props.dag} block={fuel} ekey="0" />
      <ConfigBlock dag={props.dag} block={slope} ekey="1" />
      <ConfigBlock dag={props.dag} block={fire} ekey="2" />
      <ConfigBlock dag={props.dag} block={wind} ekey="3" />
      <ConfigBlock dag={props.dag} block={crown} ekey="4" />
    </Accordion>
  );
}

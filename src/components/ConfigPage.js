import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import AppDag from './AppDag';

function configChanged(leaf, e) {
  AppDag.setValue(leaf, e.target.value);
}

function ConfigOption(props) {
  const {leaf, value} = props;
  const label = leaf.own.option.items[value];
  return (
    <option value={value} key={value}>
      {label}
    </option>
  );
}

function ConfigItem(props) {
  const { leaf } = props;
  const options = leaf.itemKeys().map((item) =>
    <ConfigOption leaf={leaf} value={item} key={item} />
  );
  return (
    <Form.Control as="select"
        defaultValue={leaf.value()}
        onChange={(e) => configChanged(leaf, e)}>
      {options}
    </Form.Control>
  );
}

function ConfigLabel(props) {
  const { leaf } = props;
  const req = ( leaf.isRequired() ) ? " (ACTIVE)" : "(inactive)";
  return (<Form.Label>{leaf.header()} {req}</Form.Label>);
}

function ConfigGroup(props) {
  const { block } = props;
  const items = Object.keys(block).map((config) =>
    <Form.Group controlId="formConfigPage" key={config}>
      <ConfigLabel leaf={block[config]} />
      <ConfigItem leaf={block[config]}/>
    </Form.Group>
  );
  return (<div>{items}</div>);
}

function ConfigBlock(props) {
  const { block, ekey } = props;  // parent branch of the block config leafs
  const title = block.label();
  return (
    <Card>
      <Card.Header>
        <Accordion.Toggle as={Card.Header} variant="link" eventKey={ekey}>
          {title}
        </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse eventKey={ekey}>
        <Card.Body>
          <ConfigGroup block={block} key={ekey} />
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
}

export default function ConfigPage(props) {
  const configs = AppDag.getConfigs();
  const blocks = Object.keys(configs).map((block, idx) =>
    <ConfigBlock block={configs[block]} key={block} ekey={idx} />
  );
  return (
    <Accordion defaultActiveKey="0">
      {blocks}
    </Accordion>
  );
}

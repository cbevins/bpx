import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

function surfacePrimary(dag) {
  const root = dag.tree.surface.fuel.primary;
  const prefix = 'Primary Surface Fuel ';
  return {
    title: prefix + 'Fire Behavior',
    leafs: [
      [root.fire.ros, prefix+'Fire Spread Rate'],
      [root.fire.firelineIntensity, prefix+'Fireline Intensity'],
      [root.fire.flameLength, prefix+'Flame Length'],
    ],
  }
}

function surfaceSecondary(dag) {
  const root = dag.tree.surface.fuel.secondary;
  const prefix = 'Secondary Surface Fuel ';
  return {
    title: prefix + 'Fire Behavior',
    leafs: [
      [root.fire.ros, prefix+'Fire Spread Rate'],
      [root.fire.firelineIntensity, prefix+'Fireline Intensity'],
      [root.fire.flameLength, prefix+'Flame Length'],
    ],
  }
}

function surfaceEllipse(dag) {
  const root = dag.tree.surface.fire.ellipse;
  const prefix = 'Surface Fire Ellipse ';
  return {
    title: prefix + 'Size and Shape',
    leafs: [
      [root.axis.lengthToWidthRatio, prefix+'Length-to-Width Ratio'],
      [root.size.area, prefix+'Area'],
      [root.size.perimeter, prefix+'Perimeter'],
    ],
  }
}

function selectionMade(dag, leaf, e) {
  if (e.target.checked) {
    dag.setSelected([leaf]);
  } else {
    dag.unSelect([leaf]);
  }
}

function SelectionList(props) {
  const items = props.leafs.map((item) =>
    <Form.Check type="checkbox"
      onClick={(e) => selectionMade(props.dag, item[0], e)}
      id={item[0].fullName('-')}
      label={`${item[1]} (${item[0].name()})`} />
  );
  return (
    <div>
      {items}
    </div>
  );
}

function SelectBlock(props) {
  return (
    <Card>
    <Card.Header>
      <Accordion.Toggle as={Card.Header} variant="link"
          eventKey={props.ekey}>
        {props.data.title}
      </Accordion.Toggle>
    </Card.Header>
    <Accordion.Collapse eventKey={props.ekey}>
      <Card.Body>
        <Form.Group controlId="formSelectPage">
          <SelectionList dag={props.dag} leafs={props.data.leafs} />
        </Form.Group>
      </Card.Body>
    </Accordion.Collapse>
  </Card>
  );
}

export default function SelectPage(props) {
  const sp = surfacePrimary(props.dag);
  const ss = surfaceSecondary(props.dag);
  const fe = surfaceEllipse(props.dag);
  return (
    <Accordion defaultActiveKey="0">
      <SelectBlock dag={props.dag} data={sp} ekey="0" />
      <SelectBlock dag={props.dag} data={ss} ekey="1" />
      <SelectBlock dag={props.dag} data={fe} ekey="2" />
    </Accordion>
  );
}

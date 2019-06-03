import React from 'react';
import Form from 'react-bootstrap/Form';

function selectionMade(dag, leaf, e) {
  if (e.target.checked) {
    dag.setSelected([leaf]);
  } else {
    dag.unSelect([leaf]);
  }
}

export function SelectionList(props) {
  const { primary } = props.dag.tree.surface.fuel;
  const selectableLeafs = [
    primary.fire.ros,
    primary.fire.firelineIntensity,
    primary.fire.flameLength,
  ];

  const items = selectableLeafs.map((leaf) =>
    <Form.Check type="checkbox"
      onClick={(e) => selectionMade(props.dag, leaf, e)}
      id={leaf.fullName('-')}
      label={leaf.name()} />
  );
  return (
    <div>
      <h3>Select from the following {items.length} variables:</h3>
      {items}
    </div>
  );
}

export default function SelectPage(props) {
  return (
    <Form.Group controlId="formBasicChecbox">
      <SelectionList dag={props.dag} />
    </Form.Group>
  );
}

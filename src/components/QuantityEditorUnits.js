import React, {useState} from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import AppDag from './AppDag';

export function QuantityEditorUnitsSelect({leaf, setUnits}) {
  const options = leaf.unitsOfMeasure().map((uom) => <option>{uom}</option>);
  return (
    <Form.Control
      as='select'
      defaultValue={leaf.displayUnits()}
      onChange={(e) => {
        //alert('units '+e.target.value);
        setUnits(e.target.value);}}>
      {options}
    </Form.Control>
  );
}

export default function QuantityEditorUnits(props) {
  const {leaf, setShow, setForm, freshForm} = props;
  const [units, setUnits] = useState(leaf.displayUnits());
  const [decimals, setDecimals] = useState(leaf.displayDecimals());

  return (
    <Card.Body>
      <Card.Title></Card.Title>

      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text>Units ({leaf.displayUnits()})</InputGroup.Text>
        </InputGroup.Prepend>
        <QuantityEditorUnitsSelect leaf={leaf} setUnits={setUnits}/>
      </InputGroup>

      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text>Decimals ({leaf.displayDecimals()})</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control as="select"
            defaultValue={leaf.displayDecimals()}
            onChange={(e) => {
              //alert('decimals='+e.target.value);
              setDecimals(e.target.value)}}>
          <option>0</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
          <option>6</option>
          <option>7</option>
          <option>8</option>
          <option>9</option>
        </Form.Control>
      </InputGroup>

      <Button variant='primary'
          onClick={() => {
              leaf.own.dag.units.setDisplayUnits(leaf.own.units, units);
              leaf.own.dag.units.setDisplayDecimals(leaf.own.units, decimals);
              AppDag.updateBatch();
              setForm(freshForm());
              setShow(false);
          }}>
        Apply Values
      </Button>
      <Button variant='secondary'
          onClick={() => {
            setForm(freshForm());
            setShow(false);
          }}>
        Cancel
      </Button>
    </Card.Body>
  );
}
